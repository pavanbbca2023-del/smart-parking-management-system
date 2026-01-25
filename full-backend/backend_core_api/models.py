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
        return self.slots.filter(is_occupied=False, is_active=True).count()

class Slot(models.Model):
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name='slots')
    slot_number = models.CharField(max_length=10)
    is_occupied = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        unique_together = ['zone', 'slot_number']
        ordering = ['zone', 'slot_number']

    def __str__(self):
        return f"{self.zone.name} - {self.slot_number}"

class ParkingSession(models.Model):
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )
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
        super().save(*args, **kwargs)

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
