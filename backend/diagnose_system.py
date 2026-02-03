import os
import sys
import django
import requests
import json
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal

# Setup Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

from backend_core_api.models import User, Zone, ParkingSession, Payment

CONST_URL = "http://127.0.0.1:8000"

def diagnose():
    print("\n🔍 === SYSTEM DIAGNOSTICS === 🔍")
    
    # 1. DATABASE CHECK
    print("\n[1] DATABASE LEVEL:")
    user_count = User.objects.count()
    zone_count = Zone.objects.count()
    session_count = ParkingSession.objects.count()
    
    now = timezone.now()
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    sessions_today = ParkingSession.objects.filter(entry_time__gte=today_start).count()
    
    print(f"  - Users in DB: {user_count}")
    print(f"  - Zones in DB: {zone_count}")
    print(f"  - Total Sessions: {session_count}")
    print(f"  - Sessions Today (> {today_start.time()}): {sessions_today}")
    
    # 2. TIMEZONE CHECK
    print("\n[2] TIME CONFIGURATION:")
    print(f"  - Django Time (timezone.now()): {now}")
    print(f"  - System Time: {datetime.now()}")
    
    # 3. API RESPONSE CHECK
    print("\n[3] API LEVEL:")
    endpoints = [
        "/api/analytics/dashboard/",
        "/api/admin/zones/",  # Checking admin endpoint specifically
        "/api/admin/users/"   # Checking admin endpoint specifically
    ]
    
    for ep in endpoints:
        try:
            url = f"{CONST_URL}{ep}"
            print(f"  👉 Fetching {url}...")
            res = requests.get(url, timeout=5)
            print(f"     Status: {res.status_code}")
            
            if res.status_code == 200:
                data = res.json()
                # Print keys to verify structure
                if isinstance(data, dict):
                    print(f"     Keys: {list(data.keys())}")
                    if 'data' in data and isinstance(data['data'], dict):
                         print(f"     Data Keys: {list(data['data'].keys())}")
                         # Check specific values
                         if 'total_revenue' in data['data']:
                             print(f"     ✅ total_revenue: {data['data']['total_revenue']}")
                    elif 'results' in data:
                        print(f"     ✅ Pagination 'results' found. Count: {len(data['results'])}")
                    elif 'users' in data:
                        print(f"     ✅ 'users' list found. Count: {len(data['users'])}")
                    elif 'zones' in data:
                        print(f"     ✅ 'zones' list found. Count: {len(data['zones'])}")
                elif isinstance(data, list):
                    print(f"     ✅ Direct List returned. Length: {len(data)}")
            else:
                print(f"     ❌ Error: {res.text[:100]}")
        except Exception as e:
            print(f"     ❌ Exception: {e}")

    print("\n================================")

if __name__ == "__main__":
    from datetime import datetime
    diagnose()
