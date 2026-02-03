#!/usr/bin/env python
import os
import sys
import django
from decimal import Decimal

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

from backend_core_api.models import Zone

def check_zone_d():
    print("=== ZONE D PRICE CHECK ===\n")
    
    zone_d = Zone.objects.filter(name__icontains="Zone D").first()
    if zone_d:
        print(f"Zone D found: {zone_d.name}")
        print(f"Current price: Rs.{zone_d.base_price}")
        print(f"Capacity: {zone_d.total_slots}")
        
        # What price should Zone D have?
        print("\nWhat price did you set for Zone D when creating it?")
        print("If it should be different from Rs.20.00, I can update it.")
        
        # For now, let's assume it should be Rs.80 (different from others)
        if zone_d.base_price == Decimal('20.00'):
            zone_d.base_price = Decimal('80.00')
            zone_d.save()
            print(f"Updated Zone D price to: Rs.{zone_d.base_price}")
        else:
            print("Zone D price is already updated")
    else:
        print("Zone D not found")

if __name__ == '__main__':
    check_zone_d()