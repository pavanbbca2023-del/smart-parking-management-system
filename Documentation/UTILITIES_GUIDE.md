# Utilities Documentation

## Overview

The `utils/` folder contains helper functions that make common tasks easier throughout the parking system. These utilities are designed to be simple, reusable, and beginner-friendly.

---

## File Structure

```
parking/utils/
├── __init__.py
├── time_utils.py       # Time-related helper functions
└── random_utils.py     # Random data generation functions
```

---

## TimeUtils (`time_utils.py`)

### Purpose
Helper functions for time-related operations in the parking system.

### Functions

#### 1. `get_duration_in_hours_and_minutes(start_time, end_time)`

Calculate how long between two times.

```python
from backend_core.parking.utils.time_utils import TimeUtils

start = timezone.now() - timedelta(hours=1, minutes=30)
end = timezone.now()

duration = TimeUtils.get_duration_in_hours_and_minutes(start, end)

# Returns:
# {
#     'hours': 1,
#     'minutes': 30,
#     'total_minutes': 90,
#     'total_seconds': 5400
# }

print(f"Parked for {duration['hours']}h {duration['minutes']}m")
```

---

#### 2. `format_time_for_display(datetime_obj, format_string)`

Format time in a nice way for showing to users.

```python
from backend_core.parking.utils.time_utils import TimeUtils

time = session.entry_time

# Default format
display = TimeUtils.format_time_for_display(time)
# "17-01-2024 10:30:45"

# Date only
date_only = TimeUtils.format_time_for_display(time, '%d-%m-%Y')
# "17-01-2024"

# Time only
time_only = TimeUtils.format_time_for_display(time, '%H:%M:%S')
# "10:30:45"

# ISO format
iso = TimeUtils.format_time_for_display(time, '%Y-%m-%d %H:%M:%S')
# "2024-01-17 10:30:45"
```

---

#### 3. `get_time_difference_in_words(past_time)`

Show how long ago something happened.

```python
from backend_core.parking.utils.time_utils import TimeUtils

time_ago = TimeUtils.get_time_difference_in_words(session.entry_time)
# Returns: "2 hours ago", "30 minutes ago", etc.

print(f"Vehicle entered {time_ago}")
```

---

#### 4. `get_current_time()`

Get the current time (timezone-aware).

```python
from backend_core.parking.utils.time_utils import TimeUtils

now = TimeUtils.get_current_time()
print(f"Current time: {now}")
```

---

#### 5. `is_time_within_range(time_to_check, start_time, end_time)`

Check if a time is between two times.

```python
from backend_core.parking.utils.time_utils import TimeUtils

start = timezone.now()
end = timezone.now() + timedelta(hours=2)
check_time = timezone.now() + timedelta(hours=1)

is_within = TimeUtils.is_time_within_range(check_time, start, end)
# True - because 1 hour is between start and end

if is_within:
    print("Time is within range")
```

---

#### 6. `add_time_to_datetime(datetime_obj, hours=0, minutes=0, seconds=0)`

Add time to a datetime.

```python
from backend_core.parking.utils.time_utils import TimeUtils

current = timezone.now()

# Add 1 hour and 30 minutes
future = TimeUtils.add_time_to_datetime(current, hours=1, minutes=30)
print(f"1.5 hours later: {future}")
```

---

#### 7. `subtract_time_from_datetime(datetime_obj, hours=0, minutes=0, seconds=0)`

Subtract time from a datetime.

```python
from backend_core.parking.utils.time_utils import TimeUtils

current = timezone.now()

# Go back 30 minutes
past = TimeUtils.subtract_time_from_datetime(current, minutes=30)
print(f"30 minutes ago: {past}")
```

---

#### 8. `get_start_of_day(date_obj=None)` and `get_end_of_day(date_obj=None)`

Get start (00:00:00) and end (23:59:59) of a day.

