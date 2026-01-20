# admin.py - Django Admin Configuration

from django.contrib import admin
from .models import ParkingZone, ParkingSlot, Vehicle, ParkingSession


# ============================================
# PARKING ZONE ADMIN
# ============================================
@admin.register(ParkingZone)
class ParkingZoneAdmin(admin.ModelAdmin):
    """
    Admin interface for Parking Zones
    """
    # Fields to display in list view
    list_display = ['name', 'hourly_rate', 'is_active', 'total_slots', 'available_slots', 'created_at']
    
    # Fields to filter by
    list_filter = ['is_active', 'created_at']
    
    # Fields to search
    search_fields = ['name']
    
    # Fields that are read-only
    readonly_fields = ['created_at']
    
    # Custom methods for display
    def total_slots(self, obj):
        """Show total slots in this zone"""
        return obj.slots.count()
    total_slots.short_description = 'Total Slots'
    
    def available_slots(self, obj):
        """Show available slots in this zone"""
        return obj.slots.filter(is_occupied=False).count()
    available_slots.short_description = 'Available Slots'


# ============================================
# PARKING SLOT ADMIN
# ============================================
@admin.register(ParkingSlot)
class ParkingSlotAdmin(admin.ModelAdmin):
    """
    Admin interface for Parking Slots
    """
    # Fields to display in list view
    list_display = ['slot_number', 'zone', 'is_occupied', 'current_vehicle', 'created_at']
    
    # Fields to filter by
    list_filter = ['is_occupied', 'zone', 'created_at']
    
    # Fields to search
    search_fields = ['slot_number', 'zone__name']
    
    # Fields that are read-only
    readonly_fields = ['created_at']
    
    # Custom methods for display
    def current_vehicle(self, obj):
        """Show current vehicle in this slot"""
        if obj.is_occupied:
            active_session = obj.sessions.filter(exit_time__isnull=True).first()
            if active_session:
                return active_session.vehicle.vehicle_number
        return 'Empty'
    current_vehicle.short_description = 'Current Vehicle'


# ============================================
# VEHICLE ADMIN
# ============================================
@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    """
    Admin interface for Vehicles
    """
    # Fields to display in list view
    list_display = ['vehicle_number', 'owner_name', 'total_sessions', 'active_session', 'created_at']
    
    # Fields to search
    search_fields = ['vehicle_number', 'owner_name']
    
    # Fields that are read-only
    readonly_fields = ['created_at']
    
    # Custom methods for display
    def total_sessions(self, obj):
        """Show total parking sessions for this vehicle"""
        return obj.sessions.count()
    total_sessions.short_description = 'Total Sessions'
    
    def active_session(self, obj):
        """Show if vehicle has active session"""
        active = obj.sessions.filter(exit_time__isnull=True).first()
        if active:
            return f"Yes - Slot {active.slot.slot_number}"
        return 'No'
    active_session.short_description = 'Active Session'


# ============================================
# PARKING SESSION ADMIN
# ============================================
@admin.register(ParkingSession)
class ParkingSessionAdmin(admin.ModelAdmin):
    """
    Admin interface for Parking Sessions
    """
    # Fields to display in list view
    list_display = [
        'vehicle', 'slot', 'zone', 'status', 'entry_qr_scanned', 
        'exit_qr_scanned', 'amount_paid', 'payment_method', 'created_at'
    ]
    
    # Fields to filter by
    list_filter = [
        'entry_qr_scanned', 'exit_qr_scanned', 'is_paid', 
        'payment_method', 'zone', 'created_at'
    ]
    
    # Fields to search
    search_fields = ['vehicle__vehicle_number', 'qr_code', 'slot__slot_number']
    
    # Fields that are read-only
    readonly_fields = ['qr_code', 'created_at', 'updated_at']
    
    # Fields to display in detail view
    fieldsets = (
        ('Basic Information', {
            'fields': ('vehicle', 'slot', 'zone', 'qr_code')
        }),
        ('Timing', {
            'fields': ('entry_time', 'exit_time', 'created_at', 'updated_at')
        }),
        ('QR Scanning', {
            'fields': ('entry_qr_scanned', 'exit_qr_scanned')
        }),
        ('Payment', {
            'fields': ('amount_paid', 'payment_method', 'is_paid')
        }),
    )
    
    # Custom methods for display
    def status(self, obj):
        """Show session status"""
        if obj.exit_time:
            return 'Completed'
        elif obj.entry_qr_scanned:
            return 'Active (Entered)'
        else:
            return 'Booked (Not Entered)'
    status.short_description = 'Status'
    
    # Custom actions
    actions = ['mark_as_paid', 'cancel_session']
    
    def mark_as_paid(self, request, queryset):
        """Mark selected sessions as paid"""
        updated = queryset.update(is_paid=True)
        self.message_user(request, f'{updated} sessions marked as paid.')
    mark_as_paid.short_description = 'Mark selected sessions as paid'
    
    def cancel_session(self, request, queryset):
        """Cancel selected sessions (release slots)"""
        for session in queryset:
            if not session.exit_time:  # Only cancel active sessions
                session.slot.is_occupied = False
                session.slot.save()
        self.message_user(request, f'Selected sessions cancelled and slots released.')
    cancel_session.short_description = 'Cancel selected sessions'


# ============================================
# ADMIN SITE CUSTOMIZATION
# ============================================

# Customize admin site header and title
admin.site.site_header = 'Smart Parking Management System'
admin.site.site_title = 'Parking Admin'
admin.site.index_title = 'Welcome to Parking Management'