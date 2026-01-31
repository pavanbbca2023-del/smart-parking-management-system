"""
SMART PARKING MANAGEMENT SYSTEM - ADMIN
=======================================
Complete admin interface for all models
"""

from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils import timezone

from .models_complete import (
    ParkingZone, ParkingSlot, Vehicle, ParkingBooking,
    ParkingSession, Payment, Refund, QRScanLog
)


@admin.register(ParkingZone)
class ParkingZoneAdmin(admin.ModelAdmin):
    """Admin for parking zones"""
    
    list_display = ('name', 'hourly_rate', 'total_slots', 'available_slots_display', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name',)
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'hourly_rate', 'total_slots')
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def available_slots_display(self, obj):
        """Display available slots count"""
        total = obj.slots.filter(is_active=True).count()
        occupied = obj.slots.filter(is_occupied=True, is_active=True).count()
        available = total - occupied
        
        color = 'green' if available > total * 0.3 else 'orange' if available > 0 else 'red'
        return format_html(
            '<span style="color: {};">{}/{}</span>',
            color, available, total
        )
    
    available_slots_display.short_description = 'Available/Total'


@admin.register(ParkingSlot)
class ParkingSlotAdmin(admin.ModelAdmin):
    """Admin for parking slots"""
    
    list_display = ('slot_number', 'zone', 'is_occupied', 'is_active', 'current_session_display')
    list_filter = ('zone', 'is_occupied', 'is_active', 'created_at')
    search_fields = ('slot_number', 'zone__name')
    readonly_fields = ('created_at',)
    
    def current_session_display(self, obj):
        """Display current session if occupied"""
        if obj.is_occupied:
            session = obj.sessions.filter(status='ACTIVE').first()
            if session:
                return format_html(
                    '<a href="{}">{}</a>',
                    reverse('admin:parking_parkingsession_change', args=[session.pk]),
                    session.vehicle.vehicle_number
                )
        return '-'
    
    current_session_display.short_description = 'Current Vehicle'


@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    """Admin for vehicles"""
    
    list_display = ('vehicle_number', 'owner_name', 'phone_number', 'total_bookings', 'active_session_display', 'created_at')
    search_fields = ('vehicle_number', 'owner_name', 'phone_number')
    readonly_fields = ('created_at',)
    
    def total_bookings(self, obj):
        """Display total bookings count"""
        return obj.bookings.count()
    
    total_bookings.short_description = 'Total Bookings'
    
    def active_session_display(self, obj):
        """Display active session if any"""
        session = obj.sessions.filter(status='ACTIVE').first()
        if session:
            return format_html(
                '<span style="color: green;">Active - {}</span>',
                session.zone.name
            )
        return format_html('<span style="color: gray;">None</span>')
    
    active_session_display.short_description = 'Active Session'


@admin.register(ParkingBooking)
class ParkingBookingAdmin(admin.ModelAdmin):
    """Admin for parking bookings"""
    
    list_display = ('booking_id_short', 'vehicle_display', 'zone', 'status', 'booking_amount', 'expires_at', 'created_at')
    list_filter = ('status', 'zone', 'created_at', 'expires_at')
    search_fields = ('booking_id', 'vehicle__vehicle_number', 'qr_code')
    readonly_fields = ('booking_id', 'qr_code', 'created_at', 'expires_at', 'paid_at', 'cancelled_at')
    
    fieldsets = (
        ('Booking Information', {
            'fields': ('booking_id', 'vehicle', 'zone', 'slot')
        }),
        ('Booking Details', {
            'fields': ('booking_amount', 'hours_booked', 'status', 'qr_code')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'expires_at', 'paid_at', 'cancelled_at'),
            'classes': ('collapse',)
        }),
    )
    
    def booking_id_short(self, obj):
        """Display short booking ID"""
        return str(obj.booking_id)[:8] + '...'
    
    booking_id_short.short_description = 'Booking ID'
    
    def vehicle_display(self, obj):
        """Display vehicle with link"""
        return format_html(
            '<a href="{}">{}</a>',
            reverse('admin:parking_vehicle_change', args=[obj.vehicle.pk]),
            obj.vehicle.vehicle_number
        )
    
    vehicle_display.short_description = 'Vehicle'


