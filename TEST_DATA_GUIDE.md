# Test Data Setup Guide

## Quick Start - 30 Seconds!

### Step 1: Open PowerShell Terminal
```bash
cd C:\Users\pawan\OneDrive\Desktop\smart-parking-management-system
.\venv\Scripts\activate
```

### Step 2: Run Test Data Command
```bash
python manage.py create_test_data
```

That's it! You now have test data! 🎉

---

## What Gets Created

### 3 Parking Zones
```
✅ Zone A     - 50 slots  @ ₹40/hour (ACTIVE)
✅ Zone B     - 100 slots @ ₹50/hour (ACTIVE)
✅ Zone C     - 25 slots  @ ₹30/hour (DISABLED)
```

### 175 Parking Slots
- 50 slots in Zone A
- 100 slots in Zone B
- 25 slots in Zone C

### 10 Test Vehicles
```
KA-01-AB-0001  Car    Rajesh Kumar
KA-01-AB-0002  Bike   Priya Singh
KA-01-AB-0003  Car    Amit Patel
KA-01-AB-0004  SUV    Neha Sharma
KA-01-AB-0005  Car    Vikram Desai
KA-01-AB-0006  Bike   Anjali Verma
KA-01-AB-0007  Car    Rohan Nair
KA-01-AB-0008  Car    Sneha Gupta
KA-01-AB-0009  Bike   Arjun Singh
KA-01-AB-0010  Car    Disha Kapoor
```

### 5 Test Parking Sessions
```
1. Active      - Vehicle parked 30 min ago
2. Completed   - Vehicle exited, paid ₹80 (2 hours)
3. Active      - Vehicle parked 1 hour ago
4. Completed   - Vehicle parked 15 min (FREE parking)
5. Unpaid      - Vehicle exited, NOT PAID (₹120)
```

---

## Running the Command

### Basic Usage
```bash
python manage.py create_test_data
```

### Clear Old Data First
```bash
python manage.py create_test_data --clear
```

This will:
1. Delete all old test data
2. Create fresh new test data
3. Show statistics

---

## Output Example

When you run the command, you'll see:

```
📍 Creating Parking Zones...
   ✅ Created: Zone A (50 slots, ₹40/hour)
   ✅ Created: Zone B (100 slots, ₹50/hour)
   ✅ Created: Zone C (25 slots, ₹30/hour) - DISABLED

🅿️  Creating Parking Slots...
   ✅ Created 50 slots for Zone A
   ✅ Created 100 slots for Zone B
   ✅ Created 25 slots for Zone C

🚗 Creating Test Vehicles...
   ✅ Created: KA-01-AB-0001 (Car)
   ✅ Created: KA-01-AB-0002 (Bike)
   ... (8 more vehicles)

🎫 Creating Test Parking Sessions...
   ✅ Active Session 1: KA-01-AB-0001 in A001
   ✅ Completed Session 2: KA-01-AB-0002 (₹80, 2 hours)
   ✅ Active Session 3: KA-01-AB-0003 in B001
   ✅ Completed Session 4: KA-01-AB-0004 (₹0, 15 minutes - FREE)
   ✅ Unpaid Session 5: KA-01-AB-0005 (₹120 - UNPAID)

============================================================
✅ TEST DATA CREATED SUCCESSFULLY!
============================================================

📊 STATISTICS:
   Zones:             3
   Total Slots:       175
   Occupied Slots:    2
   Available Slots:   173
   
   Vehicles:          10
   Total Sessions:    5
   Active Sessions:   2
   Completed:         3
   Paid Sessions:     2
   Unpaid Sessions:   1

🧪 READY TO TEST!
   Server: http://localhost:8000/
   Admin:  http://localhost:8000/admin/
```

---

## Testing the API

After creating test data, you can test the API:

### Get Zone ID
```bash
python manage.py shell
```

```python
from backend_core.parking.models import ParkingZone

zone = ParkingZone.objects.first()
print(zone.id)  # Copy this ID

exit()
```

### Test Vehicle Entry
```bash
curl -X POST http://localhost:8000/parking/entry/ `
  -d "vehicle_number=KA-01-AB-0006&zone_id=PASTE_ID_HERE"
```

You should get:
```json
{
    "success": true,
    "message": "Vehicle entry successful",
    "session_id": "...",
    "qr_code": "QR-abc123def456",
    "slot_number": "A051"
}
```

### Test Vehicle Exit
```bash
curl -X POST http://localhost:8000/parking/exit/ `
  -d "qr_code=QR-abc123def456"
```

You should get bill details!

---

## Viewing Test Data in Admin

Open http://localhost:8000/admin/

Login with your admin account

You can see:
- ✅ Parking Zones
- ✅ Parking Slots
- ✅ Vehicles
- ✅ Parking Sessions

---

## What to Test

### 1. Entry Flow
- [ ] Try entering with vehicle KA-01-AB-0007
- [ ] Check if slot gets allocated
- [ ] Verify QR code is unique

### 2. Occupancy
- [ ] Check Zone A occupancy (should show some occupied)
- [ ] Check Zone B occupancy
- [ ] Check Zone C (disabled, should not be available)

### 3. Active Sessions
- [ ] View the 2 active parking sessions
- [ ] Check their duration and time parked

### 4. Completed Sessions
- [ ] View the 3 completed sessions
- [ ] Check their bills
- [ ] Verify paid/unpaid status

### 5. Bill Calculation
- [ ] Check session 2 (₹80 for 2 hours) - is it correct?
- [ ] Check session 4 (₹0 for 15 minutes) - FREE parking works?
- [ ] Check session 5 (₹120) - marked as unpaid?

---

## If Something Goes Wrong

### Problem: "No module named 'backend_core'"
**Solution**: Make sure you're in the right directory and venv is activated.

### Problem: "Table doesn't exist"
**Solution**: Run migrations first:
```bash
python manage.py migrate
```

### Problem: "create_test_data" not found
**Solution**: Make sure the file is in the right place:
```
backend_core/parking/management/commands/create_test_data.py
```

### Problem: Already have data, want fresh start
**Solution**: Clear and recreate:
```bash
python manage.py create_test_data --clear
```

---

## Modifying Test Data

You can edit [create_test_data.py](backend_core/parking/management/commands/create_test_data.py):

### Add More Vehicles
```python
vehicles_data = [
    {"number": "KA-01-AB-0001", "type": "Car", "owner": "Name"},
    # Add more here
]
```

### Change Parking Rates
```python
zone_a = ParkingZone.objects.get_or_create(
    name="Zone A",
    defaults={
        'total_slots': 50,
        'hourly_rate': 50,  # Change this to ₹50
        'is_active': True
    }
)
```

### Add Different Sessions
Look for the "Session 1", "Session 2", etc. sections and modify them.

---

## Next Steps

1. ✅ Create test data (`python manage.py create_test_data`)
2. ✅ View in admin panel
3. ✅ Test API endpoints
4. ✅ Read PRACTICAL_EXAMPLES.md for more code
5. ✅ Modify code as needed

---

## Quick Commands Reference

```bash
# Create test data
python manage.py create_test_data

# Clear and recreate
python manage.py create_test_data --clear

# View all vehicles
python manage.py shell
>>> from backend_core.parking.models import Vehicle
>>> Vehicle.objects.all()

# View all zones
>>> from backend_core.parking.models import ParkingZone
>>> ParkingZone.objects.all()

# Check active sessions
>>> from backend_core.parking.models import ParkingSession
>>> ParkingSession.objects.filter(exit_time__isnull=True)
```

---

**Happy Testing! 🧪**

Your test data is ready to use!
