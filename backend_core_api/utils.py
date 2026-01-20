# utils.py - Business Logic Functions for Smart Parking System

import uuid
import logging
from django.utils import timezone
from datetime import timedelta
from .models import ParkingZone, ParkingSlot, Vehicle, ParkingSession

# Setup logging (MONITORING FIX)
logger = logging.getLogger('parking')
payment_logger = logging.getLogger('payments')


# ============================================
# FUNCTION 1: ALLOCATE SLOT
# ============================================
def allocate_slot(vehicle, zone):
    """
    Allocate first available slot in selected zone
    
    Args:
        vehicle: Vehicle object
        zone: ParkingZone object
    
    Returns:
        dict: Success/failure with slot details
    """
    try:
        # Find first available slot in the zone
        available_slot = ParkingSlot.objects.filter(
            zone=zone,
            is_occupied=False
        ).first()
        
        # Check if slot is available
        if not available_slot:
            return {
                'success': False,
                'message': 'No available slots in this zone'
            }
        
        # Mark slot as occupied
        available_slot.is_occupied = True
        available_slot.save()
        
        # Generate unique QR code
        qr_code = f"QR-{uuid.uuid4().hex[:12].upper()}"
        
        # Create parking session
        session = ParkingSession.objects.create(
            vehicle=vehicle,
            slot=available_slot,
            zone=zone,
            qr_code=qr_code,
            entry_time=None,  # Will be set when QR is scanned
            exit_time=None,
            amount_paid=0,
            is_paid=False,
            entry_qr_scanned=False,
            exit_qr_scanned=False
        )
        
        return {
            'success': True,
            'message': 'Slot allocated successfully',
            'session_id': session.id,
            'slot_number': available_slot.slot_number,
            'qr_code': qr_code,
            'zone_name': zone.name,
            'hourly_rate': float(zone.hourly_rate)
        }
        
    except Exception as e:
        return {
            'success': False,
            'message': f'Slot allocation failed: {str(e)}'
        }


# ============================================
# FUNCTION 2: SCAN ENTRY QR
# ============================================
def scan_entry_qr(session_id):
    """
    Scan QR code at entry, record entry time
    
    Args:
        session_id: ParkingSession ID
    
    Returns:
        dict: Success/failure with entry details
    """
    try:
        # Get parking session
        try:
            session = ParkingSession.objects.get(id=session_id)
        except ParkingSession.DoesNotExist:
            return {
                'success': False,
                'message': 'Invalid session ID'
            }
        
        # Check if entry already scanned
        if session.entry_qr_scanned:
            return {
                'success': False,
                'message': 'Entry QR already scanned',
                'entry_time': session.entry_time.isoformat() if session.entry_time else None
            }
        
        # Check if session is still valid (not exited)
        if session.exit_time is not None:
            return {
                'success': False,
                'message': 'Session already completed'
            }
        
        # Record entry time
        current_time = timezone.now()
        session.entry_time = current_time
        session.entry_qr_scanned = True
        session.save()
        
        return {
            'success': True,
            'message': 'Entry QR scanned successfully',
            'vehicle_number': session.vehicle.vehicle_number,
            'slot_number': session.slot.slot_number,
            'zone_name': session.zone.name,
            'entry_time': current_time.isoformat(),
            'hourly_rate': float(session.zone.hourly_rate)
        }
        
    except Exception as e:
        return {
            'success': False,
            'message': f'Entry scan failed: {str(e)}'
        }


