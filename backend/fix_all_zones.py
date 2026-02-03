#!/usr/bin/env python
import os
import sys
import django
from decimal import Decimal

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

from backend_core_api.models import Zone, Slot

def fix_all_zones():
    print("=== FIXING ALL ZONES ===\n")
    
    zones = Zone.objects.all()
    for zone in zones:
        print(f"Zone: {zone.name}")
        print(f"Current - Price: Rs.{zone.base_price}, Capacity: {zone.total_slots}")
        
        # Fix Zone C pricing
        if "Zone C" in zone.name and zone.base_price != Decimal('60.00'):
            zone.base_price = Decimal('60.00')
            print(f"Updated price to Rs.60.00")
        
        # Fix capacity if 0
        if zone.total_slots == 0:
            if "Zone A" in zone.name:
                zone.total_slots = 100
            elif "Zone B" in zone.name:
                zone.total_slots = 75
            elif "Zone C" in zone.name:
                zone.total_slots = 50
            print(f"Updated capacity to {zone.total_slots}")
        
        zone.save()
        
        # Create slots if missing
        existing_slots = zone.slots.count()
        if existing_slots < zone.total_slots:
            for i in range(existing_slots + 1, zone.total_slots + 1):
                slot_number = f"{zone.name[5]}{i:03d}"  # A001, B001, C001
                Slot.objects.get_or_create(
                    zone=zone,
                    slot_number=slot_number
                )
            print(f"Created {zone.total_slots - existing_slots} slots")
        
        print(f"Final - Price: Rs.{zone.base_price}, Capacity: {zone.total_slots}")
        print()

if __name__ == '__main__':
    fix_all_zones()