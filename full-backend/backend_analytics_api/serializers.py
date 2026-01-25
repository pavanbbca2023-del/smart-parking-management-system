from rest_framework import serializers

class DashboardSummarySerializer(serializers.Serializer):
    active_sessions = serializers.IntegerField()
    completed_sessions = serializers.IntegerField()
    vehicles_entered = serializers.IntegerField()
    total_revenue = serializers.FloatField()
    total_zones = serializers.IntegerField()
    total_slots = serializers.IntegerField()
    occupied_slots = serializers.IntegerField()
    occupancy_rate = serializers.FloatField()
    total_users = serializers.IntegerField()
    users_this_week = serializers.IntegerField()

class ZoneOccupancySerializer(serializers.Serializer):
    zone_id = serializers.IntegerField()
    zone_name = serializers.CharField()
    hourly_rate = serializers.FloatField()
    total_slots = serializers.IntegerField()
    occupied_slots = serializers.IntegerField()
    available_slots = serializers.IntegerField()
    occupancy_rate = serializers.FloatField()
    active_sessions = serializers.IntegerField()

class RevenueReportSerializer(serializers.Serializer):
    from_date = serializers.DateField()
    to_date = serializers.DateField()
    total_revenue = serializers.FloatField()
    cash_revenue = serializers.FloatField()
    online_revenue = serializers.FloatField()
    total_sessions = serializers.IntegerField()
    zone_revenue = serializers.ListField()
    payment_method_revenue = serializers.ListField()
    daily_revenue = serializers.ListField()

class PeakHoursSerializer(serializers.Serializer):
    hourly_data = serializers.ListField()
    top_peak_hours = serializers.ListField()

class ActiveSessionSerializer(serializers.Serializer):
    session_id = serializers.IntegerField(source='id')
    vehicle_number = serializers.CharField()
    zone_name = serializers.CharField(source='zone.name')
    entry_time = serializers.DateTimeField()
    payment_status = serializers.CharField()

class CompletedSessionSerializer(serializers.Serializer):
    session_id = serializers.IntegerField(source='id')
    vehicle_number = serializers.CharField()
    zone_name = serializers.CharField(source='zone.name')
    entry_time = serializers.DateTimeField()
    exit_time = serializers.DateTimeField()
    amount_paid = serializers.FloatField()
    payment_method = serializers.CharField(allow_null=True, required=False)

from .models import Alert
class AlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alert
        fields = '__all__'
