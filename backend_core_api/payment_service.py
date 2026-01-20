# payment_service.py - Mock Razorpay payment service

import uuid
import random
from decimal import Decimal


class MockRazorpayService:
    """Mock Razorpay service for testing"""
    
    @staticmethod
    def create_order(amount, currency='INR'):
        """Create mock payment order"""
        order_id = f"order_{uuid.uuid4().hex[:12]}"
        
        return {
            'success': True,
            'order_id': order_id,
            'amount': int(amount * 100),  # Convert to paise
            'currency': currency,
            'key_id': 'rzp_test_mock_key',
        }
    
    @staticmethod
    def verify_payment(order_id, payment_id, signature):
        """Mock payment verification - always success for testing"""
        return {
            'success': True,
            'verified': True,
            'payment_id': payment_id,
            'order_id': order_id,
        }
    
    @staticmethod
    def simulate_payment():
        """Simulate payment success/failure"""
        # 90% success rate for testing
        success = random.random() > 0.1
        
        if success:
            return {
                'success': True,
                'payment_id': f"pay_{uuid.uuid4().hex[:12]}",
                'status': 'captured',
            }
        else:
            return {
                'success': False,
                'error': 'Payment failed',
                'status': 'failed',
            }


def process_booking_payment(amount):
    """Process initial booking payment"""
    service = MockRazorpayService()
    
    # Create order
    order = service.create_order(amount)
    
    if order['success']:
        # Simulate payment
        payment = service.simulate_payment()
        
        if payment['success']:
            return {
                'success': True,
                'order_id': order['order_id'],
                'payment_id': payment['payment_id'],
                'amount': amount,
                'status': 'SUCCESS',
            }
    
    return {
        'success': False,
        'error': 'Payment processing failed',
        'status': 'FAILED',
    }


def process_exit_payment(amount, method='ONLINE'):
    """Process exit payment"""
    if method == 'CASH':
        return {
            'success': True,
            'payment_id': f"cash_{uuid.uuid4().hex[:8]}",
            'amount': amount,
            'status': 'SUCCESS',
        }
    
    # Online payment
    return process_booking_payment(amount)