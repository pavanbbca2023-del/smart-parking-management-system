# 🚀 Quick Start - PowerShell Commands

## Setup (One Time)

```powershell
# Navigate to project
cd C:\Users\pawan\OneDrive\Desktop\smart-parking-management-system

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Create test data
python manage.py create_test_data
```

---

## Run Server

```powershell
# In one PowerShell window
python manage.py runserver

# Server will be at: http://localhost:8000
```

---

## Get Zone ID

```powershell
# In another PowerShell window (while server running)
python manage.py shell

# In Python shell
from backend_core.parking.models import ParkingZone
z = ParkingZone.objects.first()
print(z.id)
exit()

# Copy the Zone ID (looks like: 550e8400-e29b-41d4-a716-446655440000)
```

---

## Test 1: Vehicle Entry

```powershell
$zone_id = "YOUR_ZONE_ID_HERE"
$body = "vehicle_number=TEST-CAR-001&zone_id=$zone_id"

$response = Invoke-WebRequest -Method POST `
  -Uri "http://localhost:8000/parking/entry/" `
  -Body $body `
  -ContentType "application/x-www-form-urlencoded" `
  -UseBasicParsing

$response.Content | ConvertFrom-Json | ConvertTo-Json

# Save the QR code from response!
```

---

## Test 2: Vehicle Exit

```powershell
$qr_code = "QR-YOUR-QR-CODE-HERE"
$body = "qr_code=$qr_code"

$response = Invoke-WebRequest -Method POST `
  -Uri "http://localhost:8000/parking/exit/" `
  -Body $body `
  -ContentType "application/x-www-form-urlencoded" `
  -UseBasicParsing

$response.Content | ConvertFrom-Json | ConvertTo-Json
```

---

## Test 3: Zone Status

```powershell
$zone_id = "YOUR_ZONE_ID_HERE"

$response = Invoke-WebRequest -Method GET `
  -Uri "http://localhost:8000/parking/zone/$zone_id/status/" `
  -UseBasicParsing

$response.Content | ConvertFrom-Json | ConvertTo-Json
```

---

## Admin Panel

```
URL: http://localhost:8000/admin/
Username: (your superuser username)
Password: (your superuser password)

View all data:
- Parking Zones
- Parking Slots
- Vehicles
- Parking Sessions
```

---

## Key Points

✅ Add `-UseBasicParsing` to avoid security warnings
✅ Use `-ContentType "application/x-www-form-urlencoded"` for form data
✅ Zone ID and QR codes must be exact (no typos!)
✅ Always have server running when testing

---

That's it! 🎉
