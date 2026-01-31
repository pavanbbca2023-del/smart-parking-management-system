# Quick Start Guide - Get Running in 5 Minutes

## 🚀 Start Here!

This is the fastest way to get your parking system running.

---

## Step 1: Setup (2 minutes)

### Open PowerShell Terminal
```bash
cd C:\Users\pawan\OneDrive\Desktop\smart-parking-management-system
```

### Activate Virtual Environment
```bash
.\venv\Scripts\activate
```

You should see `(venv)` at the start of your prompt.

### Install Dependencies
```bash
pip install -r requirements.txt
```

---

## Step 2: Database Setup (1 minute)

### Run Migrations
```bash
python manage.py migrate
```

### Create Admin Account
```bash
python manage.py createsuperuser
```

Follow the prompts to create your admin account.

---

## Step 3: Create Test Data (1 minute)

### Open Django Shell
```bash
python manage.py shell
```

### Paste This Code
```python
from backend_core.parking.models import ParkingZone, ParkingSlot

# Create a parking zone
zone = ParkingZone.objects.create(
    name="Zone A",
    total_slots=50,
    hourly_rate=40,
    is_active=True
)
print(f"✅ Created {zone.name}")

# Create parking slots
for i in range(1, 51):
    ParkingSlot.objects.create(
        zone=zone,
        slot_number=f"A{i:03d}",
        is_occupied=False
    )
print(f"✅ Created 50 slots")

# Exit
print("✅ Ready to go!")
exit()
```

---

## Step 4: Start Server (1 minute)

### Back in PowerShell
```bash
python manage.py runserver
```

You should see:
```
Starting development server at http://127.0.0.1:8000/
```

---

## 🧪 Test It Out!

### Open Another PowerShell Tab

Keep the server running, open a NEW PowerShell window:

```bash
cd C:\Users\pawan\OneDrive\Desktop\smart-parking-management-system
.\venv\Scripts\activate
```

### Test Vehicle Entry

```bash
curl -X POST http://localhost:8000/parking/entry/ `
  -d "vehicle_number=TEST001&zone_id=YOUR_ZONE_ID"
```

**Problem**: You need the actual zone_id. Let me show you how to get it.

### Get Zone ID

In a Python window:
```bash
python manage.py shell
```

```python
from backend_core.parking.models import ParkingZone

zone = ParkingZone.objects.first()
print(zone.id)
```

Copy the zone ID. Then test entry with actual ID:

```bash
curl -X POST http://localhost:8000/parking/entry/ `
  -d "vehicle_number=TEST001&zone_id=PASTE_ID_HERE"
```

You should get a response like:
```json
{
    "success": true,
    "message": "Vehicle entry successful",
    "qr_code": "QR-abc123def456",
    "slot_number": "A001"
}
```

Copy the QR code. Then test exit:

```bash
curl -X POST http://localhost:8000/parking/exit/ `
  -d "qr_code=QR-abc123def456"
