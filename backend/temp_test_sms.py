import os
import django
import sys

# Setup Django environment
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

from backend_core_api.sms_service import SMSService

def test_sms():
    test_mobile = '9753901480'
    test_message = "Test SMS from Smart Parking System: Your vehicle mp 41 ng 4821 is being tracked."
    print(f"Sending test SMS to {test_mobile}...")
    success, response = SMSService.send(test_mobile, test_message)
    if success:
        print("SUCCESS! SMS sent.")
    else:
        print("FAILED to send SMS.")
        print(f"Error: {response.get('error')}")

if __name__ == "__main__":
    test_sms()
