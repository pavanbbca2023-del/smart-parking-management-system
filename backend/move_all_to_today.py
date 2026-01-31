import os
import django
from django.utils import timezone
from datetime import timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

from backend_core_api.models import ParkingSession, Payment

def move_all_to_today():
    print("--- Moving ALL data to Today ---")
    now = timezone.now()
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    
    # 1. Update Sessions
    sessions = ParkingSession.objects.all()
    for s in sessions:
        # Shift times forward so they appear as today
        diff = now - s.entry_time
        s.entry_time = now - timedelta(minutes=30) # Set to 30 mins ago
        if s.exit_time:
            s.exit_time = now - timedelta(minutes=5) # Set to 5 mins ago
        s.save()
        print(f"Shifted session: {s.vehicle_number}")

    # 2. Update Payments
    payments = Payment.objects.all()
    for p in payments:
        p.created_at = now - timedelta(minutes=10)
        p.save()
        print(f"Shifted payment: {p.transaction_id}")

    print("--- Done ---")

if __name__ == '__main__':
    move_all_to_today()
