import os
import django
from django.utils import timezone
from datetime import timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

from backend_core_api.models import ParkingSession, Payment

def move_to_today():
    print("--- Moving data to Today (Jan 24) ---")
    now = timezone.now()
    yesterday_start = (now - timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    
    # 1. Update Sessions
    sessions = ParkingSession.objects.filter(entry_time__lt=today_start, entry_time__gte=yesterday_start)
    for s in sessions:
        # Shift times forward by 1 day
        s.entry_time = s.entry_time + timedelta(days=1)
        if s.exit_time:
            s.exit_time = s.exit_time + timedelta(days=1)
        s.save()
        print(f"Shifted session: {s.vehicle_number}")

    # 2. Update Payments
    payments = Payment.objects.filter(created_at__lt=today_start, created_at__gte=yesterday_start)
    for p in payments:
        p.created_at = p.created_at + timedelta(days=1)
        p.save()
        print(f"Shifted payment: {p.transaction_id}")

    print("--- Done ---")

if __name__ == '__main__':
    move_to_today()
