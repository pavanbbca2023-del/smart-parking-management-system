
import requests

def check_endpoints():
    endpoints = [
        "http://127.0.0.1:8000/",
        "http://127.0.0.1:8000/admin/login/",
        "http://127.0.0.1:5173/"
    ]
    
    print("--- HTTP Connectivity Check ---")
    for url in endpoints:
        try:
            response = requests.get(url, timeout=5)
            print(f"[{response.status_code}] {url}")
        except Exception as e:
            print(f"[FAIL] {url}: {str(e)}")

if __name__ == "__main__":
    check_endpoints()
