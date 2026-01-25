import os
import django
from django.utils import timezone
from datetime import datetime
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

from backend_core_api.models import ParkingSession, Zone, Slot

def sync_payments():
    print("--- Syncing User Payments ---")
    
    zone_a = Zone.objects.filter(name='Zone A').first()
    if not zone_a:
        zone_a = Zone.objects.create(name='Zone A', total_slots=50, base_price=50.00)
    
    # User's data list
    data = [
        {'v': 'MH-01-AB-1234', 'amt': '150.00', 'method': 'Cash', 'status': 'completed', 'pay': 'paid'},
        {'v': 'DL-02-CD-5678', 'amt': '200.00', 'method': 'UPI', 'status': 'completed', 'pay': 'paid'},
        {'v': 'KA-03-EF-9012', 'amt': '100.00', 'method': 'Card', 'status': 'completed', 'pay': 'paid'},
        {'v': 'TN-04-GH-3456', 'amt': '300.00', 'method': 'Cash', 'status': 'completed', 'pay': 'paid'},
        {'v': 'UP-05-IJ-7890', 'amt': '75.00', 'method': 'UPI', 'status': 'active', 'pay': 'pending'},
    ]
    
    # Clear existing to avoid confusion if needed, but we'll just update/create
    for item in data:
        session, created = ParkingSession.objects.get_or_create(
            vehicle_number=item['v'],
            defaults={
                'zone': zone_a,
                'status': item['status'],
                'amount_paid': Decimal(item['amt']),
                'payment_method': item['method'],
                'payment_status': item['pay'],
                'exit_time': timezone.now() if item['status'] == 'completed' else None
            }
        )
        if not created:
            session.amount_paid = Decimal(item['amt'])
            session.payment_method = item['method']
            session.status = item['status']
            session.payment_status = item['pay']
            if item['status'] == 'completed' and not session.exit_time:
                session.exit_time = timezone.now()
            session.save()
            print(f"Updated: {item['v']}")
        else:
            print(f"Created: {item['v']}")

    print("--- Sync Complete ---")

if __name__ == '__main__':
    sync_payments()
