import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

from django.contrib.auth import get_user_model

def fix_admin():
    User = get_user_model()
    try:
        admin = User.objects.get(username='admin')
        if admin.role != 'ADMIN':
            print(f"Updating admin role from {admin.role} to ADMIN")
            admin.role = 'ADMIN'
            admin.save()
            print("Successfully updated admin role.")
        else:
            print("Admin role is already ADMIN.")
    except User.DoesNotExist:
        print("Admin user not found!")

if __name__ == "__main__":
    fix_admin()
