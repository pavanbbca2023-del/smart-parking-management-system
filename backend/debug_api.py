import requests
import json
import sys

# Try public endpoints first
BASE_URL = "http://127.0.0.1:8000"

def check(url):
    print(f"\n--- Checking {url} ---")
    try:
        # Assuming AllowAny permissions as seen in views
        res = requests.get(f"{BASE_URL}{url}", timeout=5)
        print(f"Status: {res.status_code}")
        try:
            print(json.dumps(res.json(), indent=2))
        except:
            print("Response is not JSON:")
            print(res.text[:500])
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check("/api/analytics/dashboard/")
    check("/api/core/users/")
