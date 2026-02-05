
import os
import django
import sys

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

from backend_core_api.models import Slot, ParkingSession

def fix_ghost_slots():
    print("🔍 Starting Slot Audit...")
    
    slots = Slot.objects.filter(is_active=True)
    fixed_count = 0
    
    for slot in slots:
        # Skip fully available slots
        if not slot.is_occupied and not slot.is_reserved:
            continue
            
        print(f"Checking Slot {slot.slot_number} ({'Occupied' if slot.is_occupied else 'Reserved'})...")
        
        # Check for any active/reserved/pending session for this slot
        active_session = ParkingSession.objects.filter(
            slot=slot,
            status__in=['active', 'reserved', 'pending_payment']
        ).first()
        
        if active_session:
            print(f"  ✅ Valid Session found: {active_session.vehicle_number} ({active_session.status})")
        else:
            print(f"  ❌ NO VALID SESSION! Resetting slot...")
            slot.is_occupied = False
            slot.is_reserved = False
            slot.save()
            fixed_count += 1
            
    print(f"\n✨ Audit Complete. Fixed {fixed_count} ghost slots.")

if __name__ == '__main__':
    fix_ghost_slots()
