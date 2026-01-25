from django.contrib import admin
from .models import DailyReport, ZoneAnalytics, VehicleAnalytics, RevenueReport, PeakHourAnalytics, Alert

@admin.register(Alert)
class AlertAdmin(admin.ModelAdmin):
    list_display = ('title', 'type', 'is_read', 'created_at')
    list_filter = ('type', 'is_read', 'created_at')
    search_fields = ('title', 'message')

class DailyReportAdmin(admin.ModelAdmin):
    list_display = ('date', 'total_sessions', 'total_revenue', 'occupancy_rate')
    list_filter = ('date',)

class ZoneAnalyticsAdmin(admin.ModelAdmin):
    list_display = ('zone', 'date', 'sessions_count', 'revenue', 'occupancy_rate')
    list_filter = ('date', 'zone')

class VehicleAnalyticsAdmin(admin.ModelAdmin):
    list_display = ('vehicle', 'total_sessions', 'total_amount_paid', 'last_visit')
    search_fields = ('vehicle__vehicle_number',)

class RevenueReportAdmin(admin.ModelAdmin):
    list_display = ('period_type', 'start_date', 'end_date', 'total_revenue')
    list_filter = ('period_type', 'start_date')

class PeakHourAnalyticsAdmin(admin.ModelAdmin):
    list_display = ('date', 'hour', 'sessions_count', 'occupancy_rate')
    list_filter = ('date', 'hour')

# Explicitly register models
admin.site.register(DailyReport, DailyReportAdmin)
admin.site.register(ZoneAnalytics, ZoneAnalyticsAdmin)
admin.site.register(VehicleAnalytics, VehicleAnalyticsAdmin)
admin.site.register(RevenueReport, RevenueReportAdmin)
admin.site.register(PeakHourAnalytics, PeakHourAnalyticsAdmin)
