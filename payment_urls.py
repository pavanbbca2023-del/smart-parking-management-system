# urls.py - Payment API Routes
from django.urls import path
from . import payment_views

urlpatterns = [
    # API 1: Create order
    path('api/payment/create-order/', payment_views.create_order_api, name='create_order'),
    
    # API 2: Verify payment
    path('api/payment/verify/', payment_views.verify_payment_api, name='verify_payment'),
    
    # API 3: Webhook handler
    path('api/payment/webhook/', payment_views.webhook_handler, name='webhook'),
]