# views.py - Analytics API Views

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.http import JsonResponse
from django.utils import timezone
from datetime import datetime
from .services import AnalyticsService
from .serializers import (
    DashboardSummarySerializer, ZoneOccupancySerializer, RevenueReportSerializer,
    PeakHoursSerializer, ActiveSessionSerializer, CompletedSessionSerializer,
    VehicleHistorySerializer, PaymentAnalyticsSerializer, SlotUsageSerializer,
    ErrorResponseSerializer
)


# Health Check API
@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """Simple health check endpoint"""
    return Response({
        'status': 'OK',
        'message': 'Analytics API is working',
        'timestamp': timezone.now().isoformat()
    })


class DashboardSummaryView(APIView):
    """
    API endpoint for dashboard summary statistics
    GET /api/analytics/dashboard/
    """
    permission_classes = [AllowAny]
    
    def get(self, request):
        """
        Get overall dashboard summary
        """
        try:
            # Get data from service
            data = AnalyticsService.get_dashboard_summary()
            
            # Check for service errors
            if 'error' in data:
                return Response(
                    {'error': data['error']}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            # Serialize and return response
            serializer = DashboardSummarySerializer(data)
            return Response({
                'success': True,
                'data': serializer.data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': 'Failed to fetch dashboard summary', 'details': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ZoneOccupancyView(APIView):
    """
    API endpoint for zone occupancy statistics
    GET /api/analytics/zones/
    """
    permission_classes = [AllowAny]
    
    def get(self, request):
        """
        Get occupancy data for all zones
        """
        try:
            # Get data from service
            data = AnalyticsService.get_zone_occupancy()
            
            # Check for service errors
            if isinstance(data, dict) and 'error' in data:
                return Response(
                    {'error': data['error']}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            # Serialize and return response
            serializer = ZoneOccupancySerializer(data, many=True)
            return Response({
                'success': True,
                'data': serializer.data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': 'Failed to fetch zone occupancy', 'details': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class RevenueReportView(APIView):
    """
    API endpoint for revenue reports
    GET /api/analytics/revenue/?from=YYYY-MM-DD&to=YYYY-MM-DD
    """
    
    def get(self, request):
        """
        Get revenue report for specified date range
        """
        try:
            # Get date parameters from query string
            from_date_str = request.query_params.get('from')
            to_date_str = request.query_params.get('to')
            
            # Parse dates if provided
            from_date = None
            to_date = None
            
            if from_date_str:
                try:
                    from_date = datetime.strptime(from_date_str, '%Y-%m-%d').date()
                except ValueError:
                    return Response(
                        {'error': 'Invalid from date format. Use YYYY-MM-DD'}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            if to_date_str:
                try:
                    to_date = datetime.strptime(to_date_str, '%Y-%m-%d').date()
                except ValueError:
                    return Response(
                        {'error': 'Invalid to date format. Use YYYY-MM-DD'}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            # Get data from service
            data = AnalyticsService.get_revenue_report(from_date, to_date)
            
            # Check for service errors
            if 'error' in data:
                return Response(
                    {'error': data['error']}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            # Serialize and return response
            serializer = RevenueReportSerializer(data)
            return Response({
                'success': True,
                'data': serializer.data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': 'Failed to fetch revenue report', 'details': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class PeakHoursView(APIView):
    """
    API endpoint for peak hours analysis
    GET /api/analytics/peak-hours/
    """
    
    def get(self, request):
        """
        Get peak hours analysis based on entry times
        """
        try:
            # Get data from service
            data = AnalyticsService.get_peak_hours()
            
            # Check for service errors
            if 'error' in data:
                return Response(
                    {'error': data['error']}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            # Serialize and return response
            serializer = PeakHoursSerializer(data)
            return Response({
                'success': True,
                'data': serializer.data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': 'Failed to fetch peak hours', 'details': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ActiveSessionsView(APIView):
    """
    API endpoint for active parking sessions
    GET /api/analytics/active-sessions/
    """
    
    def get(self, request):
        """
        Get all currently active parking sessions
        """
        try:
            # Get data from service
            data = AnalyticsService.get_active_sessions()
            
            # Check for service errors
            if isinstance(data, dict) and 'error' in data:
                return Response(
                    {'error': data['error']}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            # Serialize and return response
            serializer = ActiveSessionSerializer(data, many=True)
            return Response({
                'success': True,
                'data': serializer.data,
                'count': len(data)
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': 'Failed to fetch active sessions', 'details': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CompletedSessionsView(APIView):
    """
    API endpoint for completed parking sessions
    GET /api/analytics/completed-sessions/
    """
    
    def get(self, request):
        """
        Get recently completed parking sessions
        """
        try:
            # Get data from service
            data = AnalyticsService.get_completed_sessions()
            
            # Check for service errors
            if isinstance(data, dict) and 'error' in data:
                return Response(
                    {'error': data['error']}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            # Serialize and return response
            serializer = CompletedSessionSerializer(data, many=True)
            return Response({
                'success': True,
                'data': serializer.data,
                'count': len(data)
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': 'Failed to fetch completed sessions', 'details': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class VehicleHistoryView(APIView):
    """
    API endpoint for vehicle parking history
    GET /api/analytics/vehicle/<vehicle_number>/
    """
    
    def get(self, request, vehicle_number):
        """
        Get parking history for a specific vehicle
        """
        try:
            # Get data from service
            data = AnalyticsService.get_vehicle_history(vehicle_number)
            
            # Check for service errors
            if 'error' in data:
                if data['error'] == 'Vehicle not found':
                    return Response(
                        {'error': 'Vehicle not found'}, 
                        status=status.HTTP_404_NOT_FOUND
                    )
                else:
                    return Response(
                        {'error': data['error']}, 
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )
            
            # Serialize and return response
            serializer = VehicleHistorySerializer(data)
            return Response({
                'success': True,
                'data': serializer.data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': 'Failed to fetch vehicle history', 'details': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class PaymentAnalyticsView(APIView):
    """
    API endpoint for payment analytics
    GET /api/analytics/payments/
    """
    
    def get(self, request):
        """
        Get payment analytics and statistics
        """
        try:
            # Get data from service
            data = AnalyticsService.get_payment_analytics()
            
            # Check for service errors
            if 'error' in data:
                return Response(
                    {'error': data['error']}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            # Serialize and return response
            serializer = PaymentAnalyticsSerializer(data)
            return Response({
                'success': True,
                'data': serializer.data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': 'Failed to fetch payment analytics', 'details': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class SlotUsageView(APIView):
    """
    API endpoint for slot usage analytics
    GET /api/analytics/slots/
    """
    
    def get(self, request):
        """
        Get slot usage analytics
        """
        try:
            # Get data from service
            data = AnalyticsService.get_slot_usage()
            
            # Check for service errors
            if isinstance(data, dict) and 'error' in data:
                return Response(
                    {'error': data['error']}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            # Serialize and return response
            serializer = SlotUsageSerializer(data, many=True)
            return Response({
                'success': True,
                'data': serializer.data,
                'count': len(data)
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': 'Failed to fetch slot usage', 'details': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )