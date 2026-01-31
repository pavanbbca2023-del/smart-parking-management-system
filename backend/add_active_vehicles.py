import os
import django
from django.utils import timezone

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

from backend_core_api.models import ParkingSession, Slot, Zone

def add_active():
    print("--- Adding Active Vehicles ---")
    
    zone_a = Zone.objects.filter(name='Zone A').first()
    if not zone_a:
        print("Zone A not found!")
        return

    vehicles = ['DL-10-XY-9999', 'MH-12-PQ-5555', 'KA-01-ZZ-1111']
    
    for v_num in vehicles:
        # Check if already exists as active
        if ParkingSession.objects.filter(vehicle_number=v_num, status='active').exists():
            print(f"Vehicle {v_num} is already parked.")
            continue
            
        slot = Slot.objects.filter(zone=zone_a, is_occupied=False).first()
        if slot:
            ParkingSession.objects.create(
                vehicle_number=v_num,
                zone=zone_a,
                slot=slot,
                status='active'
            )
            slot.is_occupied = True
            slot.save()
            print(f"Parked: {v_num} in {slot.slot_number}")
        else:
            print("No free slots in Zone A!")

    print("--- Simulation Complete ---")

if __name__ == '__main__':
    add_active()
