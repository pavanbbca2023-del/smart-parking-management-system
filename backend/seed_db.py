import os
import django
from django.utils import timezone
from datetime import datetime, time

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
        # Check for existing zone to avoid MultipleObjectsReturned
        obj = Zone.objects.filter(name=z['name']).first()
        if not obj:
            obj = Zone.objects.create(**z)
            for i in range(1, z['total_slots'] + 1):
                Slot.objects.create(zone=obj, slot_number=f"{obj.name[5] if len(obj.name) > 5 else obj.name[0]}{i:03d}")
            print(f"Created {obj.name} and slots")
        else:
            print(f"{obj.name} already exists")
        zones.append(obj)

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

    # 4. Create Sample Sessions (only if none exist)
    if not ParkingSession.objects.filter(vehicle_number='MP41NG4850').exists():
        zone_a = zones[0]
        s1_slot = Slot.objects.filter(zone=zone_a, is_occupied=False).first()
        if s1_slot:
            s1_slot.is_occupied = True
            s1_slot.save()
            ParkingSession.objects.create(
                vehicle_number='MP41NG4850',
                zone=zone_a, 
                slot=s1_slot, 
                status='completed',
                initial_amount_paid=15.00,
                final_amount_paid=45.00,
                total_amount_paid=60.00,
                payment_status='paid',
                exit_time=timezone.now()
            )

    # Pending payment session
    if not ParkingSession.objects.filter(vehicle_number='MP42NG4850').exists():
        s2_slot = Slot.objects.filter(zone=zone_a, is_occupied=False, is_reserved=False).first()
        if s2_slot:
            s2_slot.is_reserved = True
            s2_slot.save()
            ParkingSession.objects.create(
                vehicle_number='MP42NG4850',
                zone=zone_a,
                slot=s2_slot,
                status='pending_payment',
                initial_amount_paid=0.00,
                payment_status='pending'
            )
    print("Sample sessions created")

if __name__ == '__main__':
    seed()
