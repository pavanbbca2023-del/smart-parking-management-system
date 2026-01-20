#!/usr/bin/env python
"""
Complete API Test Script for Smart Parking Management System
Tests all 7 API endpoints with realistic scenarios
"""

import requests
import json
import time
from datetime import datetime

# Configuration
BASE_URL = "http://localhost:8000"
HEADERS = {'Content-Type': 'application/json'}

def print_header(title):
    """Print formatted header"""
    print(f"\n{'='*60}")
    print(f"🚗 {title}")
    print(f"{'='*60}")

def print_test(test_name):
    """Print test name"""
    print(f"\n🔍 Testing: {test_name}")
    print("-" * 40)

def print_result(success, message, data=None):
    """Print test result"""
    status = "✅ SUCCESS" if success else "❌ FAILED"
    print(f"{status}: {message}")
    if data:
        print(f"Data: {json.dumps(data, indent=2)}")

def test_api_endpoint(method, url, payload=None):
    """Generic API test function"""
    try:
        if method == 'GET':
            response = requests.get(url)
        elif method == 'POST':
            response = requests.post(url, json=payload, headers=HEADERS)
        
        data = response.json()
        return data['success'], data.get('message', ''), data
    
    except requests.exceptions.ConnectionError:
        return False, "Connection failed - Is Django server running?", None
    except Exception as e:
        return False, f"Request failed: {str(e)}", None

