import os
import sys
import razorpay
from dotenv import load_dotenv

# Load env directly to be sure
load_dotenv('.env')

KEY_ID = os.getenv('RAZORPAY_KEY_ID')
KEY_SECRET = os.getenv('RAZORPAY_KEY_SECRET')

print(f"Testing Keys: ID={KEY_ID}, Secret={KEY_SECRET[:4]}***")

if not KEY_ID or not KEY_SECRET:
    print("Error: Keys missing in .env")
    sys.exit(1)

try:
    client = razorpay.Client(auth=(KEY_ID, KEY_SECRET))
    # Try to fetch orders (lightweight auth check) or create a dummy order
    print("Attempting to authenticate and create detailed order...")
    order = client.order.create({
        "amount": 100, # 1.00 INR
        "currency": "INR",
        "receipt": "test_receipt_1"
    })
    print("SUCCESS: Razorpay Order Created!")
    print(f"Order ID: {order['id']}")
    
    # Verify logic test
    # We can't verify easily without a real signature from frontend, 
    # but we proved Auth (Keys) work.
    
except Exception as e:
    print(f"FAILURE: {str(e)}")
    sys.exit(1)
