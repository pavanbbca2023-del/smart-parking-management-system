import os
import sys
import django
from datetime import timedelta
from django.utils import timezone
import random
from decimal import Decimal

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
# Or simply assume we run from backend root
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Setup Django Environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

from backend_core_api.models import User, Zone, ParkingSession, Payment

def create_cancellations():
    print("🚀 Creating Cancellation Records...")
    
    # Get a Zone and User (Admin or Staff)
    zone = Zone.objects.first()
    if not zone:
        print("❌ No zones found. Run populate_data.py first.")
        return

    # Create 3 Cancelled Sessions
    reasons = [
        ("user_initiated", "Changed plans", "processed"),
        ("admin_initiated", "Incorrect slot assignment", "processed"),
        ("system_timeout", "Payment timeout", "not_applicable")
    ]
    
    for i, (type, reason, refund) in enumerate(reasons):
        entry_time = timezone.now() - timedelta(hours=random.randint(1, 24))
        
        # Create session directly as cancelled
        session = ParkingSession.objects.create(
            vehicle_number=f"UP-16-CN-{random.randint(1000,9999)}",
            zone=zone,
            entry_time=entry_time,
            exit_time=entry_time + timedelta(minutes=15), # Short duration
            status='cancelled',
            payment_status='refunded' if refund == 'processed' else 'failed',
            initial_amount_paid=Decimal('50.00'),
            total_amount_paid=Decimal('0.00'),
            
            # Cancellation Fields based on model
            cancellation_type=type,
            cancellation_reason=reason,
            refund_status=refund,
            refund_amount=Decimal('50.00') if refund == 'processed' else Decimal('0.00'),
            cancelled_at=entry_time + timedelta(minutes=10)
        )
        print(f"  - Created Cancelled Session: {session.vehicle_number} ({reason})")

    print("✅ Cancellation Data Created!")

if __name__ == '__main__':
    create_cancellations()
