# RAZORPAY BACKEND INTEGRATION - TEST MODE ONLY
# =============================================

"""
COMPLETE BACKEND FLOW EXPLANATION:

STEP 1: CREATE ORDER
===================
Request: POST /api/payment/create-order/
{
    "amount": 100.50,
    "currency": "INR"
}

Backend Process:
1. Parse amount and currency from request
2. Convert amount to paise (₹100 = 10000 paise)
3. Call Razorpay API: client.order.create()
4. Save order in PaymentOrder model with status='CREATED'
5. Return order_id, amount, currency, key_id

Response:
{
    "success": true,
    "order_id": "order_xyz123",
    "amount": 10000,
    "currency": "INR", 
    "key_id": "rzp_test_xxxxxxxxxx"
}

Database State:
- PaymentOrder created with status='CREATED'
- order_id, amount, currency saved
- payment_id = null (not paid yet)

STEP 2: VERIFY PAYMENT
=====================
Request: POST /api/payment/verify/
{
    "razorpay_order_id": "order_xyz123",
    "razorpay_payment_id": "pay_abc456", 
    "razorpay_signature": "signature_hash"
}

Backend Process:
1. Find PaymentOrder by razorpay_order_id
2. Verify signature using Razorpay SDK
3. If valid: Update status='PAID', save payment_id
4. If invalid: Update status='FAILED'
5. Return verification result

Response (Success):
{
    "success": true,
    "message": "Payment verified",
    "order_id": "order_xyz123",
    "status": "PAID"
}

Database State:
- PaymentOrder updated with status='PAID'
- payment_id and signature saved

STEP 3: WEBHOOK HANDLING
=======================
Request: POST /api/payment/webhook/ (from Razorpay servers)
Headers: X-Razorpay-Signature: webhook_signature

Backend Process:
1. Verify webhook signature using HMAC-SHA256
2. Parse event type from webhook body
3. Handle specific events:
   - payment.captured: Update status='PAID'
   - payment.failed: Update status='FAILED'
4. Return success response to Razorpay

Webhook Events Handled:
- payment.captured: Payment successful
- payment.failed: Payment failed

DATABASE SCHEMA:
===============
PaymentOrder Model:
- order_id (CharField, unique) - Razorpay order ID
- amount (IntegerField) - Amount in paise
- currency (CharField) - Currency code (INR)
- status (CharField) - CREATED/PAID/FAILED
- payment_id (CharField, nullable) - Razorpay payment ID
- signature (CharField, nullable) - Payment signature
- created_at (DateTimeField) - Order creation time
- updated_at (DateTimeField) - Last update time

SECURITY FEATURES:
=================
1. Signature Verification: All payments verified using HMAC-SHA256
2. Webhook Verification: Webhooks verified using secret key
3. TEST MODE: Only test keys used, no real money
4. Error Handling: Proper exception handling for all APIs
5. Status Tracking: Complete payment lifecycle tracking

TEST FLOW:
=========
1. Create order with test amount
2. Use Razorpay test cards for payment
3. Verify payment signature
4. Receive webhook confirmation
5. Check final status in database

TEST CARDS (Razorpay):
- Success: 4111 1111 1111 1111
- Failure: 4000 0000 0000 0002
- CVV: Any 3 digits
- Expiry: Any future date

INSTALLATION:
============
pip install razorpay

SETTINGS:
========
# Add to Django settings.py
RAZORPAY_TEST_KEY_ID = 'rzp_test_xxxxxxxxxx'
RAZORPAY_TEST_KEY_SECRET = 'xxxxxxxxxxxxxxxxxx'

IMPORTANT NOTES:
===============
- This is TEST MODE ONLY - no real money involved
- Replace test keys with your actual Razorpay test keys
- Webhook URL must be publicly accessible for testing
- All amounts are in paise (₹1 = 100 paise)
- Signature verification is mandatory for security
"""

# MINIMAL REQUIREMENTS.TXT
"""
Django>=4.0
razorpay>=1.3.0
"""