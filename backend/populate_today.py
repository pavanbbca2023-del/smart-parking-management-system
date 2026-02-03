import os
import sys
import django
from datetime import timedelta
from django.utils import timezone
import random
from decimal import Decimal

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Setup Django Environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

from backend_core_api.models import User, Zone, Slot, ParkingSession, Payment, Vehicle

def populate_today():
    print("🚀 Pumping Data for TODAY...")
    
    # Get Zone
    zone = Zone.objects.first()
    if not zone:
        zone = Zone.objects.create(name="Zone A", base_price=50.00, total_slots=100)
    
    # Create 5 Completed Sessions for TODAY (Revenue)
    for i in range(5):
        entry_time = timezone.now() - timedelta(minutes=random.randint(60, 300))
        exit_time = entry_time + timedelta(minutes=random.randint(30, 120))
        
        vehicle_number = f"MH-12-TD-{random.randint(1000, 9999)}"
        
        session = ParkingSession.objects.create(
            vehicle_number=vehicle_number,
            zone=zone,
            entry_time=entry_time,
            exit_time=exit_time,
            status='completed',
            payment_status='paid',
            total_amount_paid=Decimal('150.00'), # Fixed amount
        )
        
        Payment.objects.create(
            session=session,
            amount=Decimal('150.00'),
            payment_method=random.choice(['UPI', 'cash', 'card']),
            status='success'
        )
        print(f"  - Revenue added: {vehicle_number}")

    # Create 2 Active Sessions (Active Parkings)
    for i in range(2):
        entry_time = timezone.now() - timedelta(minutes=random.randint(5, 50))
        ParkingSession.objects.create(
            vehicle_number=f"DL-01-AC-{random.randint(1000, 9999)}",
            zone=zone,            entry_time=entry_time,
            status='active',
            payment_status='pending'
        )
        print(f"  - Active Session added")

    print("✅ TODAY Is Populated! Dashboard MUST show data now.")

if __name__ == '__main__':
    populate_today()
