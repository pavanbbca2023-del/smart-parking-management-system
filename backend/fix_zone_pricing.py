#!/usr/bin/env python
import os
import sys
import django
from decimal import Decimal

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

from backend_core_api.models import Zone

def fix_zone_pricing():
    print("=== ZONE PRICING CHECK ===\n")
    
    # Check all zones
    zones = Zone.objects.all()
    for zone in zones:
        print(f"Zone: {zone.name}")
        print(f"Current Price: Rs.{zone.base_price}")
        
        if zone.name == "Zone A" and zone.base_price != Decimal('100.00'):
            zone.base_price = Decimal('100.00')
            zone.save()
            print(f"Updated to: Rs.{zone.base_price}")
        print()

if __name__ == '__main__':
    fix_zone_pricing()