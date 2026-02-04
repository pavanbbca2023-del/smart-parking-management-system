
import os
import django
import sys

# Setup Django environment
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

from backend_core_api.models import Slot, ParkingSession

def fix_slots():
    print("--- Fixing Slot Status ---")
    
    # 1. Reset all slots first (optional, but cleaner)
    # Be careful not to reset occupied slots if we don't track them perfectly map-wise
    # Safe approach: Iterate active sessions and ensure slot is reserved.
    
    sessions = ParkingSession.objects.filter(status__in=['active', 'reserved', 'pending_payment'])
    count = 0
    for sess in sessions:
        if sess.slot:
            if not sess.slot.is_reserved and not sess.slot.is_occupied:
                print(f"Fixing Slot {sess.slot.slot_number} for Session {sess.id} ({sess.status})")
                sess.slot.is_reserved = True
                sess.slot.save()
                count += 1
    
    print(f"Fixed {count} slots.")

if __name__ == "__main__":
    fix_slots()
