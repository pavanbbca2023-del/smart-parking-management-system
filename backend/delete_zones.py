#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

from backend_core_api.models import Zone

def delete_zones():
    zones_to_delete = ['Zone D', 'Zone E']
    
    for zone_name in zones_to_delete:
        try:
            zone = Zone.objects.filter(name=zone_name).first()
            if zone:
                # Delete all slots in this zone first
                slots_count = zone.slots.count()
                zone.slots.all().delete()
                # Delete the zone
                zone.delete()
                print(f"✅ Deleted {zone_name} and {slots_count} slots")
            else:
                print(f"❌ {zone_name} not found")
        except Exception as e:
            print(f"❌ Error deleting {zone_name}: {e}")
    
    print("\n=== Remaining Zones ===")
    for zone in Zone.objects.all():
        print(f"- {zone.name}: {zone.slots.count()} slots")

if __name__ == '__main__':
    delete_zones()
