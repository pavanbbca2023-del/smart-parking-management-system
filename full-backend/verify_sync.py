import requests

def check_status():
    try:
        r = requests.get('http://127.0.0.1:8000/api/analytics/zones/')
        res = r.json()
        if not res.get('success'):
            print("API Error:", res)
            return

        data = res['data']
        print("--- Zone Summary ---")
        total_avail = 0
        for z in data:
            name = z['zone_name']
            total = z['total_slots']
            occ = z['occupied_slots']
            resv = z['reserved_slots']
            avail = z['available_slots']
            print(f"{name}: Total={total}, Occupied={occ}, Reserved={resv}, Available={avail}")
            # Verification logic
            if total - occ - resv != avail:
                print(f"  [!] MISMATCH in {name}: {total} - {occ} - {resv} is not {avail}")
            total_avail += avail
        
        print(f"\nTotal System Availability: {total_avail}")
        
        # Check dashboard summary
        r2 = requests.get('http://127.0.0.1:8000/api/analytics/dashboard/')
        d_res = r2.json()
        if d_res.get('success'):
            d_avail = d_res['data']['available_slots']
            print(f"Dashboard Summary Availability: {d_avail}")
            if d_avail == total_avail:
                print("--- VERIFICATION PASSED ---")
            else:
                print(f"--- VERIFICATION FAILED: {d_avail} != {total_avail} ---")
                
    except Exception as e:
        print("Verification script failed:", str(e))

if __name__ == "__main__":
    check_status()
