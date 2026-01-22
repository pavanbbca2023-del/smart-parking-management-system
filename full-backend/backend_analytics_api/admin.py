from django.contrib import admin
from .models import DailyReport, ZoneAnalytics, VehicleAnalytics, RevenueReport, PeakHourAnalytics

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

from .models import StaffSalary
@admin.register(StaffSalary)
class StaffSalaryAdmin(admin.ModelAdmin):
    list_display = ('staff', 'month', 'year', 'base_salary', 'status', 'pay_date')
    list_filter = ('status', 'month', 'year')
    search_fields = ('staff__username',)
