#!/usr/bin/env python
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

from backend_core_api.models import ParkingZone, ParkingSlot

def create_test_data():
    print("Creating test data...")
    
    # Create zones
    zone_a, created = ParkingZone.objects.get_or_create(
        name="Zone A",
        defaults={'hourly_rate': 50, 'is_active': True}
    )
    
    zone_b, created = ParkingZone.objects.get_or_create(
        name="Zone B", 
        defaults={'hourly_rate': 60, 'is_active': True}
    )
    
    print(f"Created zones: {zone_a.name}, {zone_b.name}")
    
    # Create slots for Zone A
    for i in range(1, 21):
        ParkingSlot.objects.get_or_create(
            zone=zone_a,
            slot_number=f"A{i:03d}"
        )
    
    # Create slots for Zone B  
    for i in range(1, 16):
        ParkingSlot.objects.get_or_create(
            zone=zone_b,
            slot_number=f"B{i:03d}"
        )
    
    print("Test data created successfully!")
    print(f"Zone A: {zone_a.slots.count()} slots")
    print(f"Zone B: {zone_b.slots.count()} slots")

if __name__ == '__main__':
    create_test_data()