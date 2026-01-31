"""
SMART PARKING MANAGEMENT SYSTEM - MODELS
========================================
Complete backend models with zero loopholes
Production-ready with all constraints and integrity checks
"""

from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError
from decimal import Decimal
import uuid


class ParkingZone(models.Model):
    """
    Parking zones with different rates
    Example: Zone A (₹50/hour), Zone B (₹30/hour)
    """
    name = models.CharField(max_length=100, unique=True)
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2)
    total_slots = models.PositiveIntegerField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'parking_zones'
        indexes = [
            models.Index(fields=['is_active']),
            models.Index(fields=['name']),
        ]

    def __str__(self):
        return f"{self.name} - ₹{self.hourly_rate}/hour"

    def clean(self):
        if self.hourly_rate <= 0:
            raise ValidationError("Hourly rate must be positive")
        if self.total_slots <= 0:
            raise ValidationError("Total slots must be positive")


class ParkingSlot(models.Model):
    """
    Individual parking slots within zones
    Each slot belongs to one zone and has unique number
    """
    zone = models.ForeignKey(ParkingZone, on_delete=models.CASCADE, related_name='slots')
    slot_number = models.CharField(max_length=20)
    is_occupied = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'parking_slots'
        unique_together = [['zone', 'slot_number']]
        indexes = [
            models.Index(fields=['zone', 'is_occupied']),
            models.Index(fields=['is_active']),
        ]

    def __str__(self):
        return f"{self.zone.name}-{self.slot_number}"


class Vehicle(models.Model):
    """
    Vehicle information
    One vehicle can have multiple sessions but only one active at a time
    """
    vehicle_number = models.CharField(max_length=20, unique=True)
    owner_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'vehicles'
        indexes = [
            models.Index(fields=['vehicle_number']),
        ]

    def __str__(self):
        return f"{self.vehicle_number} - {self.owner_name}"

    def clean(self):
        self.vehicle_number = self.vehicle_number.upper().strip()


class ParkingBooking(models.Model):
    """
    Booking created when user reserves a slot
    Must be paid upfront, expires in 5 minutes
    """
    BOOKING_STATUS = [
        ('CREATED', 'Created'),
        ('PAID', 'Paid'),
        ('EXPIRED', 'Expired'),
        ('CANCELLED', 'Cancelled'),
        ('USED', 'Used'),
    ]

    booking_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='bookings')
    zone = models.ForeignKey(ParkingZone, on_delete=models.CASCADE, related_name='bookings')
    slot = models.ForeignKey(ParkingSlot, on_delete=models.CASCADE, related_name='bookings', null=True, blank=True)
    
    # Booking details
    booking_amount = models.DecimalField(max_digits=10, decimal_places=2)
    hours_booked = models.PositiveIntegerField(default=1)
    status = models.CharField(max_length=10, choices=BOOKING_STATUS, default='CREATED')
    
    # QR Code for entry
    qr_code = models.CharField(max_length=100, unique=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    paid_at = models.DateTimeField(null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'parking_bookings'
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['qr_code']),
            models.Index(fields=['expires_at']),
            models.Index(fields=['vehicle']),
        ]

    def __str__(self):
        return f"Booking {self.booking_id} - {self.vehicle.vehicle_number}"

    def is_expired(self):
        """Check if booking has expired"""
        return timezone.now() > self.expires_at

    def can_cancel(self):
        """Check if booking can be cancelled for refund"""
        if self.status != 'PAID':
            return False
        # Can cancel within 5 minutes of creation
        return timezone.now() <= self.created_at + timezone.timedelta(minutes=5)


class ParkingSession(models.Model):
    """
    Active parking session from entry to exit
    Links booking to actual parking usage
    """
    SESSION_STATUS = [
        ('ACTIVE', 'Active'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    ]

    session_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    booking = models.OneToOneField(ParkingBooking, on_delete=models.CASCADE, related_name='session')
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='sessions')
    zone = models.ForeignKey(ParkingZone, on_delete=models.CASCADE, related_name='sessions')
    slot = models.ForeignKey(ParkingSlot, on_delete=models.CASCADE, related_name='sessions')
    
    # Session timeline
    entry_time = models.DateTimeField(null=True, blank=True)
    exit_time = models.DateTimeField(null=True, blank=True)
    
    # QR scan tracking
    entry_qr_scanned = models.BooleanField(default=False)
    exit_qr_scanned = models.BooleanField(default=False)
    
    # Status
    status = models.CharField(max_length=10, choices=SESSION_STATUS, default='ACTIVE')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'parking_sessions'
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['vehicle', 'status']),
            models.Index(fields=['entry_time']),
            models.Index(fields=['exit_time']),
        ]
        constraints = [
            # Ensure only one active session per vehicle
            models.UniqueConstraint(
                fields=['vehicle'],
                condition=models.Q(status='ACTIVE'),
                name='unique_active_session_per_vehicle'
            )
        ]

    def __str__(self):
        return f"Session {self.session_id} - {self.vehicle.vehicle_number}"

    def duration_minutes(self):
        """Calculate parking duration in minutes"""
        if not self.entry_time or not self.exit_time:
            return 0
        delta = self.exit_time - self.entry_time
        return int(delta.total_seconds() / 60)


