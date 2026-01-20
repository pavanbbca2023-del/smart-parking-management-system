#!/usr/bin/env python
import os, sys
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
sys.path.insert(0, r'c:\Users\pawan\OneDrive\Desktop\smart-parking-management-system')

import django
django.setup()

from backend_core_api.models import ParkingZone, ParkingSlot, Vehicle, ParkingSession
from backend_core_api.utils import calculate_amount
from decimal import Decimal
from datetime import timedelta
from django.utils import timezone
import uuid

uid = str(uuid.uuid4())[:8]

# Create zone & vehicle
zone = ParkingZone.objects.create(name=f'TEST{uid}', hourly_rate=Decimal('100.00'), is_active=True)
slot = ParkingSlot.objects.create(zone=zone, slot_number=f'SLOT{uid}', is_occupied=False)
vehicle = Vehicle.objects.create(vehicle_number=f'VEH{uid}', owner_name='Test')

# 1 hour test
session = ParkingSession.objects.create(
    vehicle=vehicle,
    slot=slot,
    zone=zone,
    qr_code='QR-TEST',
    entry_time=timezone.now() - timedelta(hours=1, seconds=0)  # Exactly 1 hour
)

print(f"Session entry_time: {session.entry_time}")
print(f"Current time: {timezone.now()}")

result = calculate_amount(session)

print(f"\nResult: {result}")
print(f"Duration hours: {result['duration_hours']}")
print(f"Duration minutes: {result['duration_minutes']}")
print(f"Total amount: {result['total_amount']}")

# Manual calculation
duration = timezone.now() - session.entry_time
total_seconds = duration.total_seconds()
print(f"\nDebug:")
print(f"Total seconds: {total_seconds}")
print(f"Duration minutes: {total_seconds / 60}")
print(f"Duration hours (int div): {int(total_seconds / 3600)}")
print(f"Remainder: {total_seconds % 3600}")
