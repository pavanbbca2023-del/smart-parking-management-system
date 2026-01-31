"""
============================================
PARKING MANAGEMENT SYSTEM - VIEWS
============================================
Simple and beginner-friendly view functions
All complex logic is in utils.py
Views just call utility functions and return results
============================================
"""

from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_protect
from django.utils import timezone
import logging

# Import models
from .models import ParkingZone, ParkingSession

# Import utility functions that contain all business logic
from .utils import (
    allocate_slot,
    scan_entry_qr,
    scan_exit_qr,
    cancel_parking_session,
    calculate_refund
)


# ============================================
# VIEW 1: VEHICLE ENTRY (STEP 1)
# ============================================

@require_http_methods(["GET", "POST"])
def vehicle_entry_view(request):
    """
    Vehicle Entry View
    
    GET: Display entry form with available zones
    POST: Process vehicle entry and allocate parking slot
    
    Process:
    1. User enters vehicle number and selects zone
    2. System finds first available slot
    3. Slot is marked as occupied
    4. Parking session is created with QR code
    5. Return QR code and slot number to user
    """
    
    # GET REQUEST: Show entry form
    if request.method == "GET":
        # Get all active parking zones
        zones = ParkingZone.objects.filter(is_active=True)
        
        return render(request, 'parking/entry.html', {
            'zones': zones
        })
    
    # POST REQUEST: Process vehicle entry
    if request.method == "POST":
        # Get form data
        vehicle_number = request.POST.get("vehicle_number", "").strip()
        owner_name = request.POST.get("owner_name", "").strip()
        zone_id = request.POST.get("zone_id", "").strip()
        
        # Validate input
        if not vehicle_number or not zone_id:
            return JsonResponse({
                'success': False,
                'message': 'Vehicle number and zone are required'
            })
        
        # Call utility function to allocate slot with error handling
        try:
            result = allocate_slot(vehicle_number, owner_name, zone_id)
            return JsonResponse(result)
        except Exception as e:
            logging.error(f"Error in vehicle entry: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': 'System error occurred. Please try again.',
                'data': None
            })


# ============================================
# VIEW 2: QR ENTRY SCAN (STEP 2)
# ============================================

@require_http_methods(["GET", "POST"])
def qr_entry_scan_view(request):
    """
    Entry QR Scan View
    
    GET: Display QR scanning form
    POST: Process entry QR scan
    
    Process:
    1. User scans QR code at entry gate
    2. System finds parking session with this QR code
    3. Entry time is recorded
    4. Entry QR scanned flag is set to True (prevents double scan)
    5. Refund is locked permanently
    6. Return confirmation to user
    """
    
    # GET REQUEST: Show scanning form
    if request.method == "GET":
        return render(request, 'parking/entry_scan.html')
    
    # POST REQUEST: Process QR scan
    if request.method == "POST":
        # Get QR code from request
        qr_code = request.POST.get("qr_code", "").strip()
        
        # Validate input
        if not qr_code:
            return JsonResponse({
                'success': False,
                'message': 'QR code is required'
            })
        
        # Call utility function to scan entry QR with error handling
        try:
            result = scan_entry_qr(qr_code)
            return JsonResponse(result)
        except Exception as e:
            logging.error(f"Error in entry QR scan: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': 'QR scan failed. Please try again.',
                'data': None
            })


# ============================================
# VIEW 3: QR EXIT SCAN (STEP 3)
# ============================================

@require_http_methods(["GET", "POST"])
def qr_exit_scan_view(request):
    """
    Exit QR Scan View
    
    GET: Display exit form
    POST: Process exit QR scan and calculate bill
    
    Process:
    1. User scans QR code at exit gate
    2. System verifies entry QR was already scanned
    3. Exit time is recorded
    4. Parking amount is calculated based on duration
    5. Payment method is recorded (CASH/ONLINE)
    6. Slot is released (marked as available)
    7. Bill is returned to user
    """
    
    # GET REQUEST: Show exit form
    if request.method == "GET":
        return render(request, 'parking/exit.html')
    
    # POST REQUEST: Process vehicle exit
    if request.method == "POST":
        # Get form data
        qr_code = request.POST.get("qr_code", "").strip()
        payment_method = request.POST.get("payment_method", "").strip()
        
        # Validate input
        if not qr_code or not payment_method:
            return JsonResponse({
                'success': False,
                'message': 'QR code and payment method are required'
            })
        
        # Validate payment method
        if payment_method not in ['CASH', 'ONLINE']:
            return JsonResponse({
                'success': False,
                'message': 'Invalid payment method. Use CASH or ONLINE'
            })
        
        # Call utility function to process exit with error handling
        try:
            result = scan_exit_qr(qr_code, payment_method)
            return JsonResponse(result)
        except Exception as e:
            logging.error(f"Error in exit QR scan: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': 'Exit processing failed. Please contact support.',
                'data': None
            })


# ============================================
# VIEW 4: CANCEL BOOKING
# ============================================

@csrf_protect
@require_http_methods(["POST"])
def cancel_booking_view(request):
    """
    Cancel Parking Booking View
    
    POST: Cancel a parking booking and process refund
    
    Process:
    1. User provides QR code of booking to cancel
    2. System checks if entry was done
    3. If no entry: Apply grace period rules
       - Within 5 min: 100% refund eligible
       - After 5 min: 0% refund
    4. If entry done: No refund allowed
    5. Slot is released
    6. Return refund details to user
    """
    
    # Get form data
    qr_code = request.POST.get("qr_code", "").strip()
    
    # Validate input
    if not qr_code:
        return JsonResponse({
            'success': False,
            'message': 'QR code is required'
        })
    
    # Call utility function to cancel booking with error handling
    try:
        result = cancel_parking_session(qr_code)
        return JsonResponse(result)
    except Exception as e:
        logging.error(f"Error in booking cancellation: {str(e)}")
        return JsonResponse({
            'success': False,
            'message': 'Cancellation failed. Please contact support.',
            'data': None
        })


# ============================================
# VIEW 5: CHECK ZONE STATUS (Optional)
# ============================================

@require_http_methods(["GET"])
def zone_status_view(request, zone_id):
    """
    Zone Status View - Optional
    
    Shows current status of a parking zone
    
    Returns:
    - Total slots available
    - Number of occupied slots
    - Number of free slots
    - Occupancy percentage
    """
    
    try:
        # Get the zone
        zone = ParkingZone.objects.get(id=zone_id)
        
        # Get total slots in zone
        total_slots = zone.slots.count()
        
        # Get occupied slots
        occupied_slots = zone.slots.filter(is_occupied=True).count()
        
        # Calculate available slots
        available_slots = total_slots - occupied_slots
        
        # Calculate occupancy percentage
        if total_slots > 0:
            occupancy_percent = (occupied_slots / total_slots) * 100
        else:
            occupancy_percent = 0
        
        # Return status
        return JsonResponse({
            'success': True,
            'zone_name': zone.name,
            'total_slots': total_slots,
            'occupied_slots': occupied_slots,
            'available_slots': available_slots,
            'occupancy_percent': round(occupancy_percent, 2),
            'hourly_rate': str(zone.hourly_rate)
        })
    
    except ParkingZone.DoesNotExist:
        return JsonResponse({
            'success': False,
            'message': 'Zone not found'
        })
