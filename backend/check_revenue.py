import os
import django
from django.utils import timezone
from django.db.models import Sum

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

from backend_core_api.models import ParkingSession

def check_revenue():
    print("--- Session Audit ---")
    sessions = ParkingSession.objects.all()
    print(f"Total sessions: {sessions.count()}")
    
    active = sessions.filter(status='active').count()
    completed = sessions.filter(status='completed').count()
    print(f"Active: {active}, Completed: {completed}")
    
    paid_sessions = sessions.filter(payment_status='paid')
    print(f"Paid sessions: {paid_sessions.count()}")
    
    for s in paid_sessions:
        print(f"Vehicle: {s.vehicle_number}, Amount: {s.total_amount_paid}, Date: {s.entry_time}")
        
    total = paid_sessions.aggregate(total=Sum('total_amount_paid'))['total']
    print(f"Total Revenue aggregated: {total}")
    
    today = timezone.now().date()
    today_paid = paid_sessions.filter(entry_time__date=today)
    print(f"Paid Today: {today_paid.count()}")
    today_total = today_paid.aggregate(total=Sum('total_amount_paid'))['total']
    print(f"Today Revenue aggregated: {today_total}")

if __name__ == '__main__':
    check_revenue()
