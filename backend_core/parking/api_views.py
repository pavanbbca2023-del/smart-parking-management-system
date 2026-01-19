"""
API Views for Parking System
Separate POST endpoints for better security
"""

from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_protect
from django.utils.decorators import method_decorator
from django.views import View
import json
import logging

from .utils import (
    allocate_slot,
    scan_entry_qr,
    scan_exit_qr,
    cancel_parking_session
)

logger = logging.getLogger(__name__)


@method_decorator(csrf_protect, name='dispatch')
class VehicleEntryAPI(View):
    """API endpoint for vehicle entry"""
    
    def post(self, request):
        try:
            # Parse JSON data
            data = json.loads(request.body)
            vehicle_number = data.get('vehicle_number', '').strip()
            owner_name = data.get('owner_name', '').strip()
            zone_id = data.get('zone_id', '').strip()
            
            # Validate input
            if not vehicle_number or not zone_id:
                return JsonResponse({
                    'success': False,
                    'message': 'Vehicle number and zone are required'
                })
            
            # Process entry
            result = allocate_slot(vehicle_number, owner_name, zone_id)
            return JsonResponse(result)
            
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'message': 'Invalid JSON data'
            })
        except Exception as e:
            logger.error(f"Vehicle entry error: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': 'System error occurred'
            })


@method_decorator(csrf_protect, name='dispatch')
class EntryQRScanAPI(View):
    """API endpoint for entry QR scanning"""
    
    def post(self, request):
        try:
            data = json.loads(request.body)
            qr_code = data.get('qr_code', '').strip()
            
            if not qr_code:
                return JsonResponse({
                    'success': False,
                    'message': 'QR code is required'
                })
            
            result = scan_entry_qr(qr_code)
            return JsonResponse(result)
            
        except Exception as e:
            logger.error(f"Entry QR scan error: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': 'QR scan failed'
            })


@method_decorator(csrf_protect, name='dispatch')
class ExitQRScanAPI(View):
    """API endpoint for exit QR scanning"""
    
    def post(self, request):
        try:
            data = json.loads(request.body)
            qr_code = data.get('qr_code', '').strip()
            payment_method = data.get('payment_method', '').strip()
            
            if not qr_code or not payment_method:
                return JsonResponse({
                    'success': False,
                    'message': 'QR code and payment method are required'
                })
            
            if payment_method not in ['CASH', 'ONLINE']:
                return JsonResponse({
                    'success': False,
                    'message': 'Invalid payment method'
                })
            
            result = scan_exit_qr(qr_code, payment_method)
            return JsonResponse(result)
            
        except Exception as e:
            logger.error(f"Exit QR scan error: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': 'Exit processing failed'
            })


@require_POST
@csrf_protect
def cancel_booking_api(request):
    """API endpoint for booking cancellation"""
    try:
        data = json.loads(request.body)
        qr_code = data.get('qr_code', '').strip()
        
        if not qr_code:
            return JsonResponse({
                'success': False,
                'message': 'QR code is required'
            })
        
        result = cancel_parking_session(qr_code)
        return JsonResponse(result)
        
    except Exception as e:
        logger.error(f"Booking cancellation error: {str(e)}")
        return JsonResponse({
            'success': False,
            'message': 'Cancellation failed'
        })