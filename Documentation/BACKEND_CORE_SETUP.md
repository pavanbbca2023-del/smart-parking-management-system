# ⚙️ Smart Parking Backend - Setup Guide

## 📋 Prerequisites

```
Python 3.8+
Django 3.2+
pip
SQLite (already included)
```

---

## 🔧 Step-by-Step Setup

### Step 1: Clone/Navigate to Project

```bash
cd c:\Users\pawan\OneDrive\Desktop\smart-parking-management-system
```

### Step 2: Create Virtual Environment (Optional but Recommended)

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Requirements

```bash
pip install -r requirements.txt
```

**If requirements.txt is missing:**
```bash
pip install Django==3.2.0
```

### Step 4: Configure Django Settings

**File:** `smart_parking/settings.py`

Ensure these are present:

```python
# 1. Add app to INSTALLED_APPS
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'backend_core.parking',  # ← ADD THIS
]

# 2. Database (default SQLite is fine)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# 3. Templates
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'backend_core' / 'parking' / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# 4. Allow localhost
ALLOWED_HOSTS = ['*']

# 5. CSRF (for testing only)
CSRF_TRUSTED_ORIGINS = ['http://localhost:8000']
```

### Step 5: Apply Migrations

```bash
# Create migration files
python manage.py makemigrations

# Apply migrations to database
python manage.py migrate
```

**Output should show:**
```
Operations to perform:
  Apply all migrations: admin, auth, contenttypes, sessions, parking
Running migrations:
  Applying parking.0001_initial... OK
```

### Step 6: Create Test Data

```bash
python manage.py shell
```

**Inside Django shell:**
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

# Create slots for Zone A
for i in range(1, 11):
    ParkingSlot.objects.create(
        zone=zone_a,
        slot_number=f"A-{i:03d}"
    )

# Create slots for Zone B
for i in range(1, 11):
    ParkingSlot.objects.create(
        zone=zone_b,
        slot_number=f"B-{i:03d}"
    )

# Verify
print("Zone A:", zone_a.id)
print("Zone B:", zone_b.id)
print("Total slots:", ParkingSlot.objects.count())

exit()
```

### Step 7: Configure Main URLs

**File:** `smart_parking/urls.py`

```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('parking/', include('backend_core.parking.urls')),  # ← ADD THIS
]
```

### Step 8: Run Development Server

```bash
python manage.py runserver
```

**Expected output:**
```
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.
```

---

## 🌐 Access the Application

| Page | URL | Method |
|------|-----|--------|
| **Entry** | http://localhost:8000/parking/entry/ | GET/POST |
| **Entry Scan** | http://localhost:8000/parking/entry-qr-scan/ | GET/POST |
| **Exit** | http://localhost:8000/parking/exit-qr-scan/ | GET/POST |
| **Cancel** | http://localhost:8000/parking/cancel-booking/ | POST |
| **Zone Status** | http://localhost:8000/parking/zone/<id>/status/ | GET |

---

## 📋 Folder Structure (After Setup)

```
smart-parking-management-system/
├── backend_core/
│   └── parking/
│       ├── models.py              ← Database models
│       ├── views.py               ← View functions
│       ├── utils.py               ← Business logic
│       ├── urls.py                ← URL routing
│       ├── templates/
│       │   └── parking/
│       │       ├── entry.html
│       │       ├── entry_scan.html
│       │       └── exit.html
│       ├── migrations/
│       │   └── 0001_initial.py
│       └── ...
├── smart_parking/
│   ├── settings.py               ← Django settings
│   ├── urls.py                   ← Main URL config
│   ├── wsgi.py
│   └── asgi.py
├── manage.py                     ← Django command
├── db.sqlite3                    ← Database file
└── requirements.txt
```

---

## ✅ Verification Checklist

After setup, verify everything:

```bash
# 1. Check migrations applied
python manage.py showmigrations

# 2. Check zones created
python manage.py shell
from backend_core.parking.models import ParkingZone, ParkingSlot
print(f"Zones: {ParkingZone.objects.count()}")
print(f"Slots: {ParkingSlot.objects.count()}")
exit()

