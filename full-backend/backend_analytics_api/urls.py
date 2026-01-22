from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DashboardAnalyticsView, 
    RevenueAnalyticsView, 
    OccupancyAnalyticsView,
    PeakHoursView,
    ActiveSessionsView,
    CompletedSessionsView,
    PaymentAnalyticsView,
    StaffSalaryViewSet
)

router = DefaultRouter()
router.register(r'list', StaffSalaryViewSet, basename='staff-salary')

urlpatterns = [
    path('dashboard/', DashboardAnalyticsView.as_view(), name='analytics-dashboard'),
    path('revenue/', RevenueAnalyticsView.as_view(), name='analytics-revenue'),
    path('zones/', OccupancyAnalyticsView.as_view(), name='analytics-zones'),
    path('peak-hours/', PeakHoursView.as_view(), name='analytics-peak-hours'),
    path('active-sessions/', ActiveSessionsView.as_view(), name='analytics-active-sessions'),
    path('completed-sessions/', CompletedSessionsView.as_view(), name='analytics-completed-sessions'),
    path('payments/', PaymentAnalyticsView.as_view(), name='analytics-payments'),
    path('', include(router.urls)),
]
