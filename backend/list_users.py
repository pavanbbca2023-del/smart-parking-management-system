
import os
import django
import sys

# Setup Django environment
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

from backend_core_api.models import User

def list_users():
    print("--- Existing Users ---")
    users = User.objects.all()
    if not users:
        print("No users found in database.")
    
    for user in users:
        print(f"Username: {user.username} | Email: {user.email} | Role: {user.role} | Active: {user.is_active} | Staff: {user.is_staff} | Superuser: {user.is_superuser}")

if __name__ == "__main__":
    list_users()