# 3. Check URLs working
# Visit http://localhost:8000/parking/entry/
# Should show entry form

# 4. Check templates found
# No "TemplateDoesNotExist" errors?

# 5. Check database accessible
# No "Unable to open database" errors?
```

---

## 🐛 Troubleshooting

### Issue: "No module named 'backend_core'"
```
Solution: Ensure app is in INSTALLED_APPS in settings.py
```

### Issue: "TemplateDoesNotExist"
```
Solution: Check TEMPLATES in settings.py has correct DIRS path
Path should be: BASE_DIR / 'backend_core' / 'parking' / 'templates'
```

### Issue: "Migrations don't apply"
```
Solution: Try deleting db.sqlite3 and migrations folder, then:
python manage.py makemigrations backend_core
python manage.py migrate
```

### Issue: "Port 8000 already in use"
```
Solution: Use different port:
python manage.py runserver 8001
```

### Issue: "No slots available"
```
Solution: Create more slots or reset occupancy:
python manage.py shell
from backend_core.parking.models import ParkingSlot
ParkingSlot.objects.all().update(is_occupied=False)
exit()
```

### Issue: "Database locked"
```
Solution: Close other connections, try again
Or: rm db.sqlite3 and python manage.py migrate
```

---

## 🚀 Quick Start Commands

```bash
# Complete setup
python manage.py migrate
python manage.py shell
# ... create zones/slots ...
exit()

# Run server
python manage.py runserver

# Test entry
# Visit http://localhost:8000/parking/entry/

# Test exit
# Visit http://localhost:8000/parking/exit-qr-scan/
```

---

## 📊 Database Inspection

```bash
python manage.py shell

# List all zones
from backend_core.parking.models import ParkingZone
zones = ParkingZone.objects.all()
for z in zones:
    print(f"{z.name}: ₹{z.hourly_rate}/hr")

# List all slots
from backend_core.parking.models import ParkingSlot
slots = ParkingSlot.objects.all()
for s in slots:
    status = "OCCUPIED" if s.is_occupied else "FREE"
    print(f"{s.slot_number}: {status}")

# List all sessions
from backend_core.parking.models import ParkingSession
sessions = ParkingSession.objects.all()
for sess in sessions:
    print(f"{sess.vehicle.vehicle_number} - Amount: ₹{sess.amount_paid}")

exit()
```

---

## 🔑 Important Notes

### 1. CSRF Protection
For development, CSRF is disabled (@csrf_exempt).  
**Enable in production!**

### 2. Database
Using SQLite for simplicity.  
For production, use PostgreSQL/MySQL.

### 3. Security
No user authentication in basic version.  
Add in production.

### 4. Static Files
Not configured yet.  
Add if you need CSS/JavaScript.

### 5. Admin Panel
Access at http://localhost:8000/admin/  
Login with admin credentials.

---

## 📈 Next Steps (After Setup)

1. ✅ Run the server
2. ✅ Test entry flow
3. ✅ Test exit flow  
4. ✅ Check billing calculations
5. ✅ Read BACKEND_CORE_DOCUMENTATION.md
6. ✅ Try different test scenarios
7. ✅ Understand the code

---

## 🎓 Learning Resources

| File | Topic | Time |
|------|-------|------|
| models.py | Database structure | 5 min |
| utils.py | Business logic | 15 min |
| views.py | Views & requests | 10 min |
| urls.py | URL routing | 2 min |
| DOCUMENTATION | Complete guide | 20 min |

---

## ✨ You're All Set!

Your Smart Parking backend is ready!

```bash
# Start server
python manage.py runserver

# Then visit: http://localhost:8000/parking/entry/
```

Happy coding! 🚀

---

## 📞 Help

For detailed API documentation, see: **BACKEND_CORE_DOCUMENTATION.md**  
For testing guide, see: **BACKEND_CORE_TESTING_GUIDE.md**  
For quick reference, see: **BACKEND_CORE_QUICK_REFERENCE.md**
