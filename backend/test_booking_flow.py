import requests
import json

BASE_URL = "http://localhost:8000"

def test_booking_flow():
    print("1. Checking available zones...")
    try:
        zones_resp = requests.get(f"{BASE_URL}/api/core/zones/")
        if zones_resp.status_code != 200:
            print(f"Failed to fetch zones: {zones_resp.text}")
            return
        
        zones = zones_resp.json().get('zones', [])
        if not zones:
            print("No zones found.")
            return

        target_zone = zones[0]
        print(f"Targeting Zone: {target_zone['name']} (ID: {target_zone['id']})")

        print("\n2. Creating a Booking...")
        booking_data = {
            "vehicle_number": "TEST-BOOK-01",
            "zone_id": target_zone['id'],
            "mobileNumber": "9988776655",
            "email": "test@example.com",
            # "exitTime": "18:00" # Optional
        }
        
        book_resp = requests.post(f"{BASE_URL}/api/core/sessions/book/", json=booking_data)
        
        if book_resp.status_code == 201:
            booking = book_resp.json()
            print("Booking Successful!")
            print(f"Session ID: {booking.get('id')}")
            print(f"Vehicle: {booking.get('vehicle_number')}")
            print(f"Slot: {booking.get('slot', {}).get('slot_number')}")
            print(f"QR Code Data: {booking.get('qr_code')}")
        else:
            print(f"Booking Failed: {book_resp.status_code}")
            print(book_resp.text)

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    test_booking_flow()
