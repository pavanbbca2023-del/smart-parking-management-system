# drf_urls.py - DRF URL Configuration for Smart Parking APIs

from django.urls import path
from .drf_views import (
    BookParkingAPIView, ScanEntryAPIView, ScanExitAPIView,
    RefundCheckAPIView, SessionsListAPIView, ZonesListAPIView,
    PaymentStatusAPIView, health_check
)

urlpatterns = [
    
    # ============================================
    # DRF API ENDPOINTS
    # ============================================
    
    # Health Check
    path('api/health/', health_check, name='health_check'),
    
    # Parking APIs
    path('api/parking/book/', BookParkingAPIView.as_view(), name='book_parking'),
    path('api/parking/scan-entry/', ScanEntryAPIView.as_view(), name='scan_entry'),
    path('api/parking/scan-exit/', ScanExitAPIView.as_view(), name='scan_exit'),
    path('api/parking/refund/', RefundCheckAPIView.as_view(), name='refund_check'),
    path('api/parking/sessions/', SessionsListAPIView.as_view(), name='list_sessions'),
    path('api/parking/zones/', ZonesListAPIView.as_view(), name='list_zones'),
    path('api/parking/payment-status/', PaymentStatusAPIView.as_view(), name='payment_status'),
    
]