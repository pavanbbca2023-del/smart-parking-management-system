from django.contrib import admin
from .models import (
    DailyReport,
    ZoneAnalytics,
    VehicleAnalytics,
    RevenueReport,
    PeakHourAnalytics
)

@admin.register(DailyReport)
class DailyReportAdmin(admin.ModelAdmin):
    list_display = ('date', 'total_sessions', 'total_revenue', 'occupancy_rate')
    list_filter = ('date',)
    search_fields = ('date',)
    date_hierarchy = 'date'

@admin.register(ZoneAnalytics)
class ZoneAnalyticsAdmin(admin.ModelAdmin):
    list_display = ('zone', 'date', 'sessions_count', 'revenue', 'occupancy_rate')
    list_filter = ('zone', 'date')
    search_fields = ('zone__name',)
    date_hierarchy = 'date'

@admin.register(VehicleAnalytics)
class VehicleAnalyticsAdmin(admin.ModelAdmin):
    list_display = ('vehicle', 'total_sessions', 'total_amount_paid', 'created_at')
    search_fields = ('vehicle__vehicle_number',)
    readonly_fields = ('created_at', 'updated_at')

@admin.register(RevenueReport)
class RevenueReportAdmin(admin.ModelAdmin):
    list_display = ('period_type', 'start_date', 'end_date', 'total_revenue', 'total_sessions')
    list_filter = ('period_type', 'start_date')
    date_hierarchy = 'start_date'

@admin.register(PeakHourAnalytics)
class PeakHourAnalyticsAdmin(admin.ModelAdmin):
    list_display = ('date', 'hour', 'sessions_count', 'occupancy_rate')
    list_filter = ('date', 'hour')
    date_hierarchy = 'date'
