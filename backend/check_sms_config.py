
import os
import django
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

def check_config():
    print("--- SMS Configuration Check ---")
    provider = getattr(settings, 'SMS_PROVIDER', 'unknown')
    print(f"SMS Provider: {provider}")

    if provider.lower() == 'twilio':
        sid = getattr(settings, 'TWILIO_ACCOUNT_SID', '')
        token = getattr(settings, 'TWILIO_AUTH_TOKEN', '')
        phone = getattr(settings, 'TWILIO_PHONE_NUMBER', '')
        
        print(f"Account SID: {'[SET]' if sid and sid != 'your_account_sid' else '[MISSING/DEFAULT]'}")
        print(f"Auth Token: {'[SET]' if token and token != 'your_auth_token' else '[MISSING/DEFAULT]'}")
        print(f"Phone Number: {'[SET]' if phone and phone != 'your_phone_number' else '[MISSING/DEFAULT]'}")
        
    elif provider.lower() == 'fast2sms':
        api_key = getattr(settings, 'FAST2SMS_API_KEY', '')
        print(f"API Key: {'[SET]' if api_key else '[MISSING]'}")

if __name__ == "__main__":
    check_config()
