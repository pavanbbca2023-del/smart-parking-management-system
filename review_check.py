from backend_core_api.models import *
from django.db import connection
from django.contrib import admin

print('=' * 70)
print('SENIOR DJANGO BACKEND REVIEW')
print('=' * 70)
print('')

# 1. DATABASE TABLES
print('1. DATABASE TABLES')
print('-' * 70)
tables = connection.introspection.table_names()
required_tables = [
    'backend_core_api_parkingzone',
    'backend_core_api_parkingslot',
    'backend_core_api_vehicle',
    'backend_core_api_parkingsession',
    'backend_core_api_user'
]
for table in required_tables:
    status = 'PASS' if table in tables else 'FAIL'
    print(f'[{status}] {table}')
print('')

# 2. MODELS VALIDATION
print('2. MODELS VALIDATION')
print('-' * 70)
models_to_check = [
    ('ParkingZone', ParkingZone),
    ('ParkingSlot', ParkingSlot),
    ('Vehicle', Vehicle),
    ('ParkingSession', ParkingSession),
    ('User', User),
]

for name, model in models_to_check:
    try:
        obj = model.objects.first()
        status = 'PASS'
    except Exception as e:
        status = f'FAIL: {str(e)[:30]}'
    print(f'[{status}] {name}')
print('')

# 3. DATABASE INTEGRITY
print('3. DATABASE INTEGRITY')
print('-' * 70)
orphan_sessions = ParkingSession.objects.filter(slot__isnull=True).count()
print(f'[{"PASS" if orphan_sessions == 0 else "FAIL"}] No orphan sessions: {orphan_sessions}')

occupied_without_session = ParkingSlot.objects.filter(is_occupied=True, sessions__isnull=True).count()
print(f'[{"PASS" if occupied_without_session == 0 else "FAIL"}] Occupied slots have sessions: {occupied_without_session}')

unpaid_exits = ParkingSession.objects.filter(exit_time__isnull=False, is_paid=False).count()
print(f'[{"WARN" if unpaid_exits > 0 else "PASS"}] Unpaid exits exist: {unpaid_exits}')

print('')

# 4. ADMIN REGISTRATION
print('4. ADMIN REGISTRATION')
print('-' * 70)
admin_checks = [
    ('ParkingZone', ParkingZone),
    ('ParkingSlot', ParkingSlot),
    ('Vehicle', Vehicle),
    ('ParkingSession', ParkingSession),
]
for name, model in admin_checks:
    status = 'PASS' if model in admin.site._registry else 'FAIL'
    print(f'[{status}] {name} registered')

print('')

# 5. FUNCTION CHECKS
print('5. UTILITY FUNCTIONS')
print('-' * 70)
from backend_core_api import utils
functions = [
    'allocate_slot',
    'scan_entry_qr',
    'scan_exit_qr',
    'calculate_amount',
    'release_slot',
    'refund_logic',
    'get_session_by_qr',
    'validate_qr_format',
    'get_zone_availability'
]
for func_name in functions:
    has_func = hasattr(utils, func_name)
    status = 'PASS' if has_func else 'FAIL'
    print(f'[{status}] {func_name}()')

print('')
print('=' * 70)
print('REVIEW COMPLETE')
print('=' * 70)
