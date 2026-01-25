from django.utils import timezone
from .models import ShiftLog
from decimal import Decimal

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
