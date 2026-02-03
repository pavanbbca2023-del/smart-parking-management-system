import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

from backend_core_api.models import ParkingSession
from django.utils import timezone

# Check all sessions
sessions = ParkingSession.objects.all()
print(f"Total sessions: {sessions.count()}")

for session in sessions:
    print(f"ID: {session.id}, Vehicle: {session.vehicle_number}, Status: {session.status}, Entry: {session.entry_time}")

# Check today's reserved sessions
today = timezone.now().date()
reserved_today = ParkingSession.objects.filter(
    entry_time__date=today,
    status__in=['reserved', 'pending_payment']
)
print(f"\nReserved today: {reserved_today.count()}")

# Check all reserved sessions
all_reserved = ParkingSession.objects.filter(status__in=['reserved', 'pending_payment'])
print(f"All reserved: {all_reserved.count()}")
for session in all_reserved:
    print(f"Reserved - ID: {session.id}, Vehicle: {session.vehicle_number}, Status: {session.status}, Entry: {session.entry_time}")