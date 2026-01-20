# drf_views.py - DRF Views for Smart Parking System

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import ParkingZone, ParkingSlot, Vehicle, ParkingSession
from .drf_serializers import (
    ParkingZoneSerializer, ParkingSlotSerializer, VehicleSerializer,
    ParkingSessionSerializer, BookParkingSerializer, QRScanSerializer,
    ExitScanSerializer, PaymentStatusSerializer
)
from .utils import (
    allocate_slot, scan_entry_qr, scan_exit_qr, 
    refund_logic, get_session_by_qr
)


class BookParkingAPIView(APIView):
    """API for booking parking slot"""
    
    def post(self, request):
        serializer = BookParkingSerializer(data=request.data)
        if serializer.is_valid():
            vehicle_number = serializer.validated_data['vehicle_number'].upper()
            owner_name = serializer.validated_data['owner_name']
            zone_id = serializer.validated_data['zone_id']
            
            try:
                zone = ParkingZone.objects.get(id=zone_id, is_active=True)
            except ParkingZone.DoesNotExist:
                return Response({
                    'success': False,
                    'message': 'Invalid or inactive parking zone'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Create or get vehicle
            vehicle, created = Vehicle.objects.get_or_create(
                vehicle_number=vehicle_number,
                defaults={'owner_name': owner_name}
            )
            
            # Check active session
            active_session = ParkingSession.objects.filter(
                vehicle=vehicle, exit_time__isnull=True
            ).first()
            
            if active_session:
                return Response({
                    'success': False,
                    'message': 'Vehicle already has an active parking session'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Allocate slot
            result = allocate_slot(vehicle, zone)
            
            if result['success']:
                return Response(result, status=status.HTTP_201_CREATED)
            else:
                return Response(result, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ScanEntryAPIView(APIView):
    """API for scanning entry QR code"""
    
    def post(self, request):
        serializer = QRScanSerializer(data=request.data)
        if serializer.is_valid():
            qr_code = serializer.validated_data['qr_code']
            
            session = get_session_by_qr(qr_code)
            if not session:
                return Response({
                    'success': False,
                    'message': 'Invalid QR code'
                }, status=status.HTTP_404_NOT_FOUND)
            
            result = scan_entry_qr(session.id)
            
            if result['success']:
                return Response(result, status=status.HTTP_200_OK)
            else:
                return Response(result, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ScanExitAPIView(APIView):
    """API for scanning exit QR code"""
    
    def post(self, request):
        serializer = ExitScanSerializer(data=request.data)
        if serializer.is_valid():
            qr_code = serializer.validated_data['qr_code']
            payment_method = serializer.validated_data['payment_method']
            
            session = get_session_by_qr(qr_code)
            if not session:
                return Response({
                    'success': False,
                    'message': 'Invalid QR code'
                }, status=status.HTTP_404_NOT_FOUND)
            
            result = scan_exit_qr(session.id, payment_method)
            
            if result['success']:
                return Response(result, status=status.HTTP_200_OK)
            else:
                return Response(result, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RefundCheckAPIView(APIView):
    """API for checking refund eligibility"""
    
    def post(self, request):
        serializer = QRScanSerializer(data=request.data)
        if serializer.is_valid():
            qr_code = serializer.validated_data['qr_code']
            
            session = get_session_by_qr(qr_code)
            if not session:
                return Response({
                    'success': False,
                    'message': 'Invalid QR code'
                }, status=status.HTTP_404_NOT_FOUND)
            
            result = refund_logic(session)
            return Response(result, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SessionsListAPIView(APIView):
    """API for listing all parking sessions"""
    
    def get(self, request):
        sessions = ParkingSession.objects.all().select_related(
            'vehicle', 'slot', 'zone'
        ).order_by('-created_at')
        
        serializer = ParkingSessionSerializer(sessions, many=True)
        
        return Response({
            'success': True,
            'message': f'Found {len(serializer.data)} sessions',
            'total_sessions': len(serializer.data),
            'sessions': serializer.data
        }, status=status.HTTP_200_OK)


class ZonesListAPIView(APIView):
    """API for listing parking zones with availability"""
    
    def get(self, request):
        zones = ParkingZone.objects.filter(is_active=True)
        serializer = ParkingZoneSerializer(zones, many=True)
        
        return Response({
            'success': True,
            'message': f'Found {len(serializer.data)} active zones',
            'total_zones': len(serializer.data),
            'zones': serializer.data
        }, status=status.HTTP_200_OK)


class PaymentStatusAPIView(APIView):
    """API for checking payment status"""
    
    def post(self, request):
        serializer = PaymentStatusSerializer(data=request.data)
        if serializer.is_valid():
            session_id = serializer.validated_data['session_id']
            
            try:
                session = ParkingSession.objects.get(id=session_id)
            except ParkingSession.DoesNotExist:
                return Response({
                    'success': False,
                    'message': 'Invalid session ID'
                }, status=status.HTTP_404_NOT_FOUND)
            
            # Calculate current amount if active
            from .utils import calculate_amount
            current_amount = 0
            if session.entry_time and not session.exit_time:
                amount_result = calculate_amount(session)
                if amount_result['success']:
                    current_amount = float(amount_result['total_amount'])
            
            return Response({
                'success': True,
                'session_id': session.id,
                'vehicle_number': session.vehicle.vehicle_number,
                'qr_code': session.qr_code,
                'entry_qr_scanned': session.entry_qr_scanned,
                'exit_qr_scanned': session.exit_qr_scanned,
                'is_paid': session.is_paid,
                'amount_paid': float(session.amount_paid),
                'current_amount': current_amount,
                'payment_method': session.payment_method,
                'status': 'Completed' if session.exit_time else 'Active'
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Function-based views for simple endpoints
@api_view(['GET'])
def health_check(request):
    """Health check endpoint"""
    return Response({
        'success': True,
        'message': 'Smart Parking API is working',
        'version': '1.0.0'
    }, status=status.HTTP_200_OK)