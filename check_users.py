#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

from backend_core_api.models import User

# Check existing users
print("=== EXISTING USERS ===")
users = User.objects.all()
for user in users:
    print(f"Username: {user.username}, Role: {user.role}")

print("\n=== CREATING STAFF ACCOUNT ===")
# Create staff user if doesn't exist
if not User.objects.filter(username='staff1').exists():
    User.objects.create_user(
        username='staff1',
        email='staff1@parking.com',
        password='staff123',
        role='STAFF'
    )
    print("Staff user 'staff1' created!")
else:
    print("Staff user 'staff1' already exists!")

print("\n=== STAFF LOGIN DETAILS ===")
print("Username: staff1")
print("Password: staff123")
print("Role: STAFF")