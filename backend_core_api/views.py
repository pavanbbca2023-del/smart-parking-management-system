# views.py - API Views for Smart Parking System

import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_GET
from django.utils import timezone
from .models import ParkingZone, ParkingSlot, Vehicle, ParkingSession
from .utils import (
    allocate_slot,
    scan_entry_qr,
    scan_exit_qr,
    calculate_amount,
    release_slot,
    refund_logic,
    get_session_by_qr,
    get_zone_availability
)


# ============================================
# API 1: BOOK PARKING
# ============================================
@csrf_exempt
@require_POST
def book_parking(request):
    """
    POST /api/parking/book/
    Book parking, allocate slot, generate QR
    
    Input JSON:
    {
        "vehicle_number": "KA-01-AB-1234",
        "owner_name": "John Doe",
        "zone_id": 1
    }
    """
    try:
        # Parse JSON data
        data = json.loads(request.body)
        
        # Get input fields
        vehicle_number = data.get('vehicle_number', '').strip().upper()
        owner_name = data.get('owner_name', '').strip()
        zone_id = data.get('zone_id')
        
        # Validate required fields
        if not vehicle_number:
            return JsonResponse({
                'success': False,
                'message': 'Vehicle number is required'
            })
        
        if not owner_name:
            return JsonResponse({
                'success': False,
                'message': 'Owner name is required'
            })
        
        if not zone_id:
            return JsonResponse({
                'success': False,
                'message': 'Zone ID is required'
            })
        
        # Get parking zone
        try:
            zone = ParkingZone.objects.get(id=zone_id, is_active=True)
        except ParkingZone.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Invalid or inactive parking zone'
            })
        
        # Create or get vehicle
        vehicle, created = Vehicle.objects.get_or_create(
            vehicle_number=vehicle_number,
            defaults={'owner_name': owner_name}
        )
        
        # Check if vehicle already has active session
        active_session = ParkingSession.objects.filter(
            vehicle=vehicle,
            exit_time__isnull=True
        ).first()
        
        if active_session:
            return JsonResponse({
                'success': False,
                'message': 'Vehicle already has an active parking session',
                'existing_session_id': active_session.id
            })
        
        # Allocate slot
        result = allocate_slot(vehicle, zone)
        
        return JsonResponse(result)
        
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'message': 'Invalid JSON data'
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Booking failed: {str(e)}'
        })


# ============================================
# API 2: SCAN ENTRY QR
# ============================================
@csrf_exempt
@require_POST
def scan_entry(request):
    """
    POST /api/parking/scan-entry/
    Scan QR, record entry time
    
    Input JSON:
    {
        "qr_code": "QR-ABC123DEF456"
    }
    """
    try:
        # Parse JSON data
        data = json.loads(request.body)
        
        # Get QR code
        qr_code = data.get('qr_code', '').strip()
        
        # Validate QR code
        if not qr_code:
            return JsonResponse({
                'success': False,
                'message': 'QR code is required'
            })
        
        # Find session by QR code
        session = get_session_by_qr(qr_code)
        if not session:
            return JsonResponse({
                'success': False,
                'message': 'Invalid QR code'
            })
        
        # Scan entry QR
        result = scan_entry_qr(session.id)
        
        return JsonResponse(result)
        
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'message': 'Invalid JSON data'
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Entry scan failed: {str(e)}'
        })


# ============================================
# API 3: SCAN EXIT QR
# ============================================
@csrf_exempt
@require_POST
def scan_exit(request):
    """
    POST /api/parking/scan-exit/
    Scan QR, calculate amount, process payment, release slot
    
    Input JSON:
    {
        "qr_code": "QR-ABC123DEF456",
        "payment_method": "CASH"
    }
    """
    try:
        # Parse JSON data
        data = json.loads(request.body)
        
        # Get input fields
        qr_code = data.get('qr_code', '').strip()
        payment_method = data.get('payment_method', '').strip().upper()
        
        # Validate required fields
        if not qr_code:
            return JsonResponse({
                'success': False,
                'message': 'QR code is required'
            })
        
        if not payment_method:
            return JsonResponse({
                'success': False,
                'message': 'Payment method is required'
            })
        
        # Validate payment method
        if payment_method not in ['CASH', 'ONLINE']:
            return JsonResponse({
                'success': False,
                'message': 'Payment method must be CASH or ONLINE'
            })
        
        # Find session by QR code
        session = get_session_by_qr(qr_code)
        if not session:
            return JsonResponse({
                'success': False,
                'message': 'Invalid QR code'
            })
        
        # Scan exit QR
        result = scan_exit_qr(session.id, payment_method)
        
        return JsonResponse(result)
        
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'message': 'Invalid JSON data'
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Exit scan failed: {str(e)}'
        })


