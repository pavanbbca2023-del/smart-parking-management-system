from django.utils import timezone
from datetime import timedelta
import uuid
from .models import ParkingSlot, ParkingSession, Vehicle, ParkingZone


# ============================================
# SLOT ALLOCATION LOGIC
# ============================================

def allocate_slot(vehicle_number, owner_name, zone_id):
    """
    Allocate a parking slot to a vehicle
    
    Steps:
    1. Get or create the vehicle record
    2. Find first available (not occupied) slot in the zone
    3. Mark that slot as occupied
    4. Create a parking session with QR code
    5. Return session details
    
    Args:
        vehicle_number: License plate (e.g., "DL-01-AB-1234")
        owner_name: Owner's name
        zone_id: Parking zone ID
    
    Returns:
        Dictionary with session details or error message
    """
    
    try:
        # Step 1: Get or create the vehicle
        vehicle, created = Vehicle.objects.get_or_create(
            vehicle_number=vehicle_number,
            defaults={'owner_name': owner_name}
        )
        
        # Step 2: Get the parking zone
        zone = ParkingZone.objects.get(id=zone_id)
        
        # Step 3: Find first available slot in the zone
        available_slot = ParkingSlot.objects.filter(
            zone=zone,
            is_occupied=False  # Not occupied means it's available
        ).first()
        
        # Check if slot is available
        if not available_slot:
            return {
                'success': False,
                'message': 'No slots available in this zone',
                'data': None
            }
        
        # Step 4: Mark slot as occupied
        available_slot.is_occupied = True
        available_slot.save()
        
        # Step 5: Create parking session with unique QR code
        qr_code = str(uuid.uuid4())  # Generate unique QR code
        
        session = ParkingSession.objects.create(
            vehicle=vehicle,
            slot=available_slot,
            zone=zone,
            qr_code=qr_code,
            entry_qr_scanned=False,  # Entry QR not scanned yet
            exit_qr_scanned=False,   # Exit QR not scanned yet
            is_paid=False             # Payment not received yet
        )
        
        # Return success response
        return {
            'success': True,
            'message': f'Slot allocated: {available_slot.slot_number}',
            'data': {
                'session_id': str(session.id),
                'qr_code': qr_code,
                'slot_number': available_slot.slot_number,
                'zone_name': zone.name,
                'vehicle_number': vehicle.vehicle_number
            }
        }
    
    except ParkingZone.DoesNotExist:
        return {
            'success': False,
            'message': 'Zone not found',
            'data': None
        }
    except Exception as e:
        return {
            'success': False,
            'message': f'Error: {str(e)}',
            'data': None
        }


# ============================================
# ENTRY QR SCAN LOGIC
# ============================================

def scan_entry_qr(qr_code):
    """
    Scan QR code at entry gate
    
    Rules:
    1. QR code must exist in parking session
    2. Entry QR can only be scanned once (prevent double scan)
    3. Save entry time when scanned
    4. After entry scan, refund is locked permanently
    
    Args:
        qr_code: The scanned QR code
    
    Returns:
        Dictionary with success status and details
    """
    
    try:
        # Find the parking session with this QR code
        session = ParkingSession.objects.get(qr_code=qr_code)
        
        # Check if entry QR already scanned (prevent double scan)
        if session.entry_qr_scanned:
            return {
                'success': False,
                'message': 'Entry QR already scanned. Cannot scan twice!',
                'data': None
            }
        
        # Mark entry QR as scanned
        session.entry_qr_scanned = True
        
        # Save entry time
        session.entry_time = timezone.now()
        session.save()
        
        return {
            'success': True,
            'message': 'Entry QR scanned successfully',
            'data': {
                'session_id': str(session.id),
                'vehicle_number': session.vehicle.vehicle_number,
                'entry_time': session.entry_time,
                'slot_number': session.slot.slot_number
            }
        }
    
    except ParkingSession.DoesNotExist:
        return {
            'success': False,
            'message': 'Invalid QR code. Session not found.',
            'data': None
        }
    except Exception as e:
        return {
            'success': False,
            'message': f'Error: {str(e)}',
            'data': None
        }


