"""
PARKING MANAGEMENT SYSTEM - Views
==================================
Simple and beginner-friendly view functions
Uses simple service functions (not complex patterns)
Easy to read and understand
"""

from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone

# Import models
from .models import Vehicle, ParkingZone, ParkingSession, ParkingSlot

# Import simple service functions
from .services.slot_service import allocate_slot, release_slot, close_session, get_zone_occupancy_status
from .services.billing_service import calculate_bill, save_bill_to_session, get_bill_details
from .services.qr_service import generate_qr, validate_qr_code

# Import simple validator functions
from .validators.session_validator import validate_vehicle_entry, is_session_active, validate_session_exit


# ========== VEHICLE ENTRY VIEW ==========

@csrf_exempt  # Disable CSRF for testing (enable in production!)
@require_http_methods(["GET", "POST"])
def vehicle_entry(request):
    """
    STEP 1: Vehicle enters parking zone
    
    GET: Show list of available zones
    POST: Process vehicle entry
    """
    
    # ===== GET REQUEST: Show entry form with zones =====
    if request.method == "GET":
        # Get all active parking zones
        zones = ParkingZone.objects.filter(is_active=True)
        
        return render(request, 'parking/entry.html', {
            'zones': zones
        })
    
    # ===== POST REQUEST: Process vehicle entry =====
    if request.method == "POST":
        # STEP 1: Get input from user
        vehicle_number = request.POST.get("vehicle_number", "").strip()
        zone_id = request.POST.get("zone_id", "").strip()
        
        # STEP 2: Validate input using validator function
        is_valid, error_message = validate_vehicle_entry(vehicle_number, zone_id)
        
        if not is_valid:
            return JsonResponse({
                'success': False,
                'message': error_message
            })
        
        # STEP 3: Get the zone
        zone = ParkingZone.objects.get(id=zone_id)
        
        # STEP 4: Get or create vehicle
        vehicle, created = Vehicle.objects.get_or_create(
            vehicle_number=vehicle_number
        )
        
        # STEP 5: Allocate slot using service function
        # This will:
        # - Find a free slot
        # - Mark it as occupied
        # - Create a parking session with unique QR code
        session = allocate_slot(vehicle, zone)
        
        # STEP 6: Check if slot was allocated
        # Returns None if no free slots available
        if session is None:
            return JsonResponse({
                'success': False,
                'message': f'No free slots available in {zone.name}'
            })
        
        # STEP 7: Return success response with session details
        return JsonResponse({
            'success': True,
            'message': 'Vehicle entry successful!',
            'session_id': str(session.id),
            'qr_code': session.qr_code,
            'slot_number': session.slot.slot_number,
            'zone_name': zone.name,
            'entry_time': session.entry_time.isoformat(),
            'hourly_rate': str(zone.hourly_rate)
        })


# ========== VEHICLE EXIT VIEW ==========

@csrf_exempt  # Disable CSRF for testing (enable in production!)
@require_http_methods(["GET", "POST"])
def vehicle_exit(request):
    """
    STEP 2: Vehicle exits parking zone
    
    GET: Show exit form
    POST: Process vehicle exit and calculate bill
    """
    
    # ===== GET REQUEST: Show exit form =====
    if request.method == "GET":
        return render(request, 'parking/exit.html')
    
    # ===== POST REQUEST: Process vehicle exit =====
    if request.method == "POST":
        # STEP 1: Get QR code from user
        qr_code = request.POST.get("qr_code", "").strip()
        
        # STEP 2: Validate QR code using validator function
        is_valid, error_message, session = validate_session_exit(qr_code)
        
        if not is_valid:
            return JsonResponse({
                'success': False,
                'message': error_message
            })
        
        # STEP 3: Close session (set exit time to NOW)
        session = close_session(session)
        
        # STEP 4: Calculate bill amount based on parking duration
        amount_to_pay = calculate_bill(session)
        
        # STEP 5: Save bill to database and mark session as paid
        bill_result = save_bill_to_session(session, amount_to_pay)
        
        # STEP 5a: Check if bill was saved successfully
        if bill_result is None:
            return JsonResponse({
                'success': False,
                'message': 'Error calculating bill amount'
            })
        
        # STEP 6: Release the parking slot (mark as free)
        is_released = release_slot(session)
        
        # STEP 6a: Check if slot was released successfully
        if not is_released:
            return JsonResponse({
                'success': False,
                'message': 'Error releasing parking slot'
            })
        
        # STEP 7: Get complete bill details using service function
        bill_details = get_bill_details(session)
        
        # STEP 8: Return bill to user
        return JsonResponse({
            'success': True,
            'message': 'Vehicle exit successful!',
            'vehicle_number': bill_details['vehicle_number'],
            'zone_name': bill_details['zone_name'],
            'parking_duration': f"{bill_details['duration_hours']}h {bill_details['duration_minutes']}m",
            'amount_to_pay': str(bill_details['amount_paid']),
            'status': 'Paid'
        })


# ========== ZONE STATUS VIEW ==========

@require_http_methods(["GET"])
def zone_status(request, zone_id):
    """
    Get current occupancy status of a parking zone
    
    Shows:
    - Total slots
    - Occupied slots
    - Available slots
    - Occupancy percentage
    """
    
    # STEP 1: Find the zone
    try:
        zone = ParkingZone.objects.get(id=zone_id)
    except ParkingZone.DoesNotExist:
        return JsonResponse({
            'success': False,
            'message': 'Zone not found'
        })
    
    # STEP 2: Get zone occupancy status using service function
    status = get_zone_occupancy_status(zone)
    
    # STEP 3: Return status with all details
    return JsonResponse({
        'success': True,
        'zone_name': zone.name,
        'total_slots': status['total_slots'],
        'occupied_slots': status['occupied_slots'],
        'available_slots': status['available_slots'],
        'occupancy_percent': round(status['occupancy_percent'], 2),
        'hourly_rate': str(zone.hourly_rate),
        'is_active': zone.is_active
    })
