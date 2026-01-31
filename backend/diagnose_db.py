import os
import django
from django.utils import timezone
from datetime import datetime

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

from backend_core_api.models import ParkingSession

def check_timestamps():
    now = timezone.now()
    local_now = timezone.localtime(now)
    today_start = local_now.replace(hour=0, minute=0, second=0, microsecond=0)
    
    print(f"Current Time (UTC): {now}")
    print(f"Current Time (Local): {local_now}")
    print(f"Today Start (Local): {today_start}")
    
    sessions = ParkingSession.objects.all().order_by('-entry_time')[:5]
    print(f"\n--- Last 5 Sessions ---")
    for s in sessions:
        is_today = s.entry_time >= today_start
        print(f"ID: {s.id} | Vehicle: {s.vehicle_number} | Entry (UTC): {s.entry_time} | Today? {is_today}")

    today_count = ParkingSession.objects.filter(entry_time__gte=today_start).count()
    print(f"\nTotal Sessions >= Today Start: {today_count}")

if __name__ == "__main__":
    check_timestamps()
