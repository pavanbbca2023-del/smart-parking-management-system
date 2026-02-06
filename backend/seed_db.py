import os
import django
from django.utils import timezone
from datetime import datetime, time, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

from django.apps import apps
from django.contrib.auth import get_user_model

def seed():
    User = get_user_model()
    Zone = apps.get_model('backend_core_api', 'Zone')
    ParkingSession = apps.get_model('backend_core_api', 'ParkingSession')
    Slot = apps.get_model('backend_core_api', 'Slot')
    
    # 1. Create Superuser
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
        print("Superuser created")
    else:
        print("Superuser already exists")

    admin = User.objects.get(username='admin')

    # 2. Create Zones & Slots
    zones_data = [
        {'name': 'Zone A', 'total_slots': 50, 'base_price': 60.00},
        {'name': 'Zone B', 'total_slots': 50, 'base_price': 30.00},
        {'name': 'Zone C', 'total_slots': 50, 'base_price': 40.00},
        {'name': 'Zone D', 'total_slots': 50, 'base_price': 50.00},
        {'name': 'Zone E', 'total_slots': 50, 'base_price': 80.00},
    ]
    zones = []
    for z in zones_data:
        obj, created = Zone.objects.get_or_create(
            name=z['name'],
            defaults={'total_slots': z['total_slots'], 'base_price': z['base_price']}
        )
        if not created:
            obj.total_slots = z['total_slots']
            obj.base_price = z['base_price']
            obj.save()
        print(f"{'Created' if created else 'Updated'} {obj.name}")
        
        # Create slots
        for i in range(1, z['total_slots'] + 1):
            slot_number = f"{obj.name.split()[-1]}{i:03d}"
            Slot.objects.get_or_create(
                zone=obj,
                slot_number=slot_number,
                defaults={'is_active': True}
            )
        zones.append(obj)
    print(f"Created {len(zones)} zones with slots")

    # 3. Create Staff Members
    staff_data = [
        {'username': 'staff1', 'email': 'staff1@parking.io', 'role': 'STAFF', 'position': 'Senior Warden', 'salary': 30000},
        {'username': 'staff2', 'email': 'staff2@parking.io', 'role': 'STAFF', 'position': 'Security Officer', 'salary': 25000},
    ]
    for s in staff_data:
        if not User.objects.filter(username=s['username']).exists():
            user = User.objects.create_user(**s)
            user.set_password('staff123')
            user.save()
    print("Staff created")

    # 4. Create Sample Sessions (Refresh dates if exist)
    # if not zones:
    #     print("No zones available, skipping session creation")
    #     return

    # zone_a = zones[0]

    # # Completed Session
    # session_complete = ParkingSession.objects.filter(vehicle_number='MP41NG4850').first()
    # s1_slot = Slot.objects.filter(zone=zone_a, is_occupied=False).first()
    # 
    # if not session_complete and s1_slot:
    #     s1_slot.is_occupied = True
    #     s1_slot.save()
    #     session_complete = ParkingSession.objects.create(
    #         vehicle_number='MP41NG4850',
    #         zone=zone_a, 
    #         slot=s1_slot, 
    #         status='completed',
    #         initial_amount_paid=15.00,
    #         final_amount_paid=45.00,
    #         total_amount_paid=60.00,
    #         payment_status='paid',
    #         payment_method='cash',
    #         booking_time=timezone.now() - timedelta(hours=2),
    #         entry_time=timezone.now() - timedelta(hours=1.5),
    #         exit_time=timezone.now()
    #     )
    # elif session_complete:
    #     # Refresh dates to appear as "Today"
    #     session_complete.booking_time = timezone.now() - timedelta(hours=2)
    #     session_complete.entry_time = timezone.now() - timedelta(hours=1.5)
    #     session_complete.exit_time = timezone.now()
    #     session_complete.save()

    # if session_complete:
    #     # Ensure Payment Record exists
    #     Payment = apps.get_model('backend_core_api', 'Payment')
    #     if not Payment.objects.filter(session=session_complete).exists():
    #         Payment.objects.create(
    #             session=session_complete,
    #             amount=60.00,
    #             payment_method='cash',
    #             payment_type='FULL',
    #             status='success',
    #             transaction_id=f"TXN_{int(datetime.now().timestamp())}"
    #         )
    #     else:
    #          # Refresh payment date
    #          p = Payment.objects.filter(session=session_complete).first()
    #          if p:
    #             p.created_at = timezone.now()
    #             p.save()

    # # Pending payment session
    # session_pending = ParkingSession.objects.filter(vehicle_number='MP42NG4850').first()
    # s2_slot = Slot.objects.filter(zone=zone_a, is_occupied=False, is_reserved=False).first()

    # if not session_pending and s2_slot:
    #     s2_slot.is_reserved = True
    #     s2_slot.save()
    #     ParkingSession.objects.create(
    #         vehicle_number='MP42NG4850',
    #         zone=zone_a,
    #         slot=s2_slot,
    #         status='pending_payment',
    #         initial_amount_paid=0.00,
    #         payment_status='pending',
    #         booking_time=timezone.now() - timedelta(minutes=30)
    #     )
    # elif session_pending:
    #     session_pending.booking_time = timezone.now() - timedelta(minutes=30)
    #     session_pending.save()
    # print("Sample sessions created")

if __name__ == '__main__':
    seed()
