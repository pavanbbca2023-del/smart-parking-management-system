# models.py - Payment Database Schema
from django.db import models
from django.utils import timezone

class PaymentOrder(models.Model):
    """Store Razorpay payment orders - TEST MODE ONLY"""
    
    STATUS_CHOICES = [
        ('CREATED', 'Created'),
        ('PAID', 'Paid'),
        ('FAILED', 'Failed'),
    ]
    
    # Core fields as per requirements
    order_id = models.CharField(max_length=100, unique=True)  # Razorpay order ID
    amount = models.IntegerField()  # Amount in paise (₹100 = 10000 paise)
    currency = models.CharField(max_length=3, default='INR')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='CREATED')
    payment_id = models.CharField(max_length=100, null=True, blank=True)  # Razorpay payment ID
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Additional fields for verification
    signature = models.CharField(max_length=200, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.order_id} - {self.status}"