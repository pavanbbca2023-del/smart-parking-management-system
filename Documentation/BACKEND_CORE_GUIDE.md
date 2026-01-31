# Smart Parking Management System - Backend Core Documentation

## Overview
This is a beginner-friendly Django backend for a Parking Management System. The code is designed to be simple, readable, and easy to understand for developers new to Django.

---

## Architecture: Service-Based Pattern

The backend follows a **Service-Based Architecture**, which separates:
- **Views** → Handle HTTP requests (thin layer)
- **Services** → Business logic (slot management, billing, QR codes)
- **Validators** → Input validation
- **Models** → Database structure

This makes the code easy to test, maintain, and understand.

---

## Project Structure

```
backend_core/parking/
├── models.py                      # Database models (already created)
├── views.py                       # API endpoints (entry/exit/status)
├── urls.py                        # URL routing
├── admin.py                       # Django admin configuration
├── serializers.py                 # API response formatting
│
├── services/
│   ├── __init__.py
│   ├── slot_service.py            # Slot allocation & release logic
│   ├── billing_service.py         # Billing calculations
│   └── qr_service.py              # QR code generation & validation
│
└── validators/
    ├── __init__.py
    └── session_validator.py       # Input validation logic
```

---

## Models Explained (Already Created)

### 1. ParkingZone
Represents a parking area with multiple slots.

```
- id: Unique identifier
- name: Zone name (e.g., "Zone A", "Zone B")
- total_slots: Total number of slots in zone
- hourly_rate: Hourly parking rate
- is_active: Whether zone is active
- created_at: Creation timestamp
```

### 2. ParkingSlot
Individual parking space within a zone.

```
- id: Unique identifier
- zone: Which zone this slot belongs to
- slot_number: Slot name (e.g., "A1", "B5")
- is_occupied: True if a vehicle is parked, False if empty
- created_at: Creation timestamp
```

### 3. Vehicle
A car/vehicle that parks in the system.

```
- id: Unique identifier
- vehicle_number: Registration number (e.g., "KA-01-AB-1234")
- vehicle_type: Type of vehicle (e.g., "Car", "Bike")
- owner_name: Owner's name (optional)
- created_at: Creation timestamp
```

### 4. ParkingSession
Records each parking event.

```
- id: Unique identifier
- vehicle: Which vehicle is parked
- slot: Which slot is occupied
- zone: Which zone
- entry_time: When vehicle entered
- exit_time: When vehicle left (null if still parked)
- qr_code: Unique QR code for this session
- amount_paid: Bill amount in rupees
- is_paid: Whether bill is paid
- created_at: Creation timestamp
```

---

## Service Documentation

### 1. Slot Service (`services/slot_service.py`)

Handles all parking slot operations.

#### Functions:

**`allocate_slot(vehicle, zone)`**
- Finds an available slot in the zone
- Marks it as occupied
- Creates a parking session with QR code
- Returns the session

Example:
```python
from services.slot_service import SlotService
from models import Vehicle, ParkingZone

vehicle = Vehicle.objects.get(vehicle_number="ABC123")
zone = ParkingZone.objects.get(name="Zone A")

# Allocate a slot
session = SlotService.allocate_slot(vehicle, zone)

if session:
    print(f"Slot allocated: {session.slot.slot_number}")
    print(f"QR Code: {session.qr_code}")
else:
    print("No available slots!")
```

**`close_session(session)`**
- Sets the exit_time to current time
- Marks session as closed
- Returns updated session

Example:
```python
from services.slot_service import SlotService

# Close the session (vehicle exiting)
closed_session = SlotService.close_session(session)
```

**`release_slot(session)`**
- Marks the slot as not occupied
- Makes it available for next vehicle
- Returns True if successful

Example:
```python
from services.slot_service import SlotService

# Release the slot
success = SlotService.release_slot(session)
if success:
    print("Slot released!")
```

**`get_zone_occupancy_status(zone)`**
- Returns occupancy information for a zone
- Shows how many slots are free vs occupied
- Returns dictionary with stats

