from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from django.utils import timezone
from django.http import JsonResponse
from .models import User, Slot, Attendance, Zone, ParkingSession, Payment, Vehicle, Dispute, Schedule, ShiftLog, Feedback
from .serializers import (
    UserSerializer, SlotSerializer, ZoneSerializer, 
    ParkingSessionSerializer, PaymentSerializer, VehicleSerializer,
    DisputeSerializer, ScheduleSerializer, AttendanceSerializer,
    ShiftLogSerializer, FeedbackSerializer
)

class ShiftLogViewSet(viewsets.ModelViewSet):
    queryset = ShiftLog.objects.all()
    serializer_class = ShiftLogSerializer
    permission_classes = [AllowAny]

class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [AllowAny]

class CoreDashboardView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        sessions = ParkingSession.objects.all().order_by('-entry_time')[:10]
        zones = Zone.objects.all()
        session_serializer = ParkingSessionSerializer(sessions, many=True)
        zone_serializer = ZoneSerializer(zones, many=True)
        return Response({
            'success': True,
            'sessions': session_serializer.data,
            'zones': zone_serializer.data
        })

def home(request):
    return JsonResponse({
        "status": "online",
        "message": "Smart Parking Management System API is running",
        "version": "1.0.0",
        "endpoints": {
            "admin": "/admin/",
            "api_auth": "/api/auth/",
            "api_core": "/api/core/",
            "api_analytics": "/api/analytics/"
        }
    })

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = self.queryset
        role = self.request.query_params.get('role')
        search = self.request.query_params.get('search')
        
        if role:
            queryset = queryset.filter(role=role)
        if search:
            queryset = queryset.filter(username__icontains=search) | queryset.filter(email__icontains=search)
            
        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response({'success': True, 'users': serializer.data})

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

class SlotViewSet(viewsets.ModelViewSet):
    queryset = Slot.objects.all()
    serializer_class = SlotSerializer
    permission_classes = [AllowAny]


class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'], url_path='entry')
    def staff_entry(self, request):
        Attendance.objects.create(staff=request.user, status='on-duty')
        return Response({'success': True, 'message': 'Duty started'})

    @action(detail=False, methods=['post'], url_path='exit')
    def staff_exit(self, request):
        attendance = Attendance.objects.filter(staff=request.user, status='on-duty').last()
        if attendance:
            attendance.exit_time = timezone.now()
            attendance.status = 'off-duty'
            attendance.save()
            return Response({'success': True, 'message': 'Duty ended'})
        return Response({'success': False, 'message': 'No active duty found'}, status=400)

class ZoneViewSet(viewsets.ModelViewSet):
    queryset = Zone.objects.all()
    serializer_class = ZoneSerializer
    permission_classes = [AllowAny]

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response({'success': True, 'zones': serializer.data})

    @action(detail=True, methods=['post'])
    def toggle_status(self, request, pk=None):
        zone = self.get_object()
        zone.is_active = not zone.is_active
        zone.save()
        return Response({'status': 'Zone status updated', 'is_active': zone.is_active, 'success': True})

    @action(detail=True, methods=['get'])
    def slots(self, request, pk=None):
        zone = self.get_object()
        slots = Slot.objects.filter(zone=zone).order_by('slot_number')
        serializer = SlotSerializer(slots, many=True)
        return Response({'success': True, 'slots': serializer.data})

