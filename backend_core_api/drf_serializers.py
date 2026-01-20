# serializers.py - DRF Serializers for Smart Parking System

from rest_framework import serializers
from .models import ParkingZone, ParkingSlot, Vehicle, ParkingSession


class ParkingZoneSerializer(serializers.ModelSerializer):
    """Serializer for ParkingZone model"""
    available_slots = serializers.SerializerMethodField()
    total_slots = serializers.SerializerMethodField()
    
    class Meta:
        model = ParkingZone
        fields = ['id', 'name', 'hourly_rate', 'is_active', 'created_at', 'total_slots', 'available_slots']
    
    def get_available_slots(self, obj):
        return obj.slots.filter(is_occupied=False).count()
    
    def get_total_slots(self, obj):
        return obj.slots.count()


class ParkingSlotSerializer(serializers.ModelSerializer):
    """Serializer for ParkingSlot model"""
    zone_name = serializers.CharField(source='zone.name', read_only=True)
    
    class Meta:
        model = ParkingSlot
        fields = ['id', 'slot_number', 'zone', 'zone_name', 'is_occupied', 'created_at']


class VehicleSerializer(serializers.ModelSerializer):
    """Serializer for Vehicle model"""
    
    class Meta:
        model = Vehicle
        fields = ['id', 'vehicle_number', 'owner_name', 'created_at']


class ParkingSessionSerializer(serializers.ModelSerializer):
    """Serializer for ParkingSession model"""
    vehicle_number = serializers.CharField(source='vehicle.vehicle_number', read_only=True)
    owner_name = serializers.CharField(source='vehicle.owner_name', read_only=True)
    slot_number = serializers.CharField(source='slot.slot_number', read_only=True)
    zone_name = serializers.CharField(source='zone.name', read_only=True)
    status = serializers.SerializerMethodField()
    
    class Meta:
        model = ParkingSession
        fields = [
            'id', 'vehicle_number', 'owner_name', 'slot_number', 'zone_name',
            'qr_code', 'entry_time', 'exit_time', 'entry_qr_scanned', 
            'exit_qr_scanned', 'amount_paid', 'payment_method', 'is_paid',
            'status', 'created_at', 'updated_at'
        ]
    
    def get_status(self, obj):
        if obj.exit_time:
            return 'Completed'
        elif obj.entry_qr_scanned:
            return 'Active'
        else:
            return 'Booked'


# Request/Response Serializers
class BookParkingSerializer(serializers.Serializer):
    """Serializer for booking parking request"""
    vehicle_number = serializers.CharField(max_length=20)
    owner_name = serializers.CharField(max_length=100)
    zone_id = serializers.IntegerField()


class QRScanSerializer(serializers.Serializer):
    """Serializer for QR scan requests"""
    qr_code = serializers.CharField(max_length=100)


class ExitScanSerializer(serializers.Serializer):
    """Serializer for exit scan requests"""
    qr_code = serializers.CharField(max_length=100)
    payment_method = serializers.ChoiceField(choices=['CASH', 'ONLINE'])


class PaymentStatusSerializer(serializers.Serializer):
    """Serializer for payment status requests"""
    session_id = serializers.IntegerField()