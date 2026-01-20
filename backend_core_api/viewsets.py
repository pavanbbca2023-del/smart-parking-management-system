# viewsets.py - ViewSets for role-based APIs

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django.utils import timezone
from django.db.models import Sum, Count, Q
from datetime import timedelta
import uuid

from .models import User, ExtendedParkingSession, Payment
from .models import ParkingZone, ParkingSlot, Vehicle
from .extended_serializers import *
from .permissions import IsAdminUser, IsStaffUser, IsRegularUser, IsOwnerOrAdmin
from .payment_service import process_booking_payment, process_exit_payment
from .utils import calculate_amount


class UserBookingViewSet(viewsets.ModelViewSet):
    """User booking APIs"""
    permission_classes = [IsRegularUser]
    serializer_class = ExtendedParkingSessionSerializer
    
    def get_queryset(self):
        return ExtendedParkingSession.objects.filter(booked_by=self.request.user)
    
    @action(detail=False, methods=['post'])
    def book_slot(self, request):
        """Book parking slot with initial payment"""
        serializer = BookingSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        zone_id = serializer.validated_data['zone_id']
        vehicle_number = serializer.validated_data['vehicle_number'].upper()
        owner_name = serializer.validated_data.get('owner_name', request.user.username)
        
        # Get zone
        try:
            zone = ParkingZone.objects.get(id=zone_id, is_active=True)
        except ParkingZone.DoesNotExist:
            return Response({'error': 'Invalid zone'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check active session
        active_session = ExtendedParkingSession.objects.filter(
            booked_by=request.user,
            status__in=['BOOKED', 'ACTIVE']
        ).first()
        
        if active_session:
            return Response({
                'error': 'You already have an active booking'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Find available slot
        available_slot = ParkingSlot.objects.filter(
            zone=zone, is_occupied=False
        ).first()
        
        if not available_slot:
            return Response({
                'error': 'No available slots in this zone'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create or get vehicle
        vehicle, created = Vehicle.objects.get_or_create(
            vehicle_number=vehicle_number,
            defaults={'owner_name': owner_name}
        )
        
        # Process initial payment (₹50)
        booking_amount = 50
        payment_result = process_booking_payment(booking_amount)
        
        if not payment_result['success']:
            return Response({
                'error': 'Payment processing failed'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create session
        qr_code = f"QR-{uuid.uuid4().hex[:12].upper()}"
        session = ExtendedParkingSession.objects.create(
            vehicle=vehicle,
            slot=available_slot,
            zone=zone,
            booked_by=request.user,
            qr_code=qr_code,
            status='BOOKED',
            payment_status='PARTIAL',
            paid_amount=booking_amount,
        )
        
        # Reserve slot
        available_slot.is_occupied = True
        available_slot.save()
        
        # Create payment record
        Payment.objects.create(
            session=session,
            amount=booking_amount,
            method='ONLINE',
            type='BOOKING',
            status='SUCCESS',
            transaction_id=payment_result.get('payment_id'),
            razorpay_order_id=payment_result.get('order_id'),
        )
        
        return Response({
            'success': True,
            'session_id': session.id,
            'qr_code': qr_code,
            'slot_number': available_slot.slot_number,
            'zone_name': zone.name,
            'paid_amount': booking_amount,
            'message': 'Slot booked successfully'
        }, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'])
    def current_session(self, request):
        """Get current active session"""
        session = ExtendedParkingSession.objects.filter(
            booked_by=request.user,
            status__in=['BOOKED', 'ACTIVE']
        ).first()
        
        if not session:
            return Response({
                'message': 'No active session found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = self.get_serializer(session)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def bookings(self, request):
        """Get user booking history"""
        sessions = self.get_queryset()
        serializer = self.get_serializer(sessions, many=True)
        return Response({
            'bookings': serializer.data,
            'total': sessions.count()
        })


class StaffOperationsViewSet(viewsets.ViewSet):
    """Staff operation APIs"""
    permission_classes = [IsStaffUser]
    
    @action(detail=False, methods=['post'])
    def entry(self, request):
        """Process vehicle entry"""
        serializer = QRScanSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        qr_code = serializer.validated_data['qr_code']
        
        try:
            session = ExtendedParkingSession.objects.get(qr_code=qr_code)
        except ExtendedParkingSession.DoesNotExist:
            return Response({'error': 'Invalid QR code'}, status=status.HTTP_404_NOT_FOUND)
        
        if session.status != 'BOOKED':
            return Response({
                'error': f'Session is {session.status}, cannot process entry'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Update session
        session.status = 'ACTIVE'
        session.entry_time = timezone.now()
        session.save()
        
        return Response({
            'success': True,
            'message': 'Entry processed successfully',
            'vehicle_number': session.vehicle.vehicle_number,
            'slot_number': session.slot.slot_number,
            'entry_time': session.entry_time,
        })
    
    @action(detail=False, methods=['post'])
    def exit(self, request):
        """Process vehicle exit with payment"""
        serializer = ExitPaymentSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        qr_code = serializer.validated_data['qr_code']
        payment_method = serializer.validated_data['payment_method']
        
        try:
            session = ExtendedParkingSession.objects.get(qr_code=qr_code)
        except ExtendedParkingSession.DoesNotExist:
            return Response({'error': 'Invalid QR code'}, status=status.HTTP_404_NOT_FOUND)
        
        if session.status != 'ACTIVE':
            return Response({
                'error': f'Session is {session.status}, cannot process exit'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Calculate total amount
        current_time = timezone.now()
        duration = current_time - session.entry_time
        duration_hours = max(1, int(duration.total_seconds() / 3600))
        if duration.total_seconds() % 3600 > 0:
            duration_hours += 1
        
        total_amount = duration_hours * session.zone.hourly_rate
        remaining_amount = total_amount - session.paid_amount
        
        if remaining_amount > 0:
            # Process remaining payment
            payment_result = process_exit_payment(remaining_amount, payment_method)
            
            if not payment_result['success']:
                return Response({
                    'error': 'Payment processing failed'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Create payment record
            Payment.objects.create(
                session=session,
                amount=remaining_amount,
                method=payment_method,
                type='EXIT',
                status='SUCCESS',
                transaction_id=payment_result.get('payment_id'),
            )
        
        # Update session
        session.status = 'COMPLETED'
        session.exit_time = current_time
        session.total_amount = total_amount
        session.payment_status = 'PAID'
        session.save()
        
        # Release slot
        session.slot.is_occupied = False
        session.slot.save()
        
        return Response({
            'success': True,
            'message': 'Exit processed successfully',
            'bill_details': {
                'vehicle_number': session.vehicle.vehicle_number,
                'duration_hours': duration_hours,
                'total_amount': float(total_amount),
                'paid_amount': float(session.paid_amount),
                'remaining_amount': float(remaining_amount),
                'payment_method': payment_method,
            }
        })
    
    @action(detail=False, methods=['get'])
    def current_sessions(self, request):
        """Get current active sessions"""
        sessions = ExtendedParkingSession.objects.filter(
            status__in=['BOOKED', 'ACTIVE']
        ).select_related('vehicle', 'slot', 'zone')
        
        serializer = ExtendedParkingSessionSerializer(sessions, many=True)
        return Response({
            'sessions': serializer.data,
            'total': sessions.count()
        })


class AdminReportsViewSet(viewsets.ViewSet):
    """Admin report APIs"""
    permission_classes = [IsAdminUser]
    
    @action(detail=False, methods=['get'])
    def payments(self, request):
        """Get payment reports"""
        payments = Payment.objects.all().select_related('session__vehicle')
        serializer = PaymentSerializer(payments, many=True)
        
        total_amount = payments.aggregate(Sum('amount'))['amount__sum'] or 0
        
        return Response({
            'payments': serializer.data,
            'total_payments': payments.count(),
            'total_amount': float(total_amount)
        })
    
    @action(detail=False, methods=['get'])
    def reports(self, request):
        """Get daily revenue reports"""
        from django.db.models import Sum, Count
        from django.utils import timezone
        from datetime import timedelta
        
        # Last 7 days report
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=7)
        
        daily_reports = []
        current_date = start_date
        
        while current_date <= end_date:
            payments = Payment.objects.filter(
                created_at__date=current_date,
                status='SUCCESS'
            )
            
            total_amount = payments.aggregate(Sum('amount'))['amount__sum'] or 0
            cash_amount = payments.filter(method='CASH').aggregate(Sum('amount'))['amount__sum'] or 0
            online_amount = payments.filter(method='ONLINE').aggregate(Sum('amount'))['amount__sum'] or 0
            
            daily_reports.append({
                'date': current_date,
                'total_amount': float(total_amount),
                'total_sessions': payments.count(),
                'cash_amount': float(cash_amount),
                'online_amount': float(online_amount),
            })
            
            current_date += timedelta(days=1)
        
        return Response({
            'daily_reports': daily_reports,
            'period': f"{start_date} to {end_date}"
        })