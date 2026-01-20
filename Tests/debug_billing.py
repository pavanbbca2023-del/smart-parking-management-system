#!/usr/bin/env python
import os, sys
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
sys.path.insert(0, r'c:\Users\pawan\OneDrive\Desktop\smart-parking-management-system')

import django
django.setup()

from datetime import timedelta
from django.utils import timezone

now = timezone.now()
one_hour_ago = now - timedelta(hours=1)
duration = now - one_hour_ago
total_seconds = duration.total_seconds()

print("Time Calculation Debug:")
print(f"Now: {now}")
print(f"One hour ago: {one_hour_ago}")
print(f"Duration: {duration}")
print(f"Total seconds: {total_seconds}")
print(f"Hours (int div): {int(total_seconds / 3600)}")
print(f"Remainder: {total_seconds % 3600}")

# Simulate billing logic
duration_hours = int(total_seconds / 3600)
print(f"\nBefore: duration_hours = {duration_hours}")

if total_seconds % 3600 > 0:
    duration_hours += 1
    print("Has remainder, adding 1")
else:
    print("No remainder")

duration_hours = max(1, duration_hours)
print(f"After max(1, ...): duration_hours = {duration_hours}")
