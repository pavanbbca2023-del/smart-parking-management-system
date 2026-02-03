#!/usr/bin/env python
import os
import sys
import django
from decimal import Decimal

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

from backend_core_api.models import Zone

def fix_zone_pricing_logic():
    # Update Zone A to 100 rupees
    zone_a = Zone.objects.filter(name__icontains="Zone A").first()
    if zone_a:
        zone_a.base_price = Decimal('100.00')
        zone_a.save()
        print(f"Updated {zone_a.name}: Rs.{zone_a.base_price}")
    
    # Show all zones
    print("\nAll Zones:")
    for zone in Zone.objects.all():
        print(f"{zone.name}: Rs.{zone.base_price}")

if __name__ == '__main__':
    fix_zone_pricing_logic()