# ============================================
# FUNCTION 3: SCAN EXIT QR
# ============================================
def scan_exit_qr(session_id, payment_method):
    """
    Scan QR code at exit, calculate amount, process payment
    
    Args:
        session_id: ParkingSession ID
        payment_method: 'CASH' or 'ONLINE'
    
    Returns:
        dict: Success/failure with bill details
    """
    try:
        # Get parking session
        try:
            session = ParkingSession.objects.get(id=session_id)
        except ParkingSession.DoesNotExist:
            return {
                'success': False,
                'message': 'Invalid session ID'
            }
        
        # Check if entry QR was scanned first
        if not session.entry_qr_scanned or session.entry_time is None:
            return {
                'success': False,
                'message': 'Entry QR must be scanned before exit'
            }
        
        # Check if exit already scanned
        if session.exit_qr_scanned or session.exit_time is not None:
            return {
                'success': False,
                'message': 'Exit QR already scanned'
            }
        
        # Validate payment method
        if payment_method not in ['CASH', 'ONLINE']:
            return {
                'success': False,
                'message': 'Invalid payment method. Use CASH or ONLINE'
            }
        
        # Calculate amount
        amount_result = calculate_amount(session)
        if not amount_result['success']:
            return amount_result
        
        total_amount = amount_result['total_amount']
        duration_hours = amount_result['duration_hours']
        
        # Record exit time and payment
        current_time = timezone.now()
        session.exit_time = current_time
        session.exit_qr_scanned = True
        session.amount_paid = total_amount
        session.payment_method = payment_method
        
        # CRITICAL FIX: Only mark paid for CASH (verified immediately)
        # ONLINE payments require webhook confirmation
        if payment_method == 'CASH':
            session.is_paid = True
            session.payment_status = 'SUCCESS'
        else:  # ONLINE
            session.is_paid = False
            session.payment_status = 'PENDING'
        
        session.save()
        
        # Log payment activity (MONITORING FIX)
        payment_logger.info(
            f'Exit scanned - Vehicle: {session.vehicle.vehicle_number}, '
            f'Amount: ₹{total_amount}, Method: {payment_method}, '
            f'Status: {session.payment_status}'
        )
        
        # Release slot ONLY if payment is SUCCESS or CASH
        if session.is_paid or session.payment_status == 'SUCCESS':
            release_result = release_slot(session)
            payment_logger.info(f'Slot released for {session.vehicle.vehicle_number}')
        else:
            release_result = {'success': True, 'message': 'Slot hold: awaiting payment confirmation'}
            payment_logger.info(f'Slot held for {session.vehicle.vehicle_number} - waiting for payment')
        
        return {
            'success': True,
            'message': 'Exit processed successfully',
            'bill_details': {
                'vehicle_number': session.vehicle.vehicle_number,
                'slot_number': session.slot.slot_number,
                'zone_name': session.zone.name,
                'entry_time': session.entry_time.isoformat(),
                'exit_time': current_time.isoformat(),
                'duration_hours': duration_hours,
                'hourly_rate': float(session.zone.hourly_rate),
                'total_amount': float(total_amount),
                'payment_method': payment_method,
                'session_id': session.id
            }
        }
        
    except Exception as e:
        return {
            'success': False,
            'message': f'Exit processing failed: {str(e)}'
        }


# ============================================
# FUNCTION 4: CALCULATE AMOUNT
# ============================================
def calculate_amount(session):
    """
    Calculate parking amount based on duration
    
    Grace period: 5 min free, after that full 1-hour charge
    
    Args:
        session: ParkingSession object
    
    Returns:
        dict: Success/failure with amount details
    """
    try:
        # Check if entry time exists
        if not session.entry_time:
            return {
                'success': False,
                'message': 'Entry time not recorded'
            }
        
        # Calculate duration
        current_time = timezone.now()
        duration = current_time - session.entry_time
        duration_minutes = duration.total_seconds() / 60
        
        # Grace period: 5 minutes free
        if duration_minutes <= 5:
            return {
                'success': True,
                'total_amount': 0,
                'duration_hours': 0,
                'duration_minutes': int(duration_minutes),
                'is_free': True,
                'reason': '5-minute grace period'
            }
        
        # After grace period: full 1-hour charge minimum
        # Calculate hours with proper rounding
        total_seconds = duration.total_seconds()
        duration_hours = int(total_seconds / 3600)  # Get full hours
        
        # If there's any remainder, round up to next hour
        if total_seconds % 3600 > 0:
            duration_hours += 1
        
        # Minimum 1 hour charge after grace period
        duration_hours = max(1, duration_hours)
        
        # Calculate total amount
        hourly_rate = session.zone.hourly_rate
        total_amount = duration_hours * hourly_rate
        
        return {
            'success': True,
            'total_amount': total_amount,
            'duration_hours': duration_hours,
            'duration_minutes': int(duration_minutes),
            'is_free': False,
            'hourly_rate': float(hourly_rate)
        }
        
    except Exception as e:
        return {
            'success': False,
            'message': f'Amount calculation failed: {str(e)}'
        }


