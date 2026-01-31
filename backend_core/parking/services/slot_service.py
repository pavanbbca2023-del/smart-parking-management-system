"""
SLOT SERVICE - SIMPLE VERSION
=============================
Handle all parking slot operations
Easy to understand - every step commented!
"""

from django.utils import timezone
from ..models import ParkingSlot, ParkingSession
import uuid


# ========== FUNCTION 1: ALLOCATE SLOT ==========

def allocate_slot(vehicle, zone):
    """
    Find and allocate a free parking slot
    
    Arguments:
        vehicle: Vehicle object
        zone: ParkingZone object
    
    Returns:
        ParkingSession object (parking session created)
        None (if no slots available)
    """
    
    # STEP 1: Find first available slot in this zone
    # Available = is_occupied is False
    available_slot = ParkingSlot.objects.filter(
        zone=zone,
        is_occupied=False  # This slot is FREE
    ).first()
    
    # STEP 2: Check if we found a slot
    if available_slot is None:
        # No free slots available
        return None
    
    # STEP 3: Mark this slot as OCCUPIED
    available_slot.is_occupied = True
    available_slot.save()
    
    # STEP 4: Create parking session with unique QR code
    # QR code is automatically generated to ensure uniqueness
    # entry_time is auto set by Django
    # exit_time stays NULL (vehicle still parked)
    session = ParkingSession.objects.create(
        vehicle=vehicle,
        slot=available_slot,
        zone=zone,
        qr_code="QR-" + str(uuid.uuid4())[:12]
    )
    
    # STEP 6: Return the new session
    return session


# ========== FUNCTION 2: CLOSE SESSION ==========

def close_session(session):
    """
    Set exit time when vehicle leaves
    
    Arguments:
        session: ParkingSession object
    
    Returns:
        session (updated session object)
    """
    
    # STEP 1: Set exit time to NOW
    session.exit_time = timezone.now()
    
    # STEP 2: Save the session
    session.save()
    
    # STEP 3: Return the updated session
    return session


# ========== FUNCTION 3: RELEASE SLOT ==========

def release_slot(session):
    """
    Mark parking slot as FREE after vehicle exits
    
    Arguments:
        session: ParkingSession object
    
    Returns:
        True (success)
        False (if slot not found or already free)
    """
    
    # STEP 1: Get the parking slot from session
    slot = session.slot
    
    # STEP 2: Check if slot exists (safety check)
    # In case slot was deleted but session exists
    if slot is None:
        return False
    
    # STEP 3: Check if slot is actually marked as occupied
    # Safety check: only free slots that are occupied
    if not slot.is_occupied:
        return False
    
    # STEP 4: Mark slot as NOT occupied
    slot.is_occupied = False
    slot.save()
    
    # STEP 5: Return success
    return True


# ========== FUNCTION 4: GET ZONE OCCUPANCY ==========

def get_zone_occupancy_status(zone):
    """
    Get how many slots are occupied in a zone
    
    Arguments:
        zone: ParkingZone object
    
    Returns:
        Dictionary with occupancy info:
        {
            'total_slots': 50,
            'occupied_slots': 12,
            'available_slots': 38,
            'occupancy_percent': 24.0
        }
    """
    
    # STEP 1: Count total slots in this zone
    total_slots = ParkingSlot.objects.filter(zone=zone).count()
    
    # STEP 2: Count occupied slots in this zone
    occupied_slots = ParkingSlot.objects.filter(
        zone=zone,
        is_occupied=True  # Count only occupied ones
    ).count()
    
    # STEP 3: Calculate available slots
    available_slots = total_slots - occupied_slots
    
    # STEP 4: Calculate occupancy percentage
    if total_slots > 0:
        # Formula: (occupied / total) * 100
        occupancy_percent = (occupied_slots / total_slots) * 100
    else:
        # No slots at all
        occupancy_percent = 0
    
    # STEP 5: Return occupancy information
    return {
        'total_slots': total_slots,
        'occupied_slots': occupied_slots,
        'available_slots': available_slots,
        'occupancy_percent': occupancy_percent
    }
