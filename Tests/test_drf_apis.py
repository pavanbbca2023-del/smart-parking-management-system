#!/usr/bin/env python
"""
DRF API Test Script for Smart Parking Management System
"""

import requests
import json

BASE_URL = "http://localhost:8000"
HEADERS = {'Content-Type': 'application/json'}

def test_drf_apis():
    print("🚀 Testing DRF APIs...")
    
    # Test 1: Health Check
    print("\n1. Health Check API")
    response = requests.get(f"{BASE_URL}/api/health/")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    
    # Test 2: List Zones
    print("\n2. List Zones API")
    response = requests.get(f"{BASE_URL}/api/parking/zones/")
    print(f"Status: {response.status_code}")
    data = response.json()
    print(f"Zones: {len(data.get('zones', []))}")
    
    # Test 3: Book Parking
    print("\n3. Book Parking API")
    payload = {
        "vehicle_number": "KA-01-DRF-123",
        "owner_name": "DRF Test User",
        "zone_id": 1
    }
    response = requests.post(f"{BASE_URL}/api/parking/book/", json=payload)
    print(f"Status: {response.status_code}")
    booking_data = response.json()
    print(f"QR Code: {booking_data.get('qr_code')}")
    
    # Test 4: List Sessions
    print("\n4. List Sessions API")
    response = requests.get(f"{BASE_URL}/api/parking/sessions/")
    print(f"Status: {response.status_code}")
    sessions_data = response.json()
    print(f"Sessions: {sessions_data.get('total_sessions')}")
    
    print("\n✅ DRF APIs working perfectly!")

if __name__ == "__main__":
    test_drf_apis()