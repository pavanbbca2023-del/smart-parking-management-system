from django.core.management.base import BaseCommand
from django.utils import timezone
from backend_core_api.services import CancellationService
import logging

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Check for expired bookings and send expiry warnings'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS(f'Starting expired bookings check at {timezone.now()}'))
        
        # Send expiry warnings for bookings expiring soon
        warning_count = CancellationService.send_expiry_warnings()
        self.stdout.write(self.style.SUCCESS(f'Sent {warning_count} expiry warning SMS'))
        
        # Auto-cancel expired bookings
        cancelled_count = CancellationService.check_expired_bookings()
        self.stdout.write(self.style.SUCCESS(f'Auto-cancelled {cancelled_count} expired bookings'))
        
        self.stdout.write(self.style.SUCCESS('Expired bookings check completed'))
