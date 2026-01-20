# 🚗 Smart Parking Management System - Backend Core API

## 📋 Overview

Complete Django-based REST API for Smart Parking Management System with QR code scanning, real-time billing, and payment processing.

## 🏗️ Architecture

```
backend_core_api/
├── models.py          # Database models (ParkingZone, ParkingSlot, Vehicle, ParkingSession)
├── views.py           # API endpoints (7 main APIs)
├── utils.py           # Business logic functions
├── urls.py            # URL routing
├── admin.py           # Django admin interface
├── serializers.py     # Data serialization helpers
└── __init__.py        # Package initialization
```

## 🎯 Features

### Core Functionality
- **Slot Allocation**: Automatic first-available slot assignment
- **QR Code System**: Unique QR codes for entry/exit scanning
- **Real-time Billing**: Hourly rate calculation with grace period
- **Payment Processing**: CASH and ONLINE payment methods
- **Refund Logic**: 5-minute grace period for cancellations
- **Session Management**: Complete parking lifecycle tracking

### Business Rules
- ✅ **Grace Period**: 5 minutes free parking
- ✅ **Minimum Charge**: 1 hour minimum after grace period
- ✅ **Entry Validation**: Entry QR must be scanned before exit
- ✅ **Double Scan Prevention**: Prevents duplicate scans
- ✅ **Refund Rules**: 100% refund if user never arrived within 5 minutes
- ✅ **Slot Management**: Automatic slot allocation and release

## 📚 API Endpoints

### 1️⃣ Book Parking
```http
POST /api/parking/book/
Content-Type: application/json

{
    "vehicle_number": "KA-01-AB-1234",
    "owner_name": "John Doe",
    "zone_id": 1
}
```

**Response:**
```json
{
    "success": true,
    "message": "Slot allocated successfully",
    "session_id": 123,
    "slot_number": "A001",
    "qr_code": "QR-ABC123DEF456",
    "zone_name": "Zone A",
    "hourly_rate": 50.0
}
```

### 2️⃣ Scan Entry QR
```http
POST /api/parking/scan-entry/
Content-Type: application/json

{
    "qr_code": "QR-ABC123DEF456"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Entry QR scanned successfully",
    "vehicle_number": "KA-01-AB-1234",
    "slot_number": "A001",
    "zone_name": "Zone A",
    "entry_time": "2024-01-15T10:30:00Z",
    "hourly_rate": 50.0
}
```

### 3️⃣ Scan Exit QR
```http
POST /api/parking/scan-exit/
Content-Type: application/json

{
    "qr_code": "QR-ABC123DEF456",
    "payment_method": "CASH"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Exit processed successfully",
    "bill_details": {
        "vehicle_number": "KA-01-AB-1234",
        "slot_number": "A001",
        "zone_name": "Zone A",
        "entry_time": "2024-01-15T10:30:00Z",
        "exit_time": "2024-01-15T12:30:00Z",
        "duration_hours": 2,
        "hourly_rate": 50.0,
        "total_amount": 100.0,
        "payment_method": "CASH",
        "session_id": 123
    }
}
```

### 4️⃣ Check Refund Eligibility
```http
POST /api/parking/refund/
Content-Type: application/json

{
    "qr_code": "QR-ABC123DEF456"
}
```

### 5️⃣ List All Sessions
```http
GET /api/parking/sessions/
```

### 6️⃣ List Zones with Availability
```http
GET /api/parking/zones/
```

### 7️⃣ Check Payment Status
```http
POST /api/parking/payment-status/
Content-Type: application/json

{
    "session_id": 123
}
```

## 🗄️ Database Models

### ParkingZone
```python
- name: CharField(max_length=100)
- hourly_rate: DecimalField(max_digits=10, decimal_places=2)
- is_active: BooleanField(default=True)
- created_at: DateTimeField(auto_now_add=True)
```

### ParkingSlot
```python
- zone: ForeignKey(ParkingZone)
- slot_number: CharField(max_length=50)
- is_occupied: BooleanField(default=False)
- created_at: DateTimeField(auto_now_add=True)
```

### Vehicle
```python
- vehicle_number: CharField(max_length=20, unique=True)
- owner_name: CharField(max_length=100)
- created_at: DateTimeField(auto_now_add=True)
```

### ParkingSession
```python
- vehicle: ForeignKey(Vehicle)
- slot: ForeignKey(ParkingSlot)
- zone: ForeignKey(ParkingZone)
- entry_time: DateTimeField(null=True, blank=True)
- exit_time: DateTimeField(null=True, blank=True)
- qr_code: CharField(max_length=100, unique=True)
- entry_qr_scanned: BooleanField(default=False)
- exit_qr_scanned: BooleanField(default=False)
- amount_paid: DecimalField(max_digits=10, decimal_places=2, default=0)
- payment_method: CharField(choices=['CASH', 'ONLINE'])
- is_paid: BooleanField(default=False)
- created_at: DateTimeField(auto_now_add=True)
- updated_at: DateTimeField(auto_now=True)
```

## 🔧 Business Logic Functions (utils.py)

