import os
import django
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from backend_core_api.models import User, Attendance

def test_login(identifier, password):
    print(f"Testing login for: {identifier}")
    
    # Simulate StaffLoginView logic
    username = identifier
    if identifier and '@' in identifier:
        try:
            user_obj = User.objects.get(email=identifier)
            username = user_obj.username
        except User.DoesNotExist:
            pass
            
    user = authenticate(username=username, password=password)
    
    if user:
        print(f"SUCCESS: Authenticated as {user.username} (Role: {user.role})")
        refresh = RefreshToken.for_user(user)
        print(f"Tokens generated: {str(refresh.access_token)[:10]}...")
    else:
        print("FAILED: Invalid credentials")

if __name__ == "__main__":
    test_login('teststaff', 'password123')
