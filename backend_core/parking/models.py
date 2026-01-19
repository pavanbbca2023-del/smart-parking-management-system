from django.db import models
from django.utils import timezone
import uuid


# ============================================
# PARKING ZONE MODEL
# ============================================
# Represents a parking area (e.g., Zone A, Zone B)
class ParkingZone(models.Model):
    # Name of the parking zone
    name = models.CharField(max_length=100)
    
    # Cost per hour in the zone (e.g., 50 for ₹50/hour)
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2, default=50)
    
    # Is this zone currently active/open?
    is_active = models.BooleanField(default=True)
    
    # Timestamp when zone was created
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Timestamp when zone was last updated
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        # Display zone name and status
        return f"{self.name} - {'Active' if self.is_active else 'Inactive'}"

    class Meta:
        verbose_name = "Parking Zone"
        verbose_name_plural = "Parking Zones"


# ============================================
# PARKING SLOT MODEL
# ============================================
# Individual parking spaces within a zone
class ParkingSlot(models.Model):
    # Link to the parking zone
    zone = models.ForeignKey(ParkingZone, on_delete=models.CASCADE, related_name='slots')
    
    # Slot number (e.g., A-001, A-002)
    slot_number = models.CharField(max_length=50)
    
    # Is someone currently parked in this slot?
    is_occupied = models.BooleanField(default=False)
    
    # Timestamp when slot was created
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        # Display zone and slot number
        return f"{self.zone.name} - Slot {self.slot_number}"

    class Meta:
        verbose_name = "Parking Slot"
        verbose_name_plural = "Parking Slots"
        unique_together = ['zone', 'slot_number']  # Slot number must be unique per zone


# ============================================
# VEHICLE MODEL
# ============================================
# Stores vehicle information
class Vehicle(models.Model):
    # License plate number (e.g., DL-01-AB-1234)
    vehicle_number = models.CharField(max_length=20, unique=True)
    
    # Owner's name
    owner_name = models.CharField(max_length=100)
    
    # Timestamp when vehicle was registered
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        # Display vehicle number and owner
        return f"{self.vehicle_number} - {self.owner_name}"

    class Meta:
        verbose_name = "Vehicle"
        verbose_name_plural = "Vehicles"


# ============================================
# PARKING SESSION MODEL
# ============================================
# Records each parking session (entry to exit)
class ParkingSession(models.Model):
    # Payment method choices
    PAYMENT_CHOICES = [
        ('CASH', 'Cash Payment'),
        ('ONLINE', 'Online Payment'),
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
    qr_code = models.CharField(max_length=100, unique=True, default=uuid.uuid4)
    
    # Has entry QR code been scanned?
    entry_qr_scanned = models.BooleanField(default=False)
    
    # Has exit QR code been scanned?
    exit_qr_scanned = models.BooleanField(default=False)
    
    # Total amount charged in rupees
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # How did the user pay?
    payment_method = models.CharField(max_length=10, choices=PAYMENT_CHOICES, null=True, blank=True)
    
    # Has payment been received?
    is_paid = models.BooleanField(default=False)
    
    # Timestamp when session was created
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Timestamp when session was last updated
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        # Display vehicle and session status
        status = "Parked" if self.exit_time is None else "Exited"
        return f"{self.vehicle.vehicle_number} - {status}"

    class Meta:
        verbose_name = "Parking Session"
        verbose_name_plural = "Parking Sessions"
        ordering = ['-created_at']  # Show newest sessions first
