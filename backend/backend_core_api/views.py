from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny, IsAuthenticatedOrReadOnly
from django.utils import timezone
from django.http import JsonResponse
from .models import User, Slot, Attendance, Zone, ParkingSession, Payment
from .serializers import (
    UserSerializer, SlotSerializer, ZoneSerializer, 
    ParkingSessionSerializer, PaymentSerializer,
    AttendanceSerializer
)
import razorpay
from django.conf import settings

# Initialize Razorpay client
razorpay_client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
# Trigger Server Reload for .env update

class StaffRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            data = request.data
            
            # Check if user already exists
            if User.objects.filter(email=data.get('email')).exists():
                return Response({'error': 'Email already registered'}, status=400)
            
            if User.objects.filter(username=data.get('staff_id')).exists():
                return Response({'error': 'Staff ID already taken'}, status=400)
            
            # Create User
            user = User.objects.create_user(
                username=data.get('staff_id'),
                email=data.get('email'),
                password=data.get('password'),
                first_name=data.get('first_name'),
                last_name=data.get('last_name'),
                role='STAFF',
                phone_number=data.get('phone')
            )
            
            return Response({
                'success': True,
                'message': 'Staff account created successfully',
                'user_id': user.id
            }, status=201)
            
        except Exception as e:
            return Response({'error': str(e)}, status=400)

class StaffLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # Determine if login is by email or username
        user_identifier = request.data.get('email') or request.data.get('username')
        password = request.data.get('password')
        
        username = user_identifier
        # Try to find user by email first to get the actual username for authenticate
        if user_identifier and '@' in user_identifier:
            try:
                user_obj = User.objects.get(email=user_identifier)
                username = user_obj.username
            except User.DoesNotExist:
                pass
                
        user = authenticate(username=username, password=password)
        
        if user is not None:
            if user.role not in ['STAFF', 'ADMIN']:
                 return Response({'error': 'Unauthorized access'}, status=403)
                 
            # Record Attendance
            Attendance.objects.create(staff=user, status='on-duty')
            
            refresh = RefreshToken.for_user(user)
            return Response({
                'success': True,
                'token': str(refresh.access_token),
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'staff_id': user.username,
                'role': user.role,
                'user_id': user.id
            })
        else:
            return Response({'error': 'Invalid credentials'}, status=401)


class ShiftLogViewSet(viewsets.ModelViewSet):
    queryset = []
    permission_classes = [IsAuthenticated]

class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = []
    permission_classes = [IsAuthenticated]

class CoreDashboardView(APIView):
    permission_classes = [IsAuthenticated]
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

def get_staff_zones(user):
    """Helper function to get zones assigned to a staff member"""
    return []

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
        try:
            queryset = self.filter_queryset(self.get_queryset())
            serializer = self.get_serializer(queryset, many=True)
            return Response({'success': True, 'users': serializer.data})
        except Exception as e:
            return Response({'success': False, 'error': str(e)}, status=400)

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

class SlotViewSet(viewsets.ModelViewSet):
    queryset = Slot.objects.all()
    serializer_class = SlotSerializer
    permission_classes = [IsAuthenticated]


