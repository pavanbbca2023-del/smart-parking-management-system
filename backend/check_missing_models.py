#!/usr/bin/env python
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

from backend_core_api.models import *
from backend_analytics_api.models import *

def check_missing_models():
    print("=== MISSING MODELS CHECK ===\n")
    
    models_to_check = [
        ('User', User),
        ('Zone', Zone), 
        ('Slot', Slot),
        ('ParkingSession', ParkingSession),
        ('Payment', Payment),
        ('Vehicle', Vehicle),
        ('Attendance', Attendance),
        ('Dispute', Dispute),
        ('Schedule', Schedule),
        ('ShiftLog', ShiftLog),
        ('Feedback', Feedback),
        ('BookingActivityLog', BookingActivityLog),
        ('Alert', Alert)
    ]
    
    missing_data = []
    
    for name, model in models_to_check:
        try:
            count = model.objects.count()
            if count == 0:
                missing_data.append(name)
                print(f"[EMPTY] {name}: 0 records")
            else:
                print(f"[OK] {name}: {count} records")
        except Exception as e:
            print(f"[ERROR] {name}: {e}")
            missing_data.append(name)
    
    print(f"\nMISSING DATA MODELS: {len(missing_data)}")
    for model in missing_data:
        print(f"- {model}")

if __name__ == '__main__':
    check_missing_models()