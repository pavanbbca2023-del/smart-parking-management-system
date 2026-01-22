from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from .services import AnalyticsService
from .serializers import (
    DashboardSummarySerializer, ZoneOccupancySerializer, RevenueReportSerializer,
    PeakHoursSerializer, ActiveSessionSerializer, CompletedSessionSerializer
)

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
        data = AnalyticsService.get_revenue_report()
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

from rest_framework import viewsets
from django.utils import timezone
class StaffSalaryViewSet(viewsets.ModelViewSet):
    from .models import StaffSalary
    from .serializers import StaffSalarySerializer
    queryset = StaffSalary.objects.all()
    serializer_class = StaffSalarySerializer
    permission_classes = [AllowAny]

    def list(self, request):
        month = request.query_params.get('month')
        year = request.query_params.get('year')
        
        queryset = self.queryset
        if month: queryset = queryset.filter(month=month)
        if year: queryset = queryset.filter(year=year)
            
        serializer = self.get_serializer(queryset, many=True)
        return Response({'success': True, 'staff_salaries': serializer.data})

    @action(detail=False, methods=['post'])
    def pay(self, request):
        salary_id = request.data.get('salary_id')
        if salary_id:
            try:
                from .models import StaffSalary
                salary = StaffSalary.objects.get(id=salary_id)
                salary.status = 'paid'
                salary.pay_date = timezone.now()
                salary.save()
                return Response({'success': True, 'message': 'Payment successful'})
            except StaffSalary.DoesNotExist:
                return Response({'success': False, 'message': 'Salary record not found'}, status=404)
        return Response({'success': False, 'message': 'No salary_id provided'}, status=400)

class PaymentAnalyticsView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        return Response({'success': True, 'payments': []})
