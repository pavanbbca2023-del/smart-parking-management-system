# Backend Core - Quick Reference Guide

## Files Created

### Services (Business Logic)
1. **`services/slot_service.py`** - Slot allocation and release
2. **`services/billing_service.py`** - Bill calculations
3. **`services/qr_service.py`** - QR code generation
4. **`validators/session_validator.py`** - Input validation

### Existing Files (Updated)
- **`views.py`** - API endpoints (entry, exit, status)
- **`urls.py`** - URL routing
- **`models.py`** - Database models

---

## Quick Usage Examples

### 1. Allocate a Parking Slot
```python
from backend_core.parking.services.slot_service import SlotService
from backend_core.parking.models import Vehicle, ParkingZone

# Get vehicle and zone
vehicle = Vehicle.objects.get(vehicle_number="ABC123")
zone = ParkingZone.objects.get(name="Zone A")

# Allocate slot
session = SlotService.allocate_slot(vehicle, zone)

if session:
    print(f"✅ Slot: {session.slot.slot_number}")
    print(f"✅ QR Code: {session.qr_code}")
else:
    print("❌ No available slots")
```

### 2. Close Session (Vehicle Exiting)
```python
from backend_core.parking.services.slot_service import SlotService

# Close the session
session = SlotService.close_session(session)
```

### 3. Calculate Bill
```python
from backend_core.parking.services.billing_service import BillingService

# Calculate bill
amount = BillingService.calculate_bill(session)
print(f"Amount to pay: ₹{amount}")

# Save bill
BillingService.save_bill_to_session(session, amount)

# Get bill details
details = BillingService.get_bill_details(session)
```

### 4. Generate QR Code
```python
from backend_core.parking.services.qr_service import QRService

# Generate
qr_code = QRService.generate_qr()
# Output: "QR-a1b2c3d4e5f6"

# Validate
is_valid = QRService.validate_qr_code(qr_code)
```

### 5. Validate Entry
```python
from backend_core.parking.validators.session_validator import SessionValidator

# Validate
is_valid, error = SessionValidator.validate_vehicle_entry("ABC123", zone_id)

if not is_valid:
    print(f"Error: {error}")
```

---

## API Endpoints (for Frontend)

### Entry
```
POST /parking/entry/
Body: { vehicle_number, zone_id }
Returns: { session_id, qr_code, slot_number, entry_time }
```

### Exit
```
POST /parking/exit/
Body: { qr_code }
Returns: { amount, duration, vehicle_number, zone_name, times }
```

### Zone Status
```
GET /parking/zone/<zone_id>/status/
Returns: { total_slots, occupied_slots, available_slots, occupancy_percent }
```

---

## Billing Rates

```
First 10 minutes ........... FREE ₹0
Next 50 minutes (total 60) . ₹40
Each extra hour ............ ₹20
```

### Examples
- 5 min → ₹0
- 15 min → ₹40
- 1 hour → ₹40
- 1.5 hours → ₹60
- 2 hours → ₹80

---

## Common Code Patterns

### Check Zone Occupancy
```python
from backend_core.parking.services.slot_service import SlotService

status = SlotService.get_zone_occupancy_status(zone)

print(f"Total: {status['total_slots']}")
print(f"Occupied: {status['occupied_slots']}")
print(f"Available: {status['available_slots']}")
print(f"Usage: {status['occupancy_percent']}%")
```

### Get Vehicle's Active Session
```python
from backend_core.parking.models import ParkingSession

# Find active session for a vehicle
active_session = ParkingSession.objects.filter(
    vehicle__vehicle_number="ABC123",
    exit_time__isnull=True
).first()

if active_session:
    print(f"Vehicle is parked in {active_session.zone.name}")
else:
    print("Vehicle not parked")
```

### Get Vehicle Parking History
```python
from backend_core.parking.models import ParkingSession

# Get all sessions for a vehicle
sessions = ParkingSession.objects.filter(
    vehicle__vehicle_number="ABC123"
).order_by('-entry_time')

for session in sessions:
    print(f"In: {session.entry_time}, Out: {session.exit_time}")
```

### Get Zone Revenue
```python
from backend_core.parking.models import ParkingSession
from django.db.models import Sum

# Get total paid amount for a zone
revenue = ParkingSession.objects.filter(
    zone=zone,
    is_paid=True
).aggregate(total=Sum('amount_paid'))

print(f"Total revenue: ₹{revenue['total']}")
```

---

## Debugging Tips

