import os
import django
import sys
from decimal import Decimal

# Setup Django environment
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

from backend_core_api.models import ParkingSession, Payment

def sync_data():
    print("--- Starting Payment Data Reconciliation ---")
    sessions = ParkingSession.objects.filter(status='completed')
    count = 0
    
    for session in sessions:
        # Find all successful payments for this session
        payments = Payment.objects.filter(session=session, status='success')
        
        if payments.exists():
            total_paid = sum(p.amount for p in payments)
            latest_payment = payments.order_by('-created_at').first()
            
            # Sync session fields
            session.payment_method = latest_payment.payment_method
            session.total_amount_paid = total_paid
            session.payment_status = 'paid'
            session.save()
            count += 1
            print(f"✅ Synced: {session.vehicle_number} | Amount: ₹{total_paid} | Method: {session.payment_method}")
        else:
            # FALLBACK: Create missing payment if session shows it was paid
            if session.total_amount_paid > 0:
                Payment.objects.create(
                    session=session,
                    amount=session.total_amount_paid,
                    payment_method=session.payment_method or 'Cash',
                    payment_type='FULL',
                    status='success',
                    created_at=session.exit_time or session.entry_time
                )
                session.payment_status = 'paid'
                session.save()
                count += 1
                print(f"✨ Created Missing Payment: {session.vehicle_number} | Amount: ₹{session.total_amount_paid}")
            else:
                print(f"⚠️ No payment found and 0 balance for: {session.vehicle_number}")

    print(f"\n--- Sync Complete. {count} sessions updated. ---")

if __name__ == "__main__":
    sync_data()
