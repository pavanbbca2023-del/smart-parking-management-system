from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from .services import AnalyticsService
from .serializers import (
    DashboardSummarySerializer, ZoneOccupancySerializer, RevenueReportSerializer,
    PeakHoursSerializer, ActiveSessionSerializer, CompletedSessionSerializer,
    AlertSerializer
)
from .models import Alert

class AlertViewSet(viewsets.ModelViewSet):
    queryset = Alert.objects.all().order_by('-created_at')
    serializer_class = AlertSerializer
    permission_classes = [AllowAny]

class DashboardAnalyticsView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        data = AnalyticsService.get_dashboard_summary()
        if 'error' in data: return Response(data, status=500)
        serializer = DashboardSummarySerializer(data)
        return Response({'success': True, 'data': serializer.data})

class RevenueAnalyticsView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        period = request.query_params.get('period', 'ALL')
        data = AnalyticsService.get_revenue_report(period=period)
        serializer = RevenueReportSerializer(data)
        return Response({'success': True, 'data': serializer.data})

class OccupancyAnalyticsView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        data = AnalyticsService.get_zone_occupancy()
        serializer = ZoneOccupancySerializer(data, many=True)
        return Response({'success': True, 'data': serializer.data})

class PeakHoursView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        data = AnalyticsService.get_peak_hours()
        serializer = PeakHoursSerializer(data)
        return Response({'success': True, 'data': serializer.data})

class ActiveSessionsView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        data = AnalyticsService.get_active_sessions()
        serializer = ActiveSessionSerializer(data, many=True)
        return Response({'success': True, 'data': serializer.data})

class CompletedSessionsView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        data = AnalyticsService.get_completed_sessions()
        serializer = CompletedSessionSerializer(data, many=True)
        return Response({'success': True, 'data': serializer.data})

class PaymentAnalyticsView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        return Response({'success': True, 'payments': []})
