# serializers.py - Data Serialization for Smart Parking System
# (Optional file - for future DRF integration or data formatting)

from django.core.serializers.json import DjangoJSONEncoder
from django.forms.models import model_to_dict
from .models import ParkingZone, ParkingSlot, Vehicle, ParkingSession


# ============================================
# SERIALIZER FUNCTIONS
# ============================================

def serialize_parking_zone(zone):
    """
    Serialize ParkingZone object to dictionary
    
    Args:
        zone: ParkingZone object
    
    Returns:
        dict: Serialized zone data
    """
    return {
        'id': zone.id,
        'name': zone.name,
        'hourly_rate': float(zone.hourly_rate),
        'is_active': zone.is_active,
        'created_at': zone.created_at.isoformat(),
        'total_slots': zone.slots.count(),
        'available_slots': zone.slots.filter(is_occupied=False).count(),
        'occupied_slots': zone.slots.filter(is_occupied=True).count()
    }


def serialize_parking_slot(slot):
    """
    Serialize ParkingSlot object to dictionary
    
    Args:
        slot: ParkingSlot object
    
    Returns:
        dict: Serialized slot data
    """
    # Get current vehicle if occupied
    current_vehicle = None
    if slot.is_occupied:
        active_session = slot.sessions.filter(exit_time__isnull=True).first()
        if active_session:
            current_vehicle = active_session.vehicle.vehicle_number
    
    return {
        'id': slot.id,
        'slot_number': slot.slot_number,
        'zone_id': slot.zone.id,
        'zone_name': slot.zone.name,
        'is_occupied': slot.is_occupied,
        'current_vehicle': current_vehicle,
        'created_at': slot.created_at.isoformat()
    }


def serialize_vehicle(vehicle):
    """
    Serialize Vehicle object to dictionary
    
    Args:
        vehicle: Vehicle object
    
    Returns:
        dict: Serialized vehicle data
    """
    # Get active session if any
    active_session = vehicle.sessions.filter(exit_time__isnull=True).first()
    
    return {
        'id': vehicle.id,
        'vehicle_number': vehicle.vehicle_number,
        'owner_name': vehicle.owner_name,
        'created_at': vehicle.created_at.isoformat(),
        'total_sessions': vehicle.sessions.count(),
        'has_active_session': active_session is not None,
        'active_session_id': active_session.id if active_session else None
    }


def serialize_parking_session(session):
    """
    Serialize ParkingSession object to dictionary
    
    Args:
        session: ParkingSession object
    
    Returns:
        dict: Serialized session data
    """
    # Calculate duration if entry time exists
    duration_minutes = 0
    if session.entry_time:
        from django.utils import timezone
        if session.exit_time:
            duration = session.exit_time - session.entry_time
        else:
            duration = timezone.now() - session.entry_time
        duration_minutes = int(duration.total_seconds() / 60)
    
    # Determine status
    if session.exit_time:
        status = 'Completed'
    elif session.entry_qr_scanned:
        status = 'Active (Entered)'
    else:
        status = 'Booked (Not Entered)'
    
    return {
        'id': session.id,
        'vehicle_number': session.vehicle.vehicle_number,
        'owner_name': session.vehicle.owner_name,
        'slot_number': session.slot.slot_number,
        'zone_name': session.zone.name,
        'qr_code': session.qr_code,
        'entry_time': session.entry_time.isoformat() if session.entry_time else None,
        'exit_time': session.exit_time.isoformat() if session.exit_time else None,
        'entry_qr_scanned': session.entry_qr_scanned,
        'exit_qr_scanned': session.exit_qr_scanned,
        'amount_paid': float(session.amount_paid),
        'payment_method': session.payment_method,
        'is_paid': session.is_paid,
        'status': status,
        'duration_minutes': duration_minutes,
        'created_at': session.created_at.isoformat(),
        'updated_at': session.updated_at.isoformat()
    }


# ============================================
# BULK SERIALIZERS
# ============================================

def serialize_zones_list(zones):
    """
    Serialize list of ParkingZone objects
    
    Args:
        zones: QuerySet of ParkingZone objects
    
    Returns:
        list: List of serialized zone data
    """
    return [serialize_parking_zone(zone) for zone in zones]


def serialize_slots_list(slots):
    """
    Serialize list of ParkingSlot objects
    
    Args:
        slots: QuerySet of ParkingSlot objects
    
    Returns:
        list: List of serialized slot data
    """
    return [serialize_parking_slot(slot) for slot in slots]


def serialize_vehicles_list(vehicles):
    """
    Serialize list of Vehicle objects
    
    Args:
        vehicles: QuerySet of Vehicle objects
    
    Returns:
        list: List of serialized vehicle data
    """
    return [serialize_vehicle(vehicle) for vehicle in vehicles]


def serialize_sessions_list(sessions):
    """
    Serialize list of ParkingSession objects
    
    Args:
        sessions: QuerySet of ParkingSession objects
    
    Returns:
        list: List of serialized session data
    """
    return [serialize_parking_session(session) for session in sessions]


# ============================================
# RESPONSE FORMATTERS
# ============================================

def format_success_response(message, data=None):
    """
    Format successful API response
    
    Args:
        message: Success message
        data: Optional data to include
    
    Returns:
        dict: Formatted response
    """
    response = {
        'success': True,
        'message': message
    }
    
    if data is not None:
        response.update(data)
    
    return response


def format_error_response(message, error_code=None):
    """
    Format error API response
    
    Args:
        message: Error message
        error_code: Optional error code
    
    Returns:
        dict: Formatted error response
    """
    response = {
        'success': False,
        'message': message
    }
    
    if error_code:
        response['error_code'] = error_code
    
    return response


# ============================================
# VALIDATION HELPERS
# ============================================

def validate_required_fields(data, required_fields):
    """
    Validate that all required fields are present in data
    
    Args:
        data: Dictionary of input data
        required_fields: List of required field names
    
    Returns:
        tuple: (is_valid, missing_fields)
    """
    missing_fields = []
    
    for field in required_fields:
        if field not in data or not data[field]:
            missing_fields.append(field)
    
    return len(missing_fields) == 0, missing_fields


def validate_choice_field(value, choices):
    """
    Validate that value is in allowed choices
    
    Args:
        value: Value to validate
        choices: List of allowed choices
    
    Returns:
        bool: True if valid choice
    """
    return value in choices