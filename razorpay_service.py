# razorpay_service.py - Core Payment Logic
import razorpay
import hmac
import hashlib
import json
from django.conf import settings
from django.utils import timezone

class RazorpayService:
    """Razorpay integration service - TEST MODE ONLY"""
    
    def __init__(self):
        # TEST MODE KEYS - No real money
        self.key_id = 'rzp_test_xxxxxxxxxx'  # Replace with your test key
        self.key_secret = 'xxxxxxxxxxxxxxxxxx'  # Replace with your test secret
        self.client = razorpay.Client(auth=(self.key_id, self.key_secret))
    
    def create_order(self, amount_rupees, currency='INR'):
        """
        Step 1: Create Razorpay order
        
        Backend Flow:
        1. Convert rupees to paise (Razorpay requirement)
        2. Call Razorpay API to create order
        3. Return order details for database storage
        """
        try:
            # Convert to paise (₹100 = 10000 paise)
            amount_paise = int(amount_rupees * 100)
            
            # Create order via Razorpay API
            order_data = {
                'amount': amount_paise,
                'currency': currency,
                'receipt': f'order_{int(timezone.now().timestamp())}'
            }
            
            razorpay_order = self.client.order.create(data=order_data)
            
            return {
                'success': True,
                'order_id': razorpay_order['id'],
                'amount': amount_paise,
                'currency': currency,
                'key_id': self.key_id
            }
            
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def verify_signature(self, order_id, payment_id, signature):
        """
        Step 2: Verify payment signature
        
        Backend Flow:
        1. Create signature string from order_id and payment_id
        2. Generate HMAC using secret key
        3. Compare with received signature
        4. Return verification result
        """
        try:
            # Create signature verification data
            params_dict = {
                'razorpay_order_id': order_id,
                'razorpay_payment_id': payment_id,
                'razorpay_signature': signature
            }
            
            # Verify using Razorpay SDK
            self.client.utility.verify_payment_signature(params_dict)
            return {'success': True, 'verified': True}
            
        except razorpay.errors.SignatureVerificationError:
            return {'success': False, 'verified': False, 'error': 'Invalid signature'}
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def verify_webhook(self, webhook_body, webhook_signature):
        """
        Step 3: Verify webhook signature
        
        Backend Flow:
        1. Generate expected signature using webhook body and secret
        2. Compare with received signature
        3. Return verification result
        """
        try:
            expected_signature = hmac.new(
                self.key_secret.encode('utf-8'),
                webhook_body.encode('utf-8'),
                hashlib.sha256
            ).hexdigest()
            
            if hmac.compare_digest(expected_signature, webhook_signature):
                return {'success': True, 'verified': True}
            else:
                return {'success': False, 'verified': False}
                
        except Exception as e:
            return {'success': False, 'error': str(e)}