"""
SMART PARKING MANAGEMENT SYSTEM - VIEWS
=======================================
Clean views that only call service functions
No business logic in views - all in services
"""

import json
import logging
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_http_methods, require_POST
from django.views.decorators.csrf import csrf_protect
from django.utils.decorators import method_decorator
from django.views import View

from .services_complete import ParkingService
from .models_complete import ParkingZone

logger = logging.getLogger(__name__)


# ============================================
# BOOKING MANAGEMENT VIEWS
# ============================================

@method_decorator(csrf_protect, name='dispatch')
class CreateBookingView(View):
    """
    Create new parking booking
    POST: Create booking with payment
    """
    
    def post(self, request):
        """
        Create parking booking
        
        Expected JSON:
        {
            "vehicle_number": "DL01AB1234",
            "owner_name": "John Doe",
            "zone_id": 1,
            "hours": 2,
            "phone_number": "9876543210"
        }
        """
        try:
            data = json.loads(request.body)
            
            # Extract data
            vehicle_number = data.get('vehicle_number', '').strip()
            owner_name = data.get('owner_name', '').strip()
            zone_id = data.get('zone_id')
            hours = data.get('hours', 1)
            phone_number = data.get('phone_number', '').strip()
            
            # Validate required fields
            if not all([vehicle_number, owner_name, zone_id]):
                return JsonResponse({
                    'success': False,
                    'error': 'Vehicle number, owner name, and zone ID are required'
                })
            
            # Call service function
            result = ParkingService.create_booking(
                vehicle_number=vehicle_number,
                owner_name=owner_name,
                zone_id=zone_id,
                hours=hours,
                phone_number=phone_number
            )
            
            return JsonResponse(result)
            
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'error': 'Invalid JSON data'
            })
        except Exception as e:
            logger.error(f"Error in CreateBookingView: {str(e)}")
            return JsonResponse({
                'success': False,
                'error': 'Internal server error'
            })


@method_decorator(csrf_protect, name='dispatch')
class ProcessPaymentView(View):
    """
    Process payment for booking
    POST: Process booking payment
    """
    
    def post(self, request):
        """
        Process booking payment
        
        Expected JSON:
        {
            "booking_id": "uuid-string",
            "payment_gateway_data": {...}
        }
        """
        try:
            data = json.loads(request.body)
            
            booking_id = data.get('booking_id', '').strip()
            payment_gateway_data = data.get('payment_gateway_data', {})
            
            if not booking_id:
                return JsonResponse({
                    'success': False,
                    'error': 'Booking ID is required'
                })
            
            # Call service function
            result = ParkingService.process_booking_payment(
                booking_id=booking_id,
                payment_gateway_data=payment_gateway_data
            )
            
            return JsonResponse(result)
            
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'error': 'Invalid JSON data'
            })
        except Exception as e:
            logger.error(f"Error in ProcessPaymentView: {str(e)}")
            return JsonResponse({
                'success': False,
                'error': 'Internal server error'
            })


@method_decorator(csrf_protect, name='dispatch')
class CancelBookingView(View):
    """
    Cancel booking and process refund
    POST: Cancel booking
    """
    
    def post(self, request):
        """
        Cancel booking
        
        Expected JSON:
        {
            "booking_id": "uuid-string",
            "reason": "User cancelled"
        }
        """
        try:
            data = json.loads(request.body)
            
            booking_id = data.get('booking_id', '').strip()
            reason = data.get('reason', 'User cancelled').strip()
            
            if not booking_id:
                return JsonResponse({
                    'success': False,
                    'error': 'Booking ID is required'
                })
            
            # Call service function
            result = ParkingService.cancel_booking(
                booking_id=booking_id,
                reason=reason
            )
            
            return JsonResponse(result)
            
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'error': 'Invalid JSON data'
            })
        except Exception as e:
            logger.error(f"Error in CancelBookingView: {str(e)}")
            return JsonResponse({
                'success': False,
                'error': 'Internal server error'
            })


# ============================================
# QR SCANNING VIEWS
# ============================================

@method_decorator(csrf_protect, name='dispatch')
class EntryQRScanView(View):
    """
    Process entry QR scan
    POST: Scan QR for entry
    """
    
    def post(self, request):
        """
        Process entry QR scan
        
        Expected JSON:
        {
            "qr_code": "PARK-ABC123DEF456",
            "scanner_device_id": "ENTRY_GATE_01",
            "scanner_location": "Main Entrance"
        }
        """
        try:
            data = json.loads(request.body)
            
            qr_code = data.get('qr_code', '').strip()
            scanner_device_id = data.get('scanner_device_id', '').strip()
            scanner_location = data.get('scanner_location', '').strip()
            
            if not qr_code:
                return JsonResponse({
                    'success': False,
                    'error': 'QR code is required'
                })
            
            # Call service function
            result = ParkingService.scan_entry_qr(
                qr_code=qr_code,
                scanner_device_id=scanner_device_id,
                scanner_location=scanner_location
            )
            
            return JsonResponse(result)
            
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'error': 'Invalid JSON data'
            })
        except Exception as e:
            logger.error(f"Error in EntryQRScanView: {str(e)}")
            return JsonResponse({
                'success': False,
                'error': 'Internal server error'
            })


