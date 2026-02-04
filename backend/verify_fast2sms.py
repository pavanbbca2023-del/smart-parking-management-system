
import os
import django
import sys

# Setup Django environment
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

from backend_core_api.sms_service import Fast2SMSService
from django.conf import settings

def test_fast2sms():
    target_number = "6263979224"
    print(f"--- Testing Fast2SMS to {target_number} ---")
    
    api_key = getattr(settings, 'FAST2SMS_API_KEY', None)
    print(f"API KEY Loaded: {'Yes' if api_key else 'No'}")
    
    if not api_key:
        print("ERROR: API Key not found in settings.")
        return

    # Message must be short for free plan
    message = "Test SMS from Smart Parking System."
    
    success, response = Fast2SMSService.send_sms(target_number, message)
    
    if success:
        print("SUCCESS: SMS sent successfully.")
        print(f"Response: {response}")
    else:
        print("FAILED: SMS execution failed.")
        print(f"Error: {response}")

if __name__ == "__main__":
    test_fast2sms()
