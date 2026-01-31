"""
BILLING SERVICE - SIMPLE VERSION
================================
Calculate parking bills
Easy to understand - every step commented!
"""

from decimal import Decimal
import math


# ========== BILLING RULES (Easy to modify!) ==========

# First 10 minutes of parking are FREE
FREE_MINUTES = 10

# After free time, first hour costs ₹40
FIRST_HOUR_RATE = 40

# Each additional hour costs ₹20
EXTRA_HOUR_RATE = 20


# ========== FUNCTION 1: CALCULATE BILL ==========

def calculate_bill(session):
    """
    Calculate parking bill for a session
    
    Billing Rules:
    - First 10 minutes: FREE (₹0)
    - Next 50 minutes (total 0-60 min): ₹40
    - Every extra hour: ₹20
    
    Examples:
    - 5 minutes = ₹0 (FREE)
    - 15 minutes = ₹40 (₹40 for first hour)
    - 65 minutes = ₹60 (₹40 + ₹20 extra)
    - 2 hours 30 min = ₹80 (₹40 + ₹20 + ₹20)
    
    Arguments:
        session: ParkingSession object
    
    Returns:
        Bill amount as Decimal (in rupees)
    """
    
    # STEP 1: Check if vehicle has exited
    if session.exit_time is None:
        # Vehicle still parked, no bill yet
        return Decimal('0')
    
    # STEP 2: Calculate how long vehicle was parked
    time_parked = session.exit_time - session.entry_time
    total_seconds = time_parked.total_seconds()
    
    # STEP 3: Convert seconds to minutes
    total_minutes = total_seconds / 60
    
    # STEP 4: Check if within free parking time
    if total_minutes <= FREE_MINUTES:
        # Less than or equal to 10 minutes, no charge! FREE parking
        return Decimal('0')
    
    # STEP 5: Calculate billable minutes (subtract free time)
    billable_minutes = total_minutes - FREE_MINUTES
    
    # STEP 6: Convert billable minutes to hours
    billable_hours = billable_minutes / 60
    
    # STEP 7: Calculate bill
    # Formula:
    # - If <= 1 hour: ₹40
    # - If > 1 hour: ₹40 + (₹20 × extra hours, rounded up)
    
    if billable_hours <= 1:
        # Within first hour after free time
        bill_amount = Decimal(str(FIRST_HOUR_RATE))
    else:
        # More than 1 hour
        # Start with first hour charge
        bill_amount = Decimal(str(FIRST_HOUR_RATE))
        
        # Calculate extra hours beyond the first hour
        extra_hours = billable_hours - 1
        
        # Round UP (if 1.1 hours extra, charge for 2 hours)
        extra_hours_rounded = math.ceil(extra_hours)
        
        # Add ₹20 per extra hour
        extra_charge = Decimal(str(EXTRA_HOUR_RATE * extra_hours_rounded))
        bill_amount = bill_amount + extra_charge
    
    # STEP 8: Return the final bill amount
    return bill_amount


# ========== FUNCTION 2: SAVE BILL TO SESSION ==========

def save_bill_to_session(session, amount):
    """
    Save the bill amount to the parking session
    
    Arguments:
        session: ParkingSession object
        amount: Bill amount (float or Decimal)
    
    Returns:
        Updated ParkingSession object
        None if amount is invalid
    """
    
    # STEP 1: Convert amount to Decimal for safe calculations
    bill_amount = Decimal(str(amount))
    
    # STEP 2: Validate amount is NOT negative (safety check)
    # This should never happen, but protect against bugs
    if bill_amount < Decimal('0'):
        return None
    
    # STEP 3: Set the amount paid
    session.amount_paid = bill_amount
    
    # STEP 4: Mark session as paid (only if amount > 0)
    # If amount is 0 (free parking), still mark as paid
    session.is_paid = True
    
    # STEP 5: Save to database
    session.save()
    
    # STEP 6: Return the updated session
    return session


# ========== FUNCTION 3: GET BILL DETAILS ==========

def get_bill_details(session):
    """
    Get all bill details for a parking session
    
    Arguments:
        session: ParkingSession object
    
    Returns:
        Dictionary with all bill information
    """
    
    # STEP 1: Calculate total duration
    if session.exit_time is None:
        # Vehicle still parked
        duration = None
        hours = 0
        minutes = 0
    else:
        # Vehicle has exited
        duration = session.exit_time - session.entry_time
        total_seconds = duration.total_seconds()
        
        # STEP 2: Convert to hours and minutes
        hours = int(total_seconds // 3600)      # Hours
        minutes = int((total_seconds % 3600) // 60)  # Remaining minutes
    
    # STEP 3: Get vehicle information
    vehicle_number = session.vehicle.vehicle_number
    
    # STEP 4: Get zone information
    zone_name = session.zone.name
    
    # STEP 5: Get payment information
    entry_time = session.entry_time
    exit_time = session.exit_time
    amount_paid = session.amount_paid
    is_paid = session.is_paid
    
    # STEP 6: Build details dictionary
    bill_details = {
        'duration_hours': hours,
        'duration_minutes': minutes,
        'vehicle_number': vehicle_number,
        'zone_name': zone_name,
        'entry_time': entry_time,
        'exit_time': exit_time,
        'amount_paid': amount_paid,
        'is_paid': is_paid
    }
    
    # STEP 7: Return all details
    return bill_details