class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]

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
    
    def create(self, request, *args, **kwargs):
        # Map frontend field names to backend field names
        data = request.data.copy()
        
        # Map 'hourlyRate' to 'base_price'
        if 'hourlyRate' in data:
            data['base_price'] = data.pop('hourlyRate')
        
        # Map 'capacity' to 'total_slots'
        if 'capacity' in data:
            data['total_slots'] = data.pop('capacity')
        
        # Map 'zoneName' to 'name'
        if 'zoneName' in data:
            data['name'] = data.pop('zoneName')
        
        # Map 'location' to 'description'
        if 'location' in data:
            data['description'] = data.pop('location')
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        zone = serializer.save()
        
        # Create slots for the zone
        from .models import Slot
        total_slots = zone.total_slots
        zone_prefix = zone.name[5] if len(zone.name) > 5 else 'Z'  # Get zone letter
        
        for i in range(1, total_slots + 1):
            slot_number = f"{zone_prefix}{i:03d}"
            Slot.objects.create(
                zone=zone,
                slot_number=slot_number
            )
        
        return Response({
            'success': True, 
            'message': 'Zone created successfully',
            'zone': serializer.data
        }, status=201)

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
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action in ['list', 'book_parking', 'scan_entry', 'scan_exit', 'create_razorpay_order', 'verify_razorpay_payment']:
            return [AllowAny()]
        return super().get_permissions()

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        
        # Filter by vehicle_number if provided
        vehicle_number = request.query_params.get('vehicle_number')
        if vehicle_number:
            queryset = queryset.filter(vehicle_number__icontains=vehicle_number)
            
        serializer = self.get_serializer(queryset, many=True)
        return Response({'success': True, 'sessions': serializer.data})

    @action(detail=False, methods=['post'], url_path='book', permission_classes=[AllowAny])
    def book_parking(self, request):
        vehicle_number = request.data.get('vehicle_number')
        zone_id = request.data.get('zone_id')
        guest_mobile = request.data.get('mobileNumber')
        guest_email = request.data.get('email')
        exit_time_str = request.data.get('exitTime')
        
        try:
            zone = Zone.objects.get(id=zone_id)
            slot = Slot.objects.filter(zone=zone, is_occupied=False, is_reserved=False, is_active=True).first()
            if not slot:
                return Response({'error': 'No slots available in this zone'}, status=400)
            
            # Set expiry time if exitTime is provided
            from datetime import timedelta
            booking_expiry = None
            if exit_time_str:
                try:
                    h, m = map(int, exit_time_str.split(':'))
                    now_local = timezone.localtime(timezone.now())
                    booking_expiry = now_local.replace(hour=h, minute=m, second=0, microsecond=0)
                    
                    # If the selected time is earlier than now, assume it's for tomorrow
                    if booking_expiry <= now_local:
                        booking_expiry += timedelta(days=1)
                        
                    # Still check to prevent invalid very close times if needed, 
                    # but the main goal is to allow next-day bookings.
                except ValueError:
                    return Response({'error': 'Invalid time format'}, status=400)

            session = ParkingSession.objects.create(
                vehicle_number=vehicle_number,
                zone=zone,
                slot=slot,
                status='pending_payment', # Wait for payment confirmation
                user=request.user if request.user.is_authenticated else None,
                guest_mobile=guest_mobile,
                guest_email=guest_email,
                booking_expiry_time=booking_expiry
            )
            
            # Mark slot as reserved - MOVED TO PAYMENT VERIFICATION
            # slot.is_reserved = True 
            # slot.save()
            
            # Generate QR code data
            import json
            qr_data = {
                'session_id': session.id,
                'vehicle_number': session.vehicle_number,
                'zone': session.zone.name,
                'slot_number': slot.slot_number,
                'entry_time': (session.entry_time or timezone.now()).isoformat(),
                'type': 'parking_session'
            }
            session.qr_code_data = json.dumps(qr_data)
            session.save()
            
            serializer = self.get_serializer(session)
            response_data = serializer.data
            response_data['qr_code'] = qr_data
            
            # Send Booking SMS
            try:
                from .sms_service import SMSService
                message = (
                    f"BOOKING RECEIVED: Slot {slot.slot_number} in {zone.name} is reserved "
                    f"for vehicle {vehicle_number}. Booking ID: {session.id}. "
                    f"Please complete payment to confirm."
                )
                if guest_mobile:
                    SMSService.send(guest_mobile, message)
            except Exception as sms_err:
                import logging
                logging.getLogger(__name__).error(f"Booking SMS failed: {str(sms_err)}")

            return Response(response_data, status=201)
        except Zone.DoesNotExist:
            return Response({'error': 'Zone not found'}, status=404)

    @action(detail=False, methods=['post'], url_path='scan-entry', permission_classes=[AllowAny])
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
            
        # 3. If session found, check zone permissions for staff
        if session:
            # Check if user is staff and has permission for this zone
            if request.user and request.user.is_authenticated and request.user.role == 'STAFF':
                staff_zones = get_staff_zones(request.user)
                if staff_zones and session.zone_id not in staff_zones:
                    return Response({
                        'error': 'Zone Access Denied',
                        'message': f'You can only process entries for your assigned zones. This vehicle is in {session.zone.name}.'
                    }, status=403)
            
            if session.status not in ['active', 'reserved']:
                return Response({'error': f'Session is in {session.status} status'}, status=400)
                
            if session.status == 'reserved' and session.slot:
                # Transition from reserved to active occupancy
                slot = session.slot
                slot.is_reserved = False
                slot.is_occupied = True
                slot.save()
                session.status = 'active'
                session.entry_time = timezone.now()  # Update actual entry time
                session.save()
            elif not session.slot:
                slot = Slot.objects.filter(zone=session.zone, is_occupied=False, is_reserved=False, is_active=True).first()
                if slot:
                    slot.is_occupied = True
                    slot.save()
                    session.slot = slot
                    session.status = 'active'
            session.save()
            
            # Send Entry Confirmation SMS
            try:
                from .sms_service import SMSService
                message = f"ENTRY VERIFIED: Vehicle {session.vehicle_number} has entered {session.zone.name}. Slot: {session.slot.slot_number}."
                mobile = session.user.phone_number if session.user else session.guest_mobile
                if mobile:
                    SMSService.send(mobile, message)
            except Exception as e:
                import logging
                logging.getLogger(__name__).error(f"Entry SMS failed: {str(e)}")
        return Response({'success': True, 'message': 'Entry verified', 'session_id': session.id})
            
        # 4. If no session found, create walk-in session if zone_id provided
        if vehicle_number and zone_id:
            try:
                zone = Zone.objects.get(id=zone_id)
                slot = Slot.objects.filter(zone=zone, is_occupied=False, is_reserved=False, is_active=True).first()
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
                
                # Send Walk-in Entry SMS
                try:
                    from .sms_service import SMSService
                    message = f"ENTRY RECORDED: Vehicle {session.vehicle_number} has entered {zone.name}. Slot: {slot.slot_number}. Initial Paid: Rs.{params_amount}."
                    # For walk-ins, we might not have a mobile yet unless passed in request
                    mobile = request.data.get('mobileNumber') or request.data.get('phone_number')
                    if mobile:
                        SMSService.send(mobile, message)
                except Exception as e:
                    import logging
                    logging.getLogger(__name__).error(f"Walk-in Entry SMS failed: {str(e)}")

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
            except Exception as e:
                return Response({'error': str(e)}, status=500)

        return Response({'error': 'Missing vehicle_number or session_id'}, status=400)

    @action(detail=False, methods=['post'], url_path='scan-exit', permission_classes=[AllowAny])
    def scan_exit(self, request):
        print(f"DEBUG: scan_exit called with {request.data}")
        session_id = request.data.get('session_id')
        vehicle_number = request.data.get('vehicle_number')
        
        session = None
        if session_id:
            try:
                # First check for active session
                session = ParkingSession.objects.get(id=session_id)
                if session.status == 'reserved':
                    return Response({
                        'error': 'Vehicle Not Entered',
                        'message': 'This booking is confirmed but the vehicle has not entered yet. Please scan at ENTRY gate first.'
                    }, status=400)
                if session.status != 'active':
                     return Response({'error': f'Session is {session.status}'}, status=400)
                     
            except ParkingSession.DoesNotExist:
                pass
                
        if not session and vehicle_number:
            session = ParkingSession.objects.filter(vehicle_number=vehicle_number, status='active').last()
            
        if not session:
            # Check if there is a reserved session for this vehicle
            reserved = ParkingSession.objects.filter(vehicle_number=vehicle_number, status='reserved').first()
            if reserved:
                 return Response({
                        'error': 'Vehicle Not Entered',
                        'message': 'This vehicle has a reservation but has not entered yet. Please scan at ENTRY gate first.'
                    }, status=400)
            return Response({'error': 'Active session not found'}, status=404)

        # Check zone permissions for staff
        if request.user and request.user.is_authenticated and request.user.role == 'STAFF':
            staff_zones = get_staff_zones(request.user)
            if staff_zones and session.zone_id not in staff_zones:
                return Response({
                    'error': 'Zone Access Denied',
                    'message': f'You can only process exits for your assigned zones. This vehicle is in {session.zone.name}.'
                }, status=403)

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
            slot.is_reserved = False
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
        
        # Send Exit Confirmation SMS
        try:
            from .sms_service import SMSService
            message = (
                f"EXIT COMPLETED: Vehicle {session.vehicle_number} has exited {session.zone.name}. "
                f"Total: Rs.{session.total_amount_paid}. Thank you for using QuickPark!"
            )
            mobile = session.user.phone_number if session.user else session.guest_mobile
            if mobile:
                SMSService.send(mobile, message)
        except Exception as e:
            import logging
            logging.getLogger(__name__).error(f"Exit SMS failed: {str(e)}")

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
    
    @action(detail=True, methods=['post'], url_path='cancel')
    def cancel_booking(self, request, pk=None):
        """Cancel a booking and process refund"""
        from .services import CancellationService
        
        session = self.get_object()
        reason = request.data.get('reason', 'User requested cancellation')
        
        success, message, refund_amount = CancellationService.process_cancellation(
            session=session,
            reason=reason,
            user=request.user if request.user.is_authenticated else None,
            cancellation_type='user_initiated'
        )
        
        if success:
            serializer = self.get_serializer(session)
            return Response({
                'success': True,
                'message': message,
                'refund_amount': float(refund_amount),
                'session': serializer.data
            })
        else:
            return Response({
                'success': False,
                'error': message
            }, status=400)
    
    @action(detail=True, methods=['post'], url_path='extend')
    def extend_booking(self, request, pk=None):
        """Extend booking expiry time"""
        from .services import CancellationService
        
        session = self.get_object()
        hours = int(request.data.get('hours', 2))  # Default 2 hours
        
        if hours not in [2, 6, 24]:
            return Response({
                'success': False,
                'error': 'Invalid extension duration. Choose 2, 6, or 24 hours.'
            }, status=400)
        
        success, message = CancellationService.process_extension(
            session=session,
            hours=hours,
            user=request.user if request.user.is_authenticated else None
        )
        
        if success:
            serializer = self.get_serializer(session)
            return Response({
                'success': True,
                'message': message,
                'new_expiry_time': session.booking_expiry_time.isoformat() if session.booking_expiry_time else None,
                'extension_count': session.extension_count,
                'session': serializer.data
            })
        else:
            return Response({
                'success': False,
                'error': message
            }, status=400)
    
    @action(detail=True, methods=['get'], url_path='can-cancel')
    def check_cancellation(self, request, pk=None):
        """Check if booking can be cancelled and calculate refund"""
        session = self.get_object()
        
        can_cancel, message = session.can_cancel()
        refund_amount = session.calculate_refund() if can_cancel else 0
        
        return Response({
            'can_cancel': can_cancel,
            'message': message,
            'refund_amount': float(refund_amount),
            'refund_percentage': int((refund_amount / session.initial_amount_paid * 100) if session.initial_amount_paid > 0 else 0)
        })
    
    @action(detail=False, methods=['get'], url_path='activity-logs')
    def get_activity_logs(self, request):
        """Get booking activity logs for admin/staff monitoring"""
        return Response({
            'success': True,
            'activity_logs': [],
            'total_count': 0,
            'page': 1,
            'page_size': 50,
            'total_pages': 0
        })
    
    @action(detail=False, methods=['get'], url_path='cancellation-report')
    def cancellation_report(self, request):
        """Get cancellation statistics and reports"""
        from django.db.models import Count, Sum, Avg
        from django.utils import timezone
        from datetime import timedelta
        
        # Get time range
        range_type = request.query_params.get('range', 'today')  # today, week, month
        now = timezone.now()
        
        if range_type == 'today':
            start_date = now.replace(hour=0, minute=0, second=0, microsecond=0)
        elif range_type == 'week':
            start_date = now - timedelta(days=7)
        else:  # month
            start_date = now - timedelta(days=30)
        
        # Get cancelled sessions
        cancelled_sessions = ParkingSession.objects.filter(
            status='cancelled',
            cancelled_at__gte=start_date
        )
        
        # Calculate statistics
        total_cancellations = cancelled_sessions.count()
        user_initiated = cancelled_sessions.filter(cancellation_type='user_initiated').count()
        auto_cancelled = cancelled_sessions.filter(cancellation_type='auto_cancelled').count()
        admin_cancelled = cancelled_sessions.filter(cancellation_type='admin_cancelled').count()
        
        total_refunds = cancelled_sessions.aggregate(Sum('refund_amount'))['refund_amount__sum'] or 0
        avg_refund = cancelled_sessions.aggregate(Avg('refund_amount'))['refund_amount__avg'] or 0
        
        # Top users who cancelled
        from django.db.models import Count
        top_users = cancelled_sessions.values(
            'user__username', 'user__id'
        ).annotate(
            cancel_count=Count('id')
        ).order_by('-cancel_count')[:10]
        
        # Cancellations by zone
        by_zone = cancelled_sessions.values(
            'zone__name'
        ).annotate(
            count=Count('id')
        ).order_by('-count')
        
        # Cancellation reasons breakdown
        reasons = cancelled_sessions.values(
            'cancellation_reason'
        ).annotate(
            count=Count('id')
        ).order_by('-count')[:10]
        
        return Response({
            'success': True,
            'summary': {
                'total_cancellations': total_cancellations,
                'user_initiated': user_initiated,
                'auto_cancelled': auto_cancelled,
                'admin_cancelled': admin_cancelled,
                'total_refunds': float(total_refunds),
                'average_refund': float(avg_refund),
            },
            'top_users': list(top_users),
            'by_zone': list(by_zone),
            'cancellation_reasons': list(reasons),
            'range': range_type
        })
    
    @action(detail=False, methods=['get'], url_path='extension-report')
    def extension_report(self, request):
        """Get time extension statistics and reports"""
        from django.db.models import Count, Avg
        from django.utils import timezone
        from datetime import timedelta
        
        # Get time range
        range_type = request.query_params.get('range', 'today')
        now = timezone.now()
        
        if range_type == 'today':
            start_date = now.replace(hour=0, minute=0, second=0, microsecond=0)
        elif range_type == 'week':
            start_date = now - timedelta(days=7)
        else:  # month
            start_date = now - timedelta(days=30)
        
        # Get sessions with extensions
        extended_sessions = ParkingSession.objects.filter(
            extension_count__gt=0,
            entry_time__gte=start_date
        )
        
        total_extensions = extended_sessions.aggregate(Sum('extension_count'))['extension_count__sum'] or 0
        avg_extensions = extended_sessions.aggregate(Avg('extension_count'))['extension_count__avg'] or 0
        
        # Top users who extended
        top_users = extended_sessions.values(
            'user__username', 'user__id'
        ).annotate(
            total_ext=Sum('extension_count')
        ).order_by('-total_ext')[:10]
        
        return Response({
            'success': True,
            'summary': {
                'total_sessions_extended': extended_sessions.count(),
                'total_extensions': int(total_extensions),
                'average_extensions_per_booking': float(avg_extensions),
            },
            'top_users': list(top_users),
            'range': range_type
        })

    @action(detail=True, methods=['post'], url_path='create-razorpay-order')
    def create_razorpay_order(self, request, pk=None):
        """Create a Razorpay order for payment"""
        session = self.get_object()
        try:
            amount = float(request.data.get('amount', session.initial_amount_paid))
            
            # Check for Mock Mode (missing or placeholder keys)
            key_id = settings.RAZORPAY_KEY_ID
            if not key_id or 'your_' in key_id:
                print("Using Mock Payment Mode (Invalid API Keys)")
                return Response({
                    'order': {
                        'id': f'order_mock_{session.id}_{int(timezone.now().timestamp())}',
                        'amount': int(amount * 100),
                        'currency': 'INR',
                        'status': 'created'
                    }
                })

            # Create Razorpay order
            data = {
                'amount': int(amount * 100),  # Amount in paise
                'currency': 'INR',
                'receipt': f'receipt_{session.id}',
                'notes': {
                    'session_id': session.id,
                    'vehicle_number': session.vehicle_number
                }
            }
            order = razorpay_client.order.create(data=data)
            return Response({
                'order': order,
                'key_id': settings.RAZORPAY_KEY_ID
            })
        except Exception as e:
            print(f"Razorpay Order Creation Failed: {str(e)}") # Debug Log
            return Response({'error': str(e)}, status=400)

    @action(detail=False, methods=['post'], url_path='verify-razorpay-payment')
    def verify_razorpay_payment(self, request):
        """Verify Razorpay payment signature and update session status"""
        payment_id = request.data.get('razorpay_payment_id')
        order_id = request.data.get('razorpay_order_id')
        signature = request.data.get('razorpay_signature')
        
        try:
            # Handle Mock Payment Verification
            if order_id and order_id.startswith('order_mock_'):
                print("Verifying Mock Payment")
                # Skip signature check for mock orders
            else:
                # Verify signature
                params_dict = {
                    'razorpay_order_id': order_id,
                    'razorpay_payment_id': payment_id,
                    'razorpay_signature': signature
                }
                razorpay_client.utility.verify_payment_signature(params_dict)
            
            # Update session status
            session_id = request.data.get('session_id')
            parking_session = ParkingSession.objects.get(id=session_id)
            
            # OPTIMISTIC BOOKING: Check availability now
            if parking_session.slot.is_reserved or parking_session.slot.is_occupied:
                # Double check if WE are the ones who reserved it (retry scenario)
                if parking_session.status != 'reserved':
                     return Response({'success': False, 'error': 'Slot already taken by another user.'}, status=400)

            # Lock the slot
            parking_session.slot.is_reserved = True
            parking_session.slot.save()

            # Save the amount to the session
            amount_paid = request.data.get('amount', 0)
            from decimal import Decimal
            parking_session.initial_amount_paid = Decimal(str(amount_paid))
            parking_session.payment_status = 'paid'
            parking_session.status = 'reserved' # Confirm booking after payment
            parking_session.save()
            
            # Record the payment
            Payment.objects.create(
                session=parking_session,
                amount=Decimal(str(amount_paid)),
                payment_method='UPI/Card (Razorpay)',
                payment_type='FULL',
                transaction_id=payment_id,
                status='success'
            )
            
            # Trigger SMS confirmation
            try:
                from .sms_service import SMSService
                import logging
                logger = logging.getLogger(__name__)
                message = (
                    f"PAYMENT SUCCESS: Your booking for {parking_session.vehicle_number} "
                    f"at {parking_session.zone.name} is confirmed. Slot: {parking_session.slot.slot_number}. "
                    f"Show QR at entry."
                )
                # Use guest_mobile if available
                mobile = parking_session.user.phone_number if parking_session.user else parking_session.guest_mobile
                if mobile:
                    SMSService.send(mobile, message)
            except Exception as sms_err:
                logger.error(f"Failed to send SMS after payment: {str(sms_err)}")
            
            return Response({'success': True, 'message': 'Payment verified successfully'})
        except Exception as e:
            return Response({'success': False, 'error': str(e)}, status=400)


class VehicleViewSet(viewsets.ModelViewSet):
    queryset = []
    permission_classes = [AllowAny]

    def list(self, request, *args, **kwargs):
        return Response({'success': True, 'vehicles': []})

class DisputeViewSet(viewsets.ModelViewSet):
    queryset = []
    permission_classes = [AllowAny]

    def list(self, request, *args, **kwargs):
        return Response({'success': True, 'disputes': []})

class ScheduleViewSet(viewsets.ModelViewSet):
    queryset = []
    permission_classes = [AllowAny]

    def list(self, request, *args, **kwargs):
        return Response({
            'success': True,
            'schedules': [],
            'zone_id': request.query_params.get('zone')
        })

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [AllowAny]

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response({'success': True, 'payments': serializer.data})