```python
from backend_core.parking.utils.time_utils import TimeUtils

# Today
start = TimeUtils.get_start_of_day()  # 00:00:00 today
end = TimeUtils.get_end_of_day()      # 23:59:59 today

# Specific date
from datetime import date
specific_date = date(2024, 1, 17)
start = TimeUtils.get_start_of_day(specific_date)
end = TimeUtils.get_end_of_day(specific_date)

# Get all sessions today
from backend_core.parking.models import ParkingSession

sessions = ParkingSession.objects.filter(
    entry_time__gte=start,
    entry_time__lte=end
)
print(f"Sessions today: {sessions.count()}")
```

---

#### 9. `format_duration_as_string(hours, minutes, seconds=0)`

Format duration as readable text.

```python
from backend_core.parking.utils.time_utils import TimeUtils

# Format different durations
duration1 = TimeUtils.format_duration_as_string(1, 30)      # "1h 30m"
duration2 = TimeUtils.format_duration_as_string(0, 45)      # "45m"
duration3 = TimeUtils.format_duration_as_string(2, 0)       # "2h"
duration4 = TimeUtils.format_duration_as_string(0, 0, 30)   # "30s"

print(f"You parked for {duration1}")
```

---

## RandomUtils (`random_utils.py`)

### Purpose
Helper functions for generating random data (codes, IDs, numbers, etc).

### Functions

#### 1. `generate_random_code(length=10, include_numbers=True, include_letters=True)`

Generate a random code.

```python
from backend_core.parking.utils.random_utils import RandomUtils

# Mix of letters and numbers
code1 = RandomUtils.generate_random_code()
# "ABC123DEF4"

# Only letters
code2 = RandomUtils.generate_random_code(include_numbers=False)
# "ABCDEFGHIJ"

# Only numbers
code3 = RandomUtils.generate_random_code(include_letters=False)
# "1234567890"

# Custom length
code4 = RandomUtils.generate_random_code(length=6)
# "A1B2C3"
```

---

#### 2. `generate_random_string(length=20)`

Generate a random string (letters only, mixed case).

```python
from backend_core.parking.utils.random_utils import RandomUtils

random_string = RandomUtils.generate_random_string()
# "aBcDeFgHiJkLmNoPqRsT"

short_string = RandomUtils.generate_random_string(length=5)
# "AbCdE"
```

---

#### 3. `generate_random_number(min_value=0, max_value=999999)`

Generate a random number in a range.

```python
from backend_core.parking.utils.random_utils import RandomUtils

# Default: 0 to 999999
number1 = RandomUtils.generate_random_number()

# Custom range: 1 to 100
number2 = RandomUtils.generate_random_number(min_value=1, max_value=100)

print(f"Random number: {number2}")
```

---

#### 4. `generate_uuid()`

Generate a unique UUID (for IDs).

```python
from backend_core.parking.utils.random_utils import RandomUtils

unique_id = RandomUtils.generate_uuid()
# "550e8400-e29b-41d4-a716-446655440000"

print(f"Unique ID: {unique_id}")
```

---

#### 5. `generate_random_slot_number(prefix="A")`

Generate a random parking slot number.

```python
from backend_core.parking.utils.random_utils import RandomUtils

# With prefix "A"
slot1 = RandomUtils.generate_random_slot_number()
# "A042"

# With prefix "B"
slot2 = RandomUtils.generate_random_slot_number(prefix="B")
# "B156"

print(f"Assigned slot: {slot1}")
```

---

#### 6. `generate_random_vehicle_number()`

Generate a random vehicle registration number.

```python
from backend_core.parking.utils.random_utils import RandomUtils

vehicle = RandomUtils.generate_random_vehicle_number()
# "KA-01-AB-1234"

print(f"Test vehicle: {vehicle}")
```

---

#### 7. `generate_random_password(length=12)`

Generate a strong random password.

```python
from backend_core.parking.utils.random_utils import RandomUtils

password = RandomUtils.generate_random_password()
# "aBc123!@#$%^"

# Custom length
strong_password = RandomUtils.generate_random_password(length=20)

print(f"New password: {password}")
```

---

#### 8. `pick_random_from_list(items_list)`

Pick one random item from a list.

```python
from backend_core.parking.utils.random_utils import RandomUtils

zones = ["Zone A", "Zone B", "Zone C"]

random_zone = RandomUtils.pick_random_from_list(zones)
# "Zone B" (or any random one)

print(f"Assigning to: {random_zone}")
```

