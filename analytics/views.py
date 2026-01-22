from django.shortcuts import render
from django.http import JsonResponse
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import (
    ParkingZone, ParkingSlot, Vehicle, ParkingSession,
    Payment, AnalyticsReport, SystemMetrics
)
from .serializers.model_serializers import (
    ParkingZoneSerializer, ParkingSlotSerializer, VehicleSerializer,
    ParkingSessionSerializer, PaymentSerializer, AnalyticsReportSerializer,
    SystemMetricsSerializer
)


# ViewSets for REST API
class ParkingZoneViewSet(viewsets.ModelViewSet):
    queryset = ParkingZone.objects.all()
    serializer_class = ParkingZoneSerializer


class ParkingSlotViewSet(viewsets.ModelViewSet):
    queryset = ParkingSlot.objects.all()
    serializer_class = ParkingSlotSerializer


class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer


class ParkingSessionViewSet(viewsets.ModelViewSet):
    queryset = ParkingSession.objects.all()
    serializer_class = ParkingSessionSerializer


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer


class AnalyticsReportViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AnalyticsReport.objects.all()
    serializer_class = AnalyticsReportSerializer


class SystemMetricsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SystemMetrics.objects.all()
    serializer_class = SystemMetricsSerializer
