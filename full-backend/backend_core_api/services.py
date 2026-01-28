from django.utils import timezone
from .models import ShiftLog, ParkingSession, BookingActivityLog, Slot
from decimal import Decimal
from .sms_service import SMSService
import logging

logger = logging.getLogger(__name__)

class ShiftService:
    @staticmethod
    def update_stats(user, action_type, amount=0, payment_method='cash'):
        """
        Updates the current shift log for the staff member.
        action_type: 'entry' or 'exit'
        amount: Decimal or float
        payment_method: 'cash', 'upi', 'card'
        """
        today = timezone.now().date()
        
        # Get or create shift log for today
        shift_log, created = ShiftLog.objects.get_or_create(
            staff=user,
            shift_start__date=today,
            defaults={
                'shift_start': timezone.now(),
                'entry_count': 0,
                'exit_count': 0,
                'revenue_collected': Decimal('0.00'),
                'cash_collected': Decimal('0.00'),
                'online_collected': Decimal('0.00')
            }
        )
        
        amount_decimal = Decimal(str(amount))
        
        if action_type == 'entry':
            shift_log.entry_count += 1
        elif action_type == 'exit':
            shift_log.exit_count += 1
            
        shift_log.revenue_collected += amount_decimal
        
        if str(payment_method).lower() == 'cash':
            shift_log.cash_collected += amount_decimal
        else:
            shift_log.online_collected += amount_decimal
            
        shift_log.save()


class CancellationService:
    """Service for handling booking cancellations and extensions"""
    
    @staticmethod
    def log_activity(session, activity_type, description, user=None, metadata=None):
        """Log booking activity for admin/staff monitoring"""
        try:
            BookingActivityLog.objects.create(
                session=session,
                user=user or session.user,
                activity_type=activity_type,
                description=description,
                metadata=metadata or {}
            )
            logger.info(f"Activity logged: {activity_type} for session {session.id}")
        except Exception as e:
            logger.error(f"Failed to log activity: {str(e)}")
    
    @staticmethod
    def process_cancellation(session, reason, user=None, cancellation_type='user_initiated'):
        """
        Process booking cancellation
        
        Args:
            session: ParkingSession instance
            reason: Cancellation reason
            user: User who initiated cancellation
            cancellation_type: Type of cancellation (user_initiated, auto_cancelled, admin_cancelled)
            
        Returns:
            tuple: (success: bool, message: str, refund_amount: Decimal)
        """
        try:
            # Check if cancellation is allowed
            can_cancel, message = session.can_cancel()
            if not can_cancel:
                return False, message, Decimal('0.00')
            
            # Calculate refund
            refund_amount = session.calculate_refund()
            
            # Update session
            session.status = 'cancelled'
            session.cancellation_reason = reason
            session.cancelled_at = timezone.now()
            session.cancellation_type = cancellation_type
            session.refund_amount = refund_amount
            session.refund_status = 'pending' if refund_amount > 0 else 'not_applicable'
            session.save()
            
            # Free up the slot
            if session.slot:
                slot = session.slot
                slot.is_occupied = False
                slot.is_reserved = False
                slot.save()
            
            # Log activity
            CancellationService.log_activity(
                session=session,
                activity_type='booking_cancelled' if cancellation_type == 'user_initiated' else 'auto_cancelled',
                description=f"Booking cancelled: {reason}",
                user=user,
                metadata={
                    'refund_amount': float(refund_amount),
                    'cancellation_type': cancellation_type,
                    'vehicle_number': session.vehicle_number,
                    'zone': session.zone.name
                }
            )
            
            # Send SMS confirmation
            if cancellation_type == 'user_initiated':
                SMSService.send_cancellation_confirmation(session)
            else:
                SMSService.send_auto_cancellation_notice(session)
            
            return True, f"Booking cancelled successfully. Refund: Rs.{refund_amount}", refund_amount
            
        except Exception as e:
            logger.error(f"Error processing cancellation: {str(e)}")
            return False, f"Error: {str(e)}", Decimal('0.00')
    
    @staticmethod
    def process_extension(session, hours, user=None):
        """
        Process booking time extension
        
        Args:
            session: ParkingSession instance
            hours: Number of hours to extend
            user: User who requested extension
            
        Returns:
            tuple: (success: bool, message: str)
        """
        try:
            success, message = session.extend_booking(hours)
            
            if success:
                # Log activity
                CancellationService.log_activity(
                    session=session,
                    activity_type='booking_extended',
                    description=f"Booking extended by {hours} hours",
                    user=user,
                    metadata={
                        'hours_extended': hours,
                        'new_expiry_time': session.booking_expiry_time.isoformat() if session.booking_expiry_time else None,
                        'extension_count': session.extension_count,
                        'vehicle_number': session.vehicle_number
                    }
                )
                
                # Send SMS confirmation
                SMSService.send_extension_confirmation(session, hours)
            
            return success, message
            
        except Exception as e:
            logger.error(f"Error processing extension: {str(e)}")
            return False, f"Error: {str(e)}"
    
    @staticmethod
    def check_expired_bookings():
        """
        Check for expired bookings and auto-cancel them
        Returns count of auto-cancelled bookings
        """
        from datetime import timedelta
        
        now = timezone.now()
        expired_count = 0
        
        # Find expired reserved bookings
        expired_sessions = ParkingSession.objects.filter(
            status='reserved',
            booking_expiry_time__lte=now
        )
        
        for session in expired_sessions:
            success, message, refund = CancellationService.process_cancellation(
                session=session,
                reason="Booking expired - not used within time limit",
                cancellation_type='auto_cancelled'
            )
            if success:
                expired_count += 1
        
        logger.info(f"Auto-cancelled {expired_count} expired bookings")
        return expired_count
    
    @staticmethod
    def send_expiry_warnings():
        """
        Send SMS warnings for bookings expiring soon
        Returns count of warnings sent
        """
        warning_count = 0
        
        # Find bookings expiring soon that haven't been warned
        expiring_sessions = ParkingSession.objects.filter(
            status='reserved',
            sms_notification_sent=False
        )
        
        for session in expiring_sessions:
            if session.is_expiring_soon():
                # Send warning SMS
                success, response = SMSService.send_cancellation_warning(session)
                
                if success:
                    session.sms_notification_sent = True
                    session.save()
                    
                    # Log SMS activity
                    CancellationService.log_activity(
                        session=session,
                        activity_type='sms_sent',
                        description="Expiry warning SMS sent",
                        metadata={
                            'sms_response': response,
                            'vehicle_number': session.vehicle_number,
                            'expiry_time': session.booking_expiry_time.isoformat() if session.booking_expiry_time else None
                        }
                    )
                    warning_count += 1
        
        logger.info(f"Sent {warning_count} expiry warning SMS")
        return warning_count