### Check Slot Status
```python
from backend_core.parking.models import ParkingSlot

# See all occupied slots
occupied = ParkingSlot.objects.filter(
    zone=zone,
    is_occupied=True
)

print(f"Occupied slots: {[s.slot_number for s in occupied]}")
```

### Find Session by QR Code
```python
from backend_core.parking.models import ParkingSession

# Get session
session = ParkingSession.objects.get(qr_code="QR-a1b2c3d4e5f6")
print(f"Vehicle: {session.vehicle.vehicle_number}")
print(f"Slot: {session.slot.slot_number}")
print(f"Active: {session.exit_time is None}")
```

### View Unpaid Sessions
```python
from backend_core.parking.models import ParkingSession

# Get unpaid sessions
unpaid = ParkingSession.objects.filter(
    is_paid=False,
    exit_time__isnull=False
)

print(f"Unpaid sessions: {unpaid.count()}")
```

---

## Testing

### Run Tests
```bash
python manage.py test backend_core.parking.tests
```

### Test Entry Flow
```bash
curl -X POST http://localhost:8000/parking/entry/ \
  -d "vehicle_number=TEST001&zone_id=<your-zone-id>"
```

### Test Exit Flow
```bash
curl -X POST http://localhost:8000/parking/exit/ \
  -d "qr_code=<your-qr-code>"
```

---

## Configuration Changes

### Change Billing Rates
File: `services/billing_service.py`
```python
class BillingService:
    FREE_MINUTES = 10  # ← Change here
    FIRST_HOUR_RATE = 40  # ← Change here
    EXTRA_HOUR_RATE = 20  # ← Change here
```

### Change QR Code Format
File: `services/qr_service.py`
```python
# Current: "QR-a1b2c3d4e5f6" (12 hex chars)
# Modify generate_qr() to change format
```

---

## Database Queries (Django Shell)

### Open Django Shell
```bash
python manage.py shell
```

### Create Test Data
```python
from backend_core.parking.models import Vehicle, ParkingZone, ParkingSlot

# Create zone
zone = ParkingZone.objects.create(
    name="Zone A",
    total_slots=50,
    hourly_rate=40,
    is_active=True
)

# Create vehicle
vehicle = Vehicle.objects.create(
    vehicle_number="KA-01-AB-1234",
    vehicle_type="Car",
    owner_name="John Doe"
)

# Create slots
for i in range(50):
    ParkingSlot.objects.create(
        zone=zone,
        slot_number=f"A{i+1}",
        is_occupied=False
    )
```

### View Data
```python
# All zones
ParkingZone.objects.all()

# All vehicles
Vehicle.objects.all()

# All sessions
ParkingSession.objects.all()

# Specific session
ParkingSession.objects.get(qr_code="QR-abc123")
```

---

## Code Structure Summary

```
┌─────────────────────────────────────────┐
│         FRONTEND (Not shown)             │
│    (HTML forms, Mobile app, etc)         │
└────────────────────┬────────────────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │    VIEWS (views.py)    │
        │  Thin HTTP handlers    │
        └────────┬───────────────┘
                 │
        ┌────────┴──────────────────────────┐
        │                                    │
        ▼                                    ▼
┌───────────────────┐          ┌──────────────────────┐
│ VALIDATORS        │          │ SERVICES             │
│ session_validator │          │                      │
│                   │          │ • slot_service       │
│ - Check input     │          │ • billing_service    │
│ - Validate data   │          │ • qr_service         │
└───────────────────┘          │                      │
                               │ (Business Logic)     │
                               └──────────┬───────────┘
                                          │
                                          ▼
                            ┌─────────────────────────┐
                            │   MODELS (models.py)    │
                            │   Database Tables       │
                            │                         │
                            │ • ParkingZone           │
                            │ • ParkingSlot           │
                            │ • Vehicle               │
                            │ • ParkingSession        │
                            └─────────────────────────┘
```

---

## Performance Tips

1. **Use `.first()` instead of `.get()` when unsure** - Won't crash if not found
2. **Filter before counting** - `count()` is faster than `len(list())`
3. **Use `select_related()` for foreign keys** - Reduces database queries
4. **Cache zone status** - Don't recalculate every time
5. **Index commonly filtered fields** - Vehicle number, QR code

---

## Security Checklist

- [ ] Add login authentication
- [ ] Validate all input data
- [ ] Use HTTPS in production
- [ ] Rate limit API endpoints
- [ ] Log all transactions
- [ ] Hash sensitive data
- [ ] Add payment verification
- [ ] Implement access controls

---

**Keep it simple. Keep it readable. Keep it working!** ✅

