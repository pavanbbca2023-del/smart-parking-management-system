import os
import django
from django.utils import timezone
from datetime import timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

from backend_core_api.models import ParkingSession

def fix_sessions():
    print("--- Fixing Sessions ---")
    now = timezone.now()
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    
    # Fix completed sessions without exit_time
    completed_no_exit = ParkingSession.objects.filter(status='completed', exit_time__isnull=True)
    count = completed_no_exit.count()
    completed_no_exit.update(exit_time=now, payment_status='paid')
    print(f"Fixed {count} completed sessions by adding exit_time.")
    
    # Fix completed sessions with exit_time but from "before today" if we want them to show up for demo
    # Or just count all completed sessions for now to be safe
    
    all_completed = ParkingSession.objects.filter(status='completed')
    for s in all_completed:
        if s.amount_paid == 0:
            s.amount_paid = 50.00
            s.payment_status = 'paid'
            s.save()
    
    print(f"Total completed sessions now: {all_completed.count()}")
    print("--- Done ---")

if __name__ == '__main__':
    fix_sessions()
