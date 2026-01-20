#!/usr/bin/env python
"""
Test script for role-based Smart Parking APIs
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_role_apis():
    print("🚀 Testing Role-based APIs...")
    
    # Test JWT login
    print("\n1. JWT Authentication")
    login_data = {
        "username": "admin",
        "password": "admin123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/auth/login/", json=login_data)
        if response.status_code == 200:
            token_data = response.json()
            access_token = token_data.get('access')
            print(f"✅ Login successful")
            print(f"Token: {access_token[:50]}...")
            
            # Test authenticated API
            headers = {'Authorization': f'Bearer {access_token}'}
            
            # Test zones API
            zones_response = requests.get(f"{BASE_URL}/api/parking/zones/", headers=headers)
            print(f"Zones API: {zones_response.status_code}")
            
        else:
            print(f"❌ Login failed: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_role_apis()