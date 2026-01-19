"""
RAZORPAY PAYMENT API VIEWS - TEST MODE ONLY
===========================================
Backend APIs for payment processing
NO REAL MONEY - TEST ENVIRONMENT ONLY
"""

import json
import logging
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View

from .models import ParkingSession
from .models_payment import RazorpayOrder
from .services.razorpay_service import RazorpayService

logger = logging.getLogger(__name__)


class CreatePaymentOrderAPI(View):
    """
    API 1: Create Razorpay order for parking payment
    
    Backend Flow:
    1. Get parking session and amount
    2. Create Razorpay order via API
    3. Save order details in database
    4. Return order info for frontend
    """
    
    def post(self, request):
        try:
            # Parse request data
            data = json.loads(request.body)
            session_id = data.get('parking_session_id')
            
            # Validate parking session
            try:
                parking_session = ParkingSession.objects.get(id=session_id)
            except ParkingSession.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'Parking session not found'
                })
            
            # Check if payment already exists
            if hasattr(parking_session, 'razorpay_order'):
                existing_order = parking_session.razorpay_order
                if existing_order.status == 'PAID':
                    return JsonResponse({
                        'success': False,
                        'message': 'Payment already completed'
                    })
            
            # Calculate amount (from parking session)
            amount_rupees = float(parking_session.amount_paid or 0)
            if amount_rupees <= 0:
                return JsonResponse({
                    'success': False,
                    'message': 'Invalid payment amount'
                })
            
            # Create Razorpay order
            razorpay_service = RazorpayService()
            result = razorpay_service.create_order(parking_session, amount_rupees)
            
            if result['success']:
                logger.info(f"Payment order created for session {session_id}")
                return JsonResponse({
                    'success': True,
                    'order_id': result['order_id'],
                    'amount': result['amount'],  # Amount in paise
                    'currency': result['currency'],
                    'key_id': result['key_id'],  # For Razorpay checkout
                    'message': 'Order created successfully'
                })
            else:
                return JsonResponse(result)
                
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'message': 'Invalid JSON data'
            })
        except Exception as e:
            logger.error(f"Error creating payment order: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': 'Order creation failed'
            })


class VerifyPaymentAPI(View):
    """
    API 2: Verify payment after user completes payment
    
    Backend Flow:
    1. Receive payment details from frontend
    2. Verify signature with Razorpay
    3. Update order and parking session status
    4. Return verification result
    """
    
    def post(self, request):
        try:
            # Parse payment details
            data = json.loads(request.body)
            razorpay_order_id = data.get('razorpay_order_id')
            razorpay_payment_id = data.get('razorpay_payment_id')
            razorpay_signature = data.get('razorpay_signature')
            
            # Validate required fields
            if not all([razorpay_order_id, razorpay_payment_id, razorpay_signature]):
                return JsonResponse({
                    'success': False,
                    'message': 'Missing payment details'
                })
            
            # Verify payment
            razorpay_service = RazorpayService()
            result = razorpay_service.verify_payment(
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature
            )
            
            if result['success']:
                logger.info(f"Payment verified: {razorpay_payment_id}")
                return JsonResponse({
                    'success': True,
                    'message': 'Payment verified successfully',
                    'parking_session_id': result['parking_session_id'],
                    'amount_paid': result['amount_paid']
                })
            else:
                return JsonResponse(result)
                
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'message': 'Invalid JSON data'
            })
        except Exception as e:
            logger.error(f"Error verifying payment: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': 'Payment verification failed'
            })


@csrf_exempt  # Webhooks don't send CSRF tokens
@require_POST
def razorpay_webhook(request):
    """
    API 3: Handle Razorpay webhooks
    
    Backend Flow:
    1. Receive webhook from Razorpay servers
    2. Verify webhook signature
    3. Process event (payment.captured, payment.failed)
    4. Update database accordingly
    5. Return success response
    """
    try:
        # Get webhook data and signature
        webhook_body = request.body.decode('utf-8')
        webhook_signature = request.headers.get('X-Razorpay-Signature', '')
        
        if not webhook_signature:
            logger.error("Missing webhook signature")
            return JsonResponse({
                'success': False,
                'message': 'Missing signature'
            }, status=400)
        
        # Process webhook
        razorpay_service = RazorpayService()
        result = razorpay_service.handle_webhook(webhook_body, webhook_signature)
        
        if result['success']:
            logger.info("Webhook processed successfully")
            return JsonResponse({'status': 'success'})
        else:
            logger.error(f"Webhook processing failed: {result['message']}")
            return JsonResponse({
                'status': 'error',
                'message': result['message']
            }, status=400)
            
    except Exception as e:
        logger.error(f"Webhook error: {str(e)}")
        return JsonResponse({
            'status': 'error',
            'message': 'Webhook processing failed'
        }, status=500)


class PaymentStatusAPI(View):
    """
    API 4: Check payment status
    
    Backend Flow:
    1. Get parking session ID
    2. Check payment order status
    3. Return current status
    """
    
    def get(self, request, session_id):
        try:
            # Get parking session
            parking_session = ParkingSession.objects.get(id=session_id)
            
            # Check if payment order exists
            if hasattr(parking_session, 'razorpay_order'):
                order = parking_session.razorpay_order
                return JsonResponse({
                    'success': True,
                    'payment_status': order.status,
                    'order_id': order.razorpay_order_id,
                    'amount': order.amount / 100,  # Convert to rupees
                    'paid_at': order.paid_at.isoformat() if order.paid_at else None
                })
            else:
                return JsonResponse({
                    'success': True,
                    'payment_status': 'NOT_INITIATED',
                    'message': 'No payment order found'
                })
                
        except ParkingSession.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Parking session not found'
            })
        except Exception as e:
            logger.error(f"Error checking payment status: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': 'Status check failed'
            })


# ============================================
# BACKEND FLOW EXPLANATION
# ============================================

"""
COMPLETE BACKEND PAYMENT FLOW:

STEP 1: CREATE ORDER
--------------------
POST /parking/api/payment/create-order/
{
    "parking_session_id": 123
}

Backend Process:
1. Get parking session from database
2. Calculate amount from session.amount_paid
3. Call Razorpay API to create order
4. Save order details in RazorpayOrder model
5. Return order_id, amount, key_id for frontend

Response:
{
    "success": true,
    "order_id": "order_xyz123",
    "amount": 10000,  // in paise
    "currency": "INR",
    "key_id": "rzp_test_xxxxxxxxxx"
}

STEP 2: VERIFY PAYMENT
----------------------
POST /parking/api/payment/verify/
{
    "razorpay_order_id": "order_xyz123",
    "razorpay_payment_id": "pay_abc456",
    "razorpay_signature": "signature_hash"
}

Backend Process:
1. Find order in database using order_id
2. Verify signature using Razorpay SDK
3. If valid: Update order status to PAID
4. Update parking session: is_paid = True
5. Return success response

STEP 3: WEBHOOK HANDLING
------------------------
POST /parking/webhook/razorpay/
(Called automatically by Razorpay servers)

Backend Process:
1. Verify webhook signature
2. Parse event type (payment.captured/payment.failed)
3. Update order status in database
4. Prevent duplicate processing
5. Return success to Razorpay

STEP 4: STATUS CHECK
--------------------
GET /parking/api/payment/status/{session_id}/

Backend Process:
1. Get parking session
2. Check associated payment order
3. Return current payment status

TEST MODE SAFETY:
- Uses rzp_test_* keys only
- No real money transactions
- All payments are simulated
- Safe for development/testing
"""