Example:
```python
from services.slot_service import SlotService

status = SlotService.get_zone_occupancy_status(zone)
print(f"Total slots: {status['total_slots']}")
print(f"Occupied: {status['occupied_slots']}")
print(f"Available: {status['available_slots']}")
print(f"Occupancy: {status['occupancy_percent']}%")
```

---

### 2. Billing Service (`services/billing_service.py`)

Handles all parking bill calculations.

#### Billing Rules:
- **First 10 minutes**: FREE ₹0
- **0-60 minutes total**: ₹40
- **Each additional hour**: ₹20 per hour

#### Examples:
- 5 minutes → ₹0 (within free time)
- 15 minutes → ₹40 (first hour)
- 65 minutes → ₹60 (₹40 + ₹20 for 5 extra minutes, rounded to 1 hour)
- 2 hours 30 minutes → ₹80 (₹40 + ₹20 + ₹20)

#### Functions:

**`calculate_bill(session)`**
- Calculates bill based on entry and exit times
- Applies free time rule
- Returns bill amount

Example:
```python
from services.billing_service import BillingService

# Calculate the bill
bill_amount = BillingService.calculate_bill(session)
print(f"Bill amount: ₹{bill_amount}")
```

**`save_bill_to_session(session, amount)`**
- Saves bill amount to the parking session
- Marks session as paid
- Updates database

Example:
```python
from services.billing_service import BillingService

# Save bill to database
updated_session = BillingService.save_bill_to_session(session, bill_amount)
```

**`get_bill_details(session)`**
- Returns complete bill information
- Includes duration, vehicle number, zone, times, amount

Example:
```python
from services.billing_service import BillingService

details = BillingService.get_bill_details(session)
print(f"Vehicle: {details['vehicle_number']}")
print(f"Duration: {details['duration_hours']}h {details['duration_minutes']}m")
print(f"Amount: ₹{details['amount_paid']}")
```

---

### 3. QR Service (`services/qr_service.py`)

Handles QR code generation and validation.

#### QR Code Format:
- Starts with "QR-"
- Followed by 12 hexadecimal characters
- Example: "QR-a1b2c3d4e5"
- Unique for each parking session

#### Functions:

**`generate_qr()`**
- Generates a unique QR code
- Uses Python UUID for uniqueness
- Returns QR code string

Example:
```python
from services.qr_service import QRService

# Generate a new QR code
qr_code = QRService.generate_qr()
print(f"Generated: {qr_code}")
# Output: Generated: QR-f1a2b3c4d5e6
```

**`validate_qr_code(qr_code)`**
- Checks if QR code has correct format
- Returns True if valid, False if invalid

Example:
```python
from services.qr_service import QRService

# Validate a QR code
is_valid = QRService.validate_qr_code("QR-a1b2c3d4e5f6")
if is_valid:
    print("QR code is valid")
else:
    print("QR code is invalid")
```

---

### 4. Session Validator (`validators/session_validator.py`)

Validates parking session operations.

#### Functions:

**`validate_vehicle_entry(vehicle_number, zone_id)`**
- Validates vehicle entry request
- Checks: vehicle number, zone ID, zone exists, vehicle not already parked
- Returns: (is_valid, error_message)

Example:
```python
from validators.session_validator import SessionValidator

# Validate entry
is_valid, error = SessionValidator.validate_vehicle_entry("ABC123", zone_id)
if is_valid:
    print("Entry is valid, proceed")
else:
    print(f"Error: {error}")
```

**`is_session_active(qr_code)`**
- Checks if a session is still active (vehicle still parked)
- Returns True if active, False if not found or already exited

Example:
```python
from validators.session_validator import SessionValidator

# Check if session is active
if SessionValidator.is_session_active("QR-a1b2c3d4e5f6"):
    print("Session is active")
else:
    print("Session not found or already closed")
```

**`validate_session_exit(qr_code)`**
- Validates vehicle exit request
- Checks: QR code exists, session is active
- Returns: (is_valid, error_message, session)

