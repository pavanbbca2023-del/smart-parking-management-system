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
    
from twilio.rest import Client

class TwilioSMSService:
    """
    Twilio integration for sending SMS notifications
    """
    
    @staticmethod
    def send_sms(mobile_numbers, message):
        """
        Send SMS using Twilio API
        """
        try:
            account_sid = getattr(settings, 'TWILIO_ACCOUNT_SID', None)
            auth_token = getattr(settings, 'TWILIO_AUTH_TOKEN', None)
            from_number = getattr(settings, 'TWILIO_PHONE_NUMBER', None)
            
            if not all([account_sid, auth_token, from_number]):
                logger.error("Twilio credentials not fully configured in settings")
                return False, {"error": "Twilio not configured"}
            
            client = Client(account_sid, auth_token)
            
            # Twilio handles one number at a time via API standard
            if isinstance(mobile_numbers, str):
                mobile_numbers = [num.strip() for num in mobile_numbers.split(',')]
            
            results = []
            for number in mobile_numbers:
                # Add +91 if not present (assuming India)
                formatted_number = str(number).strip()
                if not formatted_number.startswith('+'):
                    formatted_number = f"+91{formatted_number}"
                
                # Check if we are using a Messaging Service SID (starts with MG) or a Phone Number
                params = {
                    "body": message,
                    "to": formatted_number
                }
                
                if from_number.startswith('MG'):
                    params["messaging_service_sid"] = from_number
                else:
                    params["from_"] = from_number
                    
                msg = client.messages.create(**params)
                results.append(msg.sid)
                
            logger.info(f"Twilio SMS sent successfully. SIDs: {results}")
            return True, {"sids": results}
            
        except Exception as e:
            logger.error(f"Twilio SMS failed: {str(e)}")
            return False, {"error": str(e)}

class SMSService:
    """
    Unified SMS Service to switch between providers easily
    """
    @staticmethod
    def send(mobile_numbers, message):
        provider = getattr(settings, 'SMS_PROVIDER', 'fast2sms').lower()
        
        if provider == 'twilio':
            return TwilioSMSService.send_sms(mobile_numbers, message)
        else:
            return Fast2SMSService.send_sms(mobile_numbers, message)

    @staticmethod
    def send_cancellation_warning(session):
        mobile = session.user.phone_number if session.user else session.guest_mobile
        if not mobile: return False, {"error": "No mobile"}
        message = (
            f"PARKING ALERT: Your booking for {session.vehicle_number} "
            f"will expire in 2 hours. Booking ID: {session.id}"
        )
        return SMSService.send(mobile, message)

    @staticmethod
    def send_cancellation_confirmation(session):
        mobile = session.user.phone_number if session.user else session.guest_mobile
        if not mobile: return False, {"error": "No mobile"}
        refund_text = f"Refund of Rs.{session.refund_amount} will be processed." if session.refund_amount > 0 else "No refund."
        message = f"BOOKING CANCELLED: {session.vehicle_number}. {refund_text}"
        return SMSService.send(mobile, message)

    @staticmethod
    def send_extension_confirmation(session, hours_extended):
        mobile = session.user.phone_number if session.user else session.guest_mobile
        if not mobile: return False, {"error": "No mobile"}
        message = f"BOOKING EXTENDED: {session.vehicle_number} by {hours_extended}h."
        return SMSService.send(mobile, message)

    @staticmethod
    def send_auto_cancellation_notice(session):
        mobile = session.user.phone_number if session.user else session.guest_mobile
        if not mobile: return False, {"error": "No mobile"}
        message = f"AUTO-CANCELLED: booking for {session.vehicle_number} has expired."
        return SMSService.send(mobile, message)
