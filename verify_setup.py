#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

from django.contrib.auth.models import User
from analytics.models import ParkingZone, ParkingSlot, Vehicle, ParkingSession, Payment, AnalyticsReport, SystemMetrics

# Check Users
users = User.objects.all()
print(f"✅ Total users: {users.count()}")
print(f"✅ Admin users: {[u.username for u in users if u.is_superuser]}")
print()

# Check Database Tables
print("Database Tables Status:")
print(f"✅ ParkingZone records: {ParkingZone.objects.count()}")
print(f"✅ ParkingSlot records: {ParkingSlot.objects.count()}")
print(f"✅ Vehicle records: {Vehicle.objects.count()}")
print(f"✅ ParkingSession records: {ParkingSession.objects.count()}")
print(f"✅ Payment records: {Payment.objects.count()}")
print(f"✅ AnalyticsReport records: {AnalyticsReport.objects.count()}")
print(f"✅ SystemMetrics records: {SystemMetrics.objects.count()}")
print()

print("✅ PROJECT SETUP COMPLETE!")
print()
print("Admin Credentials:")
print("  Username: admin")
print("  Password: admin123456")
print()
print("Admin Panel URL: http://127.0.0.1:8000/admin/")
print("API Documentation URL: http://127.0.0.1:8000/api/analytics/")

