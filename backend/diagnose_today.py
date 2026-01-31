import os
import django
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal
from django.db.models import Sum

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

from backend_core_api.models import ParkingSession, Payment

def diagnose_today():
    now = timezone.now()
    local_now = timezone.localtime(now)
    today_start = local_now.replace(hour=0, minute=0, second=0, microsecond=0)
    
    print(f"--- Environment ---")
    print(f"Now (UTC): {now}")
    print(f"Now (Local): {local_now}")
    print(f"Today Start (Local): {today_start}")
    
    print(f"\n--- Today's Statistics (Logic Check) ---")
    entries = ParkingSession.objects.filter(entry_time__gte=today_start)
    exits = ParkingSession.objects.filter(status='completed', exit_time__gte=today_start)
    
    print(f"Entries Found: {entries.count()}")
    print(f"Exits Found: {exits.count()}")
    
    if Payment:
        revenue = Payment.objects.filter(created_at__gte=today_start, status='success')
        total = revenue.aggregate(total=Sum('amount'))['total'] or Decimal('0.00')
        print(f"Today's Revenue: ₹{total}")
        
        cash = revenue.filter(payment_method__iexact='cash').aggregate(total=Sum('amount'))['total'] or Decimal('0.00')
        print(f" - Cash: ₹{cash}")
        print(f" - Online: ₹{total - cash}")

    print(f"\n--- Detailed Today's Entries ---")
    for s in entries[:10]:
        print(f"ID: {s.id} | Vehicle: {s.vehicle_number} | Entry: {s.entry_time}")

if __name__ == "__main__":
    diagnose_today()