@method_decorator(csrf_protect, name='dispatch')
class ExitQRScanView(View):
    """
    Process exit QR scan
    POST: Scan QR for exit
    """
    
    def post(self, request):
        """
        Process exit QR scan
        
        Expected JSON:
        {
            "qr_code": "PARK-ABC123DEF456",
            "scanner_device_id": "EXIT_GATE_01",
            "scanner_location": "Main Exit"
        }
        """
        try:
            data = json.loads(request.body)
            
            qr_code = data.get('qr_code', '').strip()
            scanner_device_id = data.get('scanner_device_id', '').strip()
            scanner_location = data.get('scanner_location', '').strip()
            
            if not qr_code:
                return JsonResponse({
                    'success': False,
                    'error': 'QR code is required'
                })
            
            # Call service function
            result = ParkingService.scan_exit_qr(
                qr_code=qr_code,
                scanner_device_id=scanner_device_id,
                scanner_location=scanner_location
            )
            
            return JsonResponse(result)
            
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'error': 'Invalid JSON data'
            })
        except Exception as e:
            logger.error(f"Error in ExitQRScanView: {str(e)}")
            return JsonResponse({
                'success': False,
                'error': 'Internal server error'
            })


@method_decorator(csrf_protect, name='dispatch')
class ProcessAdditionalPaymentView(View):
    """
    Process additional payment for extended parking
    POST: Process additional payment
    """
    
    def post(self, request):
        """
        Process additional payment
        
        Expected JSON:
        {
            "session_id": "uuid-string",
            "payment_gateway_data": {...}
        }
        """
        try:
            data = json.loads(request.body)
            
            session_id = data.get('session_id', '').strip()
            payment_gateway_data = data.get('payment_gateway_data', {})
            
            if not session_id:
                return JsonResponse({
                    'success': False,
                    'error': 'Session ID is required'
                })
            
            # Call service function
            result = ParkingService.process_additional_payment(
                session_id=session_id,
                payment_gateway_data=payment_gateway_data
            )
            
            return JsonResponse(result)
            
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'error': 'Invalid JSON data'
            })
        except Exception as e:
            logger.error(f"Error in ProcessAdditionalPaymentView: {str(e)}")
            return JsonResponse({
                'success': False,
                'error': 'Internal server error'
            })


# ============================================
# STATUS AND INFO VIEWS
# ============================================

class ZoneStatusView(View):
    """
    Get parking zone status
    GET: Get zone information and availability
    """
    
    def get(self, request, zone_id):
        """
        Get zone status
        
        URL: /parking/zone/{zone_id}/status/
        """
        try:
            # Call service function
            result = ParkingService.get_zone_status(zone_id=zone_id)
            
            return JsonResponse(result)
            
        except Exception as e:
            logger.error(f"Error in ZoneStatusView: {str(e)}")
            return JsonResponse({
                'success': False,
                'error': 'Internal server error'
            })


class AllZonesView(View):
    """
    Get all parking zones
    GET: List all available zones
    """
    
    def get(self, request):
        """
        Get all zones with basic info
        
        URL: /parking/zones/
        """
        try:
            zones = ParkingZone.objects.filter(is_active=True).values(
                'id', 'name', 'hourly_rate', 'total_slots'
            )
            
            zones_list = []
            for zone in zones:
                # Get current status for each zone
                status = ParkingService.get_zone_status(zone['id'])
                if status['success']:
                    zone.update({
                        'available_slots': status['available_slots'],
                        'occupancy_percentage': status['occupancy_percentage']
                    })
                zones_list.append(zone)
            
            return JsonResponse({
                'success': True,
                'zones': zones_list
            })
            
        except Exception as e:
            logger.error(f"Error in AllZonesView: {str(e)}")
            return JsonResponse({
                'success': False,
                'error': 'Internal server error'
            })


# ============================================
# WEB INTERFACE VIEWS (Optional)
# ============================================

@require_http_methods(["GET"])
def booking_form_view(request):
    """
    Display booking form (for web interface)
    """
    try:
        zones = ParkingZone.objects.filter(is_active=True)
        return render(request, 'parking/booking_form.html', {
            'zones': zones
        })
    except Exception as e:
        logger.error(f"Error in booking_form_view: {str(e)}")
        return render(request, 'parking/error.html', {
            'error': 'Unable to load booking form'
        })


@require_http_methods(["GET"])
def qr_scanner_view(request, scan_type):
    """
    Display QR scanner interface
    
    Args:
        scan_type: 'entry' or 'exit'
    """
    try:
        if scan_type not in ['entry', 'exit']:
            return render(request, 'parking/error.html', {
                'error': 'Invalid scan type'
            })
        
        return render(request, 'parking/qr_scanner.html', {
            'scan_type': scan_type,
            'page_title': f'{scan_type.title()} Scanner'
        })
    except Exception as e:
        logger.error(f"Error in qr_scanner_view: {str(e)}")
        return render(request, 'parking/error.html', {
            'error': 'Unable to load scanner'
        })


# ============================================
# ERROR HANDLING
# ============================================

def handle_404(request, exception):
    """Custom 404 handler"""
    return JsonResponse({
        'success': False,
        'error': 'Endpoint not found'
    }, status=404)


def handle_500(request):
    """Custom 500 handler"""
    return JsonResponse({
        'success': False,
        'error': 'Internal server error'
    }, status=500)


# ============================================
# HEALTH CHECK
# ============================================

@require_http_methods(["GET"])
def health_check(request):
    """
    System health check endpoint
    """
    try:
        # Basic database connectivity check
        zone_count = ParkingZone.objects.count()
        
        return JsonResponse({
            'success': True,
            'status': 'healthy',
            'timestamp': timezone.now().isoformat(),
            'zones_configured': zone_count
        })
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return JsonResponse({
            'success': False,
            'status': 'unhealthy',
            'error': str(e)
        }, status=503)