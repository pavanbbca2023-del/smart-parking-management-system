# Setup & Migration Guide

## Overview
This guide explains how to set up the Smart Parking Management System from scratch.

---

## Prerequisites

Before starting, make sure you have:
- Python 3.8 or higher
- Django 3.2 or higher
- pip (Python package manager)
- SQLite3 (or PostgreSQL)

---

## Step 1: Install Dependencies

```bash
# Navigate to project directory
cd smart-parking-management-system

# Install all required packages
pip install -r requirements.txt
```

### What gets installed:
- Django (Web framework)
- djangorestframework (API support)
- django-cors-headers (Cross-origin requests)
- python-dotenv (Environment variables)
- And other dependencies

---

## Step 2: Run Database Migrations

Migrations create tables in the database based on models.

```bash
# Run all migrations
python manage.py migrate
```

This will:
- Create all necessary database tables
- Set up foreign key relationships
- Initialize the database structure

---

## Step 3: Create Initial Parking Zones

You can use Django shell to create test data:

```bash
# Open Django interactive shell
python manage.py shell
```

Then run these commands:

```python
from backend_core.parking.models import ParkingZone, ParkingSlot

# Create Zone A
zone_a = ParkingZone.objects.create(
    name="Zone A",
    total_slots=50,
    hourly_rate=40,
    is_active=True
)
print(f"✅ Created {zone_a.name}")

# Create Zone B
zone_b = ParkingZone.objects.create(
    name="Zone B",
    total_slots=100,
    hourly_rate=50,
    is_active=True
)
print(f"✅ Created {zone_b.name}")

# Create parking slots for Zone A
for i in range(1, 51):
    ParkingSlot.objects.create(
        zone=zone_a,
        slot_number=f"A{i:03d}",  # A001, A002, A003, etc
        is_occupied=False
    )
print(f"✅ Created 50 slots for Zone A")

# Create parking slots for Zone B
for i in range(1, 101):
    ParkingSlot.objects.create(
        zone=zone_b,
        slot_number=f"B{i:03d}",  # B001, B002, B003, etc
        is_occupied=False
    )
print(f"✅ Created 100 slots for Zone B")

# Verify
print("\n=== SUMMARY ===")
print(f"Zones: {ParkingZone.objects.count()}")
print(f"Total Slots: {ParkingSlot.objects.count()}")
```

Then type `exit()` to leave the shell.

---

## Step 4: Create a Superuser (Admin)

```bash
# Create admin account
python manage.py createsuperuser
```

You'll be asked for:
- Username: (your choice, e.g., "admin")
- Email: (your email)
- Password: (your strong password)

---

## Step 5: Start the Development Server

```bash
# Start Django development server
python manage.py runserver
```

You should see:
```
Starting development server at http://127.0.0.1:8000/
```

---

## Step 6: Test the Setup

### Option A: Using Browser

1. **Admin Panel**: Visit http://localhost:8000/admin/
   - Login with superuser credentials
   - View/manage ParkingZones, ParkingSlots, Vehicles, ParkingSessions

2. **API Endpoints**:
   - Entry: http://localhost:8000/parking/entry/
   - Exit: http://localhost:8000/parking/exit/
   - Zone Status: http://localhost:8000/parking/zone/{zone_id}/status/

### Option B: Using cURL (Command Line)

Get your zone_id first:
```bash
# Open Django shell
python manage.py shell
```

```python
from backend_core.parking.models import ParkingZone
zone = ParkingZone.objects.first()
print(zone.id)  # Copy this UUID
```

Then test the API:

```bash
# Test vehicle entry
curl -X POST http://localhost:8000/parking/entry/ \
  -d "vehicle_number=KA-01-AB-1234&zone_id=<PASTE_ZONE_ID_HERE>"

# Response should include qr_code
# Copy the qr_code value for the next test

# Test vehicle exit
curl -X POST http://localhost:8000/parking/exit/ \
  -d "qr_code=<PASTE_QR_CODE_HERE>"

# Should show bill details

# Check zone status
curl http://localhost:8000/parking/zone/<PASTE_ZONE_ID_HERE>/status/
```

---

## Step 7: Verify All Components

### Check Models
```bash
python manage.py shell
```

```python
from backend_core.parking.models import (
    ParkingZone, ParkingSlot, Vehicle, ParkingSession
)

# Verify zones exist
zones = ParkingZone.objects.all()
print(f"✅ Zones: {zones.count()}")
for zone in zones:
    print(f"   - {zone.name}: {zone.total_slots} slots")

# Verify slots exist
slots = ParkingSlot.objects.all()
print(f"✅ Slots: {slots.count()}")

# Check available slots
available = ParkingSlot.objects.filter(is_occupied=False).count()
print(f"✅ Available slots: {available}")
```

### Check Services
```python
from backend_core.parking.services.slot_service import SlotService
from backend_core.parking.services.billing_service import BillingService
from backend_core.parking.services.qr_service import QRService
from backend_core.parking.validators.session_validator import SessionValidator

print("✅ slot_service imported")
print("✅ billing_service imported")
print("✅ qr_service imported")
print("✅ session_validator imported")

# Test QR generation
qr = QRService.generate_qr()
print(f"✅ QR Code generated: {qr}")

# Test QR validation
is_valid = QRService.validate_qr_code(qr)
print(f"✅ QR validation works: {is_valid}")
```

Type `exit()` to leave shell.

---

## Folder Structure After Setup

