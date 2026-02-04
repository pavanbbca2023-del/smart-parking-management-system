
import os
import django
import sys

# Setup Django environment
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

from backend_core_api.models import User

def create_users():
    print("--- Creating Default Users ---")
    
    # Create Admin
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
        print("Created Superuser: admin / admin123")
    else:
        print("Superuser 'admin' already exists.")

    # Create Staff
    if not User.objects.filter(username='staff001').exists():
        User.objects.create_user(
            username='staff001', 
            email='staff001@example.com', 
            password='password123',
            role='STAFF',
            first_name='Staff',
            last_name='Member'
        )
        print("Created Staff User: staff001 / password123")
    else:
        print("Staff user 'staff001' already exists.")

if __name__ == "__main__":
    create_users()
