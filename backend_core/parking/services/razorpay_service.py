"""
RAZORPAY PAYMENT SERVICE - TEST MODE ONLY
=========================================
Core payment integration logic
NO REAL MONEY - TEST ENVIRONMENT ONLY
"""

import razorpay
import hmac
import hashlib
import json
import logging
from django.conf import settings
from django.utils import timezone
from .models_payment import RazorpayOrder, PaymentWebhook

logger = logging.getLogger(__name__)

class RazorpayService:
    """
    Razorpay payment integration service
    Handles order creation, verification, and webhooks
    """
    
    def __init__(self):
        """
        Initialize Razorpay client with TEST keys
        IMPORTANT: These are TEST keys - no real money
        """
        # TEST MODE KEYS - Replace with your test keys
        self.key_id = getattr(settings, 'RAZORPAY_TEST_KEY_ID', 'rzp_test_xxxxxxxxxx')
        self.key_secret = getattr(settings, 'RAZORPAY_TEST_KEY_SECRET', 'xxxxxxxxxxxxxxxxxx')
        
        # Initialize Razorpay client
        self.client = razorpay.Client(auth=(self.key_id, self.key_secret))
        
        logger.info("Razorpay service initialized in TEST MODE")

    def create_order(self, parking_session, amount_rupees):
        """
        Step 1: Create Razorpay order
        
        Args:
            parking_session: ParkingSession object
            amount_rupees: Amount in rupees (e.g., 100.50)
        
        Returns:
            dict: Order details or error
        """
        try:
            # Convert rupees to paise (₹100 = 10000 paise)
            amount_paise = int(amount_rupees * 100)
            
            # Create order data
            order_data = {
                'amount': amount_paise,  # Amount in paise
                'currency': 'INR',
                'receipt': f'parking_{parking_session.id}_{timezone.now().strftime("%Y%m%d_%H%M%S")}',
                'notes': {
                    'parking_session_id': str(parking_session.id),
                    'vehicle_number': parking_session.vehicle.vehicle_number,
                    'zone': parking_session.zone.name
                }
            }
            
            # Call Razorpay API to create order
            razorpay_order = self.client.order.create(data=order_data)
            
            # Save order in database
            order = RazorpayOrder.objects.create(
                parking_session=parking_session,
                razorpay_order_id=razorpay_order['id'],
                amount=amount_paise,
                currency='INR',
                status='CREATED'
            )
            
            logger.info(f"Razorpay order created: {razorpay_order['id']}")
            
            return {
                'success': True,
                'order_id': razorpay_order['id'],
                'amount': amount_paise,
                'currency': 'INR',
                'key_id': self.key_id,  # For frontend
                'message': 'Order created successfully'
            }
            
        except Exception as e:
            logger.error(f"Error creating Razorpay order: {str(e)}")
            return {
                'success': False,
                'message': f'Order creation failed: {str(e)}'
            }

    def verify_payment(self, razorpay_order_id, razorpay_payment_id, razorpay_signature):
        """
        Step 2: Verify payment signature
        
        Args:
            razorpay_order_id: Order ID from Razorpay
            razorpay_payment_id: Payment ID from Razorpay
            razorpay_signature: Signature from Razorpay
        
        Returns:
            dict: Verification result
        """
        try:
            # Find order in database
            order = RazorpayOrder.objects.get(razorpay_order_id=razorpay_order_id)
            
            # Verify signature using Razorpay method
            params_dict = {
                'razorpay_order_id': razorpay_order_id,
                'razorpay_payment_id': razorpay_payment_id,
                'razorpay_signature': razorpay_signature
            }
            
            # This will raise SignatureVerificationError if invalid
            self.client.utility.verify_payment_signature(params_dict)
            
            # Signature is valid - update order status
            order.razorpay_payment_id = razorpay_payment_id
            order.razorpay_signature = razorpay_signature
            order.status = 'PAID'
            order.paid_at = timezone.now()
            order.save()
            
            # Update parking session
            parking_session = order.parking_session
            parking_session.payment_method = 'ONLINE'
            parking_session.is_paid = True
            parking_session.save()
            
            logger.info(f"Payment verified successfully: {razorpay_payment_id}")
            
            return {
                'success': True,
                'message': 'Payment verified successfully',
                'parking_session_id': parking_session.id,
                'amount_paid': order.amount / 100  # Convert back to rupees
            }
            
        except RazorpayOrder.DoesNotExist:
            logger.error(f"Order not found: {razorpay_order_id}")
            return {
                'success': False,
                'message': 'Order not found'
            }
        except razorpay.errors.SignatureVerificationError:
            logger.error(f"Invalid signature for order: {razorpay_order_id}")
            # Mark order as failed
            try:
                order = RazorpayOrder.objects.get(razorpay_order_id=razorpay_order_id)
                order.status = 'FAILED'
                order.save()
            except:
                pass
            return {
                'success': False,
                'message': 'Payment verification failed'
            }
        except Exception as e:
            logger.error(f"Error verifying payment: {str(e)}")
            return {
                'success': False,
                'message': f'Verification error: {str(e)}'
            }

    def handle_webhook(self, webhook_data, webhook_signature):
        """
        Step 3: Handle Razorpay webhooks
        
        Args:
            webhook_data: Raw webhook data from Razorpay
            webhook_signature: Webhook signature for verification
        
        Returns:
            dict: Processing result
        """
        try:
            # Verify webhook signature
            expected_signature = hmac.new(
                self.key_secret.encode('utf-8'),
                webhook_data.encode('utf-8'),
                hashlib.sha256
            ).hexdigest()
            
            if not hmac.compare_digest(expected_signature, webhook_signature):
                logger.error("Invalid webhook signature")
                return {
                    'success': False,
                    'message': 'Invalid webhook signature'
                }
            
            # Parse webhook data
            data = json.loads(webhook_data)
            event_id = data.get('event', {}).get('id')
            event_type = data.get('event', {}).get('entity')
            
            # Check if already processed
            if PaymentWebhook.objects.filter(event_id=event_id).exists():
                logger.info(f"Webhook already processed: {event_id}")
                return {
                    'success': True,
                    'message': 'Webhook already processed'
                }
            
            # Save webhook
            webhook = PaymentWebhook.objects.create(
                event_id=event_id,
                event_type=event_type,
                webhook_data=data
            )
            
            # Process based on event type
            result = self._process_webhook_event(webhook, data)
            
            # Update webhook processing status
            webhook.processed = True
            webhook.processed_at = timezone.now()
            webhook.processing_result = json.dumps(result)
            webhook.save()
            
            return result
            
        except Exception as e:
            logger.error(f"Error handling webhook: {str(e)}")
            return {
                'success': False,
                'message': f'Webhook processing error: {str(e)}'
            }

    def _process_webhook_event(self, webhook, data):
        """
        Process specific webhook events
        
        Args:
            webhook: PaymentWebhook object
            data: Parsed webhook data
        
        Returns:
            dict: Processing result
        """
        event_type = data.get('event', {}).get('entity')
        payment_data = data.get('payload', {}).get('payment', {}).get('entity', {})
        
        if event_type == 'payment.captured':
            return self._handle_payment_captured(webhook, payment_data)
        elif event_type == 'payment.failed':
            return self._handle_payment_failed(webhook, payment_data)
        else:
            logger.info(f"Unhandled webhook event: {event_type}")
            return {
                'success': True,
                'message': f'Event {event_type} noted but not processed'
            }

    def _handle_payment_captured(self, webhook, payment_data):
        """Handle payment.captured webhook"""
        try:
            order_id = payment_data.get('order_id')
            payment_id = payment_data.get('id')
            
            # Find and update order
            order = RazorpayOrder.objects.get(razorpay_order_id=order_id)
            webhook.razorpay_order = order
            webhook.save()
            
            if order.status != 'PAID':
                order.status = 'PAID'
                order.razorpay_payment_id = payment_id
                order.paid_at = timezone.now()
                order.save()
                
                # Update parking session
                parking_session = order.parking_session
                parking_session.payment_method = 'ONLINE'
                parking_session.is_paid = True
                parking_session.save()
                
                logger.info(f"Payment captured via webhook: {payment_id}")
            
            return {
                'success': True,
                'message': 'Payment captured successfully'
            }
            
        except RazorpayOrder.DoesNotExist:
            logger.error(f"Order not found for webhook: {order_id}")
            return {
                'success': False,
                'message': 'Order not found'
            }

    def _handle_payment_failed(self, webhook, payment_data):
        """Handle payment.failed webhook"""
        try:
            order_id = payment_data.get('order_id')
            
            # Find and update order
            order = RazorpayOrder.objects.get(razorpay_order_id=order_id)
            webhook.razorpay_order = order
            webhook.save()
            
            order.status = 'FAILED'
            order.save()
            
            logger.info(f"Payment failed via webhook: {order_id}")
            
            return {
                'success': True,
                'message': 'Payment failure recorded'
            }
            
        except RazorpayOrder.DoesNotExist:
            logger.error(f"Order not found for failed payment: {order_id}")
            return {
                'success': False,
                'message': 'Order not found'
            }