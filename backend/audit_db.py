import os
import django
from django.utils import timezone

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

from backend_core_api.models import Zone, Slot, ParkingSession, User

def audit_db():
    print("--- Database Audit ---")
    print(f"Users: {User.objects.count()}")
    print(f"Zones: {Zone.objects.count()}")
    print(f"Slots: {Slot.objects.count()}")
    print(f"Parking Sessions: {ParkingSession.objects.count()}")
    
    sessions = ParkingSession.objects.all()
    for s in sessions:
        print(f"Session ID: {s.id}, Vehicle: {s.vehicle_number}, Status: {s.status}, Payment: {s.payment_status}, Entry: {s.entry_time}, Exit: {s.exit_time}")

    print("--- Summary by Status ---")
    active = sessions.filter(status='active').count()
    completed = sessions.filter(status='completed').count()
    print(f"Active: {active}, Completed: {completed}")

if __name__ == '__main__':
    audit_db()