# ============================================
# CALCULATE PARKING AMOUNT LOGIC
# ============================================

def calculate_amount(session):
    """
    Calculate parking amount based on entry and exit time
    
    Billing Rules:
    1. Amount = number of hours × hourly_rate
    2. Grace period: 5 minutes free
    3. After grace period: charge full hour
    4. Minimum charge: 1 hour
    
    Example:
    - Parked 45 minutes → 1 hour charge (minimum)
    - Parked 1 hour 5 minutes (grace) → still 1 hour charge
    - Parked 1 hour 6 minutes → 2 hours charge (grace expired)
    - Parked 2 hours 30 minutes → 3 hours charge
    
    Args:
        session: ParkingSession object
    
    Returns:
        Decimal amount to be charged
    """
    
    # Check if entry and exit times exist
    if not session.entry_time or not session.exit_time:
        return 0
    
    # Calculate total duration parked
    duration = session.exit_time - session.entry_time
    
    # Get total minutes parked
    total_minutes = int(duration.total_seconds() / 60)
    
    # Apply grace period: 5 minutes free
    grace_period_minutes = 5
    billable_minutes = max(0, total_minutes - grace_period_minutes)
    
    # Convert minutes to hours (round up)
    # Example: 65 minutes → 2 hours, 61 minutes → 2 hours, 60 minutes → 1 hour
    billable_hours = (billable_minutes + 59) // 60  # Round up division
    
    # Minimum charge is 1 hour
    if billable_hours == 0:
        billable_hours = 1
    
    # Calculate amount
    hourly_rate = session.zone.hourly_rate
    amount = billable_hours * hourly_rate
    
    return amount


# ============================================
# RELEASE SLOT LOGIC
# ============================================

def release_slot(session):
    """
    Release the parking slot so another vehicle can use it
    
    Steps:
    1. Mark slot as not occupied
    2. Save changes
    
    Args:
        session: ParkingSession object
    
    Returns:
        Boolean: True if successful
    """
    
    try:
        # Get the slot from the session
        slot = session.slot
        
        # Mark slot as not occupied (available)
        slot.is_occupied = False
        slot.save()
        
        return True
    except Exception as e:
        print(f"Error releasing slot: {str(e)}")
        return False


# ============================================
# EXIT QR SCAN LOGIC
# ============================================

def scan_exit_qr(qr_code, payment_method):
    """
    Scan QR code at exit gate and process payment
    
    Rules:
    1. Entry QR must be scanned first (entry_qr_scanned = True)
    2. Exit QR can only be scanned once (prevent double exit)
    3. Save exit time
    4. Calculate billing amount
    5. Mark payment method (CASH or ONLINE)
    6. Mark as paid (is_paid = True)
    7. Release the parking slot
    
    Args:
        qr_code: The scanned QR code
        payment_method: 'CASH' or 'ONLINE'
    
    Returns:
        Dictionary with exit details and amount charged
    """
    
    try:
        # Find the session
        session = ParkingSession.objects.get(qr_code=qr_code)
        
        # Rule 1: Entry QR must be scanned first
        if not session.entry_qr_scanned:
            return {
                'success': False,
                'message': 'Entry QR not scanned. Cannot exit!',
                'data': None
            }
        
        # Rule 2: Prevent double exit scan
        if session.exit_qr_scanned:
            return {
                'success': False,
                'message': 'Exit already scanned. Cannot scan twice!',
                'data': None
            }
        
        # Rule 3: Save exit time
        session.exit_time = timezone.now()
        
        # Rule 4: Calculate billing amount
        amount = calculate_amount(session)
        session.amount_paid = amount
        
        # Rule 5: Mark payment method
        session.payment_method = payment_method
        
        # Rule 6: Mark as paid
        session.is_paid = True
        
        # Mark exit QR as scanned
        session.exit_qr_scanned = True
        
        # Save session changes
        session.save()
        
        # Rule 7: Release the parking slot
        release_slot(session)
        
        return {
            'success': True,
            'message': 'Exit processed successfully',
            'data': {
                'session_id': str(session.id),
                'vehicle_number': session.vehicle.vehicle_number,
                'exit_time': session.exit_time,
                'entry_time': session.entry_time,
                'amount_charged': float(amount),
                'payment_method': payment_method,
                'slot_number': session.slot.slot_number
            }
        }
    
    except ParkingSession.DoesNotExist:
        return {
            'success': False,
            'message': 'Invalid QR code. Session not found.',
            'data': None
        }
    except Exception as e:
        return {
            'success': False,
            'message': f'Error: {str(e)}',
            'data': None
        }


