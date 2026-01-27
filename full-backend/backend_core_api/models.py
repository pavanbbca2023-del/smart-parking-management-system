from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings
from decimal import Decimal

class User(AbstractUser):
    ROLE_CHOICES = (
        ('ADMIN', 'Admin'),
        ('STAFF', 'Staff'),
        ('USER', 'User'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='USER')
    salary = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    position = models.CharField(max_length=100, blank=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)

    def __str__(self):
        return f"{self.username} ({self.role})"


class Attendance(models.Model):
    staff = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'STAFF'})
    entry_time = models.DateTimeField(auto_now_add=True)
    exit_time = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, default='on-duty')

    def __str__(self):
        return f"{self.staff.username} - {self.entry_time}"

class Zone(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    total_slots = models.IntegerField(default=0)
    base_price = models.DecimalField(max_digits=10, decimal_places=2, default=20.00)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    @property
    def available_slots(self):
        return self.total_slots - self.occupied_slots - self.reserved_slots

    @property
    def occupied_slots(self):
        return self.slots.filter(is_occupied=True, is_active=True).count()

    @property
    def reserved_slots(self):
        return self.slots.filter(is_reserved=True, is_active=True).count()

class Slot(models.Model):
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name='slots')
    slot_number = models.CharField(max_length=10)
    is_occupied = models.BooleanField(default=False)
    is_reserved = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        unique_together = ['zone', 'slot_number']
        ordering = ['zone', 'slot_number']

    def __str__(self):
        return f"{self.zone.name} - {self.slot_number}"

class ParkingSession(models.Model):
    STATUS_CHOICES = (
        ('reserved', 'Reserved'),
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )
    CANCELLATION_TYPE_CHOICES = (
        ('user_initiated', 'User Initiated'),
        ('auto_cancelled', 'Auto Cancelled'),
        ('admin_cancelled', 'Admin Cancelled'),
    )
    REFUND_STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('processed', 'Processed'),
        ('rejected', 'Rejected'),
        ('not_applicable', 'Not Applicable'),
    )
    
    # Original fields
    vehicle_number = models.CharField(max_length=20)
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE)
    entry_time = models.DateTimeField(auto_now_add=True)
    exit_time = models.DateTimeField(null=True, blank=True)
    initial_amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    final_amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    payment_method = models.CharField(max_length=50, blank=True, null=True)
    payment_status = models.CharField(max_length=20, default='pending')
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='active')
    qr_code_data = models.TextField(blank=True, null=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    slot = models.ForeignKey(Slot, on_delete=models.SET_NULL, null=True, blank=True)
    guest_mobile = models.CharField(max_length=15, blank=True, null=True)
    guest_email = models.EmailField(blank=True, null=True)
    
    # Cancellation fields
    cancellation_reason = models.TextField(blank=True, null=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)
    cancellation_type = models.CharField(max_length=20, choices=CANCELLATION_TYPE_CHOICES, blank=True, null=True)
    refund_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    refund_status = models.CharField(max_length=20, choices=REFUND_STATUS_CHOICES, default='not_applicable')
    
    # Extension fields
    booking_expiry_time = models.DateTimeField(null=True, blank=True)
    extension_count = models.IntegerField(default=0)
    
    # SMS notification tracking
    sms_notification_sent = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.vehicle_number} - {self.zone.name} ({self.status})"

    def save(self, *args, **kwargs):
        # Ensure values are Decimals before addition to prevent TypeError
        try:
            initial = Decimal(str(self.initial_amount_paid))
        except:
            initial = Decimal('0.00')
            
        try:
            final = Decimal(str(self.final_amount_paid))
        except:
            final = Decimal('0.00')
            
        self.total_amount_paid = initial + final
        
        # Set default expiry time for reserved bookings (24 hours)
        if not self.booking_expiry_time and self.status == 'reserved':
            from django.utils import timezone
            from datetime import timedelta
            self.booking_expiry_time = timezone.now() + timedelta(hours=24)
        
        super().save(*args, **kwargs)
    
    def can_cancel(self):
        """Check if booking can be cancelled"""
        from django.utils import timezone
        
        # Can't cancel completed or already cancelled bookings
        if self.status in ['completed', 'cancelled']:
            return False, "Booking is already completed or cancelled"
        
        # Can't cancel active sessions (must exit first)
        if self.status == 'active':
            return False, "Active parking sessions cannot be cancelled. Please exit first."
        
        return True, "Cancellation allowed"
    
    def calculate_refund(self):
        """Calculate refund amount based on cancellation policy"""
        from django.utils import timezone
        from datetime import timedelta
        
        # Only reserved bookings get refunds
        if self.status != 'reserved':
            return Decimal('0.00')
        
        time_since_booking = timezone.now() - self.entry_time
        
        # Free cancellation within 30 minutes (100% refund)
        if time_since_booking <= timedelta(minutes=30):
            return self.initial_amount_paid
        
        # Partial refund within 2 hours (50% refund)
        elif time_since_booking <= timedelta(hours=2):
            return self.initial_amount_paid * Decimal('0.50')
        
        # No refund after 2 hours
        else:
            return Decimal('0.00')
    
    def is_expiring_soon(self):
        """Check if booking will expire soon (within 2 hours)"""
        from django.utils import timezone
        from datetime import timedelta
        
        if not self.booking_expiry_time or self.status != 'reserved':
            return False
        
        time_until_expiry = self.booking_expiry_time - timezone.now()
        return timedelta(0) < time_until_expiry <= timedelta(hours=2)
    
    def extend_booking(self, hours):
        """Extend booking expiry time"""
        from django.utils import timezone
        from datetime import timedelta
        
        if self.status != 'reserved':
            return False, "Only reserved bookings can be extended"
        
        if not self.booking_expiry_time:
            self.booking_expiry_time = timezone.now() + timedelta(hours=hours)
        else:
            self.booking_expiry_time += timedelta(hours=hours)
        
        self.extension_count += 1
        self.sms_notification_sent = False  # Reset SMS flag for new expiry time
        self.save()
        
        return True, f"Booking extended by {hours} hours"