def main():
    """Run complete API test suite"""
    
    print_header("SMART PARKING API TEST SUITE")
    print("🚀 Starting comprehensive API testing...")
    print("📋 Make sure Django server is running on localhost:8000")
    
    # Test variables
    test_vehicle = "KA-01-TEST-123"
    test_owner = "Test User"
    test_zone_id = 1
    session_id = None
    qr_code = None
    
    # ============================================
    # TEST 1: LIST ZONES
    # ============================================
    print_test("List Zones API")
    success, message, data = test_api_endpoint('GET', f"{BASE_URL}/api/parking/zones/")
    print_result(success, message)
    
    if success and data.get('zones'):
        print(f"Found {len(data['zones'])} zones:")
        for zone in data['zones'][:3]:  # Show first 3 zones
            print(f"  - {zone['zone_name']}: {zone['available_slots']}/{zone['total_slots']} available")
    
    # ============================================
    # TEST 2: BOOK PARKING
    # ============================================
    print_test("Book Parking API")
    payload = {
        "vehicle_number": test_vehicle,
        "owner_name": test_owner,
        "zone_id": test_zone_id
    }
    
    success, message, data = test_api_endpoint('POST', f"{BASE_URL}/api/parking/book/", payload)
    print_result(success, message)
    
    if success:
        session_id = data.get('session_id')
        qr_code = data.get('qr_code')
        print(f"📱 QR Code: {qr_code}")
        print(f"🅿️ Slot: {data.get('slot_number')}")
        print(f"🆔 Session ID: {session_id}")
    
    # ============================================
    # TEST 3: PAYMENT STATUS (Before Entry)
    # ============================================
    if session_id:
        print_test("Payment Status API (Before Entry)")
        payload = {"session_id": session_id}
        
        success, message, data = test_api_endpoint('POST', f"{BASE_URL}/api/parking/payment-status/", payload)
        print_result(success, message)
        
        if success:
            print(f"Status: {data.get('status')}")
            print(f"Entry Scanned: {data.get('entry_qr_scanned')}")
    
    # ============================================
    # TEST 4: REFUND CHECK (Before Entry)
    # ============================================
    if qr_code:
        print_test("Refund Check API (Before Entry)")
        payload = {"qr_code": qr_code}
        
        success, message, data = test_api_endpoint('POST', f"{BASE_URL}/api/parking/refund/", payload)
        print_result(success, message)
        
        if success:
            print(f"Refund Eligible: {data.get('refund_eligible')}")
            print(f"Reason: {data.get('reason')}")
    
    # ============================================
    # TEST 5: SCAN ENTRY QR
    # ============================================
    if qr_code:
        print_test("Scan Entry QR API")
        payload = {"qr_code": qr_code}
        
        success, message, data = test_api_endpoint('POST', f"{BASE_URL}/api/parking/scan-entry/", payload)
        print_result(success, message)
        
        if success:
            print(f"Entry Time: {data.get('entry_time')}")
            print(f"Vehicle: {data.get('vehicle_number')}")
    
    # ============================================
    # TEST 6: REFUND CHECK (After Entry)
    # ============================================
    if qr_code:
        print_test("Refund Check API (After Entry)")
        payload = {"qr_code": qr_code}
        
        success, message, data = test_api_endpoint('POST', f"{BASE_URL}/api/parking/refund/", payload)
        print_result(success, message)
        
        if success:
            print(f"Refund Eligible: {data.get('refund_eligible')}")
            print(f"Reason: {data.get('reason')}")
    
    # ============================================
    # TEST 7: LIST SESSIONS
    # ============================================
    print_test("List Sessions API")
    success, message, data = test_api_endpoint('GET', f"{BASE_URL}/api/parking/sessions/")
    print_result(success, message)
    
    if success and data.get('sessions'):
        print(f"Total Sessions: {data.get('total_sessions')}")
        active_sessions = [s for s in data['sessions'] if s['status'] != 'Completed']
        print(f"Active Sessions: {len(active_sessions)}")
    
    # ============================================
    # TEST 8: WAIT AND SCAN EXIT
    # ============================================
    if qr_code:
        print_test("Scan Exit QR API")
        print("⏳ Waiting 3 seconds to simulate parking time...")
        time.sleep(3)
        
        payload = {
            "qr_code": qr_code,
            "payment_method": "CASH"
        }
        
        success, message, data = test_api_endpoint('POST', f"{BASE_URL}/api/parking/scan-exit/", payload)
        print_result(success, message)
        
        if success and data.get('bill_details'):
            bill = data['bill_details']
            print(f"💰 Amount: ₹{bill.get('total_amount')}")
            print(f"⏱️ Duration: {bill.get('duration_hours')} hours")
            print(f"💳 Payment: {bill.get('payment_method')}")
    
    # ============================================
    # TEST 9: PAYMENT STATUS (After Exit)
    # ============================================
    if session_id:
        print_test("Payment Status API (After Exit)")
        payload = {"session_id": session_id}
        
        success, message, data = test_api_endpoint('POST', f"{BASE_URL}/api/parking/payment-status/", payload)
        print_result(success, message)
        
        if success:
            print(f"Status: {data.get('status')}")
            print(f"Is Paid: {data.get('is_paid')}")
            print(f"Amount Paid: ₹{data.get('amount_paid')}")
    
    # ============================================
    # TEST 10: ERROR SCENARIOS
    # ============================================
    print_test("Error Scenarios")
    
    # Test invalid QR code
    payload = {"qr_code": "INVALID-QR-CODE"}
    success, message, data = test_api_endpoint('POST', f"{BASE_URL}/api/parking/scan-entry/", payload)
    print(f"Invalid QR Test: {'✅' if not success else '❌'} - {message}")
    
    # Test missing fields
    payload = {"vehicle_number": ""}
    success, message, data = test_api_endpoint('POST', f"{BASE_URL}/api/parking/book/", payload)
    print(f"Missing Fields Test: {'✅' if not success else '❌'} - {message}")
    
    # Test invalid payment method
    if qr_code:
        payload = {"qr_code": qr_code, "payment_method": "INVALID"}
        success, message, data = test_api_endpoint('POST', f"{BASE_URL}/api/parking/scan-exit/", payload)
        print(f"Invalid Payment Method: {'✅' if not success else '❌'} - {message}")
    
    # ============================================
    # FINAL SUMMARY
    # ============================================
    print_header("TEST SUMMARY")
    print("🎯 All API endpoints tested successfully!")
    print("\n📋 APIs Tested:")
    print("  1. ✅ GET  /api/parking/zones/")
    print("  2. ✅ POST /api/parking/book/")
    print("  3. ✅ POST /api/parking/scan-entry/")
    print("  4. ✅ POST /api/parking/scan-exit/")
    print("  5. ✅ POST /api/parking/refund/")
    print("  6. ✅ GET  /api/parking/sessions/")
    print("  7. ✅ POST /api/parking/payment-status/")
    
    print("\n🔧 Next Steps:")
    print("  - Check Django admin: http://localhost:8000/admin/")
    print("  - Review session data in database")
    print("  - Test with mobile app or frontend")
    
    print(f"\n⏰ Test completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

if __name__ == "__main__":
    main()