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
    StaffSalary = apps.get_model('backend_analytics_api', 'StaffSalary')
    Vehicle = apps.get_model('backend_core_api', 'Vehicle')
    Dispute = apps.get_model('backend_core_api', 'Dispute')
    Schedule = apps.get_model('backend_core_api', 'Schedule')
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
        {'name': 'Zone A', 'total_slots': 20, 'base_price': 20.00},
        {'name': 'Zone B', 'total_slots': 15, 'base_price': 30.00},
        {'name': 'VIP Zone', 'total_slots': 5, 'base_price': 100.00},
    ]
    zones = []
    for z in zones_data:
        obj, created = Zone.objects.get_or_create(name=z['name'], defaults=z)
        zones.append(obj)
        if created:
            for i in range(1, z['total_slots'] + 1):
                Slot.objects.create(zone=obj, slot_number=f"{obj.name[5] if len(obj.name) > 5 else obj.name[0]}-{i:02d}")
    print("Zones and Slots created")

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
            
            # Create schedule
            Schedule.objects.create(staff=user, day='Monday', shift_start=time(9,0), shift_end=time(17,0))
    print("Staff and Schedules created")

    # 4. Create Vehicles
    v1, _ = Vehicle.objects.get_or_create(vehicle_number='MH-01-AB-1234', defaults={'user': admin, 'vehicle_type': 'Car'})
    v2, _ = Vehicle.objects.get_or_create(vehicle_number='DL-05-CD-5678', defaults={'user': admin, 'vehicle_type': 'SUV'})
    
    # 5. Create Sessions & Disputes
    # Active Session in Zone A
    zone_a = zones[0]
    s1_slot = Slot.objects.filter(zone=zone_a, is_occupied=False).first()
    if s1_slot:
        s1_slot.is_occupied = True
        s1_slot.save()
        ParkingSession.objects.get_or_create(
            vehicle_number='MH-01-AB-1234',
            defaults={
                'zone': zone_a, 
                'slot': s1_slot, 
                'status': 'active',
                'initial_amount_paid': zone_a.base_price,
                'payment_status': 'partially_paid'
            }
        )

    # Completed Session
    zone_b = zones[1]
    s2, _ = ParkingSession.objects.get_or_create(
        vehicle_number='DL-05-CD-5678',
        zone=zone_b,
        defaults={
            'status': 'completed', 
            'initial_amount_paid': zone_b.base_price,
            'final_amount_paid': 120.00,
            'total_amount_paid': 150.00, 
            'payment_status': 'paid', 
            'exit_time': timezone.now()
        }
    )
    
    Dispute.objects.get_or_create(
        session=s2,
        user=admin,
        defaults={'reason': 'Incorrect slot assignment', 'status': 'Open', 'dispute_type': 'Operations', 'severity': 'Medium'}
    )
    print("Sessions and Disputes created")

    # 6. Create Salary for Current Month
    now = timezone.now()
    for s in User.objects.filter(role='STAFF'):
        StaffSalary.objects.get_or_create(
            staff=s,
            month=now.month,
            year=now.year,
            defaults={'base_salary': s.salary, 'status': 'pending'}
        )
    print("Salary records created")

if __name__ == '__main__':
    seed()
