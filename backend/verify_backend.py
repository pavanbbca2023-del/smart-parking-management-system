import urllib.request
import urllib.error
import urllib.parse
import json
import random
import sys

BASE_URL = "http://localhost:8000"

def run_test(name, func):
    print(f"\n--- Testing {name} ---")
    try:
        func()
        print(f"✅ {name} Passed")
        return True
    except Exception as e:
        print(f"❌ {name} Failed: {str(e)}")
        return False

def test_home():
    with urllib.request.urlopen(f"{BASE_URL}/") as response:
        data = json.loads(response.read().decode())
        print(f"Response: {data}")
        if data.get('status') != 'online':
            raise Exception("Status not online")

def test_staff_auth():
    # 1. Register
    rand_id = random.randint(1000, 9999)
    staff_id = f"STAFF{rand_id}"
    email = f"staff{rand_id}@example.com"
    password = "testpassword123"
    
    reg_data = {
        "first_name": "Test",
        "last_name": "Staff",
        "email": email,
        "phone": f"987654{rand_id}",
        "staff_id": staff_id,
        "password": password
    }
    
    print(f"Attempting to register {staff_id}...")
    req = urllib.request.Request(
        f"{BASE_URL}/api/core/staff/register/",
        data=json.dumps(reg_data).encode(),
        headers={'Content-Type': 'application/json'}
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            reg_resp = json.loads(response.read().decode())
            print(f"Register Response: {reg_resp}")
            if not reg_resp.get('success'):
                raise Exception("Registration success flag missing")
    except urllib.error.HTTPError as e:
        print(f"Register failed with {e.code}: {e.read().decode()}")
        raise

    # 2. Login
    print(f"Attempting to login...")
    login_data = {
        "email": email,
        "password": password
    }
    
    req = urllib.request.Request(
        f"{BASE_URL}/api/core/staff/login/",
        data=json.dumps(login_data).encode(),
        headers={'Content-Type': 'application/json'}
    )
    
    token = None
    with urllib.request.urlopen(req) as response:
        login_resp = json.loads(response.read().decode())
        print(f"Login Response: {login_resp}")
        if not login_resp.get('success'):
            raise Exception("Login success flag missing")
        token = login_resp.get('token')
        
    if not token:
        raise Exception("No token received")
        
    # 3. Access Protected/Public Resource (Zones)
    print(f"Fetching zones...")
    req = urllib.request.Request(f"{BASE_URL}/api/core/zones/")
    # If needing auth, add headers={'Authorization': f'Bearer {token}'}
    # Currently Zones are AllowAny
    
    with urllib.request.urlopen(req) as response:
        zones_resp = json.loads(response.read().decode())
        print(f"Zones count: {len(zones_resp.get('zones', []))}")

if __name__ == "__main__":
    tests = [
        ("Home Endpoint", test_home),
        ("Staff Auth Flow", test_staff_auth)
    ]
    
    failed = False
    for name, func in tests:
        if not run_test(name, func):
            failed = True
            
    if failed:
        sys.exit(1)
    print("\n🎉 All Backend Tests Passed!")