# ============================================
# API 4: REFUND CHECK
# ============================================
@csrf_exempt
@require_POST
def refund_check(request):
    """
    POST /api/parking/refund/
    Apply refund rules (5 min, entry scanned or not)
    
    Input JSON:
    {
        "qr_code": "QR-ABC123DEF456"
    }
    """
    try:
        # Parse JSON data
        data = json.loads(request.body)
        
        # Get QR code
        qr_code = data.get('qr_code', '').strip()
        
        # Validate QR code
        if not qr_code:
            return JsonResponse({
                'success': False,
                'message': 'QR code is required'
            })
        
        # Find session by QR code
        session = get_session_by_qr(qr_code)
        if not session:
            return JsonResponse({
                'success': False,
                'message': 'Invalid QR code'
            })
        
        # Check refund eligibility
        result = refund_logic(session)
        
        return JsonResponse(result)
        
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'message': 'Invalid JSON data'
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Refund check failed: {str(e)}'
        })


# ============================================
# API 5: LIST ALL SESSIONS
# ============================================
@require_GET
def list_sessions(request):
    """
    GET /api/parking/sessions/
    List all sessions
    """
    try:
        # Get all sessions
        sessions = ParkingSession.objects.all().select_related(
            'vehicle', 'slot', 'zone'
        ).order_by('-created_at')
        
        # Format session data
        sessions_list = []
        for session in sessions:
            session_data = {
                'session_id': session.id,
                'vehicle_number': session.vehicle.vehicle_number,
                'owner_name': session.vehicle.owner_name,
                'slot_number': session.slot.slot_number,
                'zone_name': session.zone.name,
                'qr_code': session.qr_code,
                'created_at': session.created_at.isoformat(),
                'entry_time': session.entry_time.isoformat() if session.entry_time else None,
                'exit_time': session.exit_time.isoformat() if session.exit_time else None,
                'entry_qr_scanned': session.entry_qr_scanned,
                'exit_qr_scanned': session.exit_qr_scanned,
                'amount_paid': float(session.amount_paid),
                'payment_method': session.payment_method,
                'is_paid': session.is_paid,
                'status': 'Completed' if session.exit_time else 'Active'
            }
            sessions_list.append(session_data)
        
        return JsonResponse({
            'success': True,
            'message': f'Found {len(sessions_list)} sessions',
            'total_sessions': len(sessions_list),
            'sessions': sessions_list
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Failed to get sessions: {str(e)}'
        })


# ============================================
# API 6: LIST ZONES WITH AVAILABILITY
# ============================================
@require_GET
def list_zones(request):
    """
    GET /api/parking/zones/
    List zones + free slots
    """
    try:
        # Get all active zones
        zones = ParkingZone.objects.filter(is_active=True)
        
        # Format zone data with availability
        zones_list = []
        for zone in zones:
            zone_data = get_zone_availability(zone)
            zones_list.append(zone_data)
        
        return JsonResponse({
            'success': True,
            'message': f'Found {len(zones_list)} active zones',
            'total_zones': len(zones_list),
            'zones': zones_list
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Failed to get zones: {str(e)}'
        })


# ============================================
# API 7: CHECK PAYMENT STATUS
# ============================================
@csrf_exempt
@require_POST
def payment_status(request):
    """
    POST /api/parking/payment-status/
    Check payment status
    
    Input JSON:
    {
        "session_id": 123
    }
    """
    try:
        # Parse JSON data
        data = json.loads(request.body)
        
        # Get session ID
        session_id = data.get('session_id')
        
        # Validate session ID
        if not session_id:
            return JsonResponse({
                'success': False,
                'message': 'Session ID is required'
            })
        
        # Get parking session
        try:
            session = ParkingSession.objects.get(id=session_id)
        except ParkingSession.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Invalid session ID'
            })
        
        # Calculate current amount if session is active
        current_amount = 0
        if session.entry_time and not session.exit_time:
            amount_result = calculate_amount(session)
            if amount_result['success']:
                current_amount = float(amount_result['total_amount'])
        
        # Return payment status
        return JsonResponse({
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
        })
        
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'message': 'Invalid JSON data'
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Payment status check failed: {str(e)}'
        })