class Payment(models.Model):
    PAYMENT_TYPE_CHOICES = (
        ('INITIAL', 'Initial Booking Fee'),
        ('FINAL', 'Final Exit Billing'),
        ('FULL', 'Full Pre-payment'),
    )
    session = models.ForeignKey(ParkingSession, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=50)
    payment_type = models.CharField(max_length=10, choices=PAYMENT_TYPE_CHOICES, default='FULL')
    transaction_id = models.CharField(max_length=100, unique=True, null=True, blank=True)
    status = models.CharField(max_length=20, default='success')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.transaction_id or 'TXN'} - {self.amount} ({self.payment_type})"

class Vehicle(models.Model):
    vehicle_number = models.CharField(max_length=20, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='vehicles')
    vehicle_type = models.CharField(max_length=50, default='Car')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.vehicle_number

class Dispute(models.Model):
    SEVERITY_CHOICES = (
        ('Low', 'Low'),
        ('Medium', 'Medium'),
        ('High', 'High'),
    )
    session = models.ForeignKey(ParkingSession, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    reason = models.TextField()
    severity = models.CharField(max_length=10, choices=SEVERITY_CHOICES, default='Medium')
    dispute_type = models.CharField(max_length=50, default='General')
    status = models.CharField(max_length=20, default='Open')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Dispute {self.id} - {self.status}"

class Schedule(models.Model):
    SHIFT_CHOICES = (
        ('Alpha', 'Alpha (06:00 - 14:00)'),
        ('Bravo', 'Bravo (14:00 - 22:00)'),
        ('Charlie', 'Charlie (22:00 - 06:00)'),
    )
    staff = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'STAFF'})
    zone = models.ForeignKey('Zone', on_delete=models.CASCADE, related_name='schedules', null=True, blank=True)
    day = models.CharField(max_length=20)
    shift_type = models.CharField(max_length=20, choices=SHIFT_CHOICES, default='Alpha')
    shift_start = models.TimeField()
    shift_end = models.TimeField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.staff.username} - {self.day}"

class ShiftLog(models.Model):
    staff = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'STAFF'})
    shift_start = models.DateTimeField()
    shift_end = models.DateTimeField(null=True, blank=True)
    entry_count = models.IntegerField(default=0)
    exit_count = models.IntegerField(default=0)
    revenue_collected = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    cash_collected = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    online_collected = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.staff.username} Shift - {self.shift_start.date()}"

class Feedback(models.Model):
    session = models.OneToOneField(ParkingSession, on_delete=models.CASCADE, related_name='feedback')
    rating = models.IntegerField(default=5)  # 1-5
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback for {self.session.vehicle_number} - {self.rating}★"

class BookingActivityLog(models.Model):
    """Track all booking-related activities for admin/staff monitoring"""
    ACTIVITY_TYPE_CHOICES = (
        ('booking_created', 'Booking Created'),
        ('booking_cancelled', 'Booking Cancelled'),
        ('booking_extended', 'Booking Extended'),
        ('auto_cancelled', 'Auto Cancelled'),
        ('sms_sent', 'SMS Notification Sent'),
        ('refund_processed', 'Refund Processed'),
    )
    
    session = models.ForeignKey(ParkingSession, on_delete=models.CASCADE, related_name='activity_logs')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    activity_type = models.CharField(max_length=30, choices=ACTIVITY_TYPE_CHOICES)
    description = models.TextField()
    metadata = models.JSONField(default=dict, blank=True)  # Store additional data like refund amount, extension hours, etc.
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Booking Activity Log'
        verbose_name_plural = 'Booking Activity Logs'
    
    def __str__(self):
        return f"{self.activity_type} - {self.session.vehicle_number} at {self.created_at.strftime('%Y-%m-%d %H:%M')}"
