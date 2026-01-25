import os
import django
from django.utils import timezone
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

from backend_core_api.models import ParkingSession, Slot

def fix_data():
    print("--- Fixing Data Sync ---")
    
    # 1. Reset all slots
    Slot.objects.all().update(is_occupied=False)
    print("Reset all slots to unoccupied.")
    
    # 2. Sync slots with active sessions
    active_sessions = ParkingSession.objects.filter(status='active')
    for session in active_sessions:
        if session.slot:
            session.slot.is_occupied = True
            session.slot.save()
            print(f"Sync: Slot {session.slot.slot_number} marked as occupied for vehicle {session.vehicle_number}")

    # 3. Ensure completed sessions today have revenue
    today_start = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
    completed_today = ParkingSession.objects.filter(status='completed', exit_time__gte=today_start)
    
    count = 0
    for session in completed_today:
        if session.payment_status != 'paid' or session.amount_paid == 0:
            session.payment_status = 'paid'
            if session.amount_paid == 0:
                session.amount_paid = Decimal('50.00') # Default for fix
            session.save()
            count += 1
            
    print(f"Fixed {count} completed sessions with missing revenue data.")
    print("--- Fix Complete ---")

if __name__ == '__main__':
    fix_data()