class ParkingSessionViewSet(viewsets.ModelViewSet):
    queryset = ParkingSession.objects.all()
    serializer_class = ParkingSessionSerializer
    permission_classes = [AllowAny]

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        
        # Filter by vehicle_number if provided
        vehicle_number = request.query_params.get('vehicle_number')
        if vehicle_number:
            queryset = queryset.filter(vehicle_number__icontains=vehicle_number)
            
        serializer = self.get_serializer(queryset, many=True)
        return Response({'success': True, 'sessions': serializer.data})

    @action(detail=False, methods=['post'], url_path='book')
    def book_parking(self, request):
        vehicle_number = request.data.get('vehicle_number')
        zone_id = request.data.get('zone_id')
        
        try:
            zone = Zone.objects.get(id=zone_id)
            if zone.available_slots <= 0:
                return Response({'error': 'No slots available in this zone'}, status=400)
            
            session = ParkingSession.objects.create(
                vehicle_number=vehicle_number,
                zone=zone,
                status='active',
                user=request.user if request.user.is_authenticated else None
            )
            
            # Generate QR code data
            import json
            qr_data = {
                'session_id': session.id,
                'vehicle_number': session.vehicle_number,
                'zone': session.zone.name,
                'entry_time': session.entry_time.isoformat(),
                'type': 'parking_session'
            }
            session.qr_code_data = json.dumps(qr_data)
            session.save()
            
            serializer = self.get_serializer(session)
            response_data = serializer.data
            response_data['qr_code'] = qr_data
            
            return Response(response_data, status=201)
        except Zone.DoesNotExist:
            return Response({'error': 'Zone not found'}, status=404)

    @action(detail=False, methods=['post'], url_path='scan-entry')
    def scan_entry(self, request):
        print(f"DEBUG: scan_entry called with data: {request.data}")
        vehicle_number = request.data.get('vehicle_number')
        session_id = request.data.get('session_id')
        zone_id = request.data.get('zone_id')
        
        # 1. Try to find session by ID (QR scan of a booking)
        session = None
        if session_id:
            try:
                session = ParkingSession.objects.get(id=session_id)
            except ParkingSession.DoesNotExist:
                return Response({'error': 'Booking ID not found'}, status=404)
        
        # 2. If no session_id, check for active session by vehicle number
        if not session and vehicle_number:
            session = ParkingSession.objects.filter(vehicle_number=vehicle_number, status='active').first()
            
        # 3. If session found, ensure it has a slot
        if session:
            if session.status != 'active':
                return Response({'error': f'Session is in {session.status} status'}, status=400)
                
            if not session.slot:
                slot = Slot.objects.filter(zone=session.zone, is_occupied=False, is_active=True).first()
                if slot:
                    slot.is_occupied = True
                    slot.save()
                    session.slot = slot
                    session.save()
            return Response({'success': True, 'message': 'Entry verified', 'session_id': session.id})
            
        # 4. If no session found, create walk-in session if zone_id provided
        if vehicle_number and zone_id:
            try:
                zone = Zone.objects.get(id=zone_id)
                slot = Slot.objects.filter(zone=zone, is_occupied=False, is_active=True).first()
                if not slot:
                    return Response({'error': 'No slots available in this zone'}, status=400)
                
                session = ParkingSession.objects.create(
                    vehicle_number=vehicle_number,
                    zone=zone,
                    slot=slot,
                    status='active',
                    initial_amount_paid=request.data.get('initial_amount', zone.base_price),
                    payment_status='partially_paid'
                )
                slot.is_occupied = True
                slot.save()
                
                # Record Initial Payment
                payment_method = request.data.get('payment_method', 'Cash')
                params_amount = session.initial_amount_paid
                Payment.objects.create(
                    session=session,
                    amount=params_amount,
                    payment_method=payment_method,
                    payment_type='INITIAL',
                    status='success'
                )
                
                # Update Shift Log
                if request.user.is_authenticated:
                    from .services import ShiftService
                    ShiftService.update_stats(request.user, 'entry', params_amount, payment_method)
                
                # Check Zone Capacity for Alerting
                try:
                    from backend_analytics_api.services import AlertService
                    AlertService.check_zone_capacity(zone.id)
                except:
                    pass
                
                return Response({
                    'success': True, 
                    'message': 'Walk-in entry recorded with initial payment', 
                    'session_id': session.id,
                    'initial_amount': float(session.initial_amount_paid)
                })
            except Zone.DoesNotExist:
                return Response({'error': 'Zone not found'}, status=404)

        return Response({'error': 'Missing vehicle_number or session_id'}, status=400)

    @action(detail=False, methods=['post'], url_path='scan-exit')
    def scan_exit(self, request):
        print(f"DEBUG: scan_exit called with {request.data}")
        session_id = request.data.get('session_id')
        vehicle_number = request.data.get('vehicle_number')
        
        session = None
        if session_id:
            try:
                session = ParkingSession.objects.get(id=session_id, status='active')
            except ParkingSession.DoesNotExist:
                pass
                
        if not session and vehicle_number:
            session = ParkingSession.objects.filter(vehicle_number=vehicle_number, status='active').last()
            
        if not session:
            return Response({'error': 'Active session not found'}, status=404)

        session.exit_time = timezone.now()
        session.status = 'completed'
        
        # Calculate duration in hours
        duration_delta = session.exit_time - session.entry_time
        hours = duration_delta.total_seconds() / 3600
        # Round up to nearest hour
        billable_hours = max(1, int(hours) + (1 if hours % 1 > 0 else 0))
        
        total_bill = session.zone.base_price * billable_hours
        session.final_amount_paid = max(0, total_bill - session.initial_amount_paid)
        session.payment_status = 'paid'
        
        # Free the slot
        if session.slot:
            slot = session.slot
            slot.is_occupied = False
            slot.save()
            
        session.save()
        
        # Record Final Payment
        if session.final_amount_paid > 0:
            payment_method = request.data.get('payment_method', 'Cash')
            Payment.objects.create(
                session=session,
                amount=session.final_amount_paid,
                payment_method=payment_method,
                payment_type='FINAL',
                status='success'
            )
            
            # Update Shift Log
            if request.user.is_authenticated:
                from .services import ShiftService
                ShiftService.update_stats(request.user, 'exit', session.final_amount_paid, payment_method)
        else:
             # Just increment exit count for prepaid/zero balance
             if request.user.is_authenticated:
                from .services import ShiftService
                ShiftService.update_stats(request.user, 'exit', 0, 'Cash')

        return Response({
            'success': True, 
            'total_amount': float(session.total_amount_paid),
            'initial_paid': float(session.initial_amount_paid),
            'final_balance': float(session.final_amount_paid),
            'duration_hours': round(hours, 2)
        })

    @action(detail=False, methods=['post'], url_path='refund')
    def refund(self, request):
        return Response({'success': True, 'message': 'Refund processed successfully'}, status=200)

    @action(detail=False, methods=['post'], url_path='payment-status')
    def payment_status(self, request):
        return Response({'success': True, 'payment_status': 'paid'}, status=200)

