import os
import django
from django.utils import timezone
from datetime import date, datetime
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

from backend_analytics_api.models import DailyReport
from backend_core_api.models import ParkingSession, Payment, Zone, Slot

def populate_data():
    print("--- Populating Historical Data ---")
    
    # 1. Populate Daily Reports
    reports_data = [
        {'date': date(2026, 1, 22), 'sessions': 50, 'revenue': '1200.00', 'occ': 60.5},
        {'date': date(2026, 1, 21), 'sessions': 51, 'revenue': '1300.00', 'occ': 60.5},
        {'date': date(2026, 1, 20), 'sessions': 52, 'revenue': '1400.00', 'occ': 60.5},
        {'date': date(2026, 1, 19), 'sessions': 53, 'revenue': '1500.00', 'occ': 60.5},
        {'date': date(2026, 1, 18), 'sessions': 54, 'revenue': '1600.00', 'occ': 60.5},
        {'date': date(2026, 1, 17), 'sessions': 55, 'revenue': '1700.00', 'occ': 60.5},
        {'date': date(2026, 1, 16), 'sessions': 56, 'revenue': '1800.00', 'occ': 60.5},
    ]
    
    for r in reports_data:
        obj, created = DailyReport.objects.update_or_create(
            date=r['date'],
            defaults={
                'total_sessions': r['sessions'],
                'total_revenue': Decimal(r['revenue']),
                'occupancy_rate': r['occ']
            }
        )
        print(f"{'Created' if created else 'Updated'} report for {r['date']}")

    # 2. Populate Transactions (Jan 23, 2026)
    zone_a = Zone.objects.filter(name='Zone A').first()
    if not zone_a:
        zone_a = Zone.objects.create(name='Zone A', total_slots=50, base_price=50.00)

    txns_data = [
        {'txn': 'TXN1005', 'v': 'RJ14KL2345', 'amt': '160.00', 'method': 'digital', 'time': '2026-01-23 09:38:00'},
        {'txn': 'TXN1004', 'v': 'UP16IJ7890', 'amt': '200.00', 'method': 'cash', 'time': '2026-01-23 09:38:00'},
        {'txn': 'TXN1003', 'v': 'TN09GH3456', 'amt': '140.00', 'method': 'cash', 'time': '2026-01-23 09:38:00'},
        {'txn': 'TXN1002', 'v': 'DL08EF9012', 'amt': '180.00', 'method': 'digital', 'time': '2026-01-23 09:38:00'},
        {'txn': 'TXN1001', 'v': 'KA05CD5678', 'amt': '220.00', 'method': 'cash', 'time': '2026-01-23 09:38:00'},
        {'txn': 'TXN1000', 'v': 'MH12AB1234', 'amt': '165.00', 'method': 'cash', 'time': '2026-01-23 09:38:00'},
    ]

    for t in txns_data:
        # Create session first
        session, _ = ParkingSession.objects.update_or_create(
            vehicle_number=t['v'],
            status='completed',
            defaults={
                'zone': zone_a,
                'amount_paid': Decimal(t['amt']),
                'payment_method': t['method'],
                'payment_status': 'paid',
                'entry_time': timezone.make_aware(datetime.fromisoformat(t['time'])) - timezone.timedelta(hours=2),
                'exit_time': timezone.make_aware(datetime.fromisoformat(t['time']))
            }
        )
        
        # Create payment
        Payment.objects.update_or_create(
            transaction_id=t['txn'],
            defaults={
                'session': session,
                'amount': Decimal(t['amt']),
                'payment_method': t['method'],
                'status': 'success',
                'created_at': timezone.make_aware(datetime.fromisoformat(t['time']))
            }
        )
        print(f"Sync: {t['txn']} for vehicle {t['v']}")

    print("--- Population Complete ---")

if __name__ == '__main__':
    populate_data()
