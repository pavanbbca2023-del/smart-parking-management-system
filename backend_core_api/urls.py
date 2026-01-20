# urls.py - URL Configuration for Smart Parking APIs

from django.urls import path, include
from . import views, drf_views

# URL patterns for parking APIs
urlpatterns = [
    
    # ============================================
    # Role-based APIs (NEW)
    # ============================================
    path('', include('backend_core_api.role_urls')),
    
    # ============================================
    # DRF APIs (Existing)
    # ============================================
    path('', include('backend_core_api.drf_urls')),
    
    # ============================================
    # Direct URL mappings
    # ============================================
    path('entry-qr-scan/', drf_views.ScanEntryAPIView.as_view(), name='entry_qr_scan'),
    path('exit-qr-scan/', drf_views.ScanExitAPIView.as_view(), name='exit_qr_scan'),
    
    # ============================================
    # PhonePe Payment APIs
    # ============================================
    path('api/payment/phonepe/create/', views.create_phonepe_payment, name='create_phonepe_payment'),
    path('api/payment/phonepe/verify/', views.verify_phonepe_payment, name='verify_phonepe_payment'),
    path('api/payment/phonepe/refund/', views.refund_phonepe_payment, name='refund_phonepe_payment'),
    path('api/payment/callback/phonepe/', views.phonepe_callback, name='phonepe_callback'),
    
    # ============================================
    # Original Function-based APIs (Backup)
    # ============================================
    
    # API 1: Book Parking
    path('api/parking/book-old/', views.book_parking, name='book_parking_old'),
    
    # API 2: Scan Entry QR
    path('api/parking/scan-entry-old/', views.scan_entry, name='scan_entry_old'),
    
    # API 3: Scan Exit QR
    path('api/parking/scan-exit-old/', views.scan_exit, name='scan_exit_old'),
    
    # API 4: Refund Check
    path('api/parking/refund-old/', views.refund_check, name='refund_check_old'),
    
    # API 5: List All Sessions
    path('api/parking/sessions-old/', views.list_sessions, name='list_sessions_old'),
    
    # API 6: List Zones with Availability
    path('api/parking/zones-old/', views.list_zones, name='list_zones_old'),
    
    # API 7: Check Payment Status
    path('api/parking/payment-status-old/', views.payment_status, name='payment_status_old'),
    
]

# ============================================
# API DOCUMENTATION
# ============================================

"""
SMART PARKING MANAGEMENT SYSTEM - API ENDPOINTS

BASE URL: http://localhost:8000/

1️⃣ BOOK PARKING API
   URL: POST /api/parking/book/
   Purpose: Book parking slot and generate QR code
   Input: {"vehicle_number": "KA-01-AB-1234", "owner_name": "John", "zone_id": 1}
   Output: Session ID, QR code, slot details

2️⃣ SCAN ENTRY QR API
   URL: POST /api/parking/scan-entry/
   Purpose: Scan QR when vehicle enters, record entry time
   Input: {"qr_code": "QR-ABC123DEF456"}
   Output: Entry confirmation with timestamp

3️⃣ SCAN EXIT QR API
   URL: POST /api/parking/scan-exit/
   Purpose: Scan QR when vehicle exits, calculate bill, process payment
   Input: {"qr_code": "QR-ABC123DEF456", "payment_method": "CASH"}
   Output: Bill details with amount and payment confirmation

4️⃣ REFUND CHECK API
   URL: POST /api/parking/refund/
   Purpose: Check refund eligibility (5-minute rule)
   Input: {"qr_code": "QR-ABC123DEF456"}
   Output: Refund status and amount

5️⃣ LIST SESSIONS API
   URL: GET /api/parking/sessions/
   Purpose: Get all parking sessions (active and completed)
   Input: None (GET request)
   Output: List of all sessions with details

6️⃣ LIST ZONES API
   URL: GET /api/parking/zones/
   Purpose: Get all zones with slot availability
   Input: None (GET request)
   Output: Zones with free/occupied slot counts

7️⃣ PAYMENT STATUS API
   URL: POST /api/parking/payment-status/
   Purpose: Check payment status of a session
   Input: {"session_id": 123}
   Output: Payment details and current amount

TESTING EXAMPLES:

# Test Book Parking
curl -X POST http://localhost:8000/api/parking/book/ \
  -H "Content-Type: application/json" \
  -d '{"vehicle_number": "KA-01-AB-1234", "owner_name": "John Doe", "zone_id": 1}'

# Test Entry Scan
curl -X POST http://localhost:8000/api/parking/scan-entry/ \
  -H "Content-Type: application/json" \
  -d '{"qr_code": "QR-ABC123DEF456"}'

# Test Exit Scan
curl -X POST http://localhost:8000/api/parking/scan-exit/ \
  -H "Content-Type: application/json" \
  -d '{"qr_code": "QR-ABC123DEF456", "payment_method": "CASH"}'

# Test Refund Check
curl -X POST http://localhost:8000/api/parking/refund/ \
  -H "Content-Type: application/json" \
  -d '{"qr_code": "QR-ABC123DEF456"}'

# Test List Sessions
curl -X GET http://localhost:8000/api/parking/sessions/

# Test List Zones
curl -X GET http://localhost:8000/api/parking/zones/

# Test Payment Status
curl -X POST http://localhost:8000/api/parking/payment-status/ \
  -H "Content-Type: application/json" \
  -d '{"session_id": 123}'
"""