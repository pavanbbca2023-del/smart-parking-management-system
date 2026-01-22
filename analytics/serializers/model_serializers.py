from rest_framework import serializers
from ..models import (
    ParkingZone, ParkingSlot, Vehicle, ParkingSession,
    Payment, AnalyticsReport, SystemMetrics
)


class ParkingZoneSerializer(serializers.ModelSerializer):
    """Serializer for ParkingZone model"""
    total_slots = serializers.SerializerMethodField()
    occupied_slots = serializers.SerializerMethodField()
    occupancy_rate = serializers.SerializerMethodField()

    class Meta:
        model = ParkingZone
        fields = ['id', 'name', 'description', 'is_active', 'total_slots', 'occupied_slots', 'occupancy_rate', 'created_at']
        read_only_fields = ['created_at']

    def get_total_slots(self, obj):
        return obj.get_total_slots()

    def get_occupied_slots(self, obj):
        return obj.get_occupied_count()

    def get_occupancy_rate(self, obj):
        return obj.get_occupancy_rate()


class ParkingSlotSerializer(serializers.ModelSerializer):
    """Serializer for ParkingSlot model"""
    zone_name = serializers.CharField(source='zone.name', read_only=True)

    class Meta:
        model = ParkingSlot
        fields = ['id', 'zone', 'zone_name', 'slot_number', 'status', 'is_occupied', 'created_at']
        read_only_fields = ['created_at']


class VehicleSerializer(serializers.ModelSerializer):
    """Serializer for Vehicle model"""
    total_sessions = serializers.SerializerMethodField()
    total_expenses = serializers.SerializerMethodField()

    class Meta:
        model = Vehicle
        fields = ['id', 'license_plate', 'vehicle_type', 'owner_name', 'owner_phone', 'total_sessions', 'total_expenses', 'created_at']
        read_only_fields = ['created_at']

    def get_total_sessions(self, obj):
        return obj.get_total_sessions()

    def get_total_expenses(self, obj):
        return float(obj.get_total_expenses())


class ParkingSessionSerializer(serializers.ModelSerializer):
    """Serializer for ParkingSession model"""
    vehicle_number = serializers.CharField(source='vehicle.license_plate', read_only=True)
    slot_info = serializers.CharField(source='slot.slot_number', read_only=True)
    duration_minutes = serializers.SerializerMethodField()

    class Meta:
        model = ParkingSession
        fields = ['id', 'vehicle', 'vehicle_number', 'slot', 'slot_info', 'user', 'created_by', 'status', 
                  'entry_time', 'exit_time', 'duration_minutes', 'amount_paid', 'total_amount', 'is_paid', 
                  'is_refunded', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def get_duration_minutes(self, obj):
        return obj.duration_minutes


class PaymentSerializer(serializers.ModelSerializer):
    """Serializer for Payment model"""
    session_vehicle = serializers.CharField(source='session.vehicle.license_plate', read_only=True)

    class Meta:
        model = Payment
        fields = ['id', 'session', 'session_vehicle', 'payment_type', 'payment_method', 'amount', 'status', 
                  'transaction_id', 'processed_by', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']


class AnalyticsReportSerializer(serializers.ModelSerializer):
    """Serializer for AnalyticsReport model"""
    generated_by_name = serializers.CharField(source='generated_by.username', read_only=True)

    class Meta:
        model = AnalyticsReport
        fields = ['id', 'title', 'report_type', 'data', 'generated_by', 'generated_by_name', 'created_at']
        read_only_fields = ['created_at']


class SystemMetricsSerializer(serializers.ModelSerializer):
    """Serializer for SystemMetrics model"""
    
    class Meta:
        model = SystemMetrics
        fields = ['id', 'timestamp', 'total_slots', 'occupied_slots', 'available_slots', 'daily_revenue', 'active_sessions']
        read_only_fields = ['timestamp']
