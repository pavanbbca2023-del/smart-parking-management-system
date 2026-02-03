#!/usr/bin/env python
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

from backend_core_api.models import User

def check_user_data():
    print("=== USER DATA CHECK ===\n")
    
    users = User.objects.all()
    for user in users:
        print(f"ID: {user.id}")
        print(f"Username: {user.username}")
        print(f"Email: {user.email}")
        print(f"Role: {user.role}")
        print(f"Phone: {user.phone_number}")
        print(f"Active: {user.is_active}")
        print(f"Plain Password: {user.plain_password}")
        print(f"Staff: {user.is_staff}")
        print(f"Superuser: {user.is_superuser}")
        print("-" * 30)

if __name__ == '__main__':
    check_user_data()