import requests
import json

BASE_URL = "http://localhost:8000/api/core/sessions/"

def test_api():
    try:
        # 1. Get all sessions to find a valid vehicle number
        print("Fetching all sessions...")
        response = requests.get(BASE_URL)
        if response.status_code != 200:
            print(f"Failed to fetch sessions: {response.status_code}")
            return

        data = response.json()
        sessions = data.get('sessions', [])
        
        if not sessions:
            print("No sessions found to test with.")
            return

        target_vehicle = sessions[0]['vehicle_number']
        print(f"Testing with vehicle number: {target_vehicle}")

        # 2. Filter by that vehicle number
        filter_url = f"{BASE_URL}?vehicle_number={target_vehicle}"
        print(f"Requesting: {filter_url}")
        filter_response = requests.get(filter_url)
        
        if filter_response.status_code == 200:
            filtered_data = filter_response.json()
            filtered_sessions = filtered_data.get('sessions', [])
            print(f"Found {len(filtered_sessions)} sessions for {target_vehicle}")
            
            # Verify all results match
            all_match = all(s['vehicle_number'] == target_vehicle for s in filtered_sessions)
            if all_match:
                print("SUCCESS: All returned sessions match the vehicle number.")
            else:
                print("FAILURE: Some sessions do not match.")
        else:
            print(f"Failed to filter: {filter_response.status_code}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_api()
