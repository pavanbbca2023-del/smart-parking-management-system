# extended_serializers.py - Serializers for extended models

from rest_framework import serializers
from .models import User, ExtendedParkingSession, Payment
from .models import ParkingZone, ParkingSlot, Vehicle


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'phone', 'role', 'date_joined']
        read_only_fields = ['id', 'date_joined']


class BookingSerializer(serializers.Serializer):
    zone_id = serializers.IntegerField()
    vehicle_number = serializers.CharField(max_length=20)
    owner_name = serializers.CharField(max_length=100, required=False)


class ExtendedParkingSessionSerializer(serializers.ModelSerializer):
    vehicle_number = serializers.CharField(source='vehicle.vehicle_number', read_only=True)
    owner_name = serializers.CharField(source='vehicle.owner_name', read_only=True)
    slot_number = serializers.CharField(source='slot.slot_number', read_only=True)
    zone_name = serializers.CharField(source='zone.name', read_only=True)
    zone_rate = serializers.DecimalField(source='zone.hourly_rate', max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = ExtendedParkingSession
        fields = [
            'id', 'vehicle_number', 'owner_name', 'slot_number', 'zone_name', 'zone_rate',
            'qr_code', 'status', 'payment_status', 'paid_amount', 'total_amount',
            'entry_time', 'exit_time', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'qr_code', 'created_at', 'updated_at']


class PaymentSerializer(serializers.ModelSerializer):
    session_id = serializers.IntegerField(source='session.id', read_only=True)
    vehicle_number = serializers.CharField(source='session.vehicle.vehicle_number', read_only=True)
    
    class Meta:
        model = Payment
        fields = [
            'id', 'session_id', 'vehicle_number', 'amount', 'method', 'type', 
            'status', 'transaction_id', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class QRScanSerializer(serializers.Serializer):
    qr_code = serializers.CharField(max_length=100)


class ExitPaymentSerializer(serializers.Serializer):
    qr_code = serializers.CharField(max_length=100)
    payment_method = serializers.ChoiceField(choices=['CASH', 'ONLINE'])
    amount = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)


class ZoneAvailabilitySerializer(serializers.ModelSerializer):
    available_slots = serializers.SerializerMethodField()
    total_slots = serializers.SerializerMethodField()
    
    class Meta:
        model = ParkingZone
        fields = ['id', 'name', 'hourly_rate', 'is_active', 'total_slots', 'available_slots']
    
    def get_available_slots(self, obj):
        return obj.slots.filter(is_occupied=False).count()
    
    def get_total_slots(self, obj):
        return obj.slots.count()


class PaymentReportSerializer(serializers.Serializer):
    date = serializers.DateField()
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_sessions = serializers.IntegerField()
    cash_amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    online_amount = serializers.DecimalField(max_digits=10, decimal_places=2)