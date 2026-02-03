#!/usr/bin/env python
import os
import sys
import django
from datetime import datetime, timedelta
from decimal import Decimal

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

from backend_core_api.models import User, Zone, Slot, ParkingSession, Payment
from django.utils import timezone

def populate_dashboard():
    print("Populating dashboard with sample data...")
    
    # Create admin user if not exists
    admin, created = User.objects.get_or_create(
        username='admin',
        defaults={
            'email': 'admin@parking.com',
            'role': 'ADMIN',
            'is_staff': True,
            'is_superuser': True,
            'plain_password': 'admin123'
        }
    )
    if created:
        admin.set_password('admin123')
        admin.save()
        print("Admin user created")
    
    # Create staff users
    staff_users = []
    for i in range(3):
        staff, created = User.objects.get_or_create(
            username=f'staff{i+1}',
            defaults={
                'email': f'staff{i+1}@parking.com',
                'role': 'STAFF',
                'salary': Decimal('25000.00'),
                'position': 'Parking Attendant',
                'plain_password': f'staff{i+1}123'
            }
        )
        if created:
            staff.set_password(f'staff{i+1}123')
            staff.save()
        staff_users.append(staff)
    print("Staff users created")
    
    # Create zones
    zones_data = [
        {'name': 'Zone A - Main Entrance', 'total_slots': 50, 'base_price': Decimal('20.00')},
        {'name': 'Zone B - Shopping Mall', 'total_slots': 75, 'base_price': Decimal('25.00')},
        {'name': 'Zone C - Business District', 'total_slots': 100, 'base_price': Decimal('30.00')},
    ]
    
    zones = []
    for zone_data in zones_data:
        zone, created = Zone.objects.get_or_create(
            name=zone_data['name'],
            defaults=zone_data
        )
        zones.append(zone)
        
        # Create slots for each zone
        existing_slots = zone.slots.count()
        if existing_slots < zone.total_slots:
            for slot_num in range(existing_slots + 1, zone.total_slots + 1):
                Slot.objects.get_or_create(
                    zone=zone,
                    slot_number=f"A{slot_num:03d}" if zone.name.startswith('Zone A') else 
                               f"B{slot_num:03d}" if zone.name.startswith('Zone B') else f"C{slot_num:03d}"
                )
    print("Zones and slots created")
    
    # Create sample parking sessions with revenue
    vehicles = ['MH01AB1234', 'MH02CD5678', 'MH03EF9012', 'KA01GH3456', 'DL04IJ7890']
    
    # Create active sessions
    for i, vehicle in enumerate(vehicles[:3]):
        session, created = ParkingSession.objects.get_or_create(
            vehicle_number=vehicle,
            defaults={
                'zone': zones[i % len(zones)],
                'status': 'active',
                'initial_amount_paid': Decimal('50.00'),
                'payment_status': 'paid',
                'entry_time': timezone.now() - timedelta(hours=i+1),
                'slot': zones[i % len(zones)].slots.first()
            }
        )
        if created:
            # Mark slot as occupied
            session.slot.is_occupied = True
            session.slot.save()
            
            # Create payment record
            Payment.objects.create(
                session=session,
                amount=session.initial_amount_paid,
                payment_method='razorpay',
                payment_type='INITIAL',
                transaction_id=f'pay_test_{i+1}',
                status='success'
            )
    
    # Create completed sessions with revenue (last 7 days)
    total_revenue = Decimal('0.00')
    for i in range(10):
        entry_time = timezone.now() - timedelta(days=i//2, hours=i*2)
        exit_time = entry_time + timedelta(hours=2+i)
        amount = Decimal(str(50 + i*10))
        
        session, created = ParkingSession.objects.get_or_create(
            vehicle_number=f'TEST{i:04d}',
            defaults={
                'zone': zones[i % len(zones)],
                'status': 'completed',
                'entry_time': entry_time,
                'exit_time': exit_time,
                'initial_amount_paid': amount,
                'final_amount_paid': Decimal('20.00'),
                'payment_status': 'paid',
                'slot': zones[i % len(zones)].slots.all()[i % 10]
            }
        )
        if created:
            total_revenue += session.initial_amount_paid + session.final_amount_paid
            
            # Create payment records
            Payment.objects.create(
                session=session,
                amount=session.initial_amount_paid,
                payment_method='razorpay',
                payment_type='INITIAL',
                transaction_id=f'pay_initial_{i}',
                status='success'
            )
            Payment.objects.create(
                session=session,
                amount=session.final_amount_paid,
                payment_method='cash',
                payment_type='FINAL',
                transaction_id=f'pay_final_{i}',
                status='success'
            )
    
    print(f"Sample parking sessions created with Rs.{total_revenue} revenue")
    
    # Create some reserved bookings
    for i in range(2):
        ParkingSession.objects.get_or_create(
            vehicle_number=f'RESERVED{i+1}',
            defaults={
                'zone': zones[i % len(zones)],
                'status': 'reserved',
                'initial_amount_paid': Decimal('30.00'),
                'payment_status': 'paid',
                'booking_expiry_time': timezone.now() + timedelta(hours=12),
                'slot': zones[i % len(zones)].slots.filter(is_occupied=False, is_reserved=False).first()
            }
        )
        # Mark slot as reserved
        slot = zones[i % len(zones)].slots.filter(is_occupied=False, is_reserved=False).first()
        if slot:
            slot.is_reserved = True
            slot.save()
    
    print("Reserved bookings created")
    
    # Print summary
    print("\nDashboard Data Summary:")
    print(f"Total Revenue: Rs.{Payment.objects.filter(status='success').aggregate(total=django.db.models.Sum('amount'))['total'] or 0}")
    print(f"Active Users: {User.objects.filter(role='USER').count()}")
    print(f"Active Parkings: {ParkingSession.objects.filter(status='active').count()}")
    print(f"Active Zones: {Zone.objects.filter(is_active=True).count()}")
    print(f"Total Slots: {Slot.objects.count()}")
    print(f"Occupied Slots: {Slot.objects.filter(is_occupied=True).count()}")
    print(f"Reserved Slots: {Slot.objects.filter(is_reserved=True).count()}")
    
    print("\nDashboard populated successfully!")
    print("Access admin panel at: http://localhost:8000/admin/")
    print("Admin credentials: admin / admin123")

if __name__ == '__main__':
    populate_dashboard()