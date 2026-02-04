
import os
import django
import sys

# Setup Django environment
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

from backend_core_api.models import Slot, ParkingSession, Zone

def audit_data():
    print("--- DATA AUDIT ---")
    
    print("\n[ZONES]")
    for z in Zone.objects.all():
        print(f"ID: {z.id} | Name: {z.name} | Total: {z.total_slots}")

    print("\n[SLOTS]")
    slots = Slot.objects.all()
    for s in slots:
        print(f"ID: {s.id} | No: {s.slot_number} | Zone: {s.zone.name}")
        print(f"   Flags -> Occupied: {s.is_occupied} | Reserved: {s.is_reserved} | Active: {s.is_active}")

    print("\n[SESSIONS]")
    sessions = ParkingSession.objects.all()
    for sess in sessions:
        print(f"ID: {sess.id} | Vehicle: {sess.vehicle_number} | Status: {sess.status}")
        print(f"   Slot: {sess.slot} | Paid: {sess.payment_status}")

    print("\n[DASHBOARD SUMMARY CHECK]")
    from backend_analytics_api.services import AnalyticsService
    summary = AnalyticsService.get_dashboard_summary()
    print(f"Dashboard Summary API Result: {summary}")

if __name__ == "__main__":
    audit_data()
