#!/usr/bin/env python
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

from backend_core.parking.models import ParkingZone, ParkingSlot, Vehicle, ParkingSession
from django.utils import timezone
from datetime import timedelta

def create_test_data():
    print("Creating test data...")
    
    # Clear existing data
    ParkingSession.objects.all().delete()
    ParkingSlot.objects.all().delete()
    ParkingZone.objects.all().delete()
    Vehicle.objects.all().delete()
    
    # Create Zones
    zone_a = ParkingZone.objects.create(
        name="Zone A",
        hourly_rate=40,
        is_active=True
    )
    
    zone_b = ParkingZone.objects.create(
        name="Zone B", 
        hourly_rate=50,
        is_active=True
    )
    
    print(f"Created zones: {zone_a.name}, {zone_b.name}")
    
    # Create Slots for Zone A
    for i in range(1, 21):
        ParkingSlot.objects.create(
            zone=zone_a,
            slot_number=f"A{i:03d}",
            is_occupied=False
        )
    
    # Create Slots for Zone B  
    for i in range(1, 31):
        ParkingSlot.objects.create(
            zone=zone_b,
            slot_number=f"B{i:03d}",
            is_occupied=False
        )
    
    print("Created 50 parking slots")
    
    # Create Vehicles
    vehicles_data = [
        {"number": "KA-01-AB-1234", "owner": "Rajesh Kumar"},
        {"number": "KA-01-AB-5678", "owner": "Priya Singh"},
        {"number": "KA-01-AB-9012", "owner": "Amit Patel"},
        {"number": "KA-01-AB-3456", "owner": "Neha Sharma"},
        {"number": "KA-01-AB-7890", "owner": "Vikram Desai"},
    ]
    
    vehicles = []
    for v_data in vehicles_data:
        vehicle = Vehicle.objects.create(
            vehicle_number=v_data['number'],
            owner_name=v_data['owner']
        )
        vehicles.append(vehicle)
    
    print(f"Created {len(vehicles)} vehicles")
    
    # Create Active Sessions
    slot1 = ParkingSlot.objects.filter(zone=zone_a).first()
    slot1.is_occupied = True
    slot1.save()
    
    ParkingSession.objects.create(
        vehicle=vehicles[0],
        slot=slot1,
        zone=zone_a,
        qr_code="QR-active001",
        entry_time=timezone.now() - timedelta(minutes=30),
        exit_time=None,
        amount_paid=0,
        is_paid=False
    )
    
    slot2 = ParkingSlot.objects.filter(zone=zone_b).first()
    slot2.is_occupied = True
    slot2.save()
    
    ParkingSession.objects.create(
        vehicle=vehicles[1],
        slot=slot2,
        zone=zone_b,
        qr_code="QR-active002",
        entry_time=timezone.now() - timedelta(hours=1),
        exit_time=None,
        amount_paid=0,
        is_paid=False
    )
    
    # Create Completed Sessions
    slot3 = ParkingSlot.objects.filter(zone=zone_a, is_occupied=False).first()
    ParkingSession.objects.create(
        vehicle=vehicles[2],
        slot=slot3,
        zone=zone_a,
        qr_code="QR-completed001",
        entry_time=timezone.now() - timedelta(hours=3),
        exit_time=timezone.now() - timedelta(hours=1),
        amount_paid=80,
        is_paid=True,
        payment_method='ONLINE'
    )
    
    slot4 = ParkingSlot.objects.filter(zone=zone_b, is_occupied=False).first()
    ParkingSession.objects.create(
        vehicle=vehicles[3],
        slot=slot4,
        zone=zone_b,
        qr_code="QR-completed002",
        entry_time=timezone.now() - timedelta(hours=2),
        exit_time=timezone.now() - timedelta(minutes=30),
        amount_paid=75,
        is_paid=True,
        payment_method='CASH'
    )
    
    print("Created parking sessions")
    
    # Print Summary
    print("\n" + "="*50)
    print("TEST DATA CREATED SUCCESSFULLY!")
    print("="*50)
    print(f"Zones: {ParkingZone.objects.count()}")
    print(f"Slots: {ParkingSlot.objects.count()}")
    print(f"Vehicles: {Vehicle.objects.count()}")
    print(f"Sessions: {ParkingSession.objects.count()}")
    print(f"Active Sessions: {ParkingSession.objects.filter(exit_time__isnull=True).count()}")
    print(f"Occupied Slots: {ParkingSlot.objects.filter(is_occupied=True).count()}")
    print("\nAdmin URL: http://localhost:8000/admin/")
    print("Username: admin")
    print("Password: admin123")

if __name__ == '__main__':
    create_test_data()