```

You should get:
```json
{
    "success": true,
    "message": "Vehicle exit successful",
    "bill": {
        "amount": "0",
        "duration_hours": 0,
        "duration_minutes": 0
    }
}
```

---

## ✅ You're Done!

Congratulations! Your parking system is working! 🎉

---

## 📚 Next Steps

### 1. Explore Code
- Open `backend_core/parking/services/slot_service.py`
- Read the comments
- Understand how it works

### 2. Run Examples
- Open `PRACTICAL_EXAMPLES.md`
- Copy example code
- Run in Django shell

### 3. Create Frontend
- Build HTML forms for entry/exit
- Create a dashboard
- Build QR scanner

### 4. Read Documentation
- Start with `QUICK_REFERENCE.md` (quick answers)
- Then read `BACKEND_CORE_GUIDE.md` (detailed)
- Check `PRACTICAL_EXAMPLES.md` (code samples)

---

## 🛠️ Common Commands

### Open Django Shell (to run Python code)
```bash
python manage.py shell
```

### Run Django Tests
```bash
python manage.py test
```

### Create New App (if needed)
```bash
python manage.py startapp newapp
```

### View Database
Visit: http://localhost:8000/admin/
Login with your admin credentials

### Stop Server
Press `Ctrl + C` in the terminal

---

## 📂 Important Files

| File | What It Does |
|------|-------------|
| `views.py` | API endpoints (entry, exit, status) |
| `services/slot_service.py` | Slot management logic |
| `services/billing_service.py` | Bill calculation |
| `services/qr_service.py` | QR code generation |
| `utils/time_utils.py` | Time helper functions |
| `utils/random_utils.py` | Random data helpers |

---

## 📖 Documentation

| File | Read This For |
|------|----------------|
| `QUICK_REFERENCE.md` | Quick answers (start here!) |
| `BACKEND_CORE_GUIDE.md` | Complete detailed guide |
| `PRACTICAL_EXAMPLES.md` | Working code examples |
| `SETUP_MIGRATION.md` | Installation help |
| `UTILITIES_GUIDE.md` | Utility functions |

---

## 🐛 Troubleshooting

### Problem: "No module named 'backend_core'"
**Solution**: Make sure you're in the correct directory and venv is activated.

### Problem: "Database table doesn't exist"
**Solution**: Run `python manage.py migrate`

### Problem: "Port 8000 already in use"
**Solution**: Use different port: `python manage.py runserver 8001`

### Problem: Can't find zone_id
**Solution**: Open Django shell and run:
```python
from backend_core.parking.models import ParkingZone
zone = ParkingZone.objects.first()
print(zone.id)
```

### Problem: QR code not valid
**Solution**: Make sure you copied the exact QR code from entry response.

---

## 💡 Tips

1. **Keep server running** - Open it in one terminal, keep it running
2. **Use Django shell** - Easiest way to test code quickly
3. **Check logs** - Look for error messages, they help debug
4. **Read comments** - Every function has comments explaining it
5. **Test step-by-step** - Don't try everything at once

---

## 🎯 First 5-Minute Goals

- [x] Setup virtual environment
- [x] Run migrations
- [x] Create test data
- [x] Start server
- [x] Test API endpoints

---

## What's Next?

### Short Term (1-2 hours)
1. Read QUICK_REFERENCE.md
2. Run PRACTICAL_EXAMPLES in Django shell
3. Understand the code structure

### Medium Term (1-2 days)
1. Read BACKEND_CORE_GUIDE.md
2. Modify some code
3. Create test cases
4. Understand services deeply

### Long Term (1-2 weeks)
1. Create frontend (HTML/React/Mobile)
2. Add authentication
3. Add payment gateway
4. Deploy to production

---

## 🆘 Need Help?

1. **Quick answer?** → Read QUICK_REFERENCE.md
2. **Detailed help?** → Read BACKEND_CORE_GUIDE.md
3. **Code example?** → Check PRACTICAL_EXAMPLES.md
4. **Setup issue?** → See SETUP_MIGRATION.md
5. **Utility help?** → Look at UTILITIES_GUIDE.md

---

## ✨ You're All Set!

Your Smart Parking Management System is running!

### What you have:
- ✅ Working API endpoints
- ✅ Database with test data
- ✅ Complete backend code
- ✅ Full documentation
- ✅ Working examples

### What's working:
- ✅ Vehicle entry
- ✅ Slot allocation
- ✅ QR code generation
- ✅ Bill calculation
- ✅ Vehicle exit
- ✅ Zone occupancy status

---

**Happy Coding! 🚗**

Your parking system is ready to park cars!

Remember: Keep a terminal running the server, use another for testing.

```
Terminal 1 (Server):
python manage.py runserver

Terminal 2 (Testing):
curl -X POST http://localhost:8000/parking/entry/ ...

Terminal 3 (Django Shell):
python manage.py shell
from backend_core.parking.models import Vehicle
```

That's it! You're ready to build on top of this! 🎉