class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    permission_classes = [AllowAny]

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response({'success': True, 'vehicles': serializer.data})

class DisputeViewSet(viewsets.ModelViewSet):
    queryset = Dispute.objects.all()
    serializer_class = DisputeSerializer
    permission_classes = [AllowAny]

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response({'success': True, 'disputes': serializer.data})

class ScheduleViewSet(viewsets.ModelViewSet):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    permission_classes = [AllowAny]

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        
        # Group schedules by day
        days_order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        schedule_by_day = {day: {} for day in days_order}
        
        for schedule in queryset:
            day = schedule.day
            if day in schedule_by_day:
                if schedule.shift_type == 'Alpha':
                    schedule_by_day[day]['shift1_name'] = schedule.staff.username
                elif schedule.shift_type == 'Bravo':
                    schedule_by_day[day]['shift2_name'] = schedule.staff.username
                elif schedule.shift_type == 'Charlie':
                    schedule_by_day[day]['shift3_name'] = schedule.staff.username
        
        # Convert to list format expected by frontend
        result = []
        for day in days_order:
            result.append({
                'day': day,
                'shift1_name': schedule_by_day[day].get('shift1_name', ''),
                'shift2_name': schedule_by_day[day].get('shift2_name', ''),
                'shift3_name': schedule_by_day[day].get('shift3_name', '')
            })
        
        return Response(result)

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [AllowAny]

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response({'success': True, 'payments': serializer.data})
