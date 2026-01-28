import os
import django
from django.utils import timezone

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

from backend_core_api.models import ParkingSession, Slot, Zone

def final_sync():
    print("--- Finalizing Slot Sync ---")
    
    # 1. Find the pending active vehicle
    session = ParkingSession.objects.filter(vehicle_number='UP-05-IJ-7890', status='active').first()
    if session and not session.slot:
        # Assign a free slot in Zone A
        slot = Slot.objects.filter(zone=session.zone, is_occupied=False).first()
        if slot:
            session.slot = slot
            session.save()
            slot.is_occupied = True
            slot.save()
            print(f"Assigned slot {slot.slot_number} to UP-05-IJ-7890")
            
    # 2. Re-verify all active sessions have occupied slots
    active = ParkingSession.objects.filter(status='active')
    for s in active:
        if s.slot:
            if not s.slot.is_occupied:
                s.slot.is_occupied = True
                s.slot.save()
                print(f"Force-occupied slot {s.slot.slot_number} for {s.vehicle_number}")

    print("--- Sync Complete ---")

if __name__ == '__main__':
    final_sync()
