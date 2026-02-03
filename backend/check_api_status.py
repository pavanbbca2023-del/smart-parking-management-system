import requests
import json
import os
import django
from django.conf import settings

# Setup Django environment to access settings if needed (but requests are external)
# API Base URL
BASE_URL = "http://127.0.0.1:8000"

endpoints = [
    ("/api/stats/dashboard/", "Stats Dashboard"),
    ("/api/stats/revenue/?period=7days", "Revenue Stats"),
    ("/api/stats/zones/", "Zone Stats"),
    ("/api/core/zones/", "Core Zones"),
    # ("/api/core/sessions/", "Core Sessions"), # Requires auth usually, might return 401
]

print(f"Checking API Status for {BASE_URL}...\n")

success_count = 0

for path, name in endpoints:
    url = f"{BASE_URL}{path}"
    try:
        response = requests.get(url)
        status = response.status_code
        
        status_icon = "✅" if status == 200 else "❌" if status >= 500 else "⚠️"
        
        print(f"{status_icon} {name}")
        print(f"   URL: {url}")
        print(f"   Status: {status}")
        
        if status == 200:
            success_count += 1
            try:
                data = response.json()
                # Print a summary of data keys to confirm valid JSON structure
                keys = list(data.keys()) if isinstance(data, dict) else f"List[{len(data)} items]"
                print(f"   Data: {str(keys)[:100]}...")
            except:
                print("   Data: Invalid JSON")
        else:
            print(f"   Response: {response.text[:100]}")
            
    except Exception as e:
        print(f"❌ {name}")
        print(f"   URL: {url}")
        print(f"   Error: {str(e)}")
    
    print("-" * 40)

print(f"\nSummary: {success_count}/{len(endpoints)} endpoints reachable.")
