import os
import django
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

from rest_framework.test import APIRequestFactory
from backend_core_api.views import ParkingSessionViewSet
from backend_core_api.models import Zone, Slot, ParkingSession

def test_entry():
    print("Starting Entry Test...")
    try:
        zone = Zone.objects.first()
        if not zone:
            print("No zones found! Seeding needed?")
            return

        print(f"Using Zone: {zone.name}, Base Price: {zone.base_price} (Type: {type(zone.base_price)})")
        
        factory = APIRequestFactory()
        view = ParkingSessionViewSet.as_view({'post': 'scan_entry'})
        
        # Simulate the request exactly as frontend sends it
        # Frontend: vehicleNumber, zoneId, initial_amount
        data = {
            'vehicle_number': 'MP 41 NG 4850',
            'zone_id': zone.id,
            'initial_amount': '100.00' # Frontend sends this as STRING from input
        }
        
        request = factory.post('/api/core/sessions/scan-entry/', data, format='json')
        response = view(request)
        
        print(f"Response Status: {response.status_code}")
        print(f"Response Data: {response.data}")
        
    except Exception as e:
        print(f"CRASHED: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_entry()
