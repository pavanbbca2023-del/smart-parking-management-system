import os
import django
import sys
from django.utils import timezone
from datetime import datetime
from decimal import Decimal

# Setup Django environment
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

from backend_core_api.models import ParkingSession, Payment, ShiftLog

def verify_report(target_date_str):
    target_date = datetime.strptime(target_date_str, '%Y-%m-%d').date()
    
    # Entries processed today (sessions started today)
    entries = ParkingSession.objects.filter(entry_time__date=target_date).count()
    
    # Exits processed today (sessions ended today)
    exits = ParkingSession.objects.filter(exit_time__date=target_date).count()
    
    # Revenue collection today from Payment objects
    payments = Payment.objects.filter(created_at__date=target_date)
    total_revenue = sum(p.amount for p in payments)
    
    cash_payments = payments.filter(payment_method__iexact='cash')
    total_cash = sum(p.amount for p in cash_payments)
    
    online_payments = payments.exclude(payment_method__iexact='cash')
    total_online = sum(p.amount for p in online_payments)
    
    # Check if there are any ShiftLog entries
    shift_logs = ShiftLog.objects.filter(shift_start__date=target_date)
    
    print(f"--- Database Audit for {target_date_str} ---")
    print(f"Entries Processed: {entries}")
    print(f"Exits Processed: {exits}")
    print(f"Total Revenue: ₹{total_revenue}")
    print(f"  - Cash: ₹{total_cash}")
    print(f"  - Online: ₹{total_online}")
    print(f"\nShift Logs found: {shift_logs.count()}")
    for log in shift_logs:
        print(f"  - Staff: {log.staff.username}")
        print(f"    Entries: {log.entry_count}, Exits: {log.exit_count}")
        print(f"    Revenue: ₹{log.revenue_collected} (Cash: ₹{log.cash_collected}, Online: ₹{log.online_collected})")

if __name__ == "__main__":
    verify_report('2026-01-24')
