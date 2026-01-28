import os
import django
import sys

# Setup Django environment
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(BASE_DIR, 'full-backend')
sys.path.insert(0, BACKEND_DIR)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

from backend_core_api.sms_service import SMSService
from django.conf import settings

def test_sms():
    print("--- Twilio SMS Integration Test ---")
    
    # Check if credentials are set
    sid = getattr(settings, 'TWILIO_ACCOUNT_SID', None)
    token = getattr(settings, 'TWILIO_AUTH_TOKEN', None)
    
    if not sid or not token:
        print(f"WARNING: Twilio credentials are NOT set in settings.py")
        print(f"SID: {sid}, Token: {'Set' if token else 'None'}")
        print("Please add your Account SID and Auth Token to settings.py first.")
        return

    test_mobile = input("Enter mobile number to send test SMS (e.g., 9988776655): ")
    test_message = "Test SMS from Smart Parking System via Twilio!"

    print(f"Sending test SMS to {test_mobile}...")
    success, response = SMSService.send(test_mobile, test_message)

    if success:
        print("SUCCESS! SMS sent.")
        print(f"Response: {response}")
    else:
        print("FAILED to send SMS.")
        print(f"Error: {response.get('error')}")

if __name__ == "__main__":
    test_sms()
