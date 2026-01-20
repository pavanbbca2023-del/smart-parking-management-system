# production_viewsets.py - Production-ready ViewSets with proper error handling

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from django.utils import timezone
from django.db.models import Sum, Count, Q
from datetime import timedelta
import uuid
import logging

from .production_models import User, ParkingSession, Payment, ParkingZone, ParkingSlot, Vehicle
from .production_serializers import *
from .production_permissions import IsAdminUser, IsStaffUser, IsRegularUser
from .production_services import BookingService, EntryService, ExitService, PaymentService

logger = logging.getLogger(__name__)


class UserBookingViewSet(viewsets.ViewSet):
    """User booking operations with proper validation"""
    permission_classes = [IsAuthenticated, IsRegularUser]
    
    @action(detail=False, methods=['get'])
    def zones(self, request):
        """Get available zones with slot counts"""
        zones = ParkingZone.objects.filter(is_active=True).prefetch_related('slots')
        serializer = ZoneAvailabilitySerializer(zones, many=True)
        return Response({'zones': serializer.data})
    
    @action(detail=False, methods=['post'])
    def book_slot(self, request):
        """Book parking slot with atomic transaction"""
        serializer = BookingRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            with transaction.atomic():
                result = BookingService.create_booking(
                    user=request.user,
                    zone_id=serializer.validated_data['zone_id'],
                    vehicle_number=serializer.validated_data['vehicle_number'],
                    owner_name=serializer.validated_data.get('owner_name', request.user.username)
                )
                
                if result['success']:
                    return Response(result['data'], status=status.HTTP_201_CREATED)
                else:
                    return Response({'error': result['error']}, status=status.HTTP_400_BAD_REQUEST)
                    
        except Exception as e:
            logger.error(f"Booking failed for user {request.user.id}: {str(e)}")
            return Response(
                {'error': 'Booking failed. Please try again.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'])
    def current_session(self, request):
        """Get current active session"""
        session = ParkingSession.objects.filter(
            booked_by=request.user,
            status__in=['BOOKED', 'ACTIVE']
        ).select_related('vehicle', 'slot', 'zone').first()
        
        if not session:
            return Response({'message': 'No active session found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = ParkingSessionDetailSerializer(session)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def history(self, request):
        """Get user booking history with pagination"""
        sessions = ParkingSession.objects.filter(
            booked_by=request.user
        ).select_related('vehicle', 'slot', 'zone').order_by('-created_at')
        
        # Simple pagination
        page_size = 20
        page = int(request.query_params.get('page', 1))
        start = (page - 1) * page_size
        end = start + page_size
        
        paginated_sessions = sessions[start:end]
        serializer = ParkingSessionDetailSerializer(paginated_sessions, many=True)
        
        return Response({
            'sessions': serializer.data,
            'total': sessions.count(),
            'page': page,
            'has_next': sessions.count() > end
        })
    
    @action(detail=False, methods=['post'])
    def cancel_booking(self, request):
        """Cancel booking if eligible"""
        serializer = CancelBookingSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        session_id = serializer.validated_data['session_id']
        
        try:
            with transaction.atomic():
                session = ParkingSession.objects.select_for_update().get(
                    id=session_id,
                    booked_by=request.user,
                    status='BOOKED'
                )
                
                # Check if cancellation is allowed (within 5 minutes)
                time_since_booking = timezone.now() - session.created_at
                if time_since_booking.total_seconds() > 300:  # 5 minutes
                    return Response(
                        {'error': 'Cancellation not allowed after 5 minutes'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                # Cancel session and release slot
                session.status = 'CANCELLED'
                session.save()
                
                session.slot.is_occupied = False
                session.slot.save()
                
                return Response({'message': 'Booking cancelled successfully'})
                
        except ParkingSession.DoesNotExist:
            return Response({'error': 'Session not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Cancellation failed: {str(e)}")
            return Response(
                {'error': 'Cancellation failed'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class StaffOperationsViewSet(viewsets.ViewSet):
    """Staff operations with proper QR validation"""
    permission_classes = [IsAuthenticated, IsStaffUser]
    
    @action(detail=False, methods=['post'])
    def entry(self, request):
        """Process vehicle entry via QR scan"""
        serializer = QRScanSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        qr_code = serializer.validated_data['qr_code']
        
        try:
            with transaction.atomic():
                result = EntryService.process_entry(qr_code)
                
                if result['success']:
                    return Response(result['data'])
                else:
                    return Response({'error': result['error']}, status=status.HTTP_400_BAD_REQUEST)
                    
        except Exception as e:
            logger.error(f"Entry processing failed: {str(e)}")
            return Response(
                {'error': 'Entry processing failed'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['post'])
    def exit(self, request):
        """Process vehicle exit with payment"""
        serializer = ExitProcessSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            with transaction.atomic():
                result = ExitService.process_exit(
                    qr_code=serializer.validated_data['qr_code'],
                    payment_method=serializer.validated_data['payment_method']
                )
                
                if result['success']:
                    return Response(result['data'])
                else:
                    return Response({'error': result['error']}, status=status.HTTP_400_BAD_REQUEST)
                    
        except Exception as e:
            logger.error(f"Exit processing failed: {str(e)}")
            return Response(
                {'error': 'Exit processing failed'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'])
    def active_sessions(self, request):
        """Get all active parking sessions"""
        sessions = ParkingSession.objects.filter(
            status__in=['BOOKED', 'ACTIVE']
        ).select_related('vehicle', 'slot', 'zone', 'booked_by').order_by('-created_at')
        
        serializer = ParkingSessionDetailSerializer(sessions, many=True)
        return Response({
            'sessions': serializer.data,
            'total': sessions.count()
        })
    
    @action(detail=False, methods=['get'])
    def slot_status(self, request):
        """Get real-time slot status"""
        zones = ParkingZone.objects.filter(is_active=True).prefetch_related('slots')
        serializer = ZoneAvailabilitySerializer(zones, many=True)
        return Response({'zones': serializer.data})


class AdminReportsViewSet(viewsets.ViewSet):
    """Admin reports and analytics"""
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        """Get admin dashboard data"""
        today = timezone.now().date()
        
        # Today's stats
        today_sessions = ParkingSession.objects.filter(created_at__date=today)
        today_payments = Payment.objects.filter(created_at__date=today, status='SUCCESS')
        
        # Active sessions
        active_sessions = ParkingSession.objects.filter(status__in=['BOOKED', 'ACTIVE'])
        
        # Revenue stats
        total_revenue = Payment.objects.filter(status='SUCCESS').aggregate(
            Sum('amount')
        )['amount__sum'] or 0
        
        today_revenue = today_payments.aggregate(Sum('amount'))['amount__sum'] or 0
        
        return Response({
            'today_stats': {
                'total_bookings': today_sessions.count(),
                'completed_sessions': today_sessions.filter(status='COMPLETED').count(),
                'revenue': float(today_revenue),
                'active_sessions': active_sessions.count()
            },
            'overall_stats': {
                'total_revenue': float(total_revenue),
                'total_sessions': ParkingSession.objects.count(),
                'total_users': User.objects.filter(role='USER').count()
            }
        })
    
    @action(detail=False, methods=['get'])
    def payments(self, request):
        """Get payment reports with filters"""
        payments = Payment.objects.select_related('session__vehicle').order_by('-created_at')
        
        # Date filtering
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        if start_date:
            payments = payments.filter(created_at__date__gte=start_date)
        if end_date:
            payments = payments.filter(created_at__date__lte=end_date)
        
        # Pagination
        page_size = 50
        page = int(request.query_params.get('page', 1))
        start = (page - 1) * page_size
        end = start + page_size
        
        paginated_payments = payments[start:end]
        serializer = PaymentDetailSerializer(paginated_payments, many=True)
        
        # Summary
        total_amount = payments.aggregate(Sum('amount'))['amount__sum'] or 0
        
        return Response({
            'payments': serializer.data,
            'summary': {
                'total_payments': payments.count(),
                'total_amount': float(total_amount),
                'cash_payments': payments.filter(method='CASH').count(),
                'online_payments': payments.filter(method='ONLINE').count()
            },
            'pagination': {
                'page': page,
                'has_next': payments.count() > end
            }
        })
    
    @action(detail=False, methods=['get'])
    def revenue_report(self, request):
        """Get detailed revenue reports"""
        from django.db.models import Sum, Count
        from django.db.models.functions import TruncDate
        
        # Last 30 days revenue
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=30)
        
        daily_revenue = Payment.objects.filter(
            created_at__date__range=[start_date, end_date],
            status='SUCCESS'
        ).extra(
            select={'day': 'date(created_at)'}
        ).values('day').annotate(
            total_amount=Sum('amount'),
            total_payments=Count('id')
        ).order_by('day')
        
        # Zone-wise revenue
        zone_revenue = Payment.objects.filter(
            status='SUCCESS'
        ).values(
            'session__zone__name'
        ).annotate(
            total_amount=Sum('amount'),
            total_sessions=Count('session', distinct=True)
        ).order_by('-total_amount')
        
        return Response({
            'daily_revenue': list(daily_revenue),
            'zone_revenue': list(zone_revenue),
            'period': f"{start_date} to {end_date}"
        })
    
    @action(detail=False, methods=['get'])
    def all_sessions(self, request):
        """Get all sessions with filters"""
        sessions = ParkingSession.objects.select_related(
            'vehicle', 'slot', 'zone', 'booked_by'
        ).order_by('-created_at')
        
        # Status filtering
        status_filter = request.query_params.get('status')
        if status_filter:
            sessions = sessions.filter(status=status_filter)
        
        # Date filtering
        start_date = request.query_params.get('start_date')
        if start_date:
            sessions = sessions.filter(created_at__date__gte=start_date)
        
        # Pagination
        page_size = 50
        page = int(request.query_params.get('page', 1))
        start = (page - 1) * page_size
        end = start + page_size
        
        paginated_sessions = sessions[start:end]
        serializer = ParkingSessionDetailSerializer(paginated_sessions, many=True)
        
        return Response({
            'sessions': serializer.data,
            'total': sessions.count(),
            'page': page,
            'has_next': sessions.count() > end
        })


class PublicViewSet(viewsets.ViewSet):
    """Public APIs without authentication"""
    permission_classes = []
    
    @action(detail=False, methods=['get'])
    def zones(self, request):
        """Get public zone information"""
        zones = ParkingZone.objects.filter(is_active=True).prefetch_related('slots')
        serializer = ZoneAvailabilitySerializer(zones, many=True)
        return Response({'zones': serializer.data})
    
    @action(detail=False, methods=['get'])
    def health(self, request):
        """Health check endpoint"""
        return Response({
            'status': 'healthy',
            'timestamp': timezone.now(),
            'version': '1.0.0'
        })