### Core Functions
- `allocate_slot(vehicle, zone)` - Allocate first available slot
- `scan_entry_qr(session_id)` - Process entry QR scan
- `scan_exit_qr(session_id, payment_method)` - Process exit and payment
- `calculate_amount(session)` - Calculate parking charges
- `release_slot(session)` - Release parking slot
- `refund_logic(session)` - Apply refund rules

### Helper Functions
- `get_session_by_qr(qr_code)` - Find session by QR code
- `validate_qr_format(qr_code)` - Validate QR code format
- `get_zone_availability(zone)` - Get zone slot availability

## 🚀 Setup & Installation

### 1. Add to Django Project
```python
# settings.py
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'backend_core_api',  # Add this line
]
```

### 2. Include URLs
```python
# main urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('backend_core_api.urls')),  # Add this line
]
```

### 3. Run Migrations
```bash
python manage.py makemigrations backend_core_api
python manage.py migrate
```

### 4. Create Superuser
```bash
python manage.py createsuperuser
```

### 5. Create Test Data
```python
# In Django shell
from backend_core_api.models import *

# Create zones
zone_a = ParkingZone.objects.create(name="Zone A", hourly_rate=50, is_active=True)
zone_b = ParkingZone.objects.create(name="Zone B", hourly_rate=60, is_active=True)

# Create slots
for i in range(1, 21):
    ParkingSlot.objects.create(zone=zone_a, slot_number=f"A{i:03d}")
    
for i in range(1, 31):
    ParkingSlot.objects.create(zone=zone_b, slot_number=f"B{i:03d}")
```

## 🧪 Testing

### Run Test Script
```bash
# Start Django server
python manage.py runserver

# Run comprehensive tests
python test_complete_api.py
```

### Manual Testing with cURL
```bash
# Book parking
curl -X POST http://localhost:8000/api/parking/book/ \
  -H "Content-Type: application/json" \
  -d '{"vehicle_number": "KA-01-AB-1234", "owner_name": "John", "zone_id": 1}'

# Scan entry
curl -X POST http://localhost:8000/api/parking/scan-entry/ \
  -H "Content-Type: application/json" \
  -d '{"qr_code": "QR-ABC123DEF456"}'

# Scan exit
curl -X POST http://localhost:8000/api/parking/scan-exit/ \
  -H "Content-Type: application/json" \
  -d '{"qr_code": "QR-ABC123DEF456", "payment_method": "CASH"}'
```

## 📊 Admin Interface

Access Django admin at `http://localhost:8000/admin/`

### Features
- **Zone Management**: Create/edit parking zones
- **Slot Management**: Monitor slot occupancy
- **Vehicle Registry**: View all registered vehicles
- **Session Monitoring**: Track all parking sessions
- **Custom Actions**: Mark as paid, cancel sessions
- **Real-time Stats**: Occupancy rates, revenue tracking

## 🔒 Security Features

- **Input Validation**: All inputs validated and sanitized
- **CSRF Protection**: Disabled for APIs (using @csrf_exempt)
- **Error Handling**: Comprehensive error messages
- **Data Integrity**: Foreign key constraints and unique constraints
- **Atomic Operations**: Database consistency guaranteed

## 📈 Performance Considerations

- **Database Indexing**: Proper indexes on frequently queried fields
- **Query Optimization**: select_related() for foreign key queries
- **Caching**: Ready for Redis/Memcached integration
- **Pagination**: Built-in support for large datasets

## 🔄 Workflow Examples

### Normal Parking Flow
1. **Book Parking** → Get QR code and slot assignment
2. **Scan Entry QR** → Record entry time, start billing
3. **Park Vehicle** → Customer parks in assigned slot
4. **Scan Exit QR** → Calculate bill, process payment
5. **Release Slot** → Slot becomes available for next customer

### Refund Scenario
1. **Book Parking** → Get QR code
2. **Check Refund** → Within 5 minutes = 100% refund eligible
3. **Never Arrive** → Customer doesn't show up
4. **Auto-Cancel** → System releases slot after timeout

### Grace Period Flow
1. **Book Parking** → Get QR code
2. **Scan Entry QR** → Start 5-minute grace period
3. **Quick Exit** → Exit within 5 minutes = Free parking
4. **Extended Stay** → After 5 minutes = Full hourly charge

## 🚀 Production Deployment

### Environment Variables
```bash
DEBUG=False
DATABASE_URL=postgresql://user:pass@localhost/parking_db
ALLOWED_HOSTS=yourdomain.com
SECRET_KEY=your-secret-key
```

### Database Migration
```bash
# For production
python manage.py migrate --settings=production_settings
python manage.py collectstatic --settings=production_settings
```

### API Rate Limiting
```python
# Add to settings.py for production
RATELIMIT_ENABLE = True
RATELIMIT_USE_CACHE = 'default'
```

## 📞 Support & Documentation

- **API Documentation**: Complete endpoint documentation included
- **Code Comments**: Line-by-line comments for beginners
- **Test Coverage**: Comprehensive test suite included
- **Error Handling**: Clear error messages for debugging

---

**Built with Django 4.2+ | Python 3.8+ | SQLite/PostgreSQL**

**Ready for production deployment with proper configuration**