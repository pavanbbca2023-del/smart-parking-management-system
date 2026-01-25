from rest_framework import serializers
from .models import User, Slot, Attendance, Zone, ParkingSession, Payment, Vehicle, Dispute, Schedule, ShiftLog, Feedback

class AttendanceSerializer(serializers.ModelSerializer):
    staff_name = serializers.CharField(source='staff.username', read_only=True)
    class Meta:
        model = Attendance
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    phone = serializers.CharField(source='phone_number', required=False)
    created_at = serializers.DateTimeField(source='date_joined', read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role', 'salary', 'position', 'phone', 'created_at', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class SlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = Slot
        fields = '__all__'


class ZoneSerializer(serializers.ModelSerializer):
    available_slots = serializers.ReadOnlyField()
    current_occupancy = serializers.SerializerMethodField()
    hourly_rate = serializers.DecimalField(source='base_price', max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Zone
        fields = ('id', 'name', 'description', 'total_slots', 'available_slots', 'base_price', 'hourly_rate', 'is_active', 'current_occupancy', 'slots')
    
    slots = SlotSerializer(many=True, read_only=True)

    def get_current_occupancy(self, obj):
        occupied = obj.slots.filter(is_occupied=True).count()
        return {
            'total_slots': obj.total_slots,
            'occupied': occupied,
            'available': obj.total_slots - occupied
        }

class ParkingSessionSerializer(serializers.ModelSerializer):
    zone_name = serializers.CharField(source='zone.name', read_only=True)
    slot_number = serializers.CharField(source='slot.slot_number', read_only=True)
    is_paid = serializers.SerializerMethodField()
    duration = serializers.SerializerMethodField()
    hourly_rate = serializers.DecimalField(source='zone.base_price', max_digits=10, decimal_places=2, read_only=True)
    estimated_total = serializers.SerializerMethodField()
    estimated_balance = serializers.SerializerMethodField()

    class Meta:
        model = ParkingSession
        fields = ('id', 'vehicle_number', 'zone', 'zone_name', 'slot', 'slot_number', 'entry_time', 'exit_time', 
                  'initial_amount_paid', 'final_amount_paid', 'total_amount_paid',
                  'payment_method', 'payment_status', 'is_paid', 'duration', 'status', 'qr_code_data',
                  'hourly_rate', 'estimated_total', 'estimated_balance')

    def get_is_paid(self, obj):
        return obj.payment_status == 'paid'

    def get_duration(self, obj):
        if not obj.exit_time:
            from django.utils import timezone
            duration = timezone.now() - obj.entry_time
        else:
            duration = obj.exit_time - obj.entry_time
        
        hours = int(duration.total_seconds() // 3600)
        minutes = int((duration.total_seconds() % 3600) // 60)
        return f"{hours}h {minutes}m"

    def get_estimated_total(self, obj):
        if obj.status != 'active':
            return float(obj.total_amount_paid)
            
        from django.utils import timezone
        import math
        duration_delta = timezone.now() - obj.entry_time
        hours = duration_delta.total_seconds() / 3600
        billable_hours = max(1, math.ceil(hours))
        return float(obj.zone.base_price * billable_hours)

    def get_estimated_balance(self, obj):
        total = self.get_estimated_total(obj)
        try:
            initial = float(obj.initial_amount_paid)
        except (ValueError, TypeError):
            initial = 0.0
        return max(0.0, total - initial)

class PaymentSerializer(serializers.ModelSerializer):
    session_vehicle = serializers.CharField(source='session.vehicle_number', read_only=True)
    payment_time = serializers.DateTimeField(source='created_at', read_only=True)
    
    class Meta:
        model = Payment
        fields = [
            'id', 'session', 'session_vehicle', 'amount', 'payment_method', 
            'payment_type', 'transaction_id', 'status', 'payment_time'
        ]

class VehicleSerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Vehicle
        fields = ('id', 'vehicle_number', 'user', 'owner_name', 'vehicle_type', 'created_at')

class DisputeSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    description = serializers.CharField(source='reason')
    type = serializers.CharField(source='dispute_type')

    class Meta:
        model = Dispute
        fields = ('id', 'session', 'user', 'user_name', 'reason', 'description', 'severity', 'type', 'status', 'created_at')

class ScheduleSerializer(serializers.ModelSerializer):
    staff_name = serializers.CharField(source='staff.username', read_only=True)

    class Meta:
        model = Schedule
        fields = ('id', 'staff', 'staff_name', 'day', 'shift_type', 'shift_start', 'shift_end', 'is_active')

class ShiftLogSerializer(serializers.ModelSerializer):
    staff_name = serializers.CharField(source='staff.username', read_only=True)
    class Meta:
        model = ShiftLog
        fields = '__all__'

class FeedbackSerializer(serializers.ModelSerializer):
    vehicle_number = serializers.CharField(source='session.vehicle_number', read_only=True)
    class Meta:
        model = Feedback
        fields = '__all__'
