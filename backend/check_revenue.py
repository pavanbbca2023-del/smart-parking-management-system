#!/usr/bin/env python
import os
import sys
import django
from datetime import datetime, date

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

from backend_core_api.models import ParkingSession, Payment
from django.utils import timezone

def check_revenue_calculation():
    print("=== REVENUE CALCULATION CHECK ===\n")
    
    today = timezone.now().date()
    print(f"Today's Date: {today}\n")
    
    # Method 1: Dashboard calculation (from sessions)
    today_sessions = ParkingSession.objects.filter(entry_time__date=today)
    dashboard_revenue = 0
    
    for session in today_sessions:
        if session.payment_status == 'paid':
            amount = float(session.total_amount_paid or session.initial_amount_paid or 0)
            dashboard_revenue += amount
    
    print(f"1. DASHBOARD METHOD (from sessions):")
    print(f"   - Today's paid sessions: {today_sessions.filter(payment_status='paid').count()}")
    print(f"   - Revenue: Rs.{dashboard_revenue}")
    print()
    
    # Method 2: Direct from payments table
    today_payments = Payment.objects.filter(created_at__date=today, status='success')
    payments_revenue = sum(float(payment.amount) for payment in today_payments)
    
    print(f"2. PAYMENTS TABLE METHOD:")
    print(f"   - Today's successful payments: {today_payments.count()}")
    print(f"   - Revenue: Rs.{payments_revenue}")
    print()
    
    # Method 3: Check individual session amounts
    print(f"3. SAMPLE SESSION AMOUNTS:")
    paid_sessions = today_sessions.filter(payment_status='paid')[:5]
    for session in paid_sessions:
        total = session.total_amount_paid or 0
        initial = session.initial_amount_paid or 0
        final = session.final_amount_paid or 0
        print(f"   - {session.vehicle_number}: total={total}, initial={initial}, final={final}")
    print()
    
    # Method 4: Check payment records for today
    print(f"4. SAMPLE PAYMENT RECORDS:")
    for payment in today_payments[:5]:
        print(f"   - {payment.transaction_id}: Rs.{payment.amount} ({payment.payment_method})")
    print()
    
    print(f"SUMMARY:")
    print(f"Dashboard shows: Rs.22629")
    print(f"Sessions method: Rs.{dashboard_revenue}")
    print(f"Payments method: Rs.{payments_revenue}")
    print(f"Difference: Rs.{abs(payments_revenue - dashboard_revenue)}")

if __name__ == '__main__':
    check_revenue_calculation()