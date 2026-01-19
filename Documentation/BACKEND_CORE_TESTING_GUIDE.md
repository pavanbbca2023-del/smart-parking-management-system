# 🧪 Smart Parking - Backend Core Testing Guide

## ✅ Pre-Setup Checklist

```bash
# 1. Run migrations
python manage.py makemigrations
python manage.py migrate

# 2. Create test data (zones and slots)
python manage.py shell
```

### Create Test Data in Django Shell:

```python
from backend_core.parking.models import ParkingZone, ParkingSlot

# Create Zone A
zone_a = ParkingZone.objects.create(
    name="Zone A",
    hourly_rate=50,
    is_active=True
)

# Create Zone B
zone_b = ParkingZone.objects.create(
    name="Zone B",
    hourly_rate=75,
    is_active=True
)

# Create 10 slots in Zone A
for i in range(1, 11):
    ParkingSlot.objects.create(
        zone=zone_a,
        slot_number=f"A-{i:03d}"
    )

# Create 10 slots in Zone B
for i in range(1, 11):
    ParkingSlot.objects.create(
        zone=zone_b,
        slot_number=f"B-{i:03d}"
    )

# Verify
print("Zone A ID:", zone_a.id)
print("Zone B ID:", zone_b.id)
print("Total slots created:", ParkingSlot.objects.count())

exit()
```

---

## 🚀 Test Scenario 1: Complete Parking Flow

### Step 1: Entry (Allocate Slot)

**URL:** `http://localhost:8000/parking/entry/`

**Method:** POST

**Data (Form):**
```
vehicle_number = DL-01-AB-1234
owner_name = John Doe
zone_id = <copy Zone A ID from above>
```

**Expected Response:**
```json
{
    "success": true,
    "message": "Slot allocated: A-001",
    "data": {
        "session_id": "uuid-here",
        "qr_code": "qr-code-here",
        "slot_number": "A-001",
        "zone_name": "Zone A",
        "vehicle_number": "DL-01-AB-1234"
    }
}
```

**Copy the `qr_code` value for next steps!**

---

### Step 2: Entry QR Scan

**URL:** `http://localhost:8000/parking/entry-qr-scan/`

**Method:** POST

**Data (Form):**
```
qr_code = <paste QR code from Step 1>
```

**Expected Response:**
```json
{
    "success": true,
    "message": "Entry QR scanned successfully",
    "data": {
        "session_id": "uuid-here",
        "vehicle_number": "DL-01-AB-1234",
        "entry_time": "2024-01-18T10:30:00.123Z",
        "slot_number": "A-001"
    }
}
```

---

### Step 3: Exit QR Scan (After 2 hours)

**URL:** `http://localhost:8000/parking/exit-qr-scan/`

**Method:** POST

**Data (Form):**
```
qr_code = <same QR code from Step 1>
payment_method = CASH
```

**Expected Response (2 hours parked):**
```json
{
    "success": true,
    "message": "Exit processed successfully",
    "data": {
        "session_id": "uuid-here",
        "vehicle_number": "DL-01-AB-1234",
        "exit_time": "2024-01-18T12:30:00.123Z",
        "entry_time": "2024-01-18T10:30:00.123Z",
        "amount_charged": 100.0,
        "payment_method": "CASH",
        "slot_number": "A-001"
    }
}
```

---

## 🧪 Test Scenario 2: Billing Calculation

### Test Case 1: 45 minutes (should charge 1 hour minimum)

**Entry time:** 10:00 AM  
**Exit time:** 10:45 AM  
**Parked:** 45 minutes  
**Expected bill:** 50 (1 hour × ₹50/hr)

### Test Case 2: 1 hour 5 minutes (grace period applies)

**Entry time:** 10:00 AM  
**Exit time:** 11:05 AM  
**Parked:** 1 hour 5 minutes  
**Expected bill:** 50 (grace 5 min free → still 1 hour)

### Test Case 3: 1 hour 6 minutes (grace expired)

**Entry time:** 10:00 AM  
**Exit time:** 11:06 AM  
**Parked:** 1 hour 6 minutes  
**Expected bill:** 100 (2 hours)

### Test Case 4: 2 hours 30 minutes

**Entry time:** 10:00 AM  
**Exit time:** 12:30 PM  
**Parked:** 2 hours 30 minutes  
**Expected bill:** 150 (3 hours)

---

## 🚫 Test Scenario 3: Error Cases

### Error 1: Double Entry Scan (should fail)

```
POST /parking/entry-qr-scan/
qr_code = <already scanned QR>
```

**Expected Response:**
```json
{
    "success": false,
    "message": "Entry QR already scanned. Cannot scan twice!"
}
```

---

### Error 2: Exit Without Entry Scan (should fail)

**Flow:**
1. Do Step 1 (entry allocation) ✅
2. Skip Step 2 (entry QR scan) ⏭️
3. Try Step 3 (exit scan) ❌

```
POST /parking/exit-qr-scan/
qr_code = <QR without entry scan>
payment_method = CASH
```

**Expected Response:**
```json
{
    "success": false,
    "message": "Entry QR not scanned. Cannot exit!"
}
```

---

### Error 3: Invalid QR Code (should fail)

```
POST /parking/exit-qr-scan/
qr_code = invalid-qr-code
payment_method = CASH
```

