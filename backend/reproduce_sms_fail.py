
import os
import django
import sys

# Setup Django environment
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

from backend_core_api.sms_service import SMSService

def test_specific_number():
    target_number = "6263979224"
    print(f"--- Testing SMS to {target_number} ---")
    
    success, response = SMSService.send(target_number, "Test SMS for debugging delivery failure.")
    
    if success:
        print("SUCCESS: SMS sent successfully.")
        print(f"Response: {response}")
    else:
        print("FAILED: SMS execution failed.")
        print(f"Error: {response}")

if __name__ == "__main__":
    test_specific_number()
