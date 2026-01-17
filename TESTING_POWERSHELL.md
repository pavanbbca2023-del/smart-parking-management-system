# Testing Parking System - PowerShell Guide

## ⚠️ Important: Use the Server Terminal!

Your server is running at: `http://localhost:8000`

---

## 📋 Step 1: Create Test Data

Open a **NEW PowerShell window** (don't stop the server):

```powershell
cd C:\Users\pawan\OneDrive\Desktop\smart-parking-management-system
.\venv\Scripts\Activate.ps1
python manage.py create_test_data
```

**Output should show:**
```
✅ Testing database created successfully!
   • 3 Zones created
   • 175 Parking slots created
   • 10 Vehicles created
   • 5 Parking sessions created
```

---

## 🧪 Step 2: Test API Endpoints

### PowerShell vs Linux curl

| Linux bash | PowerShell |
|-----------|-----------|
| `curl -X POST ...` | `Invoke-WebRequest -Method POST ...` |
| `-d "data"` | `-Body "data"` |
| `-H "header"` | `-Headers @{"header"="value"}` |

---

## ✅ Test 1: Get Zone ID First

```powershell
# Go to Django shell
python manage.py shell
```

Then in Python shell:
```python
from backend_core.parking.models import ParkingZone
zone = ParkingZone.objects.first()
print(zone.id)
print(zone.name)

# Copy the zone.id (looks like: 550e8400-e29b-41d4-a716-446655440000)
exit()
```

**Save the zone ID!** You'll need it for testing.

---

## ✅ Test 2: Vehicle Entry

**Replace `YOUR_ZONE_ID` with the actual ID you copied above!**

```powershell
# Save zone ID as variable
$ZONE_ID = "550e8400-e29b-41d4-a716-446655440000"

# Test Entry
Invoke-WebRequest -Method POST `
  -Uri "http://localhost:8000/parking/entry/" `
  -Body "vehicle_number=KA-01-AB-0007&zone_id=$ZONE_ID"
```

**Expected response:**
```json
{
    "success": true,
    "message": "Vehicle entry successful!",
    "session_id": "...",
    "qr_code": "QR-a1b2c3d4e5f6",
    "slot_number": "A001",
    "zone_name": "Zone A"
}
```

**Save the QR code!** You'll need it for exit test.

---

## ✅ Test 3: Vehicle Exit

**Replace `YOUR_QR_CODE` with the QR code you got from entry!**

```powershell
# Save QR code as variable
$QR_CODE = "QR-a1b2c3d4e5f6"

# Test Exit
Invoke-WebRequest -Method POST `
  -Uri "http://localhost:8000/parking/exit/" `
  -Body "qr_code=$QR_CODE"
```

**Expected response:**
```json
{
    "success": true,
    "message": "Vehicle exit successful!",
    "vehicle_number": "KA-01-AB-0007",
    "zone_name": "Zone A",
    "parking_duration": "0h 2m",
    "amount_to_pay": "0.00",
    "status": "Paid"
}
```

---

## ✅ Test 4: Zone Status

**Replace `YOUR_ZONE_ID` with the zone ID!**

```powershell
# Save zone ID as variable
$ZONE_ID = "550e8400-e29b-41d4-a716-446655440000"

# Get zone status
Invoke-WebRequest -Method GET `
  -Uri "http://localhost:8000/parking/zone/$ZONE_ID/status/"
```

**Expected response:**
```json
{
    "success": true,
    "zone_name": "Zone A",
    "total_slots": 50,
    "occupied_slots": 0,
    "available_slots": 50,
    "occupancy_percent": 0.0,
    "hourly_rate": "40.00",
    "is_active": true
}
```

---

## 🎯 Complete Test Flow

```powershell
# 1. Setup
$ZONE_ID = "YOUR_ZONE_ID_HERE"

# 2. Entry
$entry = Invoke-WebRequest -Method POST `
  -Uri "http://localhost:8000/parking/entry/" `
  -Body "vehicle_number=KA-01-AB-0001&zone_id=$ZONE_ID"

$entryData = $entry.Content | ConvertFrom-Json
$QR_CODE = $entryData.qr_code
Write-Host "Vehicle entered! QR: $QR_CODE"

# Wait a few seconds to see time difference
Start-Sleep -Seconds 5

# 3. Exit
$exit = Invoke-WebRequest -Method POST `
  -Uri "http://localhost:8000/parking/exit/" `
  -Body "qr_code=$QR_CODE"

$exitData = $exit.Content | ConvertFrom-Json
Write-Host "Vehicle exited! Bill: ₹$($exitData.amount_to_pay)"

# 4. Check zone status
Invoke-WebRequest -Method GET `
  -Uri "http://localhost:8000/parking/zone/$ZONE_ID/status/" | Select-Object Content
```

---

## 📊 Using JSON Output

To format the JSON output nicely:

```powershell
$response = Invoke-WebRequest -Method GET `
  -Uri "http://localhost:8000/parking/zone/$ZONE_ID/status/"

$response.Content | ConvertFrom-Json | ConvertTo-Json
```

Or directly:

```powershell
(Invoke-WebRequest -Method GET `
  -Uri "http://localhost:8000/parking/zone/$ZONE_ID/status/").Content | ConvertFrom-Json
```

---

## 🔧 Troubleshooting

### Error: "404 - Page not found"
- Make sure server is running: `python manage.py runserver`
- Make sure URLs are included in main urls.py

### Error: "No free slots available"
- Run `python manage.py create_test_data --clear` first
- Or check zone occupancy: `zone_status` endpoint

### Error: "Invalid QR code"
- Make sure you copied the QR code correctly from entry response
- Check for typos or extra spaces

---

## 📱 Admin Panel

View all data in Django admin:

1. Go to: `http://localhost:8000/admin/`
2. Login with your admin credentials
3. View:
   - Parking Zones
   - Parking Slots (with occupied status)
   - Vehicles
   - Parking Sessions (with entry/exit times, QR codes, amounts paid)

---

## 🎓 Learning Path

1. ✅ Run `create_test_data` command
2. ✅ Visit admin panel to see the data
3. ✅ Test vehicle entry endpoint
4. ✅ Test vehicle exit endpoint
5. ✅ Check zone status endpoint
6. ✅ Review the bill calculation
7. ✅ Read the service code
8. ✅ Understand the flow

---

**That's it! Now you can test the entire parking system! 🚗✅**