**Expected Response:**
```json
{
    "success": false,
    "message": "Invalid QR code. Session not found."
}
```

---

## 🔄 Test Scenario 4: Refund Logic

### Case 1: Cancel within 5 minutes (100% refund eligible)

**Flow:**
1. Step 1: Allocate slot ✅
2. Wait 2 minutes
3. Cancel booking

```
POST /parking/cancel-booking/
qr_code = <QR from step 1>
```

**Expected Response:**
```json
{
    "success": true,
    "message": "Session cancelled",
    "data": {
        "refund_eligible": true,
        "refund_amount": 0,
        "refund_reason": "Cancelled within grace period (2 min < 5 min). 100% refund eligible."
    }
}
```

---

### Case 2: Cancel after 5 minutes (0% refund)

**Flow:**
1. Step 1: Allocate slot ✅
2. Wait 6 minutes
3. Cancel booking

```
POST /parking/cancel-booking/
qr_code = <QR from step 1>
```

**Expected Response:**
```json
{
    "success": true,
    "message": "Session cancelled",
    "data": {
        "refund_eligible": false,
        "refund_amount": 0,
        "refund_reason": "Cancelled after grace period (6 min > 5 min). 0% refund."
    }
}
```

---

### Case 3: Cancel after entry scan (0% refund)

**Flow:**
1. Step 1: Allocate slot ✅
2. Step 2: Entry QR scan ✅
3. Cancel booking (immediately)

```
POST /parking/cancel-booking/
qr_code = <QR after entry scan>
```

**Expected Response:**
```json
{
    "success": true,
    "message": "Session cancelled",
    "data": {
        "refund_eligible": false,
        "refund_amount": 0,
        "refund_reason": "No refund allowed after vehicle entry (QR scanned)"
    }
}
```

---

## 📊 Test Scenario 5: Zone Status

**URL:** `http://localhost:8000/parking/zone/<zone_id>/status/`

**Method:** GET

**Example:**
```
GET /parking/zone/a1b2c3d4-e5f6-4g7h-8i9j-k0l1m2n3o4p5/status/
```

**Expected Response:**
```json
{
    "success": true,
    "zone_name": "Zone A",
    "total_slots": 10,
    "occupied_slots": 3,
    "available_slots": 7,
    "occupancy_percent": 30,
    "hourly_rate": "50.00"
}
```

---

## 🔍 Database Verification

### Check Parking Sessions:

```bash
python manage.py shell

from backend_core.parking.models import ParkingSession

# See all sessions
sessions = ParkingSession.objects.all()
for s in sessions:
    print(f"Vehicle: {s.vehicle.vehicle_number}")
    print(f"Slot: {s.slot.slot_number}")
    print(f"Entry QR Scanned: {s.entry_qr_scanned}")
    print(f"Exit QR Scanned: {s.exit_qr_scanned}")
    print(f"Amount Paid: {s.amount_paid}")
    print(f"Payment Method: {s.payment_method}")
    print(f"Is Paid: {s.is_paid}")
    print("---")

exit()
```

### Check Slot Occupancy:

```bash
python manage.py shell

from backend_core.parking.models import ParkingSlot

# See all slots
slots = ParkingSlot.objects.all()
for s in slots:
    status = "OCCUPIED" if s.is_occupied else "AVAILABLE"
    print(f"{s.zone.name} - {s.slot_number}: {status}")

exit()
```

---

## ⏰ Testing Time Calculations

### Manual Time Test:

```bash
python manage.py shell

from backend_core.parking.models import ParkingSession, Vehicle, ParkingSlot, ParkingZone
from django.utils import timezone
from datetime import timedelta

# Get a session
session = ParkingSession.objects.first()

# Manually set entry time
session.entry_time = timezone.now() - timedelta(hours=1, minutes=30)
session.exit_time = timezone.now()
session.save()

# Test calculation
from backend_core.parking.utils import calculate_amount
amount = calculate_amount(session)
print(f"Duration: 1 hour 30 minutes")
print(f"Calculated Amount: {amount}")
print(f"Expected: 100 (2 hours)")

exit()
```

---

## 📋 Checklist

- [ ] Database migrations applied
- [ ] Test data created (zones + slots)
- [ ] Entry allocation working
- [ ] Entry QR scan working
- [ ] Exit QR scan with billing working
- [ ] Double scan prevention working
- [ ] Error handling for invalid QR
- [ ] Billing calculation correct (grace period)
- [ ] Refund logic working
- [ ] Zone status endpoint working
- [ ] Slot occupancy tracking correct

---

## 🐛 Debugging Tips

### Issue: "Zone not found"
```
Solution: Copy correct zone ID from setup step
```

### Issue: "No slots available"
```
Solution: Create more slots or reset occupancy
python manage.py shell
from backend_core.parking.models import ParkingSlot
ParkingSlot.objects.all().update(is_occupied=False)
```

### Issue: "Invalid QR code"
```
Solution: Use exact same QR code from allocation step
Don't modify or shorten the QR code
```

### Issue: Billing amount wrong
```
Solution: Check entry_time and exit_time
Check zone hourly_rate
Check grace period (5 minutes)
```

---

## 🎯 Happy Testing!

Follow the scenarios in order for best results. Good luck! 🚀
