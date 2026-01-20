# models.py - Database Models for Smart Parking System

from django.db import models
from django.utils import timezone
import uuid


# ============================================
# PARKING ZONE MODEL
# ============================================
class ParkingZone(models.Model):
    """
    Represents a parking area (e.g., Zone A, Zone B)
    """
    # Name of the parking zone
    name = models.CharField(max_length=100)
    
    # Cost per hour in the zone (e.g., 50 for ₹50/hour)
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Is this zone currently active/open?
    is_active = models.BooleanField(default=True)
    
    # Timestamp when zone was created
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - ₹{self.hourly_rate}/hr"

    class Meta:
        verbose_name = "Parking Zone"
        verbose_name_plural = "Parking Zones"


# ============================================
# PARKING SLOT MODEL
# ============================================
class ParkingSlot(models.Model):
    """
    Individual parking spaces within a zone
    """
    # Link to the parking zone
    zone = models.ForeignKey(ParkingZone, on_delete=models.CASCADE, related_name='slots')
    
    # Slot number (e.g., A-001, A-002)
    slot_number = models.CharField(max_length=50)
    
    # Is someone currently parked in this slot?
    is_occupied = models.BooleanField(default=False)
    
    # Timestamp when slot was created
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        status = "Occupied" if self.is_occupied else "Available"
        return f"{self.zone.name} - {self.slot_number} ({status})"

    class Meta:
        verbose_name = "Parking Slot"
        verbose_name_plural = "Parking Slots"
        unique_together = ['zone', 'slot_number']  # Slot number must be unique per zone


# ============================================
# VEHICLE MODEL
# ============================================
class Vehicle(models.Model):
    """
    Stores vehicle information
    """
    # License plate number (e.g., DL-01-AB-1234)
    vehicle_number = models.CharField(max_length=20, unique=True)
    
    # Owner's name
    owner_name = models.CharField(max_length=100)
    
    # Timestamp when vehicle was registered
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.vehicle_number} - {self.owner_name}"

    class Meta:
        verbose_name = "Vehicle"
        verbose_name_plural = "Vehicles"


# ============================================
# PARKING SESSION MODEL
# ============================================
class ParkingSession(models.Model):
    """
    Records each parking session (entry to exit)
    """
    # Payment method choices
    PAYMENT_CHOICES = [
        ('CASH', 'Cash Payment'),
        ('ONLINE', 'Online Payment'),
    ]
    
    # Payment status choices (CRITICAL FIX)
    PAYMENT_STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('SUCCESS', 'Success'),
        ('FAILED', 'Failed'),
    ]

    # Link to the vehicle that parked
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='sessions')
    
    # Link to the parking slot used
    slot = models.ForeignKey(ParkingSlot, on_delete=models.CASCADE, related_name='sessions')
    
    # Link to the parking zone
    zone = models.ForeignKey(ParkingZone, on_delete=models.CASCADE, related_name='sessions')
    
    # Time when vehicle entered the parking
    entry_time = models.DateTimeField(null=True, blank=True)
    
    # Time when vehicle exited the parking
    exit_time = models.DateTimeField(null=True, blank=True)
    
    # Unique QR code for this parking session
    qr_code = models.CharField(max_length=100, unique=True)
    
    # Has entry QR code been scanned?
    entry_qr_scanned = models.BooleanField(default=False)
    
    # Has exit QR code been scanned?
    exit_qr_scanned = models.BooleanField(default=False)
    
    # Total amount charged in rupees
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # How did the user pay?
    payment_method = models.CharField(max_length=10, choices=PAYMENT_CHOICES, null=True, blank=True)
    
    # Payment status (CRITICAL FIX: separate from is_paid)
    payment_status = models.CharField(max_length=10, choices=PAYMENT_STATUS_CHOICES, default='PENDING')
    
    # Has payment been received?
    is_paid = models.BooleanField(default=False)
    
    # Timestamp when session was created
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Timestamp when session was last updated
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        status = "Active" if self.exit_time is None else "Completed"
        return f"{self.vehicle.vehicle_number} - {status}"

    class Meta:
        verbose_name = "Parking Session"
        verbose_name_plural = "Parking Sessions"
        ordering = ['-created_at']  # Show newest sessions first

# Extended User model
from django.contrib.auth.models import AbstractUser

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


# Extended ParkingSession model
class ExtendedParkingSession(models.Model):
    """Extended ParkingSession with booking and payment features"""
    
    PAYMENT_STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('PARTIAL', 'Partial'),
        ('PAID', 'Paid'),
    ]
    
    STATUS_CHOICES = [
        ('BOOKED', 'Booked'),
        ('ACTIVE', 'Active'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    ]
    
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='extended_sessions')
    slot = models.ForeignKey(ParkingSlot, on_delete=models.CASCADE, related_name='extended_sessions')
    zone = models.ForeignKey(ParkingZone, on_delete=models.CASCADE, related_name='extended_sessions')
    booked_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    
    entry_time = models.DateTimeField(null=True, blank=True)
    exit_time = models.DateTimeField(null=True, blank=True)
    
    qr_code = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='BOOKED')
    
    paid_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    payment_status = models.CharField(max_length=10, choices=PAYMENT_STATUS_CHOICES, default='PENDING')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.vehicle.vehicle_number} - {self.status}"


# Payment model
class Payment(models.Model):
    """Payment records for parking sessions"""
    
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
    ]
    
    session = models.ForeignKey(ExtendedParkingSession, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    method = models.CharField(max_length=10, choices=METHOD_CHOICES)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='SUCCESS')
    
    transaction_id = models.CharField(max_length=100, blank=True)
    razorpay_order_id = models.CharField(max_length=100, blank=True)
    razorpay_payment_id = models.CharField(max_length=100, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.session.vehicle.vehicle_number} - ₹{self.amount} ({self.type})"