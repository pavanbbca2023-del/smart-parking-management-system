from django.contrib import admin
from .models import (
    ParkingZone, ParkingSlot, Vehicle, ParkingSession,
    Payment, AnalyticsReport, SystemMetrics
)


@admin.register(ParkingZone)
class ParkingZoneAdmin(admin.ModelAdmin):
    list_display = ['name', 'is_active', 'get_total_slots', 'get_occupied_count', 'get_occupancy_rate', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name']
    readonly_fields = ['created_at']

    def get_occupied_count(self, obj):
        return obj.get_occupied_count()
    get_occupied_count.short_description = 'Occupied Slots'

    def get_occupancy_rate(self, obj):
        rate = obj.get_occupancy_rate()
        return f"{rate:.1f}%"
    get_occupancy_rate.short_description = 'Occupancy Rate'


@admin.register(ParkingSlot)
class ParkingSlotAdmin(admin.ModelAdmin):
    list_display = ['zone', 'slot_number', 'status', 'is_occupied', 'created_at']
    list_filter = ['zone', 'status', 'is_occupied', 'created_at']
    search_fields = ['slot_number', 'zone__name']
    readonly_fields = ['created_at']


@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = ['license_plate', 'vehicle_type', 'owner_name', 'get_total_sessions', 'get_total_expenses', 'created_at']
    list_filter = ['vehicle_type', 'created_at']
    search_fields = ['license_plate', 'owner_name']
    readonly_fields = ['created_at']

    def get_total_sessions(self, obj):
        return obj.get_total_sessions()
    get_total_sessions.short_description = 'Total Sessions'

    def get_total_expenses(self, obj):
        return f"${obj.get_total_expenses()}"
    get_total_expenses.short_description = 'Total Expenses'


@admin.register(ParkingSession)
class ParkingSessionAdmin(admin.ModelAdmin):
    list_display = ['vehicle', 'slot', 'status', 'entry_time', 'exit_time', 'total_amount', 'is_paid', 'created_at']
    list_filter = ['status', 'is_paid', 'entry_time']
    search_fields = ['vehicle__license_plate', 'slot__slot_number']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'entry_time'
    fieldsets = (
        ('Session Information', {
            'fields': ('vehicle', 'slot', 'user', 'created_by', 'status')
        }),
        ('Timing', {
            'fields': ('entry_time', 'exit_time')
        }),
        ('Payment', {
            'fields': ('amount_paid', 'total_amount', 'is_paid', 'is_refunded')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['transaction_id', 'session', 'amount', 'payment_method', 'status', 'created_at']
    list_filter = ['status', 'payment_type', 'payment_method', 'created_at']
    search_fields = ['transaction_id', 'session__vehicle__license_plate']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        ('Payment Information', {
            'fields': ('transaction_id', 'session', 'amount', 'status')
        }),
        ('Payment Details', {
            'fields': ('payment_type', 'payment_method', 'processed_by')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(AnalyticsReport)
class AnalyticsReportAdmin(admin.ModelAdmin):
    list_display = ['title', 'report_type', 'generated_by', 'created_at']
    list_filter = ['report_type', 'created_at']
    search_fields = ['title']
    readonly_fields = ['created_at', 'data']
    
    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser


@admin.register(SystemMetrics)
class SystemMetricsAdmin(admin.ModelAdmin):
    list_display = ['timestamp', 'total_slots', 'occupied_slots', 'available_slots', 'daily_revenue', 'active_sessions']
    list_filter = ['timestamp']
    readonly_fields = ['timestamp', 'total_slots', 'occupied_slots', 'available_slots', 'daily_revenue', 'active_sessions']
    
    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def has_change_permission(self, request, obj=None):
        return False
