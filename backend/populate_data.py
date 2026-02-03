import os
import sys
import django
from datetime import timedelta
from django.utils import timezone
import random
from decimal import Decimal

# Add project root to path to allow imports from backend.*
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Setup Django Environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

from backend_core_api.models import User, Zone, Slot, ParkingSession, Payment, Vehicle

def populate():
    print("🚀 Starting Data Population...")

    # 1. Create Users
    print("Creating Users...")
    staff_users = []
    for i in range(1, 6):
        username = f'staff{i}'
        email = f'staff{i}@parking.io'
        if not User.objects.filter(username=username).exists():
            user = User.objects.create_user(username=username, email=email, password='password123', role='STAFF')
            staff_users.append(user)
            print(f"  - Created Staff: {username}")
        else:
            staff_users.append(User.objects.get(username=username))

    # 2. Create Zones
    print("Creating Zones...")
    zones = []
    zone_data = [
        {'name': 'Zone A', 'total': 50, 'price': 20.00},
        {'name': 'Zone B', 'total': 30, 'price': 30.00},
        {'name': 'VIP Zone', 'total': 10, 'price': 100.00},
    ]
    
    for zd in zone_data:
        zone, created = Zone.objects.get_or_create(name=zd['name'], defaults={
            'total_slots': zd['total'],
            'base_price': zd['price']
        })
        zones.append(zone)
        # Create Slots
        if created:
            for k in range(1, zd['total'] + 1):
                Slot.objects.create(zone=zone, slot_number=f"{zd['name'][0]}-{k}")
        print(f"  - Zone: {zone.name} (Slots: {zone.total_slots})")

    # 3. Create Sessions (Past 7 Days + Today)
    print("Creating Sessions & Payments...")
    
    # Clear existing sessions for clean charts if needed? No, let's append.
    
    # Generate data for last 7 days including today
    today = timezone.now()
    payment_methods = ['UPI', 'Cash', 'Card', 'Wallet']
    
    for day_offset in range(7):
        date = today - timedelta(days=day_offset)
        # Random number of sessions per day (10 to 30)
        daily_sessions_count = random.randint(10, 30)
        
        print(f"  - Generating {daily_sessions_count} sessions for {date.date()}")
        
        for _ in range(daily_sessions_count):
            zone = random.choice(zones)
            duration_hours = random.uniform(1, 5)
            amount = Decimal(str(round(float(zone.base_price) * duration_hours, 2)))
            
            # Start time: Random time during that day
            start_hour = random.randint(8, 20)
            entry_time = date.replace(hour=start_hour, minute=random.randint(0, 59))
            exit_time = entry_time + timedelta(hours=duration_hours)
            
            # 80% Completed, 20% Active (only for Today)
            status = 'completed'
            if day_offset == 0 and random.random() > 0.8:
                status = 'active'
                exit_time = None
                amount = Decimal('0.00') # Not paid yet
            
            session = ParkingSession.objects.create(
                vehicle_number=f"MH-{random.randint(10,99)}-{random.choices('ABCDEFGHIJKLMNOPQRSTUVWXYZ', k=2)[0]}{random.choices('ABCDEFGHIJKLMNOPQRSTUVWXYZ', k=1)[0]}-{random.randint(1000,9999)}",
                zone=zone,
                entry_time=entry_time,
                exit_time=exit_time,
                status=status,
                initial_amount_paid=amount if status == 'completed' else 0,
                total_amount_paid=amount if status == 'completed' else 0,
                payment_status='paid' if status == 'completed' else 'pending',
                payment_method=random.choice(payment_methods) if status == 'completed' else None
            )

            # Create Payment Record
            if status == 'completed':
                Payment.objects.create(
                    session=session,
                    amount=amount,
                    payment_method=session.payment_method,
                    payment_type='FINAL',
                    created_at=exit_time
                )

    print("✅ Data Population Complete!")

if __name__ == '__main__':
    populate()