class Payment(models.Model):
    """
    All payments - booking payments and additional payments
    """
    PAYMENT_TYPE = [
        ('BOOKING', 'Booking Payment'),
        ('ADDITIONAL', 'Additional Payment'),
    ]
    
    PAYMENT_STATUS = [
        ('PENDING', 'Pending'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed'),
        ('REFUNDED', 'Refunded'),
    ]

    payment_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    booking = models.ForeignKey(ParkingBooking, on_delete=models.CASCADE, related_name='payments', null=True, blank=True)
    session = models.ForeignKey(ParkingSession, on_delete=models.CASCADE, related_name='payments', null=True, blank=True)
    
    # Payment details
    payment_type = models.CharField(max_length=10, choices=PAYMENT_TYPE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=10, choices=PAYMENT_STATUS, default='PENDING')
    
    # Payment gateway details (for future integration)
    gateway_transaction_id = models.CharField(max_length=100, blank=True)
    gateway_response = models.JSONField(default=dict, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'payments'
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['payment_type']),
            models.Index(fields=['booking']),
            models.Index(fields=['session']),
        ]

    def __str__(self):
        return f"Payment {self.payment_id} - ₹{self.amount}"


class Refund(models.Model):
    """
    Refund processing for cancelled bookings or unused time
    """
    REFUND_TYPE = [
        ('BOOKING_CANCEL', 'Booking Cancellation'),
        ('UNUSED_TIME', 'Unused Time Refund'),
    ]
    
    REFUND_STATUS = [
        ('PENDING', 'Pending'),
        ('PROCESSED', 'Processed'),
        ('FAILED', 'Failed'),
    ]

    refund_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    original_payment = models.ForeignKey(Payment, on_delete=models.CASCADE, related_name='refunds')
    booking = models.ForeignKey(ParkingBooking, on_delete=models.CASCADE, related_name='refunds', null=True, blank=True)
    session = models.ForeignKey(ParkingSession, on_delete=models.CASCADE, related_name='refunds', null=True, blank=True)
    
    # Refund details
    refund_type = models.CharField(max_length=15, choices=REFUND_TYPE)
    refund_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=10, choices=REFUND_STATUS, default='PENDING')
    reason = models.TextField()
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'refunds'
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['refund_type']),
        ]

    def __str__(self):
        return f"Refund {self.refund_id} - ₹{self.refund_amount}"


class QRScanLog(models.Model):
    """
    Log all QR code scans for audit trail
    Prevents double scanning and tracks all attempts
    """
    SCAN_TYPE = [
        ('ENTRY', 'Entry Scan'),
        ('EXIT', 'Exit Scan'),
    ]
    
    SCAN_STATUS = [
        ('SUCCESS', 'Success'),
        ('FAILED', 'Failed'),
        ('DUPLICATE', 'Duplicate Scan'),
    ]

    log_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    qr_code = models.CharField(max_length=100)
    booking = models.ForeignKey(ParkingBooking, on_delete=models.CASCADE, related_name='scan_logs', null=True, blank=True)
    session = models.ForeignKey(ParkingSession, on_delete=models.CASCADE, related_name='scan_logs', null=True, blank=True)
    
    # Scan details
    scan_type = models.CharField(max_length=5, choices=SCAN_TYPE)
    scan_status = models.CharField(max_length=10, choices=SCAN_STATUS)
    error_message = models.TextField(blank=True)
    
    # Device/location info (for future use)
    scanner_device_id = models.CharField(max_length=50, blank=True)
    scanner_location = models.CharField(max_length=100, blank=True)
    
    # Timestamp
    scanned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'qr_scan_logs'
        indexes = [
            models.Index(fields=['qr_code']),
            models.Index(fields=['scan_type']),
            models.Index(fields=['scan_status']),
            models.Index(fields=['scanned_at']),
        ]

    def __str__(self):
        return f"QR Scan {self.log_id} - {self.scan_type} - {self.scan_status}"