---

#### 9. `shuffle_list(items_list)`

Shuffle a list in random order.

```python
from backend_core.parking.utils.random_utils import RandomUtils

slots = [1, 2, 3, 4, 5]

shuffled = RandomUtils.shuffle_list(slots)
# [3, 1, 5, 2, 4] (or any random order)

print(f"Shuffled: {shuffled}")
print(f"Original: {slots}")  # Original unchanged
```

---

#### 10. `get_random_sample(items_list, sample_size)`

Get multiple random items from a list.

```python
from backend_core.parking.utils.random_utils import RandomUtils

all_slots = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# Get 3 random items
random_3 = RandomUtils.get_random_sample(all_slots, 3)
# [5, 2, 8] (or any 3 random slots)

print(f"Selected slots: {random_3}")
```

---

## Practical Examples

### Example 1: Format Parking Receipt

```python
from backend_core.parking.utils.time_utils import TimeUtils
from backend_core.parking.services.billing_service import BillingService

# Get bill details
details = BillingService.get_bill_details(session)

# Format nicely
print("=" * 40)
print("PARKING RECEIPT")
print("=" * 40)
print(f"Vehicle: {details['vehicle_number']}")
print(f"Zone: {details['zone_name']}")
print(f"Entry:  {TimeUtils.format_time_for_display(details['entry_time'], '%H:%M:%S')}")
print(f"Exit:   {TimeUtils.format_time_for_display(details['exit_time'], '%H:%M:%S')}")
print(f"Duration: {TimeUtils.format_duration_as_string(details['duration_hours'], details['duration_minutes'])}")
print(f"Amount: ₹{details['amount_paid']}")
print("=" * 40)
```

---

### Example 2: Daily Report

```python
from backend_core.parking.utils.time_utils import TimeUtils
from backend_core.parking.models import ParkingSession

# Get today's range
start = TimeUtils.get_start_of_day()
end = TimeUtils.get_end_of_day()

# Get sessions
sessions = ParkingSession.objects.filter(
    entry_time__gte=start,
    entry_time__lte=end
)

print(f"Daily Report - {TimeUtils.format_time_for_display(TimeUtils.get_current_time(), '%d-%m-%Y')}")
print(f"Total Vehicles: {sessions.count()}")
```

---

### Example 3: Test Data

```python
from backend_core.parking.utils.random_utils import RandomUtils
from backend_core.parking.models import Vehicle

# Create 10 random test vehicles
for _ in range(10):
    vehicle_number = RandomUtils.generate_random_vehicle_number()
    Vehicle.objects.create(
        vehicle_number=vehicle_number,
        vehicle_type="Car"
    )

print("Created 10 test vehicles")
```

---

## When to Use Utilities

### TimeUtils
- ✅ Display times to users
- ✅ Calculate time differences
- ✅ Get duration between two times
- ✅ Format dates for reports
- ✅ Check if time is within range

### RandomUtils
- ✅ Generate test data
- ✅ Create random codes
- ✅ Generate secure passwords
- ✅ Pick random items
- ✅ Generate unique IDs

---

## Tips

1. **Always use utilities** - Don't write time/random code yourself
2. **Check for None** - Some functions can return None on error
3. **Import correctly** - Full path: `from backend_core.parking.utils.time_utils import TimeUtils`
4. **Use in services** - Call utilities from service layer, not views
5. **Add logging** - All utilities already log operations

---

## Common Patterns

### Pattern 1: Show how long ago
```python
time_ago = TimeUtils.get_time_difference_in_words(session.entry_time)
print(f"Parked {time_ago}")
```

### Pattern 2: Calculate duration
```python
duration = TimeUtils.get_duration_in_hours_and_minutes(start, end)
formatted = TimeUtils.format_duration_as_string(duration['hours'], duration['minutes'])
print(f"Duration: {formatted}")
```

### Pattern 3: Daily report
```python
start = TimeUtils.get_start_of_day()
end = TimeUtils.get_end_of_day()
sessions = ParkingSession.objects.filter(entry_time__gte=start, entry_time__lte=end)
```

---

**Keep your code clean - use utilities!** ✨

