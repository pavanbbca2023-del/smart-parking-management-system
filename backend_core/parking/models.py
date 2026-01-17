from django.db import models
from django.utils import timezone
import uuid

class ParkingZone(models.Model):
    """
    Parking zone model
    - Contains multiple parking slots
    - Has hourly rate for billing
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    total_slots = models.IntegerField()
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'parking_zone'


class ParkingSlot(models.Model):
    """
    Parking slot model
    - Each slot belongs to a zone
    - Can be occupied or available
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    zone = models.ForeignKey(ParkingZone, on_delete=models.CASCADE)
    slot_number = models.CharField(max_length=10)
    is_occupied = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.zone.name} - Slot {self.slot_number}"

    class Meta:
        unique_together = ('zone', 'slot_number')
        db_table = 'parking_slot'


class Vehicle(models.Model):
    """
    Vehicle model
    - Stores vehicle information
    - Multiple parking sessions can be created for one vehicle
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    vehicle_number = models.CharField(max_length=20, unique=True)
    vehicle_type = models.CharField(max_length=50, default="Car")
    owner_name = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.vehicle_number

    class Meta:
        db_table = 'vehicle'


class ParkingSession(models.Model):
    """
    Parking session model
    - Records each parking session
    - Stores entry time, exit time, and billing info
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    slot = models.ForeignKey(ParkingSlot, on_delete=models.SET_NULL, null=True, blank=True)
    zone = models.ForeignKey(ParkingZone, on_delete=models.CASCADE)
    entry_time = models.DateTimeField(auto_now_add=True)
    exit_time = models.DateTimeField(null=True, blank=True)
    qr_code = models.CharField(max_length=255, unique=True)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    is_paid = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.vehicle.vehicle_number} - {self.entry_time}"

    class Meta:
        db_table = 'parking_session'
