from django.urls import path
from . import views, api_views

"""
============================================
URL ROUTING FOR PARKING MANAGEMENT
============================================
Simple and straightforward URL patterns
Each URL maps to one view function
============================================
"""

urlpatterns = [
    # ===== WEB VIEWS (with CSRF protection) =====
    path('entry/', views.vehicle_entry_view, name='vehicle_entry'),
    path('entry-qr-scan/', views.qr_entry_scan_view, name='qr_entry_scan'),
    path('exit-qr-scan/', views.qr_exit_scan_view, name='qr_exit_scan'),
    path('cancel-booking/', views.cancel_booking_view, name='cancel_booking'),
    path('zone/<str:zone_id>/status/', views.zone_status_view, name='zone_status'),
    
    # ===== SECURE API ENDPOINTS =====
    path('api/entry/', api_views.VehicleEntryAPI.as_view(), name='api_vehicle_entry'),
    path('api/entry-qr-scan/', api_views.EntryQRScanAPI.as_view(), name='api_entry_qr_scan'),
    path('api/exit-qr-scan/', api_views.ExitQRScanAPI.as_view(), name='api_exit_qr_scan'),
    path('api/cancel-booking/', api_views.cancel_booking_api, name='api_cancel_booking'),
]
