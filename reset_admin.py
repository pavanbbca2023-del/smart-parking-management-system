#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

from backend_core_api.models import User

print("=== ALL USERS ===")
users = User.objects.all()
for user in users:
    print(f"ID: {user.id}, Username: {user.username}, Role: {user.role}, Active: {user.is_active}")

print("\n=== RESETTING ADMIN PASSWORD ===")
try:
    admin_user = User.objects.get(username='admin')
    admin_user.set_password('admin123')
    admin_user.role = 'ADMIN'
    admin_user.is_staff = True
    admin_user.is_superuser = True
    admin_user.save()
    print("Admin password reset successfully!")
except User.DoesNotExist:
    print("Admin user not found, creating new one...")
    User.objects.create_superuser(
        username='admin',
        email='admin@parking.com',
        password='admin123',
        role='ADMIN'
    )
    print("New admin user created!")

print("\n=== LOGIN CREDENTIALS ===")
print("Username: admin")
print("Password: admin123")
print("Role: ADMIN")