```
smart-parking-management-system/
├── db.sqlite3                    # Database file
├── manage.py                     # Django management script
├── requirements.txt              # Python dependencies
├── BACKEND_CORE_GUIDE.md         # Detailed documentation
├── QUICK_REFERENCE.md            # Quick reference
├── SETUP_MIGRATION.md            # This file
│
├── backend_core/
│   └── parking/
│       ├── models.py             # ✅ Database models
│       ├── views.py              # ✅ API endpoints
│       ├── urls.py               # ✅ URL routing
│       ├── admin.py              # Admin configuration
│       ├── serializers.py        # API serializers
│       │
│       ├── services/
│       │   ├── __init__.py
│       │   ├── slot_service.py       # ✅ Slot management
│       │   ├── billing_service.py    # ✅ Billing logic
│       │   └── qr_service.py         # ✅ QR generation
│       │
│       ├── validators/
│       │   ├── __init__.py
│       │   └── session_validator.py  # ✅ Input validation
│       │
│       └── migrations/
│           └── (auto-generated)
│
└── smart_parking/
    ├── settings.py               # Django settings
    ├── urls.py                   # Main URL routing
    ├── wsgi.py                   # WSGI configuration
    └── asgi.py                   # ASGI configuration
```

---

## Complete Test Walkthrough

Run this complete flow to test everything:

```bash
# 1. Open shell
python manage.py shell
```

```python
# 2. Import all necessary modules
from backend_core.parking.models import (
    Vehicle, ParkingZone, ParkingSession
)
from backend_core.parking.services.slot_service import SlotService
from backend_core.parking.services.billing_service import BillingService
from backend_core.parking.services.qr_service import QRService
from backend_core.parking.validators.session_validator import SessionValidator
from django.utils import timezone
from datetime import timedelta

# 3. Get a zone
zone = ParkingZone.objects.first()
print(f"Using zone: {zone.name}")

# 4. Create a test vehicle
vehicle, created = Vehicle.objects.get_or_create(
    vehicle_number="TEST-001",
    defaults={'vehicle_type': 'Car', 'owner_name': 'Test User'}
)
print(f"Vehicle: {vehicle.vehicle_number}")

# 5. Validate entry
is_valid, error = SessionValidator.validate_vehicle_entry(
    vehicle.vehicle_number,
    zone.id
)
print(f"Entry validation: {is_valid}")

# 6. Allocate slot
session = SlotService.allocate_slot(vehicle, zone)
print(f"✅ Slot allocated: {session.slot.slot_number}")
print(f"✅ QR Code: {session.qr_code}")
print(f"✅ Entry time: {session.entry_time}")

# 7. Check zone status
status = SlotService.get_zone_occupancy_status(zone)
print(f"✅ Zone status: {status['available_slots']} available")

# 8. Simulate 30 minutes of parking
# (in production, this happens automatically)

# 9. Close session
session = SlotService.close_session(session)
print(f"✅ Session closed, exit time: {session.exit_time}")

# 10. Calculate bill
bill_amount = BillingService.calculate_bill(session)
print(f"✅ Bill amount: ₹{bill_amount}")

# 11. Save bill
BillingService.save_bill_to_session(session, bill_amount)
print(f"✅ Bill saved")

# 12. Get bill details
details = BillingService.get_bill_details(session)
print(f"✅ Details:")
print(f"   Duration: {details['duration_hours']}h {details['duration_minutes']}m")
print(f"   Vehicle: {details['vehicle_number']}")
print(f"   Zone: {details['zone_name']}")
print(f"   Amount: ₹{details['amount_paid']}")

# 13. Release slot (optional - usually done manually)
SlotService.release_slot(session)
print(f"✅ Slot released")

print("\n✅✅✅ ALL TESTS PASSED ✅✅✅")
```

Exit shell:
```python
exit()
```

---

## Environment Variables (Optional)

Create a `.env` file in project root:

```
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1

DATABASE_ENGINE=django.db.backends.sqlite3
DATABASE_NAME=db.sqlite3

TIMEZONE=Asia/Kolkata
```

---

## Common Issues & Solutions

### Issue: "No module named 'backend_core'"
**Solution**: Make sure you're in the correct directory:
```bash
cd smart-parking-management-system
python manage.py shell
```

### Issue: "ParkingZone matching query does not exist"
**Solution**: Create zones first (see Step 3):
```bash
python manage.py shell
# Then run zone creation code
```

### Issue: "Table doesn't exist"
**Solution**: Run migrations:
```bash
python manage.py migrate
```

### Issue: "Port 8000 already in use"
**Solution**: Use a different port:
```bash
python manage.py runserver 8001
```

### Issue: Import errors in IDE
**Solution**: Make sure venv is activated:
```bash
# Windows
.\venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

---

## Next Steps

1. ✅ Models are set up (database)
2. ✅ Services are created (business logic)
3. ✅ Views are ready (API endpoints)
4. ✅ Validators work (input checking)
5. **Next**: Create Frontend (HTML/React/Mobile app)
6. **Next**: Add authentication (login/signup)
7. **Next**: Add payment gateway integration
8. **Next**: Deploy to production

---

## Production Deployment

Before deploying to production:

1. Set `DEBUG=False` in settings.py
2. Generate secure `SECRET_KEY`
3. Configure `ALLOWED_HOSTS`
4. Use PostgreSQL instead of SQLite
5. Enable HTTPS
6. Add proper error logging
7. Implement authentication
8. Add rate limiting
9. Set up CORS properly
10. Use environment variables for secrets

---

## Support

If you encounter issues:
1. Check the error message carefully
2. Read the comments in code
3. Refer to BACKEND_CORE_GUIDE.md
4. Check Django documentation
5. Look at log files

---

**You're all set! Happy coding! 🎉**

