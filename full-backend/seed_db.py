import os
import django
from django.utils import timezone
from datetime import datetime, time

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

from backend_core_api.models import User, Zone, StaffSalary, Vehicle, Dispute, Schedule, ParkingSession

def seed():
    # 1. Create Superuser
    admin, created = User.objects.get_or_create(
        username='admin',
        defaults={'email': 'admin@example.com', 'is_superuser': True, 'is_staff': True}
    )
    if created or admin.password == '':
        admin.set_password('admin123')
        admin.save()
        print("Superuser created/updated")

    # 2. Create Zones
    zones_data = [
        {'name': 'Zone A', 'total_slots': 20, 'base_price': 20.00},
        {'name': 'Zone B', 'total_slots': 15, 'base_price': 30.00},
        {'name': 'VIP Zone', 'total_slots': 5, 'base_price': 100.00},
    ]
    zones = []
    for z in zones_data:
        obj, _ = Zone.objects.get_or_create(name=z['name'], defaults=z)
        zones.append(obj)
    print("Zones created")

    # 3. Create Staff Members
    staff_data = [
        {'username': 'staff1', 'email': 'staff1@parking.io', 'role': 'STAFF', 'position': 'Senior Warden', 'salary': 30000},
        {'username': 'staff2', 'email': 'staff2@parking.io', 'role': 'STAFF', 'position': 'Security Officer', 'salary': 25000},
    ]
    for s in staff_data:
        user, created = User.objects.get_or_create(username=s['username'], defaults=s)
        if created:
            user.set_password('staff123')
            user.save()
            
            # Create schedule
            Schedule.objects.create(staff=user, day='Monday', shift_start=time(9,0), shift_end=time(17,0))
    print("Staff and Schedules created")

    # 4. Create Vehicles
    vehicle, _ = Vehicle.objects.get_or_create(
        vehicle_number='ABC-1234',
        defaults={'user': admin, 'vehicle_type': 'Car'}
    )
    print("Vehicle created")

    # 5. Create Sessions & Disputes
    session, _ = ParkingSession.objects.get_or_create(
        vehicle_number='ABC-1234',
        zone=zones[0],
        defaults={'status': 'completed', 'amount_paid': 40, 'payment_status': 'paid'}
    )
    
    Dispute.objects.get_or_create(
        session=session,
        user=admin,
        defaults={'reason': 'Overcharged for 1 hour', 'status': 'pending'}
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
