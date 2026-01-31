import razorpay
import os
import django
import sys

# Setup Django environment to get keys from settings
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

from django.conf import settings

def verify_keys():
    print(f"--- Verifying Razorpay Keys ---")
    key_id = settings.RAZORPAY_KEY_ID
    key_secret = settings.RAZORPAY_KEY_SECRET
    
    print(f"Key ID: {key_id}")
    
    client = razorpay.Client(auth=(key_id, key_secret))
    
    try:
        # Try to fetch orders as a test
        orders = client.order.all({'count': 1})
        print("✅ Keys verified successfully! Connection established.")
        print(f"Connection result: {orders}")
    except Exception as e:
        print(f"❌ Verification failed: {str(e)}")

if __name__ == "__main__":
    verify_keys()
