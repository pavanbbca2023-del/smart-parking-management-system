"""
SMART PARKING MANAGEMENT SYSTEM - URLs
======================================
Complete URL routing for all endpoints
"""

from django.urls import path
from . import views_complete

app_name = 'parking'

urlpatterns = [
    # ============================================
    # BOOKING MANAGEMENT APIs
    # ============================================
    
    # Create new booking
    path('api/booking/create/', 
         views_complete.CreateBookingView.as_view(), 
         name='create_booking'),
    
    # Process booking payment
    path('api/booking/payment/', 
         views_complete.ProcessPaymentView.as_view(), 
         name='process_payment'),
    
    # Cancel booking
    path('api/booking/cancel/', 
         views_complete.CancelBookingView.as_view(), 
         name='cancel_booking'),
    
    # ============================================
    # QR SCANNING APIs
    # ============================================
    
    # Entry QR scan
    path('api/scan/entry/', 
         views_complete.EntryQRScanView.as_view(), 
         name='scan_entry'),
    
    # Exit QR scan
    path('api/scan/exit/', 
         views_complete.ExitQRScanView.as_view(), 
         name='scan_exit'),
    
    # Additional payment for extended parking
    path('api/payment/additional/', 
         views_complete.ProcessAdditionalPaymentView.as_view(), 
         name='additional_payment'),
    
    # ============================================
    # STATUS AND INFO APIs
    # ============================================
    
    # Get all zones
    path('api/zones/', 
         views_complete.AllZonesView.as_view(), 
         name='all_zones'),
    
    # Get specific zone status
    path('api/zone/<int:zone_id>/status/', 
         views_complete.ZoneStatusView.as_view(), 
         name='zone_status'),
    
    # ============================================
    # WEB INTERFACE (Optional)
    # ============================================
    
    # Booking form
    path('booking/', 
         views_complete.booking_form_view, 
         name='booking_form'),
    
    # QR Scanner interface
    path('scanner/<str:scan_type>/', 
         views_complete.qr_scanner_view, 
         name='qr_scanner'),
    
    # ============================================
    # SYSTEM
    # ============================================
    
    # Health check
    path('health/', 
         views_complete.health_check, 
         name='health_check'),
]

"""
API ENDPOINT DOCUMENTATION
=========================

BOOKING FLOW:
1. POST /parking/api/booking/create/     - Create booking
2. POST /parking/api/booking/payment/    - Pay for booking
3. POST /parking/api/scan/entry/         - Scan QR at entry
4. POST /parking/api/scan/exit/          - Scan QR at exit
5. POST /parking/api/payment/additional/ - Pay additional if needed

CANCELLATION:
- POST /parking/api/booking/cancel/      - Cancel booking

STATUS:
- GET /parking/api/zones/                - List all zones
- GET /parking/api/zone/{id}/status/     - Zone details

SYSTEM:
- GET /parking/health/                   - Health check

WEB INTERFACE:
- GET /parking/booking/                  - Booking form
- GET /parking/scanner/entry/            - Entry scanner
- GET /parking/scanner/exit/             - Exit scanner
"""