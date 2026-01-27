import requests
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class Fast2SMSService:
    """
    Fast2SMS integration for sending SMS notifications
    Documentation: https://docs.fast2sms.com/
    """
    
    BASE_URL = "https://www.fast2sms.com/dev/bulkV2"
    
    @staticmethod
    def send_sms(mobile_numbers, message):
        """
        Send SMS using Fast2SMS API
        
        Args:
            mobile_numbers (str or list): Mobile number(s) to send SMS to
            message (str): Message content
            
        Returns:
            tuple: (success: bool, response_data: dict)
        """
        try:
            # Get API key from settings
            api_key = getattr(settings, 'FAST2SMS_API_KEY', None)
            
            if not api_key:
                logger.error("Fast2SMS API key not configured in settings")
                return False, {"error": "SMS service not configured"}
            
            # Convert list to comma-separated string
            if isinstance(mobile_numbers, list):
                mobile_numbers = ','.join(str(num) for num in mobile_numbers)
            
            # Remove +91 prefix if present
            mobile_numbers = str(mobile_numbers).replace('+91', '').replace(' ', '')
            
            # Prepare request payload
            payload = {
                'sender_id': getattr(settings, 'FAST2SMS_SENDER_ID', 'FSTSMS'),
                'message': message,
                'route': 'v3',  # Promotional route
                'numbers': mobile_numbers,
            }
            
            headers = {
                'authorization': api_key,
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cache-Control': 'no-cache'
            }
            
            # Send request
            response = requests.post(
                Fast2SMSService.BASE_URL,
                data=payload,
                headers=headers,
                timeout=10
            )
            
            response_data = response.json()
            
            if response.status_code == 200 and response_data.get('return'):
                logger.info(f"SMS sent successfully to {mobile_numbers}")
                return True, response_data
            else:
                logger.error(f"Failed to send SMS: {response_data}")
                return False, response_data
                
        except requests.exceptions.RequestException as e:
            logger.error(f"SMS API request failed: {str(e)}")
            return False, {"error": str(e)}
        except Exception as e:
            logger.error(f"Unexpected error sending SMS: {str(e)}")
            return False, {"error": str(e)}
    
    @staticmethod
    def send_cancellation_warning(session):
        """Send SMS warning before auto-cancellation"""
        mobile = session.user.phone_number if session.user else session.guest_mobile
        
        if not mobile:
            return False, {"error": "No mobile number available"}
        
        message = (
            f"PARKING ALERT: Your booking for {session.vehicle_number} at {session.zone.name} "
            f"will expire in 2 hours. Reply with CANCEL to cancel or EXTEND to extend your booking. "
            f"Booking ID: {session.id}"
        )
        
        return Fast2SMSService.send_sms(mobile, message)
    
    @staticmethod
    def send_cancellation_confirmation(session):
        """Send SMS confirmation after cancellation"""
        mobile = session.user.phone_number if session.user else session.guest_mobile
        
        if not mobile:
            return False, {"error": "No mobile number available"}
        
        refund_text = f"Refund of Rs.{session.refund_amount} will be processed." if session.refund_amount > 0 else "No refund applicable."
        
        message = (
            f"BOOKING CANCELLED: Your parking booking for {session.vehicle_number} at {session.zone.name} "
            f"has been cancelled. {refund_text} Booking ID: {session.id}"
        )
        
        return Fast2SMSService.send_sms(mobile, message)
    
    @staticmethod
    def send_extension_confirmation(session, hours_extended):
        """Send SMS confirmation after time extension"""
        mobile = session.user.phone_number if session.user else session.guest_mobile
        
        if not mobile:
            return False, {"error": "No mobile number available"}
        
        from django.utils import timezone
        new_expiry = session.booking_expiry_time.strftime('%d-%b %I:%M %p') if session.booking_expiry_time else 'N/A'
        
        message = (
            f"BOOKING EXTENDED: Your parking booking for {session.vehicle_number} "
            f"has been extended by {hours_extended} hours. New expiry: {new_expiry}. "
            f"Booking ID: {session.id}"
        )
        
        return Fast2SMSService.send_sms(mobile, message)
    
    @staticmethod
    def send_auto_cancellation_notice(session):
        """Send SMS after auto-cancellation"""
        mobile = session.user.phone_number if session.user else session.guest_mobile
        
        if not mobile:
            return False, {"error": "No mobile number available"}
        
        refund_text = f"Refund of Rs.{session.refund_amount} will be processed." if session.refund_amount > 0 else "No refund applicable."
        
        message = (
            f"AUTO-CANCELLED: Your parking booking for {session.vehicle_number} at {session.zone.name} "
            f"has been automatically cancelled due to expiry. {refund_text} Booking ID: {session.id}"
        )
        
        return Fast2SMSService.send_sms(mobile, message)
