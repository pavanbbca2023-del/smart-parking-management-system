# payment_views.py - Payment APIs
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.utils import timezone
from .payment_models import PaymentOrder
from .razorpay_service import RazorpayService

@csrf_exempt
@require_POST
def create_order_api(request):
    """
    API 1: Create Payment Order
    
    Request: POST /api/payment/create-order/
    Body: {"amount": 100.50, "currency": "INR"}
    
    Backend Flow:
    1. Parse amount and currency from request
    2. Create Razorpay order via service
    3. Save order in database
    4. Return order details
    """
    try:
        data = json.loads(request.body)
        amount = float(data.get('amount', 0))
        currency = data.get('currency', 'INR')
        
        if amount <= 0:
            return JsonResponse({'success': False, 'error': 'Invalid amount'})
        
        # Create order via Razorpay
        service = RazorpayService()
        result = service.create_order(amount, currency)
        
        if result['success']:
            # Save to database
            order = PaymentOrder.objects.create(
                order_id=result['order_id'],
                amount=result['amount'],
                currency=result['currency'],
                status='CREATED'
            )
            
            return JsonResponse({
                'success': True,
                'order_id': order.order_id,
                'amount': order.amount,
                'currency': order.currency,
                'key_id': result['key_id']
            })
        else:
            return JsonResponse(result)
            
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})

@csrf_exempt
@require_POST
def verify_payment_api(request):
    """
    API 2: Verify Payment
    
    Request: POST /api/payment/verify/
    Body: {
        "razorpay_order_id": "order_xxx",
        "razorpay_payment_id": "pay_xxx", 
        "razorpay_signature": "signature_xxx"
    }
    
    Backend Flow:
    1. Get payment details from request
    2. Verify signature via Razorpay service
    3. Update order status in database
    4. Return verification result
    """
    try:
        data = json.loads(request.body)
        order_id = data.get('razorpay_order_id')
        payment_id = data.get('razorpay_payment_id')
        signature = data.get('razorpay_signature')
        
        if not all([order_id, payment_id, signature]):
            return JsonResponse({'success': False, 'error': 'Missing payment details'})
        
        # Find order in database
        try:
            order = PaymentOrder.objects.get(order_id=order_id)
        except PaymentOrder.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Order not found'})
        
        # Verify signature
        service = RazorpayService()
        result = service.verify_signature(order_id, payment_id, signature)
        
        if result['success'] and result['verified']:
            # Update order status
            order.payment_id = payment_id
            order.signature = signature
            order.status = 'PAID'
            order.save()
            
            return JsonResponse({
                'success': True,
                'message': 'Payment verified',
                'order_id': order_id,
                'status': 'PAID'
            })
        else:
            # Mark as failed
            order.status = 'FAILED'
            order.save()
            return JsonResponse({'success': False, 'error': 'Payment verification failed'})
            
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})

@csrf_exempt
@require_POST
def webhook_handler(request):
    """
    API 3: Webhook Handler
    
    Request: POST /api/payment/webhook/ (from Razorpay servers)
    Headers: X-Razorpay-Signature
    
    Backend Flow:
    1. Verify webhook signature
    2. Parse event type and data
    3. Update order status based on event
    4. Return success response to Razorpay
    """
    try:
        webhook_body = request.body.decode('utf-8')
        webhook_signature = request.headers.get('X-Razorpay-Signature', '')
        
        if not webhook_signature:
            return JsonResponse({'error': 'Missing signature'}, status=400)
        
        # Verify webhook signature
        service = RazorpayService()
        verification = service.verify_webhook(webhook_body, webhook_signature)
        
        if not verification['success'] or not verification['verified']:
            return JsonResponse({'error': 'Invalid signature'}, status=400)
        
        # Parse webhook data
        data = json.loads(webhook_body)
        event = data.get('event')
        payload = data.get('payload', {})
        
        # Handle different events
        if event == 'payment.captured':
            return handle_payment_captured(payload)
        elif event == 'payment.failed':
            return handle_payment_failed(payload)
        else:
            return JsonResponse({'status': 'ignored'})
            
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

def handle_payment_captured(payload):
    """
    Handle payment.captured webhook event
    
    Backend Flow:
    1. Extract order_id and payment_id from payload
    2. Find order in database
    3. Update status to PAID
    4. Return success
    """
    try:
        payment_entity = payload.get('payment', {}).get('entity', {})
        order_id = payment_entity.get('order_id')
        payment_id = payment_entity.get('id')
        
        if order_id:
            order = PaymentOrder.objects.get(order_id=order_id)
            order.payment_id = payment_id
            order.status = 'PAID'
            order.save()
        
        return JsonResponse({'status': 'success'})
        
    except PaymentOrder.DoesNotExist:
        return JsonResponse({'error': 'Order not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

def handle_payment_failed(payload):
    """
    Handle payment.failed webhook event
    
    Backend Flow:
    1. Extract order_id from payload
    2. Find order in database
    3. Update status to FAILED
    4. Return success
    """
    try:
        payment_entity = payload.get('payment', {}).get('entity', {})
        order_id = payment_entity.get('order_id')
        
        if order_id:
            order = PaymentOrder.objects.get(order_id=order_id)
            order.status = 'FAILED'
            order.save()
        
        return JsonResponse({'status': 'success'})
        
    except PaymentOrder.DoesNotExist:
        return JsonResponse({'error': 'Order not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)