# ============================================
# FUNCTION 5: RELEASE SLOT
# ============================================
def release_slot(session):
    """
    Release parking slot after exit
    
    Args:
        session: ParkingSession object
    
    Returns:
        dict: Success/failure message
    """
    try:
        # Mark slot as available
        if session.slot:
            session.slot.is_occupied = False
            session.slot.save()
            
            return {
                'success': True,
                'message': f'Slot {session.slot.slot_number} released successfully'
            }
        else:
            return {
                'success': False,
                'message': 'No slot assigned to this session'
            }
        
    except Exception as e:
        return {
            'success': False,
            'message': f'Slot release failed: {str(e)}'
        }


# ============================================
# FUNCTION 6: REFUND LOGIC
# ============================================
def refund_logic(session):
    """
    Apply refund rules based on user behavior
    
    Rules:
    - User never arrived → cancel <5 min → 100% refund
    - User arrived → refund not allowed
    
    Args:
        session: ParkingSession object
    
    Returns:
        dict: Refund eligibility and details
    """
    try:
        current_time = timezone.now()
        
        # Check if session is already completed
        if session.exit_time is not None:
            return {
                'success': True,
                'refund_eligible': False,
                'refund_amount': 0,
                'reason': 'Session already completed'
            }
        
        # Case 1: User never arrived (entry QR not scanned)
        if not session.entry_qr_scanned:
            # Check if within 5 minutes of booking
            time_since_booking = current_time - session.created_at
            
            if time_since_booking.total_seconds() <= 300:  # 5 minutes = 300 seconds
                return {
                    'success': True,
                    'refund_eligible': True,
                    'refund_amount': 0,  # No amount paid yet
                    'refund_percentage': 100,
                    'reason': 'User never arrived, within 5 minutes',
                    'time_remaining': 300 - int(time_since_booking.total_seconds())
                }
            else:
                return {
                    'success': True,
                    'refund_eligible': False,
                    'refund_amount': 0,
                    'reason': 'User never arrived, but 5 minutes expired'
                }
        
        # Case 2: User arrived (entry QR scanned)
        else:
            return {
                'success': True,
                'refund_eligible': False,
                'refund_amount': 0,
                'reason': 'User already arrived, refund not allowed'
            }
        
    except Exception as e:
        return {
            'success': False,
            'message': f'Refund check failed: {str(e)}'
        }


# ============================================
# HELPER FUNCTIONS
# ============================================

def get_session_by_qr(qr_code):
    """
    Get parking session by QR code
    
    Args:
        qr_code: QR code string
    
    Returns:
        ParkingSession object or None
    """
    try:
        return ParkingSession.objects.get(qr_code=qr_code)
    except ParkingSession.DoesNotExist:
        return None


def validate_qr_format(qr_code):
    """
    Validate QR code format
    
    Args:
        qr_code: QR code string
    
    Returns:
        bool: True if valid format
    """
    if not qr_code:
        return False
    
    if not qr_code.startswith('QR-'):
        return False
    
    if len(qr_code) != 15:  # QR- (3) + 12 characters = 15
        return False
    
    return True


def get_zone_availability(zone):
    """
    Get available slots count for a zone
    
    Args:
        zone: ParkingZone object
    
    Returns:
        dict: Zone details with availability
    """
    total_slots = zone.slots.count()
    occupied_slots = zone.slots.filter(is_occupied=True).count()
    available_slots = total_slots - occupied_slots
    
    return {
        'zone_id': zone.id,
        'zone_name': zone.name,
        'hourly_rate': float(zone.hourly_rate),
        'is_active': zone.is_active,
        'total_slots': total_slots,
        'occupied_slots': occupied_slots,
        'available_slots': available_slots
    }