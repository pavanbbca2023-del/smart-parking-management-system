#!/usr/bin/env python
import os
import sys
import django
from datetime import datetime

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

from backend_core_api.models import User, Zone, Slot, ParkingSession, Payment
from django.utils import timezone

def check_full_system():
    print("=== SMART PARKING SYSTEM CHECK ===\n")
    
    # 1. Database Connection
    try:
        User.objects.count()
        print("[OK] Database: Connected")
    except Exception as e:
        print(f"[ERROR] Database: Failed - {e}")
        return
    
    # 2. Models Check
    models_check = {
        'Users': User.objects.count(),
        'Zones': Zone.objects.count(),
        'Slots': Slot.objects.count(),
        'Sessions': ParkingSession.objects.count(),
        'Payments': Payment.objects.count()
    }
    
    print("[DATA] Database Models:")
    for model, count in models_check.items():
        print(f"   {model}: {count} records")
    
    # 3. Admin Users
    admins = User.objects.filter(role='ADMIN')
    print(f"\n[ADMIN] Admin Users: {admins.count()}")
    for admin in admins:
        print(f"   - {admin.username} ({admin.email})")
    
    # 4. Active Zones
    active_zones = Zone.objects.filter(is_active=True)
    print(f"\n[ZONES] Active Zones: {active_zones.count()}")
    for zone in active_zones:
        occupied = zone.slots.filter(is_occupied=True).count()
        print(f"   - {zone.name}: {occupied}/{zone.total_slots} occupied")
    
    # 5. Today's Activity
    today = timezone.now().date()
    today_sessions = ParkingSession.objects.filter(entry_time__date=today)
    today_revenue = Payment.objects.filter(created_at__date=today, status='success').aggregate(
        total=django.db.models.Sum('amount'))['total'] or 0
    
    print(f"\n[TODAY] Today's Activity:")
    print(f"   Sessions: {today_sessions.count()}")
    print(f"   Revenue: Rs.{today_revenue}")
    print(f"   Active: {today_sessions.filter(status='active').count()}")
    
    # 6. System Health
    issues = []
    
    # Check for zones without slots
    zones_no_slots = Zone.objects.filter(total_slots=0)
    if zones_no_slots.exists():
        issues.append(f"{zones_no_slots.count()} zones have no slots")
    
    # Check for sessions without payments
    unpaid_sessions = ParkingSession.objects.filter(payment_status='pending')
    if unpaid_sessions.count() > 50:
        issues.append(f"{unpaid_sessions.count()} unpaid sessions")
    
    print(f"\n[HEALTH] System Health:")
    if issues:
        for issue in issues:
            print(f"   [WARNING] {issue}")
    else:
        print("   [OK] All systems operational")
    
    # 7. API Endpoints Status
    print(f"\n[API] Key Endpoints:")
    print("   Dashboard: /api/dashboard/")
    print("   Analytics: /api/stats/")
    print("   Core API: /api/core/")
    print("   Admin: /admin/")
    
    # 8. Frontend Status
    frontend_path = "c:\\Users\\pawan\\OneDrive\\Desktop\\smart-parking-management-system\\frontend"
    if os.path.exists(frontend_path):
        print(f"\n[FRONTEND] Frontend: Available")
        print("   Admin App: /src/apps/admin/")
        print("   User App: /src/apps/user/")
        print("   Staff App: /src/apps/staff/")
    else:
        print(f"\n[ERROR] Frontend: Not found")
    
    print(f"\n[STATUS] SYSTEM STATUS: {'[OK] OPERATIONAL' if not issues else '[WARNING] NEEDS ATTENTION'}")
    print(f"\n[ACCESS] Access Points:")
    print("   Backend: http://localhost:8000/")
    print("   Admin: http://localhost:8000/admin/")
    print("   API: http://localhost:8000/api/")
    print("   Frontend: http://localhost:3000/ (if running)")

if __name__ == '__main__':
    check_full_system()