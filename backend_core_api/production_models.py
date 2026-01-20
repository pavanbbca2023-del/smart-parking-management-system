# production_models.py - Production-ready models with proper constraints

from django.db import models, transaction
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from django.core.exceptions import ValidationError
import uuid


class User(AbstractUser):
    """Extended User model with roles"""
    ROLE_CHOICES = [
        ('ADMIN', 'Admin'),
        ('STAFF', 'Staff'),
        ('USER', 'User'),
    ]
    
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='USER')
    phone = models.CharField(max_length=15, blank=True)
    
    def __str__(self):
        return f"{self.username} ({self.role})"


class ParkingZone(models.Model):
    """Parking zones with hourly rates"""
    name = models.CharField(max_length=100, unique=True)
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - ₹{self.hourly_rate}/hr"

    class Meta:
        ordering = ['name']


class ParkingSlot(models.Model):
    """Individual parking slots"""
    zone = models.ForeignKey(ParkingZone, on_delete=models.CASCADE, related_name='slots')
    slot_number = models.CharField(max_length=50)
    is_occupied = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        status = "Occupied" if self.is_occupied else "Available"
        return f"{self.zone.name} - {self.slot_number} ({status})"

    class Meta:
        unique_together = ['zone', 'slot_number']
        ordering = ['zone__name', 'slot_number']


class Vehicle(models.Model):
    """Vehicle information"""
    vehicle_number = models.CharField(max_length=20, unique=True)
    owner_name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def clean(self):
        self.vehicle_number = self.vehicle_number.upper()

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.vehicle_number} - {self.owner_name}"

    class Meta:
        ordering = ['vehicle_number']


class ParkingSession(models.Model):
    """Production-ready parking sessions with proper status flow"""
    
    STATUS_CHOICES = [
        ('BOOKED', 'Booked'),
        ('ACTIVE', 'Active'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    ]
    
    PAYMENT_STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('PARTIAL', 'Partial'),
        ('PAID', 'Paid'),
    ]
    
    # Core fields
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='sessions')
    slot = models.ForeignKey(ParkingSlot, on_delete=models.CASCADE, related_name='sessions')
    zone = models.ForeignKey(ParkingZone, on_delete=models.CASCADE, related_name='sessions')
    booked_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    
    # Status and timing
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='BOOKED')
    entry_time = models.DateTimeField(null=True, blank=True)
    exit_time = models.DateTimeField(null=True, blank=True)
    
    # QR and payment
    qr_code = models.CharField(max_length=100, unique=True)
    paid_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    payment_status = models.CharField(max_length=10, choices=PAYMENT_STATUS_CHOICES, default='PENDING')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self):
        # Validate status transitions
        if self.pk:
            old_instance = ParkingSession.objects.get(pk=self.pk)
            valid_transitions = {
                'BOOKED': ['ACTIVE', 'CANCELLED'],
                'ACTIVE': ['COMPLETED'],
                'COMPLETED': [],
                'CANCELLED': []
            }
            
            if self.status not in valid_transitions.get(old_instance.status, []):
                raise ValidationError(f"Invalid status transition from {old_instance.status} to {self.status}")
        
        # Validate timing
        if self.entry_time and self.exit_time:
            if self.exit_time <= self.entry_time:
                raise ValidationError("Exit time must be after entry time")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    @property
    def duration_hours(self):
        if self.entry_time and self.exit_time:
            duration = self.exit_time - self.entry_time
            hours = max(1, int(duration.total_seconds() / 3600))
            if duration.total_seconds() % 3600 > 0:
                hours += 1
            return hours
        return 0

    @property
    def remaining_amount(self):
        return max(0, self.total_amount - self.paid_amount)

    def __str__(self):
        return f"{self.vehicle.vehicle_number} - {self.status}"

    class Meta:
        ordering = ['-created_at']
        constraints = [
            models.CheckConstraint(
                check=models.Q(paid_amount__gte=0),
                name='paid_amount_non_negative'
            ),
            models.CheckConstraint(
                check=models.Q(total_amount__gte=0),
                name='total_amount_non_negative'
            ),
        ]


class Payment(models.Model):
    """Payment records with proper tracking"""
    
    METHOD_CHOICES = [
        ('CASH', 'Cash'),
        ('ONLINE', 'Online'),
    ]
    
    TYPE_CHOICES = [
        ('BOOKING', 'Booking'),
        ('EXIT', 'Exit'),
    ]
    
    STATUS_CHOICES = [
        ('SUCCESS', 'Success'),
        ('FAILED', 'Failed'),
        ('PENDING', 'Pending'),
    ]
    
    session = models.ForeignKey(ParkingSession, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    method = models.CharField(max_length=10, choices=METHOD_CHOICES)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='SUCCESS')
    
    # Payment gateway fields
    transaction_id = models.CharField(max_length=100, blank=True)
    razorpay_order_id = models.CharField(max_length=100, blank=True)
    razorpay_payment_id = models.CharField(max_length=100, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def clean(self):
        if self.amount <= 0:
            raise ValidationError("Payment amount must be positive")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.session.vehicle.vehicle_number} - ₹{self.amount} ({self.type})"

    class Meta:
        ordering = ['-created_at']