Example:
```python
from validators.session_validator import SessionValidator

# Validate exit
is_valid, error, session = SessionValidator.validate_session_exit(qr_code)
if is_valid:
    print(f"Can exit, session: {session.id}")
else:
    print(f"Error: {error}")
```

---

## API Endpoints (Views)

### 1. Vehicle Entry Endpoint

**URL**: `/parking/entry/`

**Method**: POST

**Request Data**:
```json
{
    "vehicle_number": "KA-01-AB-1234",
    "zone_id": "zone-uuid-here"
}
```

**Success Response**:
```json
{
    "success": true,
    "message": "Vehicle entry successful",
    "session_id": "session-uuid",
    "qr_code": "QR-a1b2c3d4e5f6",
    "slot_number": "A1",
    "entry_time": "2024-01-17T10:30:00Z"
}
```

**Error Response**:
```json
{
    "success": false,
    "error": "No parking slots available in this zone"
}
```

---

### 2. Vehicle Exit Endpoint

**URL**: `/parking/exit/`

**Method**: POST

**Request Data**:
```json
{
    "qr_code": "QR-a1b2c3d4e5f6"
}
```

**Success Response**:
```json
{
    "success": true,
    "message": "Vehicle exit successful",
    "bill": {
        "amount": "40",
        "duration_hours": 0,
        "duration_minutes": 25,
        "vehicle_number": "KA-01-AB-1234",
        "zone_name": "Zone A",
        "entry_time": "2024-01-17T10:30:00Z",
        "exit_time": "2024-01-17T10:55:00Z"
    }
}
```

**Error Response**:
```json
{
    "success": false,
    "error": "Invalid QR code or session already closed"
}
```

---

### 3. Zone Status Endpoint

**URL**: `/parking/zone/<zone_id>/status/`

**Method**: GET

**Success Response**:
```json
{
    "success": true,
    "zone_name": "Zone A",
    "total_slots": 100,
    "occupied_slots": 45,
    "available_slots": 55,
    "occupancy_percent": 45.0
}
```

---

## Step-by-Step: How a Vehicle Parks

### Step 1: Vehicle Enters
1. User sends entry request with vehicle number and zone
2. Validator checks if vehicle number is valid and zone exists
3. If vehicle already parked, reject entry
4. SlotService finds an available slot
5. QRService generates unique QR code
6. ParkingSession is created in database
7. User receives QR code and slot number

### Step 2: Vehicle Is Parked
- Slot is marked as OCCUPIED
- Session is active (exit_time is null)
- QR code identifies this session

### Step 3: Vehicle Exits
1. User provides QR code at exit
2. Validator checks if QR code is valid and session is active
3. SlotService closes session (sets exit_time)
4. BillingService calculates bill based on duration
5. Bill is saved to session
6. Slot is marked as AVAILABLE
7. User receives bill details

---

## Code Style and Conventions

### Why Simple Code?

Our code follows these principles:
- ✅ **Clear function names** - You know what it does by name
- ✅ **Comments on every step** - Easy for beginners to understand
- ✅ **No complex one-liners** - Explicit is better than implicit
- ✅ **Service-based** - Business logic separated from views
- ✅ **Easy English** - Comments are simple to read
- ✅ **No advanced patterns** - Keeps it beginner-friendly

### Example: Simple vs Complex

**❌ Don't do this (complex)**
```python
available = next((s for s in ParkingSlot.objects.filter(zone=z) if not s.is_occupied), None)
```

**✅ Do this (simple)**
```python
# Find first available slot in this zone
available = ParkingSlot.objects.filter(
    zone=zone,
    is_occupied=False
).first()
```

---

## Error Handling

All services include try-except blocks to handle errors gracefully:

```python
try:
    # Do something
except SomeException as error:
    # Log error
    logger.error(f"Error message: {str(error)}")
    # Return safe value
    return None
```

