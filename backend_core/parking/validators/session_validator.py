"""
SESSION VALIDATOR - SIMPLE VERSION
===================================
Validate parking sessions and input data
Easy to understand - every step commented!
"""

from ..models import ParkingSession, ParkingZone, Vehicle


# ========== FUNCTION 1: VALIDATE VEHICLE ENTRY ==========

def validate_vehicle_entry(vehicle_number, zone_id):
    """
    Validate vehicle entry request
    
    Checks:
    1. Vehicle number is provided
    2. Zone ID is provided
    3. Zone exists
    4. Zone is active
    5. Vehicle doesn't have active session already
    
    Arguments:
        vehicle_number: Vehicle registration number
        zone_id: Parking zone ID
    
    Returns:
        Tuple: (is_valid, error_message)
        - (True, "") if valid
        - (False, "error message") if invalid
    """
    
    # STEP 1: Check if vehicle number is provided
    if not vehicle_number:
        return False, "Vehicle number is required"
    
    # STEP 2: Check if zone ID is provided
    if not zone_id:
        return False, "Zone ID is required"
    
    # STEP 3: Check vehicle number length
    if len(vehicle_number) < 2 or len(vehicle_number) > 20:
        return False, "Vehicle number must be between 2 and 20 characters"
    
    # STEP 4: Check if zone exists
    try:
        zone = ParkingZone.objects.get(id=zone_id)
    except ParkingZone.DoesNotExist:
        return False, "Parking zone not found"
    
    # STEP 5: Check if zone is active
    if not zone.is_active:
        return False, "This parking zone is not active"
    
    # STEP 6: Check if vehicle already has active session
    # Active session = exit_time is null
    active_session = ParkingSession.objects.filter(
        vehicle__vehicle_number=vehicle_number,
        exit_time__isnull=True  # No exit time = still parked
    ).first()
    
    if active_session is not None:
        return False, "This vehicle already has an active parking session"
    
    # STEP 7: All validations passed!
    return True, ""


# ========== FUNCTION 2: CHECK IF SESSION IS ACTIVE ==========

def is_session_active(qr_code):
    """
    Check if a parking session is active (vehicle still parked)
    
    Rules:
    1. Session must exist with this QR code
    2. Session must have NO exit time
    3. If both true, session is ACTIVE
    
    Arguments:
        qr_code: QR code string
    
    Returns:
        True if session is active, False if not
    """
    
    # STEP 1: Check if QR code is provided
    if not qr_code:
        return False
    
    # STEP 2: Find active session with this QR code
    session = ParkingSession.objects.filter(
        qr_code=qr_code,
        exit_time__isnull=True  # Must not have exit time
    ).first()
    
    # STEP 3: Check if session exists
    if session is None:
        return False
    
    # STEP 4: Session is active!
    return True


# ========== FUNCTION 3: VALIDATE SESSION EXIT ==========

def validate_session_exit(qr_code):
    """
    Validate a vehicle exit request
    
    Checks:
    1. QR code is provided
    2. Session exists for this QR code
    3. Session is still active
    
    Arguments:
        qr_code: QR code string
    
    Returns:
        Tuple: (is_valid, error_message, session)
        - (True, "", session) if valid
        - (False, "error message", None) if invalid
    """
    
    # STEP 1: Check if QR code is provided
    if not qr_code:
        return False, "QR code is required", None
    
    # STEP 2: Check if QR code is not empty
    qr_code = qr_code.strip()
    if not qr_code:
        return False, "QR code cannot be empty", None
    
    # STEP 3: Find session with this QR code
    try:
        session = ParkingSession.objects.get(
            qr_code=qr_code,
            exit_time__isnull=True  # Must be active (not exited yet)
        )
    except ParkingSession.DoesNotExist:
        # Either QR code is invalid or session already closed
        return False, "Invalid QR code or session already closed", None
    
    # STEP 4: Validate that session has a valid slot
    # (slot might be deleted but session exists)
    if session.slot is None:
        return False, "Parking slot not found for this session", None
    
    # STEP 5: Validate that slot is actually marked as occupied
    # This checks data consistency
    if not session.slot.is_occupied:
        return False, "Slot status inconsistent - already marked as free", None
    
    # STEP 6: Session is valid for exit!
    return True, "", session


# ========== FUNCTION 4: VALIDATE QR CODE FORMAT ==========

def validate_qr_format(qr_code):
    """
    Validate QR code format
    
    Rules:
    1. Must start with "QR-"
    2. Must not be empty
    3. Must be reasonable length
    
    Arguments:
        qr_code: QR code string
    
    Returns:
        True if valid format, False if invalid
    """
    
    # STEP 1: Check if provided
    if not qr_code:
        return False
    
    # STEP 2: Check if starts with "QR-"
    if not qr_code.startswith("QR-"):
        return False
    
    # STEP 3: Check minimum length
    if len(qr_code) < 4:
        return False
    
    # STEP 4: Check maximum length
    if len(qr_code) > 100:
        return False
    
    # STEP 5: Format is valid!
    return True
