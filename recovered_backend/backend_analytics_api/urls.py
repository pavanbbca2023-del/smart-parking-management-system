# urls.py - Analytics API URL Configuration

from django.urls import path
from .views import (
    DashboardSummaryView, ZoneOccupancyView, RevenueReportView,
    PeakHoursView, ActiveSessionsView, CompletedSessionsView,
    VehicleHistoryView, PaymentAnalyticsView, SlotUsageView,
    health_check
)

# URL patterns for analytics API endpoints
urlpatterns = [
    # Health Check
    path('health/', health_check, name='analytics-health'),
    
    # Dashboard Summary API
    path('dashboard/', DashboardSummaryView.as_view(), name='dashboard-summary'),
    
    # Zone Occupancy API
    path('zones/', ZoneOccupancyView.as_view(), name='zone-occupancy'),
    
    # Revenue Report API
    path('revenue/', RevenueReportView.as_view(), name='revenue-report'),
    
    # Peak Hours API
    path('peak-hours/', PeakHoursView.as_view(), name='peak-hours'),
    
    # Active Sessions API
    path('active-sessions/', ActiveSessionsView.as_view(), name='active-sessions'),
    
    # Completed Sessions API
    path('completed-sessions/', CompletedSessionsView.as_view(), name='completed-sessions'),
    
    # Vehicle History API
    path('vehicle/<str:vehicle_number>/', VehicleHistoryView.as_view(), name='vehicle-history'),
    
    # Payment Analytics API
    path('payments/', PaymentAnalyticsView.as_view(), name='payment-analytics'),
    
    # Slot Usage API
    path('slots/', SlotUsageView.as_view(), name='slot-usage'),
]