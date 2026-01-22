from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'analytics'

router = DefaultRouter()
router.register(r'parking-zones', views.ParkingZoneViewSet)
router.register(r'parking-slots', views.ParkingSlotViewSet)
router.register(r'vehicles', views.VehicleViewSet)
router.register(r'parking-sessions', views.ParkingSessionViewSet)
router.register(r'payments', views.PaymentViewSet)
router.register(r'reports', views.AnalyticsReportViewSet)
router.register(r'metrics', views.SystemMetricsViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

