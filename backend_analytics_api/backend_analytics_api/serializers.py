# serializers.py - Response Serializers for Analytics API

from rest_framework import serializers


class DashboardSummarySerializer(serializers.Serializer):
    """
    Serializer for dashboard summary response
    """
    active_sessions = serializers.IntegerField()
    completed_sessions = serializers.IntegerField()
    total_revenue = serializers.FloatField()
    total_zones = serializers.IntegerField()
    total_slots = serializers.IntegerField()
    occupied_slots = serializers.IntegerField()
    occupancy_rate = serializers.FloatField()
    total_users = serializers.IntegerField()
    users_this_week = serializers.IntegerField()


class ZoneOccupancySerializer(serializers.Serializer):
    """
    Serializer for zone occupancy data
    """
    zone_id = serializers.IntegerField()
    zone_name = serializers.CharField()
    hourly_rate = serializers.FloatField()
    total_slots = serializers.IntegerField()
    occupied_slots = serializers.IntegerField()
    available_slots = serializers.IntegerField()
    occupancy_rate = serializers.FloatField()
    active_sessions = serializers.IntegerField()


class RevenueReportSerializer(serializers.Serializer):
    """
    Serializer for revenue report data
    """
    from_date = serializers.DateField()
    to_date = serializers.DateField()
    total_revenue = serializers.FloatField()
    total_sessions = serializers.IntegerField()
    zone_revenue = serializers.ListField()
    payment_method_revenue = serializers.ListField()
    daily_revenue = serializers.ListField()


class PeakHoursSerializer(serializers.Serializer):
    """
    Serializer for peak hours analysis
    """
    hourly_data = serializers.ListField()
    top_peak_hours = serializers.ListField()


class ActiveSessionSerializer(serializers.Serializer):
    """
    Serializer for active session data
    """
    session_id = serializers.IntegerField()
    vehicle_number = serializers.CharField()
    owner_name = serializers.CharField()
    zone_name = serializers.CharField()
    slot_number = serializers.CharField()
    entry_time = serializers.DateTimeField()
    duration_hours = serializers.FloatField()
    qr_code = serializers.CharField()
    payment_status = serializers.CharField()


class CompletedSessionSerializer(serializers.Serializer):
    """
    Serializer for completed session data
    """
    session_id = serializers.IntegerField()
    vehicle_number = serializers.CharField()
    owner_name = serializers.CharField()
    zone_name = serializers.CharField()
    slot_number = serializers.CharField()
    entry_time = serializers.DateTimeField()
    exit_time = serializers.DateTimeField()
    duration_hours = serializers.FloatField()
    amount_paid = serializers.FloatField()
    payment_method = serializers.CharField()
    is_paid = serializers.BooleanField()


class VehicleHistorySerializer(serializers.Serializer):
    """
    Serializer for vehicle history data
    """
    vehicle_number = serializers.CharField()
    owner_name = serializers.CharField()
    total_sessions = serializers.IntegerField()
    total_amount_paid = serializers.FloatField()
    sessions = serializers.ListField()


class PaymentAnalyticsSerializer(serializers.Serializer):
    """
    Serializer for payment analytics data
    """
    total_revenue = serializers.FloatField()
    total_paid_sessions = serializers.IntegerField()
    average_payment = serializers.FloatField()
    payment_methods = serializers.ListField()
    payment_status = serializers.ListField()
    recent_payments = serializers.ListField()


class SlotUsageSerializer(serializers.Serializer):
    """
    Serializer for slot usage data
    """
    slot_id = serializers.IntegerField()
    zone_name = serializers.CharField()
    slot_number = serializers.CharField()
    is_occupied = serializers.BooleanField()
    total_sessions = serializers.IntegerField()
    total_revenue = serializers.FloatField()
    current_vehicle = serializers.CharField(allow_null=True)


class ErrorResponseSerializer(serializers.Serializer):
    """
    Serializer for error responses
    """
    error = serializers.CharField()
    message = serializers.CharField(required=False)
    status_code = serializers.IntegerField(required=False)