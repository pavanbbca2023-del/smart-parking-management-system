import os
import sys
import django
from django.db.models import Sum

# Setup Django Environment
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

from backend_core_api.models import User, Zone, ParkingSession, Payment

def check_data():
    print("--- ADMIN DASHBOARD DATA CHECK ---")
    
    # 1. Users
    user_count = User.objects.count()
    print(f"Users: {user_count} (Expected: >1)")
    
    # 2. Revenue
    total_rev = Payment.objects.aggregate(total=Sum('amount'))['total'] or 0
    print(f"Total Revenue: {total_rev}")
    
    # 3. Zones
    zones = Zone.objects.all()
    print(f"Active Zones: {zones.count()}")
    for z in zones:
        print(f" - {z.name}: Capacity {z.total_slots}")
        
    # 4. Sessions/Activity
    sessions = ParkingSession.objects.count()
    print(f"Total Sessions: {sessions}")
    recent = ParkingSession.objects.order_by('-entry_time')[:3]
    print("Recent Activity:")
    for s in recent:
        print(f" - {s.vehicle_number} at {s.entry_time}")

if __name__ == '__main__':
    check_data()
