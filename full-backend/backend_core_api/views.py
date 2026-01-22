from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from django.utils import timezone
from django.http import JsonResponse
from .models import User, Slot, Attendance, Zone, ParkingSession, Payment, Vehicle, Dispute, Schedule
from .serializers import (
    UserSerializer, SlotSerializer, ZoneSerializer, 
    ParkingSessionSerializer, PaymentSerializer, VehicleSerializer,
    DisputeSerializer, ScheduleSerializer, AttendanceSerializer
)

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
        slots = [{'id': i, 'status': 'available' if i > 5 else 'occupied'} for i in range(1, zone.total_slots + 1)]
        return Response({'success': True, 'slots': slots})

class ParkingSessionViewSet(viewsets.ModelViewSet):
    queryset = ParkingSession.objects.all()
    serializer_class = ParkingSessionSerializer
    permission_classes = [AllowAny]

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
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
            serializer = self.get_serializer(session)
            return Response(serializer.data, status=201)
        except Zone.DoesNotExist:
            return Response({'error': 'Zone not found'}, status=404)

    @action(detail=False, methods=['post'], url_path='scan-entry')
    def scan_entry(self, request):
        return Response({'success': True, 'message': 'Entry recorded'})

    @action(detail=False, methods=['post'], url_path='scan-exit')
    def scan_exit(self, request):
        session_id = request.data.get('session_id')
        try:
            session = ParkingSession.objects.get(id=session_id, status='active')
            session.exit_time = timezone.now()
            session.status = 'completed'
            duration = (session.exit_time - session.entry_time).total_seconds() / 3600
            session.amount_paid = session.zone.base_price * max(1, int(duration))
            session.save()
            return Response({'success': True, 'amount': session.amount_paid})
        except ParkingSession.DoesNotExist:
            return Response({'error': 'Active session not found'}, status=404)

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
