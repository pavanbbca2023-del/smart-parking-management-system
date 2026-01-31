import os
import django
import random
from django.utils import timezone
from datetime import timedelta, time

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

from django.contrib.auth import get_user_model
from backend_core_api.models import Attendance, Dispute, Schedule, Zone, ParkingSession

def seed_placeholders():
    User = get_user_model()
    staff_users = User.objects.filter(role='STAFF')
    zones = Zone.objects.all()
    sessions = ParkingSession.objects.all()

    if not staff_users.exists():
        print("No staff users found. Run seed_staff_salaries.py first.")
        return

    print("Seeding Attendance records...")
    for staff in staff_users:
        # Create 5 days of attendance
        for i in range(5):
            entry = timezone.now() - timedelta(days=i, hours=random.randint(8, 10))
            exit = entry + timedelta(hours=8)
            Attendance.objects.get_or_create(
                staff=staff,
                entry_time=entry,
                exit_time=exit if random.random() > 0.2 else None,
                status='completed' if random.random() > 0.2 else 'on-duty'
            )

    print("Seeding Schedule records...")
    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    for day in days:
        for shift_type, timing in [('Alpha', (6, 14)), ('Bravo', (14, 22)), ('Charlie', (22, 6))]:
            staff = random.choice(staff_users)
            Schedule.objects.get_or_create(
                staff=staff,
                day=day,
                shift_type=shift_type,
                shift_start=time(timing[0], 0),
                shift_end=time(timing[1], 0),
                is_active=True
            )

    print("Seeding Dispute records...")
    dispute_data = [
        ("Incorrect overcharge on exit", "High", "Finances"),
        ("QR code not scanning properly", "Medium", "Technical"),
        ("Slot occupied by another vehicle", "Medium", "Operations"),
        ("Payment failed but amount deducted", "High", "Finances"),
        ("Rude behavior by staff member", "Low", "Service")
    ]
    if sessions.exists():
        for i in range(10):
            session = random.choice(sessions)
            reason, severity, d_type = random.choice(dispute_data)
            Dispute.objects.create(
                session=session,
                user=session.user if session.user else random.choice(User.objects.all()),
                reason=reason,
                severity=severity,
                dispute_type=d_type,
                status=random.choice(['Open', 'Resolved', 'In Progress'])
            )

    print("Placeholder seeding completed!")

if __name__ == "__main__":
    seed_placeholders()
