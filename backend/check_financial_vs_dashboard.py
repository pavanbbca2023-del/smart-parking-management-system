#!/usr/bin/env python
import os
import sys
import django
from datetime import datetime, date

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

from backend_core_api.models import ParkingSession, Payment, Zone
from django.utils import timezone

def check_financial_vs_dashboard():
    print("=== FINANCIAL REPORT vs DASHBOARD COMPARISON ===\n")
    
    today = timezone.now().date()
    print(f"Today's Date: {today}\n")
    
    # Get today's sessions
    today_sessions = ParkingSession.objects.filter(entry_time__date=today)
    
    # Method 1: Dashboard calculation (paid sessions with total_amount_paid)
    dashboard_sessions = today_sessions.filter(payment_status='paid')
    dashboard_revenue = sum(float(s.total_amount_paid or s.initial_amount_paid or 0) for s in dashboard_sessions)
    
    # Method 2: Financial Report calculation (sessions with total_amount_paid > 0)
    financial_sessions = today_sessions.filter(total_amount_paid__gt=0)
    financial_revenue = sum(float(s.total_amount_paid) for s in financial_sessions)
    
    print(f"1. DASHBOARD METHOD:")
    print(f"   - Filter: payment_status='paid'")
    print(f"   - Sessions: {dashboard_sessions.count()}")
    print(f"   - Revenue: Rs.{dashboard_revenue}")
    print()
    
    print(f"2. FINANCIAL REPORT METHOD:")
    print(f"   - Filter: total_amount_paid > 0")
    print(f"   - Sessions: {financial_sessions.count()}")
    print(f"   - Revenue: Rs.{financial_revenue}")
    print()
    
    # Check zone-wise revenue
    zones = Zone.objects.all()
    print(f"3. ZONE-WISE REVENUE:")
    total_zone_revenue = 0
    for zone in zones:
        zone_sessions = today_sessions.filter(
            zone=zone,
            total_amount_paid__gt=0
        )
        zone_revenue = sum(float(s.total_amount_paid) for s in zone_sessions)
        if zone_revenue > 0:
            print(f"   - {zone.name}: {zone_sessions.count()} sessions, Rs.{zone_revenue}")
            total_zone_revenue += zone_revenue
    print(f"   - Total zone revenue: Rs.{total_zone_revenue}")
    print()
    
    # Check payment methods
    print(f"4. PAYMENT METHODS:")
    methods = {}
    for session in financial_sessions:
        method = session.payment_method or 'UPI'
        amount = float(session.total_amount_paid)
        if method not in methods:
            methods[method] = {'amount': 0, 'count': 0}
        methods[method]['amount'] += amount
        methods[method]['count'] += 1
    
    for method, data in methods.items():
        percentage = (data['amount'] / financial_revenue * 100) if financial_revenue > 0 else 0
        print(f"   - {method}: Rs.{data['amount']:.2f} ({data['count']} transactions, {percentage:.0f}%)")
    print()
    
    print(f"SUMMARY:")
    print(f"Dashboard shows: Rs.22,629")
    print(f"Financial shows: Rs.22,778.55")
    print(f"Actual dashboard calc: Rs.{dashboard_revenue}")
    print(f"Actual financial calc: Rs.{financial_revenue}")
    print(f"Difference: Rs.{abs(financial_revenue - dashboard_revenue)}")

if __name__ == '__main__':
    check_financial_vs_dashboard()