@admin.register(ParkingSession)
class ParkingSessionAdmin(admin.ModelAdmin):
    """Admin for parking sessions"""
    
    list_display = ('session_id_short', 'vehicle_display', 'zone', 'slot', 'status', 'entry_time', 'exit_time', 'duration_display')
    list_filter = ('status', 'zone', 'entry_time', 'exit_time')
    search_fields = ('session_id', 'vehicle__vehicle_number', 'booking__qr_code')
    readonly_fields = ('session_id', 'created_at', 'updated_at')
    
    fieldsets = (
        ('Session Information', {
            'fields': ('session_id', 'booking', 'vehicle', 'zone', 'slot')
        }),
        ('Timeline', {
            'fields': ('entry_time', 'exit_time', 'entry_qr_scanned', 'exit_qr_scanned')
        }),
        ('Status', {
            'fields': ('status',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def session_id_short(self, obj):
        """Display short session ID"""
        return str(obj.session_id)[:8] + '...'
    
    session_id_short.short_description = 'Session ID'
    
    def vehicle_display(self, obj):
        """Display vehicle with link"""
        return format_html(
            '<a href="{}">{}</a>',
            reverse('admin:parking_vehicle_change', args=[obj.vehicle.pk]),
            obj.vehicle.vehicle_number
        )
    
    vehicle_display.short_description = 'Vehicle'
    
    def duration_display(self, obj):
        """Display parking duration"""
        if obj.entry_time and obj.exit_time:
            duration = obj.exit_time - obj.entry_time
            hours = int(duration.total_seconds() // 3600)
            minutes = int((duration.total_seconds() % 3600) // 60)
            return f"{hours}h {minutes}m"
        elif obj.entry_time:
            duration = timezone.now() - obj.entry_time
            hours = int(duration.total_seconds() // 3600)
            minutes = int((duration.total_seconds() % 3600) // 60)
            return format_html('<span style="color: blue;">{}h {}m (ongoing)</span>', hours, minutes)
        return '-'
    
    duration_display.short_description = 'Duration'


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    """Admin for payments"""
    
    list_display = ('payment_id_short', 'payment_type', 'amount', 'status', 'booking_display', 'session_display', 'created_at')
    list_filter = ('payment_type', 'status', 'created_at')
    search_fields = ('payment_id', 'booking__booking_id', 'session__session_id')
    readonly_fields = ('payment_id', 'created_at', 'completed_at')
    
    fieldsets = (
        ('Payment Information', {
            'fields': ('payment_id', 'payment_type', 'amount', 'status')
        }),
        ('Related Records', {
            'fields': ('booking', 'session')
        }),
        ('Gateway Details', {
            'fields': ('gateway_transaction_id', 'gateway_response'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'completed_at'),
            'classes': ('collapse',)
        }),
    )
    
    def payment_id_short(self, obj):
        """Display short payment ID"""
        return str(obj.payment_id)[:8] + '...'
    
    payment_id_short.short_description = 'Payment ID'
    
    def booking_display(self, obj):
        """Display related booking"""
        if obj.booking:
            return format_html(
                '<a href="{}">{}</a>',
                reverse('admin:parking_parkingbooking_change', args=[obj.booking.pk]),
                str(obj.booking.booking_id)[:8] + '...'
            )
        return '-'
    
    booking_display.short_description = 'Booking'
    
    def session_display(self, obj):
        """Display related session"""
        if obj.session:
            return format_html(
                '<a href="{}">{}</a>',
                reverse('admin:parking_parkingsession_change', args=[obj.session.pk]),
                str(obj.session.session_id)[:8] + '...'
            )
        return '-'
    
    session_display.short_description = 'Session'


@admin.register(Refund)
class RefundAdmin(admin.ModelAdmin):
    """Admin for refunds"""
    
    list_display = ('refund_id_short', 'refund_type', 'refund_amount', 'status', 'original_payment_display', 'created_at')
    list_filter = ('refund_type', 'status', 'created_at')
    search_fields = ('refund_id', 'original_payment__payment_id')
    readonly_fields = ('refund_id', 'created_at', 'processed_at')
    
    def refund_id_short(self, obj):
        """Display short refund ID"""
        return str(obj.refund_id)[:8] + '...'
    
    refund_id_short.short_description = 'Refund ID'
    
    def original_payment_display(self, obj):
        """Display original payment"""
        return format_html(
            '<a href="{}">{}</a>',
            reverse('admin:parking_payment_change', args=[obj.original_payment.pk]),
            str(obj.original_payment.payment_id)[:8] + '...'
        )
    
    original_payment_display.short_description = 'Original Payment'


@admin.register(QRScanLog)
class QRScanLogAdmin(admin.ModelAdmin):
    """Admin for QR scan logs"""
    
    list_display = ('log_id_short', 'qr_code', 'scan_type', 'scan_status', 'booking_display', 'scanned_at')
    list_filter = ('scan_type', 'scan_status', 'scanned_at')
    search_fields = ('log_id', 'qr_code', 'booking__booking_id')
    readonly_fields = ('log_id', 'scanned_at')
    
    fieldsets = (
        ('Scan Information', {
            'fields': ('log_id', 'qr_code', 'scan_type', 'scan_status')
        }),
        ('Related Records', {
            'fields': ('booking', 'session')
        }),
        ('Error Details', {
            'fields': ('error_message',)
        }),
        ('Scanner Details', {
            'fields': ('scanner_device_id', 'scanner_location'),
            'classes': ('collapse',)
        }),
        ('Timestamp', {
            'fields': ('scanned_at',)
        }),
    )
    
    def log_id_short(self, obj):
        """Display short log ID"""
        return str(obj.log_id)[:8] + '...'
    
    log_id_short.short_description = 'Log ID'
    
    def booking_display(self, obj):
        """Display related booking"""
        if obj.booking:
            return format_html(
                '<a href="{}">{}</a>',
                reverse('admin:parking_parkingbooking_change', args=[obj.booking.pk]),
                str(obj.booking.booking_id)[:8] + '...'
            )
        return '-'
    
    booking_display.short_description = 'Booking'


# ============================================
# ADMIN SITE CUSTOMIZATION
# ============================================

admin.site.site_header = "Smart Parking Management System"
admin.site.site_title = "Parking Admin"
admin.site.index_title = "Welcome to Parking Management"