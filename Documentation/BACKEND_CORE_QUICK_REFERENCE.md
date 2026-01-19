# 🚀 Smart Parking Backend - Quick Reference

## 📁 Files Overview

| File | Purpose | Lines |
|------|---------|-------|
| **models.py** | 4 database models | ~140 |
| **utils.py** | All business logic functions | ~400 |
| **views.py** | 5 simple view functions | ~180 |
| **urls.py** | URL routing | ~20 |
| **entry.html** | Entry form | ~200 |
| **entry_scan.html** | Entry QR scan form | ~180 |
| **exit.html** | Exit & bill form | ~240 |

---

## 🔧 Core Functions in utils.py

### 1. allocate_slot(vehicle_number, owner_name, zone_id)
```python
# Input: vehicle info + zone
# Output: session with QR code
# Does: Finds free slot, marks occupied, creates session

result = allocate_slot("DL-01-AB-1234", "John", zone_id)
# result['data']['qr_code'] → Show to user
```

### 2. scan_entry_qr(qr_code)
```python
# Input: QR code
# Output: Entry confirmation
# Does: Marks entry scanned, saves entry time

result = scan_entry_qr(qr_code)
# Must call AFTER allocate_slot()
```

### 3. calculate_amount(session)
```python
# Input: parking session
# Output: amount in rupees
# Does: Calculates duration × rate with grace period

amount = calculate_amount(session)
# Grace: 5 minutes free
# Minimum: 1 hour
```

### 4. scan_exit_qr(qr_code, payment_method)
```python
# Input: QR code + CASH or ONLINE
# Output: Bill details
# Does: Saves exit time, calculates bill, releases slot

result = scan_exit_qr(qr_code, "CASH")
# Must call AFTER scan_entry_qr()
```

### 5. release_slot(session)
```python
# Input: parking session
# Output: True/False
# Does: Marks slot as available

success = release_slot(session)
# Called automatically by scan_exit_qr()
```

### 6. cancel_parking_session(qr_code)
```python
# Input: QR code
# Output: Cancellation + refund info
# Does: Releases slot, applies grace period

result = cancel_parking_session(qr_code)
# Refund only if NOT entered within 5 min
```

---

## 📡 API Endpoints

| Endpoint | Method | Input | Output |
|----------|--------|-------|--------|
| `/parking/entry/` | POST | vehicle_number, owner_name, zone_id | QR code |
| `/parking/entry-qr-scan/` | POST | qr_code | Entry confirmation |
| `/parking/exit-qr-scan/` | POST | qr_code, payment_method | Bill |
| `/parking/cancel-booking/` | POST | qr_code | Refund info |
| `/parking/zone/<id>/status/` | GET | - | Zone status |

---

## 💾 Models Summary

```python
# ParkingZone
- name (Zone A, Zone B, etc)
- hourly_rate (50, 75, 100)
- is_active (True/False)

# ParkingSlot
- zone (FK to ParkingZone)
- slot_number (A-001, A-002)
- is_occupied (True/False)

# Vehicle
- vehicle_number (DL-01-AB-1234)
- owner_name (John Doe)

# ParkingSession
- vehicle (FK)
- slot (FK)
- zone (FK)
- entry_time (2024-01-18 10:30)
- exit_time (2024-01-18 12:30)
- qr_code (unique)
- entry_qr_scanned (True/False)
- exit_qr_scanned (True/False)
- amount_paid (150.00)
- payment_method (CASH/ONLINE)
- is_paid (True/False)
```

---

## ⚙️ Views Summary

```python
vehicle_entry_view()        # Show entry form, allocate slot
qr_entry_scan_view()        # Scan entry QR
qr_exit_scan_view()         # Scan exit QR, generate bill
cancel_booking_view()       # Cancel and refund
zone_status_view()          # Show zone availability
```

All views are **THIN** - they just call utils functions.

---

## 🔒 Security Rules

```
✅ Entry QR must be scanned first
✅ Exit QR comes after entry QR
✅ Can't scan QR twice (prevents double)
✅ Refund locked after entry scan
✅ No payment = No slot release
✅ Times auto-saved (no manual edit)
```

---

## 💰 Billing Formula

```
Base Duration = Exit Time - Entry Time

Grace Period = 5 minutes (free)

Billable Duration = Base Duration - Grace Period
                   (if result < 0, then 0)

Billable Hours = CEIL(Billable Duration / 60 minutes)

Minimum Hours = 1 (even if less than 60 min)

Amount = Billable Hours × Hourly Rate
```

**Examples:**
```
45 min  → 0 + 1 (min) = ₹50
65 min  → 60 + 1 (min) = ₹50 (grace applies)
66 min  → 61 → 2 hours = ₹100
150 min → 145 → 3 hours = ₹150
```

---

## 🧪 Quick Test Flow

```bash
# 1. Setup
python manage.py migrate
python manage.py shell
  # Create zones and slots (see testing guide)
  exit()

# 2. Entry
POST /parking/entry/
→ Get QR code

# 3. Entry Scan
POST /parking/entry-qr-scan/
→ Entry confirmed

# 4. Exit Scan
POST /parking/exit-qr-scan/
→ Bill calculated
```

---

## 🎓 Code Quality

| Aspect | Status |
|--------|--------|
| Comments | ✅ Line-by-line |
| Variable Names | ✅ Clear & readable |
| Functions | ✅ Single responsibility |
| Validation | ✅ Basic Django checks |
| Error Handling | ✅ Try-except with messages |
| Complexity | ✅ Simple & beginner-friendly |
| Design Patterns | ❌ None (pure Django) |
| DRF | ❌ Not used |

---

## 📚 Reading Order

1. **models.py** - Database structure (5 min)
2. **utils.py** - Business logic (15 min)
3. **views.py** - How they connect (10 min)
4. **urls.py** - Routing (2 min)
5. **templates/** - Forms (10 min)

**Total: ~45 minutes to understand everything**

---

## 🔍 Debugging Quick Tips

### Q: Where is the logic?
A: All in **utils.py** (not views.py)

### Q: How does billing work?
A: See `calculate_amount()` in utils.py (line ~150)

### Q: What if QR fails?
A: Check session exists in database

### Q: How to reset?
A: `ParkingSlot.objects.all().update(is_occupied=False)`

### Q: Where to add new features?
A: Add new function to utils.py, call from views.py

---

## 🚀 Deploy Checklist

- [ ] All migrations applied
- [ ] Test zones created
- [ ] Test slots created
- [ ] Entry flow working
- [ ] Exit flow working
- [ ] Billing correct
- [ ] QR code generation working
- [ ] Error handling working
- [ ] Refund logic working

---

## 📞 Support

**This is educational code for learning.**
- Clean, simple, readable
- Fully commented
- No shortcuts
- Pure Django

**Questions?** Check BACKEND_CORE_DOCUMENTATION.md for detailed info.

---

## 🎯 Key Takeaways

1. **Separation of Concerns**: Logic in utils, views stay thin
2. **Security First**: QR codes, time-based logic, validation
3. **Simple is Better**: No DRF, no decorators, just Django
4. **Beginner-Friendly**: Comments on every function, clear names
5. **Database-Driven**: Always persist to DB immediately

---

**Happy coding! 🚗✨**
