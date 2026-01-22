from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, SlotViewSet, AttendanceViewSet, ZoneViewSet,
    ParkingSessionViewSet, VehicleViewSet, DisputeViewSet,
    ScheduleViewSet, PaymentViewSet
)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'slots', SlotViewSet, basename='slot')
router.register(r'attendance', AttendanceViewSet, basename='attendance')
router.register(r'zones', ZoneViewSet, basename='zone')
router.register(r'sessions', ParkingSessionViewSet, basename='session')
router.register(r'payments', PaymentViewSet, basename='payment')
router.register(r'vehicles', VehicleViewSet, basename='vehicle')
router.register(r'disputes', DisputeViewSet, basename='dispute')
router.register(r'schedules', ScheduleViewSet, basename='schedule')

urlpatterns = [
    path('', include(router.urls)),
]
