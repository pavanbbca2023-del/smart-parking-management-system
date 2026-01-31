import requests
import json
import sys
import random
import time

BASE_URL = "http://localhost:8000"

# Colors for output
GREEN = '\033[92m'
RED = '\033[91m'
BLUE = '\033[94m'
RESET = '\033[0m'


def log(msg):
    print(msg)
    with open("verification_results.log", "a", encoding="utf-8") as f:
        f.write(msg + "\n")

def print_step(msg):
    log(f"\n=== {msg} ===")

def print_success(msg):
    log(f"SUCCESS: {msg}")

def print_fail(msg):
    log(f"FAIL: {msg}")

def get_token(username, password):
    url = f"{BASE_URL}/api/core/staff/login/"
    data = {"username": username, "password": password}
    try:
        resp = requests.post(url, json=data)
        if resp.status_code == 200:
            token = resp.json().get('token') or resp.json().get('access')
            print_success(f"Logged in as {username}")
            return token
        else:
            print_fail(f"Login failed for {username}: {resp.text}")
            return None
    except Exception as e:
        print_fail(f"Login error: {e}")
        return None

def verify_full_cycle():
    # Clear log file
    with open("verification_results.log", "w", encoding="utf-8") as f:
        f.write("Starting Verification run...\n")

    print_step("1. User Booking Flow")
    
    # 1.1 Fetch Zones
    try:
        zones_resp = requests.get(f"{BASE_URL}/api/core/zones/")
        zones = zones_resp.json().get('zones', [])
        if not zones:
            print_fail("No zones found")
            return
        zone = zones[0]
        log(f"Selected Zone: {zone['name']}")
    except Exception as e:
        print_fail(f"Failed to fetch zones: {e}")
        return

    # 1.2 Create Booking
    vehicle_num = f"CHK-{random.randint(1000,9999)}"
    booking_payload = {
        "vehicle_number": vehicle_num,
        "zone_id": zone['id'],
        "mobileNumber": "9876543210",
        "email": "verify@test.com"
    }
    
    session_id = None
    try:
        book_resp = requests.post(f"{BASE_URL}/api/core/sessions/book/", json=booking_payload)
        if book_resp.status_code == 201:
            data = book_resp.json()
            session_id = data.get('id')
            print_success(f"Booking Created! ID: {session_id}, Vehicle: {vehicle_num}")
            log(f"QR Code: {data.get('qr_code')}")
        else:
            print_fail(f"Booking Failed: {book_resp.text}")
            return
    except Exception as e:
        print_fail(f"Booking Error: {e}")
        return

    # --- Verification Phase ---
    
    print_step("2. Verifying Staff Access")
    staff_token = get_token("staff1", "staff123")
    if staff_token:
        headers = {"Authorization": f"Bearer {staff_token}"}
        # Check if staff can see the specific session
        resp = requests.get(f"{BASE_URL}/api/core/sessions/{session_id}/", headers=headers)
        if resp.status_code == 200:
            s_data = resp.json()
            if s_data.get('vehicle_number') == vehicle_num:
                print_success(f"Staff 'staff1' CAN SEE booking {session_id}")
            else:
                print_fail("Staff saw session but data mismatch")
        else:
            print_fail(f"Staff could NOT see booking: {resp.status_code}")

    print_step("3. Verifying Admin Access")
    admin_token = get_token("admin", "admin123")
    if admin_token:
        headers = {"Authorization": f"Bearer {admin_token}"}
        # Check if admin can see the specific session
        resp = requests.get(f"{BASE_URL}/api/core/sessions/{session_id}/", headers=headers)
        if resp.status_code == 200:
            a_data = resp.json()
            if a_data.get('vehicle_number') == vehicle_num:
                print_success(f"Admin 'admin' CAN SEE booking {session_id}")
            else:
                print_fail("Admin saw session but data mismatch")
        else:
            print_fail(f"Admin could NOT see booking: {resp.status_code}")

    # --- Entry Flow (Staff) ---
    print_step("4. Staff Simulating Entry")
    if staff_token:
        entry_payload = {
            "qr_code_data": f"PARK-{vehicle_num}" # Assuming this is the QR format, or we use session ID
        }
        
        patch_url = f"{BASE_URL}/api/core/sessions/{session_id}/"
        patch_data = {"status": "active", "is_occupied": True} # Simulating what entry would do
        
        resp = requests.patch(patch_url, json=patch_data, headers=headers)
        if resp.status_code == 200:
             print_success("Staff successfully UPDATED session status to 'active' (Simulated Entry)")
        else:
             print_fail(f"Staff failed to update session: {resp.status_code} - {resp.text}")

    print_step("5. Final Data Check")
    # Verify Admin sees the update
    if admin_token:
        resp = requests.get(f"{BASE_URL}/api/core/sessions/{session_id}/", headers=headers)
        if resp.json().get('status') == 'active':
             print_success("Admin sees updated status 'active'")
        else:
             print_fail(f"Admin sees status: {resp.json().get('status')}")


if __name__ == "__main__":
    verify_full_cycle()
