import os
import django
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

from rest_framework.test import APIRequestFactory
from backend_core_api.views import ParkingSessionViewSet
from backend_core_api.models import Zone, Slot, ParkingSession

def test_exit():
    print("Starting Exit Test...")
    try:
        # 1. Setup: Create an active session
        zone = Zone.objects.first()
        slot = Slot.objects.filter(zone=zone, is_occupied=False).first()
        if not slot:
            print("No slots available, creating one...")
            slot = Slot.objects.create(zone=zone, slot_number="DEBUG-01")
            
        vehicle_num = "MH-TEST-EXIT-01"
        
        # Clean up old test data
        ParkingSession.objects.filter(vehicle_number=vehicle_num).delete()
        
        session = ParkingSession.objects.create(
            vehicle_number=vehicle_num,
            zone=zone,
            slot=slot,
            status='active',
            initial_amount_paid=20.00
        )
        print(f"Created Active Session: ID {session.id} for {vehicle_num}")
        
        # 2. Test Scan Exit
        factory = APIRequestFactory()
        view = ParkingSessionViewSet.as_view({'post': 'scan_exit'})
        
        # Payload similar to frontend
        data = {
            'vehicle_number': vehicle_num
        }
        
        print(f"Sending Exit Request: {data}")
        request = factory.post('/api/core/sessions/scan-exit/', data, format='json')
        response = view(request)
        
        print(f"Response Status: {response.status_code}")
        print(f"Response Data: {response.data}")
        
    except Exception as e:
        print(f"CRASHED: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_exit()
