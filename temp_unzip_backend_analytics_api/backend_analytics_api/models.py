# models.py - Analytics Models for Smart Parking System

from django.db import models
from django.utils import timezone
from backend_core_api.models import ParkingZone, ParkingSession, Vehicle

class DailyReport(models.Model):
    """Daily analytics report"""
    date = models.DateField(unique=True)
    total_sessions = models.IntegerField(default=0)
    total_revenue = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    average_duration = models.DurationField(null=True, blank=True)
    peak_hour = models.TimeField(null=True, blank=True)
    occupancy_rate = models.FloatField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        app_label = 'backend_analytics_api'
        ordering = ['-date']
        verbose_name = "Daily Report"
        verbose_name_plural = "Daily Reports"
    
    def __str__(self):
        return f"Report for {self.date}"

class ZoneAnalytics(models.Model):
    """Zone-wise analytics"""
    zone = models.ForeignKey(ParkingZone, on_delete=models.CASCADE, related_name='analytics')
    date = models.DateField()
    sessions_count = models.IntegerField(default=0)
    revenue = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    occupancy_rate = models.FloatField(default=0)
    average_duration = models.DurationField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['zone', 'date']
        ordering = ['-date', 'zone']
        verbose_name = "Zone Analytics"
        verbose_name_plural = "Zone Analytics"
    
    def __str__(self):
        return f"{self.zone.name} - {self.date}"

class VehicleAnalytics(models.Model):
    """Vehicle usage analytics"""
    vehicle = models.OneToOneField(Vehicle, on_delete=models.CASCADE, related_name='analytics')
    total_sessions = models.IntegerField(default=0)
    total_amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_duration = models.DurationField(null=True, blank=True)
    favorite_zone = models.ForeignKey(ParkingZone, on_delete=models.SET_NULL, null=True, blank=True)
    last_visit = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Vehicle Analytics"
        verbose_name_plural = "Vehicle Analytics"
    
    def __str__(self):
        return f"{self.vehicle.vehicle_number} Analytics"

class RevenueReport(models.Model):
    """Monthly/Weekly revenue reports"""
    PERIOD_CHOICES = [
        ('DAILY', 'Daily'),
        ('WEEKLY', 'Weekly'),
        ('MONTHLY', 'Monthly'),
    ]
    
    period_type = models.CharField(max_length=10, choices=PERIOD_CHOICES)
    start_date = models.DateField()
    end_date = models.DateField()
    total_revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_sessions = models.IntegerField(default=0)
    cash_revenue = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    online_revenue = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-start_date']
        verbose_name = "Revenue Report"
        verbose_name_plural = "Revenue Reports"
    
    def __str__(self):
        return f"{self.period_type} Report: {self.start_date} to {self.end_date}"

class PeakHourAnalytics(models.Model):
    """Peak hours analytics"""
    date = models.DateField()
    hour = models.IntegerField()  # 0-23
    sessions_count = models.IntegerField(default=0)
    occupancy_rate = models.FloatField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['date', 'hour']
        ordering = ['-date', 'hour']
        verbose_name = "Peak Hour Analytics"
        verbose_name_plural = "Peak Hour Analytics"
    
    def __str__(self):
        return f"{self.date} - {self.hour}:00"