# ============================================
# PHONEPE PAYMENT ENDPOINTS
# ============================================

@csrf_exempt
@require_POST
def create_phonepe_payment(request):
    """
    POST /api/payment/phonepe/create/
    Create PhonePe payment request for parking session
    
    Input JSON:
    {
        "session_id": 123,
        "amount": 100.50,
        "user_id": 1
    }
    """
    try:
        from .phonepe_service import get_phonepe_service
        
        data = json.loads(request.body)
        session_id = data.get('session_id')
        amount = data.get('amount')
        user_id = data.get('user_id')
        
        # Validation
        if not session_id or not amount or not user_id:
            return JsonResponse({
                'success': False,
                'message': 'Missing required fields: session_id, amount, user_id'
            }, status=400)
        
        # Get parking session
        try:
            session = ParkingSession.objects.get(id=session_id)
            vehicle_number = session.vehicle.vehicle_number
        except ParkingSession.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Parking session not found'
            }, status=404)
        
        # Create PhonePe payment
        phonepe_service = get_phonepe_service()
        payment_result = phonepe_service.create_payment_request(
            amount=Decimal(str(amount)),
            user_id=user_id,
            session_id=session_id,
            vehicle_number=vehicle_number
        )
        
        if payment_result['success']:
            # Store transaction ID in session
            session.payment_method = 'PHONEPE'
            session.save()
            
        return JsonResponse(payment_result)
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Payment creation failed: {str(e)}'
        }, status=500)


@csrf_exempt
@require_POST
def verify_phonepe_payment(request):
    """
    POST /api/payment/phonepe/verify/
    Verify PhonePe payment status
    
    Input JSON:
    {
        "merchant_txn_id": "PARKING_xyz123",
        "session_id": 123
    }
    """
    try:
        from .phonepe_service import get_phonepe_service
        
        data = json.loads(request.body)
        merchant_txn_id = data.get('merchant_txn_id')
        session_id = data.get('session_id')
        
        if not merchant_txn_id:
            return JsonResponse({
                'success': False,
                'message': 'merchant_txn_id is required'
            }, status=400)
        
        # Verify payment
        phonepe_service = get_phonepe_service()
        verification = phonepe_service.verify_payment(merchant_txn_id)
        
        if verification['success'] and verification['verified']:
            # Update session as paid
            if session_id:
                try:
                    session = ParkingSession.objects.get(id=session_id)
                    session.is_paid = True
                    session.payment_method = 'PHONEPE'
                    session.amount_paid = verification.get('amount', 0)
                    session.save()
                except ParkingSession.DoesNotExist:
                    pass
        
        return JsonResponse(verification)
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Payment verification failed: {str(e)}'
        }, status=500)


@csrf_exempt
@require_POST
def phonepe_callback(request):
    """
    POST /api/payment/callback/phonepe/
    PhonePe webhook callback for payment status updates
    """
    try:
        from .phonepe_service import PhonePeService
        
        data = json.loads(request.body)
        
        # PhonePe sends transaction status in callback
        merchant_txn_id = data.get('data', {}).get('merchantTransactionId')
        status = data.get('data', {}).get('state')  # COMPLETED, FAILED, etc.
        
        if merchant_txn_id and status == 'COMPLETED':
            # Find and update corresponding session
            # This would require storing the mapping of txn_id to session_id
            pass
        
        # Always return success to acknowledge receipt
        return JsonResponse({
            'success': True,
            'message': 'Callback received'
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


@csrf_exempt
@require_POST
def refund_phonepe_payment(request):
    """
    POST /api/payment/phonepe/refund/
    Refund a PhonePe payment
    
    Input JSON:
    {
        "merchant_txn_id": "PARKING_xyz123",
        "amount": 100.50,
        "reason": "User cancelled"
    }
    """
    try:
        from .phonepe_service import get_phonepe_service
        
        data = json.loads(request.body)
        merchant_txn_id = data.get('merchant_txn_id')
        amount = data.get('amount')
        reason = data.get('reason', 'Parking refund')
        
        if not merchant_txn_id or not amount:
            return JsonResponse({
                'success': False,
                'message': 'Missing merchant_txn_id or amount'
            }, status=400)
        
        phonepe_service = get_phonepe_service()
        refund_result = phonepe_service.refund_payment(
            merchant_txn_id=merchant_txn_id,
            amount=Decimal(str(amount)),
            refund_reason=reason
        )
        
        return JsonResponse(refund_result)
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Refund failed: {str(e)}'
        }, status=500)