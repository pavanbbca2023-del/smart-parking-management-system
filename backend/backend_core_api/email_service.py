
from django.core.mail import send_mail, EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class EmailService:
    @staticmethod
    def send_email(subject, recipient_list, message):
        """
        Generic function to send email
        """
        if not recipient_list:
            return False, "No recipients provided"
            
        try:
            # Check if email is configured
            if not settings.EMAIL_HOST_USER or not settings.EMAIL_HOST_PASSWORD:
                logger.warning("Email not sent: Credentials missing in settings.")
                return False, "Email credentials missing"

            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=recipient_list,
                fail_silently=False,
            )
            logger.info(f"Email sent to {recipient_list}: {subject}")
            return True, "Email sent successfully"
        except Exception as e:
            logger.error(f"Failed to send email: {str(e)}")
            return False, str(e)

    @staticmethod
    def send_booking_confirmation(session):
        email = session.user.email if session.user else session.guest_email
        if not email: return False, "No email address"

        subject = f"Booking Confirmed: {session.vehicle_number}"
        message = (
            f"Dear Customer,\n\n"
            f"Your booking has been confirmed.\n"
            f"Booking ID: {session.id}\n"
            f"Vehicle: {session.vehicle_number}\n"
            f"Zone: {session.zone.name} | Slot: {session.slot.slot_number}\n"
            f"Time: {session.entry_time}\n\n"
            f"Thank you for using QuickPark."
        )
        return EmailService.send_email(subject, [email], message)

    @staticmethod
    def send_entry_alert(session):
        email = session.user.email if session.user else session.guest_email
        if not email: return False, "No email address"

        subject = f"Vehicle Entry: {session.vehicle_number}"
        message = (
            f"Vehicle {session.vehicle_number} has entered the parking lot.\n"
            f"Zone: {session.zone.name} | Slot: {session.slot.slot_number}\n"
            f"Time: {session.entry_time}"
        )
        return EmailService.send_email(subject, [email], message)

    @staticmethod
    def send_exit_alert(session):
        email = session.user.email if session.user else session.guest_email
        if not email: return False, "No email address"

        subject = f"Vehicle Exit: {session.vehicle_number}"
        message = (
            f"Vehicle {session.vehicle_number} has exited.\n"
            f"Total Amount Paid: Rs.{session.total_amount_paid}\n"
            f"Duration: {session.duration_hours} hours\n\n"
            f"Thank you for parking with us!"
        )
        return EmailService.send_email(subject, [email], message)