This ensures:
- ✅ Errors are logged for debugging
- ✅ APIs always return valid responses (no crashes)
- ✅ Users see friendly error messages

---

## Logging

All services use Python's logging module:

```python
import logging
logger = logging.getLogger(__name__)

# Log important operations
logger.info("Something successful happened")
logger.warning("Something unusual happened")
logger.error("Something bad happened")
```

Check logs to:
- Debug issues
- Monitor system behavior
- Track parking operations

---

## Testing Guide

### Unit Test Example
```python
from django.test import TestCase
from models import Vehicle, ParkingZone, ParkingSlot
from services.slot_service import SlotService

class SlotServiceTest(TestCase):
    
    def setUp(self):
        # Create test zone
        self.zone = ParkingZone.objects.create(
            name="Test Zone",
            total_slots=5,
            hourly_rate=40
        )
        
        # Create test slots
        for i in range(5):
            ParkingSlot.objects.create(
                zone=self.zone,
                slot_number=f"A{i+1}",
                is_occupied=False
            )
        
        # Create test vehicle
        self.vehicle = Vehicle.objects.create(
            vehicle_number="TEST123"
        )
    
    def test_allocate_slot(self):
        # Test slot allocation
        session = SlotService.allocate_slot(self.vehicle, self.zone)
        
        # Check results
        self.assertIsNotNone(session)
        self.assertTrue(session.slot.is_occupied)
        self.assertIsNotNone(session.qr_code)
```

---

## Setup Instructions

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Run Migrations
```bash
python manage.py migrate
```

### 3. Create Test Data
```bash
python manage.py shell
```

```python
from backend_core.parking.models import ParkingZone, ParkingSlot

# Create zone
zone = ParkingZone.objects.create(
    name="Zone A",
    total_slots=50,
    hourly_rate=40,
    is_active=True
)

# Create slots
for i in range(50):
    ParkingSlot.objects.create(
        zone=zone,
        slot_number=f"A{i+1}",
        is_occupied=False
    )
```

### 4. Start Server
```bash
python manage.py runserver
```

### 5. Test API
```bash
# Entry request
curl -X POST http://localhost:8000/parking/entry/ \
  -d "vehicle_number=ABC123&zone_id=<zone-uuid>"

# Exit request
curl -X POST http://localhost:8000/parking/exit/ \
  -d "qr_code=QR-a1b2c3d4e5f6"

# Zone status
curl http://localhost:8000/parking/zone/<zone-uuid>/status/
```

---

## Common Questions

### Q: How do I add more zones?
A: Use Django admin or create through shell:
```python
zone = ParkingZone.objects.create(
    name="Zone B",
    total_slots=100,
    hourly_rate=50
)
```

### Q: How do I change billing rates?
A: Edit `BillingService` class constants:
```python
FREE_MINUTES = 10  # Change free time
FIRST_HOUR_RATE = 40  # Change first hour rate
EXTRA_HOUR_RATE = 20  # Change extra hour rate
```

### Q: How do I track a vehicle's history?
A: Query all sessions for a vehicle:
```python
from models import ParkingSession

sessions = ParkingSession.objects.filter(
    vehicle__vehicle_number="ABC123"
)
```

### Q: How do I fix "No available slots" error?
A: Check zone occupancy:
```python
status = SlotService.get_zone_occupancy_status(zone)
print(f"Available: {status['available_slots']}")
```

---

## Security Notes

⚠️ **For Production**:
- Add authentication (login required)
- Validate all input data
- Use HTTPS only
- Implement rate limiting
- Secure sensitive data
- Add payment gateway integration

---

## Next Steps

1. **Understand the models** - Read models.py
2. **Read services** - Understand each service
3. **Try the API** - Test entry/exit endpoints
4. **Write tests** - Create test cases
5. **Extend features** - Add new functionality as needed

---

## Support

For questions or issues:
1. Check the code comments
2. Look at error logs
3. Read this documentation
4. Ask for help

---

**Happy Coding! 🚗**

Remember: Simple code is good code. Readable code is maintainable code.
