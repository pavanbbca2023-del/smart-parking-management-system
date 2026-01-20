# phonepe_service.py - PhonePe Payment Service Integration
# PhonePe is the preferred UPI/payment gateway for Indian parking systems

import uuid
import json
import hashlib
import requests
from decimal import Decimal
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

# PhonePe API Configuration
PHONEPE_ENV = getattr(settings, 'PHONEPE_ENV', 'SANDBOX')  # SANDBOX or PRODUCTION
PHONEPE_MERCHANT_ID = getattr(settings, 'PHONEPE_MERCHANT_ID', 'MERCHANT_ID')
PHONEPE_API_KEY = getattr(settings, 'PHONEPE_API_KEY', 'API_KEY')
PHONEPE_CALLBACK_URL = getattr(settings, 'PHONEPE_CALLBACK_URL', 'http://localhost:8000/api/payment/callback/phonepe/')

if PHONEPE_ENV == 'SANDBOX':
    PHONEPE_BASE_URL = 'https://api-sandbox.phonepe.com/apis/hermes'
else:
    PHONEPE_BASE_URL = 'https://api.phonepe.com/apis/hermes'


class PhonePeService:
    """
    PhonePe Payment Gateway Service
    
    Features:
    - UPI/Debit Card/Credit Card payments
    - QR Code generation for payments
    - Instant payment confirmation
    - Refund management
    - Transaction history
    
    Perfect for:
    - Indian market (99% Indians use UPI)
    - Quick, simple transactions
    - Low transaction fees
    - Instant settlement
    """
    
    @staticmethod
    def generate_merchant_transaction_id():
        """Generate unique merchant transaction ID"""
        return f"PARKING_{uuid.uuid4().hex[:12].upper()}"
    
    @staticmethod
    def calculate_checksum(data, api_key):
        """
        Calculate X-VERIFY checksum for PhonePe API
        
        Formula: SHA256(request_body + api_key)
        """
        payload = json.dumps(data) + api_key
        checksum = hashlib.sha256(payload.encode()).hexdigest()
        return f"{checksum}###1"
    
    @classmethod
    def create_payment_request(cls, amount, user_id, session_id, vehicle_number):
        """
        Create PhonePe payment request
        
        Args:
            amount (Decimal): Amount in INR
            user_id (int): User ID
            session_id (int): Parking session ID
            vehicle_number (str): Vehicle number for reference
            
        Returns:
            dict: Payment response with UPI link and QR code
        """
        try:
            merchant_txn_id = cls.generate_merchant_transaction_id()
            
            # Prepare request payload
            payload = {
                "merchantId": PHONEPE_MERCHANT_ID,
                "merchantTransactionId": merchant_txn_id,
                "merchantUserId": f"USER_{user_id}",
                "amount": int(amount * 100),  # Convert to paise
                "redirectUrl": PHONEPE_CALLBACK_URL,
                "redirectMode": "REDIRECT",
                "callbackUrl": PHONEPE_CALLBACK_URL,
                "mobileNumber": "",  # Optional: Add user mobile if available
                "paymentInstrument": {
                    "type": "UPI",
                    "targetApp": "PHONEPE"  # Opens PhonePe app directly
                },
                "deviceContext": {
                    "deviceOS": "ANDROID",  # Can be dynamic
                }
            }
            
            # Add metadata for reference
            metadata = {
                "session_id": session_id,
                "vehicle_number": vehicle_number,
                "user_id": user_id,
                "service": "parking"
            }
            payload["udf1"] = json.dumps(metadata)
            
            # Calculate checksum
            checksum = cls.calculate_checksum(payload, PHONEPE_API_KEY)
            
            # Make API request
            headers = {
                "Content-Type": "application/json",
                "X-VERIFY": checksum,
            }
            
            response = requests.post(
                f"{PHONEPE_BASE_URL}/pg/v1/pay",
                json=payload,
                headers=headers,
                timeout=10
            )
            
            response.raise_for_status()
            response_data = response.json()
            
            if response_data.get('success'):
                return {
                    'success': True,
                    'merchant_txn_id': merchant_txn_id,
                    'transaction_id': response_data.get('data', {}).get('transactionId'),
                    'upi_link': response_data.get('data', {}).get('upiLink'),
                    'amount': float(amount),
                    'status': 'INITIATED',
                    'payment_method': 'PHONEPE_UPI',
                    'message': 'Payment link generated. Please complete payment via PhonePe.'
                }
            else:
                return {
                    'success': False,
                    'message': response_data.get('message', 'Payment creation failed'),
                    'error_code': response_data.get('code')
                }
                
        except requests.exceptions.RequestException as e:
            logger.error(f"PhonePe API Error: {str(e)}")
            return {
                'success': False,
                'message': 'Payment gateway error',
                'error': str(e)
            }
        except Exception as e:
            logger.error(f"Error in create_payment_request: {str(e)}")
            return {
                'success': False,
                'message': 'Unexpected error',
                'error': str(e)
            }
    
    @classmethod
    def verify_payment(cls, merchant_txn_id, transaction_id=None):
        """
        Verify PhonePe payment status
        
        Args:
            merchant_txn_id (str): Merchant transaction ID
            transaction_id (str): PhonePe transaction ID (optional)
            
        Returns:
            dict: Payment verification result
        """
        try:
            # Prepare request
            request_data = {
                "merchantId": PHONEPE_MERCHANT_ID,
                "merchantTransactionId": merchant_txn_id
            }
            
            # Calculate checksum
            checksum = cls.calculate_checksum(request_data, PHONEPE_API_KEY)
            
            headers = {
                "Content-Type": "application/json",
                "X-VERIFY": checksum,
            }
            
            # Make verification request
            response = requests.post(
                f"{PHONEPE_BASE_URL}/pg/v1/status/{PHONEPE_MERCHANT_ID}/{merchant_txn_id}",
                json=request_data,
                headers=headers,
                timeout=10
            )
            
            response.raise_for_status()
            response_data = response.json()
            
            if response_data.get('success'):
                payment_data = response_data.get('data', {})
                return {
                    'success': True,
                    'verified': payment_data.get('state') == 'COMPLETED',
                    'status': payment_data.get('state'),
                    'transaction_id': payment_data.get('transactionId'),
                    'merchant_txn_id': merchant_txn_id,
                    'amount': payment_data.get('amount', 0) / 100,  # Convert to rupees
                    'payment_method': 'PHONEPE_UPI'
                }
            else:
                return {
                    'success': False,
                    'verified': False,
                    'message': response_data.get('message', 'Verification failed'),
                    'status': 'FAILED'
                }
                
        except Exception as e:
            logger.error(f"Error in verify_payment: {str(e)}")
            return {
                'success': False,
                'verified': False,
                'message': 'Payment verification failed',
                'error': str(e)
            }
    
    @classmethod
    def refund_payment(cls, merchant_txn_id, amount, refund_reason="Parking cancellation"):
        """
        Refund PhonePe payment
        
        Args:
            merchant_txn_id (str): Original merchant transaction ID
            amount (Decimal): Refund amount in INR
            refund_reason (str): Reason for refund
            
        Returns:
            dict: Refund response
        """
        try:
            refund_id = f"REFUND_{uuid.uuid4().hex[:10].upper()}"
            
            payload = {
                "merchantId": PHONEPE_MERCHANT_ID,
                "merchantTransactionId": merchant_txn_id,
                "originalTransactionId": merchant_txn_id,
                "refundAmount": int(amount * 100),  # Convert to paise
                "refundId": refund_id,
            }
            
            checksum = cls.calculate_checksum(payload, PHONEPE_API_KEY)
            
            headers = {
                "Content-Type": "application/json",
                "X-VERIFY": checksum,
            }
            
            response = requests.post(
                f"{PHONEPE_BASE_URL}/pg/v1/refund",
                json=payload,
                headers=headers,
                timeout=10
            )
            
            response.raise_for_status()
            response_data = response.json()
            
            if response_data.get('success'):
                return {
                    'success': True,
                    'refund_id': refund_id,
                    'merchant_txn_id': merchant_txn_id,
                    'amount': float(amount),
                    'status': 'INITIATED',
                    'message': 'Refund initiated successfully'
                }
            else:
                return {
                    'success': False,
                    'message': response_data.get('message', 'Refund failed'),
                    'error_code': response_data.get('code')
                }
                
        except Exception as e:
            logger.error(f"Error in refund_payment: {str(e)}")
            return {
                'success': False,
                'message': 'Refund processing failed',
                'error': str(e)
            }
    
    @classmethod
    def get_transaction_status(cls, merchant_txn_id):
        """
        Get detailed transaction status
        
        Returns:
            dict: Transaction details
        """
        return cls.verify_payment(merchant_txn_id)
    
    @staticmethod
    def generate_static_qr_code(merchant_id, upi_id=None):
        """
        Generate static QR code for parking lot
        Users can scan this QR to make payment directly
        
        Args:
            merchant_id (str): PhonePe Merchant ID
            upi_id (str): Optional UPI ID (e.g., parking@phonepe)
            
        Returns:
            dict: QR code URL
        """
        try:
            if not upi_id:
                upi_id = f"parking{merchant_id}@phonepe"
            
            # PhonePe QR endpoint
            qr_url = f"{PHONEPE_BASE_URL}/qr/static/{merchant_id}/{upi_id}"
            
            return {
                'success': True,
                'qr_url': qr_url,
                'upi_link': f"upi://pay?pa={upi_id}",
                'message': 'QR code generated. Users can scan to pay.'
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }


class PhonePeSimulationService:
    """
    Mock PhonePe service for testing without actual API calls
    Use this for development/testing
    """
    
    @staticmethod
    def create_payment_request(amount, user_id, session_id, vehicle_number):
        """Simulate payment request"""
        merchant_txn_id = f"PARKING_{uuid.uuid4().hex[:12].upper()}"
        
        return {
            'success': True,
            'merchant_txn_id': merchant_txn_id,
            'transaction_id': f"TXN_{uuid.uuid4().hex[:10].upper()}",
            'upi_link': f"upi://pay?pa=parking@phonepe&pn=SmartParking&am={amount}",
            'amount': float(amount),
            'status': 'INITIATED',
            'payment_method': 'PHONEPE_UPI',
            'message': '[TEST MODE] Payment link generated. Scan QR to pay via PhonePe.'
        }
    
    @staticmethod
    def verify_payment(merchant_txn_id, transaction_id=None):
        """Simulate payment verification"""
        return {
            'success': True,
            'verified': True,
            'status': 'COMPLETED',
            'transaction_id': transaction_id or f"TXN_{uuid.uuid4().hex[:10].upper()}",
            'merchant_txn_id': merchant_txn_id,
            'amount': 100.0,
            'payment_method': 'PHONEPE_UPI',
            'message': '[TEST MODE] Payment verified successfully'
        }
    
    @staticmethod
    def refund_payment(merchant_txn_id, amount, refund_reason="Parking cancellation"):
        """Simulate refund"""
        return {
            'success': True,
            'refund_id': f"REFUND_{uuid.uuid4().hex[:10].upper()}",
            'merchant_txn_id': merchant_txn_id,
            'amount': float(amount),
            'status': 'INITIATED',
            'message': '[TEST MODE] Refund initiated successfully'
        }


# Auto-select service based on settings
def get_phonepe_service():
    """Get PhonePe service (real or simulation)"""
    use_simulation = getattr(settings, 'PHONEPE_SIMULATION_MODE', True)
    
    if use_simulation:
        return PhonePeSimulationService()
    else:
        return PhonePeService()
