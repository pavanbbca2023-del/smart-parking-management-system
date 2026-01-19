"""
RAZORPAY PAYMENT MODELS - TEST MODE ONLY
========================================
Database models for storing payment information
NO REAL MONEY - TEST ENVIRONMENT ONLY
"""

from django.db import models
from django.utils import timezone
from .models import ParkingSession


class RazorpayOrder(models.Model):
    """
    Store Razorpay order details
    Links parking session with payment gateway
    """
    
    # Payment status choices
    STATUS_CHOICES = [
        ('CREATED', 'Order Created'),
        ('PAID', 'Payment Successful'),
        ('FAILED', 'Payment Failed'),
        ('CANCELLED', 'Order Cancelled'),
    ]
    
    # Link to parking session
    parking_session = models.OneToOneField(
        ParkingSession, 
        on_delete=models.CASCADE, 
        related_name='razorpay_order'
    )
    
    # Razorpay order ID (from Razorpay API)
    razorpay_order_id = models.CharField(max_length=100, unique=True)
    
    # Amount in paise (₹100 = 10000 paise)
    amount = models.IntegerField()
    
    # Currency (INR for Indian Rupees)
    currency = models.CharField(max_length=3, default='INR')
    
    # Payment status
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='CREATED')
    
    # Razorpay payment ID (after successful payment)
    razorpay_payment_id = models.CharField(max_length=100, null=True, blank=True)
    
    # Razorpay signature (for verification)
    razorpay_signature = models.CharField(max_length=200, null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Payment completion time
    paid_at = models.DateTimeField(null=True, blank=True)
    
    # Webhook event ID (to prevent duplicate processing)
    webhook_event_id = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return f"Order {self.razorpay_order_id} - {self.status}"

    class Meta:
        verbose_name = "Razorpay Order"
        verbose_name_plural = "Razorpay Orders"
        ordering = ['-created_at']


class PaymentWebhook(models.Model):
    """
    Store webhook events from Razorpay
    Prevents duplicate processing of same event
    """
    
    # Webhook event ID from Razorpay
    event_id = models.CharField(max_length=100, unique=True)
    
    # Event type (payment.captured, payment.failed, etc.)
    event_type = models.CharField(max_length=50)
    
    # Related order (if found)
    razorpay_order = models.ForeignKey(
        RazorpayOrder, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True
    )
    
    # Raw webhook data (JSON)
    webhook_data = models.JSONField()
    
    # Processing status
    processed = models.BooleanField(default=False)
    
    # Processing result
    processing_result = models.TextField(null=True, blank=True)
    
    # Timestamps
    received_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Webhook {self.event_id} - {self.event_type}"

    class Meta:
        verbose_name = "Payment Webhook"
        verbose_name_plural = "Payment Webhooks"
        ordering = ['-received_at']