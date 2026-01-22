from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User


# ======================== PARKING MODELS ========================

class ParkingZone(models.Model):
    """Define parking areas/zones"""
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = 'analytics'
        verbose_name = 'Parking Zone'
        verbose_name_plural = 'Parking Zones'

    def __str__(self):
        return self.name

    def get_occupied_count(self):
        return self.parkingslot_set.filter(status='occupied').count()

    def get_total_slots(self):
        return self.parkingslot_set.count()

    def get_occupancy_rate(self):
        total = self.get_total_slots()
        if total == 0:
            return 0
        return (self.get_occupied_count() / total) * 100


class ParkingSlot(models.Model):
    """Individual parking spaces"""
    SLOT_STATUS_CHOICES = [
        ('available', 'Available'),
        ('occupied', 'Occupied'),
        ('maintenance', 'Maintenance')
    ]
    
    zone = models.ForeignKey(ParkingZone, on_delete=models.CASCADE)
    slot_number = models.CharField(max_length=10)
    is_occupied = models.BooleanField(default=False)
    status = models.CharField(
        max_length=20,
        choices=SLOT_STATUS_CHOICES,
        default='available'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = 'analytics'
        unique_together = ('zone', 'slot_number')
        verbose_name = 'Parking Slot'
        verbose_name_plural = 'Parking Slots'

    def __str__(self):
        return f"{self.zone.name} - {self.slot_number}"


class Vehicle(models.Model):
    """Vehicle registration and tracking"""
    VEHICLE_TYPES = [
        ('car', 'Car'),
        ('bike', 'Bike'),
        ('truck', 'Truck')
    ]
    
    license_plate = models.CharField(max_length=20, unique=True)
    vehicle_type = models.CharField(
        max_length=50,
        choices=VEHICLE_TYPES,
        default='car'
    )
    owner_name = models.CharField(max_length=100, blank=True, null=True)
    owner_phone = models.CharField(max_length=20, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = 'analytics'
        verbose_name = 'Vehicle'
        verbose_name_plural = 'Vehicles'

    def __str__(self):
        return self.license_plate

    def get_total_sessions(self):
        return self.parkingsession_set.count()

    def get_total_expenses(self):
        from django.db.models import Sum
        return self.parkingsession_set.aggregate(Sum('total_amount'))['total_amount__sum'] or 0


class ParkingSession(models.Model):
    """Track parking events (entry/exit)"""
    SESSION_STATUS_CHOICES = [
        ('booked', 'Booked'),
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled')
    ]
    
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    slot = models.ForeignKey(ParkingSlot, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='parking_sessions')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='created_parking_sessions')
    status = models.CharField(
        max_length=20,
        choices=SESSION_STATUS_CHOICES,
        default='booked'
    )
    entry_time = models.DateTimeField(default=timezone.now)
    exit_time = models.DateTimeField(null=True, blank=True)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    is_paid = models.BooleanField(default=False)
    is_refunded = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        app_label = 'analytics'
        verbose_name = 'Parking Session'
        verbose_name_plural = 'Parking Sessions'

    def __str__(self):
        return f"{self.vehicle.license_plate} - {self.slot}"

    @property
    def vehicle_number(self):
        return self.vehicle.license_plate

    @property
    def duration_minutes(self):
        if self.exit_time:
            delta = self.exit_time - self.entry_time
            return int(delta.total_seconds() / 60)
        return None


class Payment(models.Model):
    """Record payment transactions"""
    PAYMENT_TYPE_CHOICES = [
        ('session_fee', 'Session Fee'),
        ('fine', 'Fine'),
        ('other', 'Other')
    ]
    
    PAYMENT_METHOD_CHOICES = [
        ('online', 'Online'),
        ('cash', 'Cash')
    ]
    
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('successful', 'Successful'),
        ('failed', 'Failed'),
        ('partial', 'Partial')
    ]
    
    session = models.ForeignKey(ParkingSession, on_delete=models.CASCADE, related_name='payments')
    payment_type = models.CharField(max_length=20, choices=PAYMENT_TYPE_CHOICES, default='session_fee')
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, default='online')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    transaction_id = models.CharField(max_length=100, unique=True, blank=True, null=True)
    processed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        app_label = 'analytics'
        verbose_name = 'Payment'
        verbose_name_plural = 'Payments'

    def __str__(self):
        return f"Payment {self.transaction_id} - {self.amount}"


# ======================== ANALYTICS MODELS ========================

class AnalyticsReport(models.Model):
    """Store generated analytics reports"""
    REPORT_TYPES = [
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('custom', 'Custom')
    ]
    
    title = models.CharField(max_length=200)
    report_type = models.CharField(max_length=20, choices=REPORT_TYPES)
    data = models.JSONField(default=dict)
    generated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = 'analytics'
        verbose_name = 'Analytics Report'
        verbose_name_plural = 'Analytics Reports'

    def __str__(self):
        return f"{self.title} - {self.report_type}"


class SystemMetrics(models.Model):
    """Store real-time system snapshots"""
    timestamp = models.DateTimeField(auto_now_add=True)
    total_slots = models.IntegerField(default=0)
    occupied_slots = models.IntegerField(default=0)
    available_slots = models.IntegerField(default=0)
    daily_revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    active_sessions = models.IntegerField(default=0)

    class Meta:
        app_label = 'analytics'
        verbose_name = 'System Metrics'
        verbose_name_plural = 'System Metrics'

    def __str__(self):
        return f"Metrics - {self.timestamp}"
