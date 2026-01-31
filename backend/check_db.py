import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

from backend_core_api.models import User

print(f"Total Users in DB: {User.objects.count()}")
print("Recent Users:")
for user in User.objects.order_by('-date_joined')[:5]:
    print(f"- {user.username} ({user.role})")
