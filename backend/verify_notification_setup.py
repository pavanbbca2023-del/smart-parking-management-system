
import os
import django
import sys
import logging

# Setup Django environment
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

from django.conf import settings
from backend_core_api.sms_service import SMSService
from backend_core_api.email_service import EmailService

# Configure logging to show info
logging.basicConfig(level=logging.INFO)

def verify_setup():
    print("--- Verifying Notification Setup ---")

    # 1. Check SMS Provider
    provider = getattr(settings, 'SMS_PROVIDER', 'unknown')
    print(f"SMS Provider: {provider}")
    
    # 2. Test Mock SMS
    print("\n[Testing SMS]")
    success, response = SMSService.send("1234567890", "Test SMS Message")
    if success and response.get('provider') == 'mock':
        print("✅ Mock SMS: Success (Logged to console)")
    elif success:
         print(f"✅ SMS Sent via {provider}")
    else:
        print(f"❌ SMS Failed: {response}")

    # 3. Test Email
    print("\n[Testing Email]")
    email_user = getattr(settings, 'EMAIL_HOST_USER', None)
    email_pass = getattr(settings, 'EMAIL_HOST_PASSWORD', None)

    if not email_user or "your_email" in email_user:
        print("❌ Email Config: Skipped (Placeholder detected in EMAIL_HOST_USER)")
        print("   Action: Update .env with real Gmail address")
        return

    if not email_pass or "your_app_password" in email_pass:
        print("❌ Email Config: Skipped (Placeholder detected in EMAIL_HOST_PASSWORD)")
        print("   Action: Update .env with real App Password")
        return

    print(f"Attempting to send email to {email_user}...")
    success, msg = EmailService.send_email(
        "Test Email from Smart Parking", 
        [email_user], 
        "This is a test email to verify your SMTP configuration."
    )

    if success:
        print("✅ Email: Sent Successfully!")
        print("   Check your inbox.")
    else:
        print(f"❌ Email Failed: {msg}")

if __name__ == "__main__":
    verify_setup()
