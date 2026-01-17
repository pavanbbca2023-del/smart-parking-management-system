from django.contrib import admin
from .models import ParkingZone, ParkingSlot, Vehicle, ParkingSession


@admin.register(ParkingZone)
class ParkingZoneAdmin(admin.ModelAdmin):
    """
    Admin interface for ParkingZone model
    - Display zone name, total slots, hourly rate
    - Allow filtering by active status
    - Allow searching by zone name
    """
    list_display = ('name', 'total_slots', 'hourly_rate', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name',)
    readonly_fields = ('id', 'created_at')
    
    fieldsets = (
        ('Basic Info', {
            'fields': ('id', 'name', 'total_slots', 'hourly_rate')
        }),
        ('Status', {
            'fields': ('is_active', 'created_at')
        }),
    )


@admin.register(ParkingSlot)
class ParkingSlotAdmin(admin.ModelAdmin):
    """
    Admin interface for ParkingSlot model
    - Display slot number, zone, occupancy status
    - Allow filtering by zone and occupancy
    - Allow searching by slot number
    """
    list_display = ('slot_number', 'zone', 'is_occupied', 'created_at')
    list_filter = ('zone', 'is_occupied', 'created_at')
    search_fields = ('slot_number', 'zone__name')
    readonly_fields = ('id', 'created_at')
    
    fieldsets = (
        ('Basic Info', {
            'fields': ('id', 'zone', 'slot_number')
        }),
        ('Status', {
            'fields': ('is_occupied', 'created_at')
        }),
    )


@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    """
    Admin interface for Vehicle model
    - Display vehicle number, type, owner name
    - Allow searching by vehicle number
    - Show creation date
    """
    list_display = ('vehicle_number', 'vehicle_type', 'owner_name', 'created_at')
    list_filter = ('vehicle_type', 'created_at')
    search_fields = ('vehicle_number', 'owner_name')
    readonly_fields = ('id', 'created_at')
    
    fieldsets = (
        ('Basic Info', {
            'fields': ('id', 'vehicle_number', 'vehicle_type', 'owner_name')
        }),
        ('Timeline', {
            'fields': ('created_at',)
        }),
    )


@admin.register(ParkingSession)
class ParkingSessionAdmin(admin.ModelAdmin):
    """
    Admin interface for ParkingSession model
    - Display vehicle, zone, entry/exit times, billing info
    - Allow filtering by zone, payment status, date
    - Allow searching by vehicle number and QR code
    - Show billing details
    """
    list_display = ('vehicle_number_display', 'zone', 'entry_time', 'exit_time', 'amount_paid', 'is_paid')
    list_filter = ('zone', 'is_paid', 'entry_time', 'exit_time')
    search_fields = ('vehicle__vehicle_number', 'qr_code')
    readonly_fields = ('id', 'entry_time', 'created_at')
    
    fieldsets = (
        ('Session Info', {
            'fields': ('id', 'vehicle', 'zone', 'slot', 'qr_code')
        }),
        ('Timeline', {
            'fields': ('entry_time', 'exit_time', 'created_at')
        }),
        ('Billing', {
            'fields': ('amount_paid', 'is_paid')
        }),
    )
    
    def vehicle_number_display(self, obj):
        """Display vehicle number in list view"""
        return obj.vehicle.vehicle_number
    
    vehicle_number_display.short_description = 'Vehicle'