# ============================================
# REFUND LOGIC
# ============================================

def calculate_refund(session):
    """
    Calculate refund amount based on refund rules
    
    REFUND RULES:
    
    CASE 1: User never arrived (entry QR NOT scanned)
    - Cancel within 5 minutes of booking → 100% refund
    - Cancel after 5 minutes → 0% refund (no cancellation)
    
    CASE 2: User arrived (entry QR SCANNED)
    - No refund allowed → 0%
    - Reason: Vehicle already parked, cannot refund
    
    Args:
        session: ParkingSession object
    
    Returns:
        Dictionary with refund details
    """
    
    # CASE 2: Entry QR already scanned (user already parked)
    if session.entry_qr_scanned:
        return {
            'can_refund': False,
            'refund_amount': 0,
            'reason': 'No refund allowed after vehicle entry (QR scanned)'
        }
    
    # CASE 1: Entry QR NOT scanned (user never arrived)
    if not session.entry_qr_scanned:
        # Get time difference since booking
        current_time = timezone.now()
        booking_time = session.created_at
        time_difference = current_time - booking_time
        
        # Get minutes elapsed since booking
        minutes_elapsed = int(time_difference.total_seconds() / 60)
        
        # Grace period for cancellation: 5 minutes
        grace_period_minutes = 5
        
        # If cancelled within grace period → 100% refund
        if minutes_elapsed <= grace_period_minutes:
            return {
                'can_refund': True,
                'refund_amount': 0,  # No payment made yet, so refund is not applicable
                'reason': f'Cancelled within grace period ({minutes_elapsed} min < {grace_period_minutes} min). 100% refund eligible.'
            }
        
        # If cancelled after grace period → no refund
        else:
            return {
                'can_refund': False,
                'refund_amount': 0,
                'reason': f'Cancelled after grace period ({minutes_elapsed} min > {grace_period_minutes} min). 0% refund.'
            }


def cancel_parking_session(qr_code):
    """
    Cancel a parking session and process refund
    
    Steps:
    1. Find the session
    2. Calculate refund eligibility
    3. Release the slot
    4. Mark session as cancelled (set exit_time)
    5. Return refund details
    
    Args:
        qr_code: The QR code of the session
    
    Returns:
        Dictionary with cancellation and refund details
    """
    
    try:
        # Find the session
        session = ParkingSession.objects.get(qr_code=qr_code)
        
        # Check if session already cancelled
        if session.exit_time is not None:
            return {
                'success': False,
                'message': 'Session already processed (entry/exit already scanned)',
                'data': None
            }
        
        # Calculate refund
        refund_info = calculate_refund(session)
        
        # Release the parking slot
        release_slot(session)
        
        # Mark session as cancelled (set exit time to current time)
        session.exit_time = timezone.now()
        session.is_paid = True
        session.save()
        
        return {
            'success': True,
            'message': 'Session cancelled',
            'data': {
                'session_id': str(session.id),
                'vehicle_number': session.vehicle.vehicle_number,
                'refund_eligible': refund_info['can_refund'],
                'refund_amount': refund_info['refund_amount'],
                'refund_reason': refund_info['reason'],
                'slot_number': session.slot.slot_number
            }
        }
    
    except ParkingSession.DoesNotExist:
        return {
            'success': False,
            'message': 'Invalid QR code. Session not found.',
            'data': None
        }
    except Exception as e:
        return {
            'success': False,
            'message': f'Error: {str(e)}',
            'data': None
        }
