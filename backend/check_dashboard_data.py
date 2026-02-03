#!/usr/bin/env python
import os
import sys
import django
from datetime import datetime, date

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

from backend_core_api.models import User, Zone, Slot, ParkingSession, Payment
from django.utils import timezone

def check_dashboard_data():
    print("=== CHECKING DASHBOARD DATA ===\n")
    
    # Today's date
    today = timezone.now().date()
    print(f"Today's Date: {today}")
    print(f"Current Time: {timezone.now()}\n")
    
    # 1. Today's Bookings
    today_sessions = ParkingSession.objects.filter(entry_time__date=today)
    print(f"1. TODAY'S BOOKINGS: {today_sessions.count()}")
    print(f"   - Sessions created today: {today_sessions.count()}")
    if today_sessions.exists():
        print("   - Sample sessions:")
        for session in today_sessions[:3]:
            print(f"     * {session.vehicle_number} at {session.entry_time}")
    print()
    
    # 2. Today's Revenue
    today_payments = Payment.objects.filter(created_at__date=today, status='success')
    today_revenue = sum(payment.amount for payment in today_payments)
    print(f"2. TODAY'S REVENUE: Rs.{today_revenue}")
    print(f"   - Successful payments today: {today_payments.count()}")
    if today_payments.exists():
        print("   - Sample payments:")
        for payment in today_payments[:3]:
            print(f"     * Rs.{payment.amount} - {payment.payment_method}")
    print()
    
    # 3. Active Sessions
    active_sessions = ParkingSession.objects.filter(status='active')
    print(f"3. ACTIVE SESSIONS: {active_sessions.count()}")
    print(f"   - Currently parked vehicles: {active_sessions.count()}")
    if active_sessions.exists():
        print("   - Active vehicles:")
        for session in active_sessions[:5]:
            print(f"     * {session.vehicle_number} in {session.zone.name if session.zone else 'Unknown Zone'}")
    print()
    
    # 4. Total Users
    total_users = User.objects.count()
    print(f"4. TOTAL USERS: {total_users}")
    print(f"   - All users in system: {total_users}")
    print(f"   - Admins: {User.objects.filter(role='ADMIN').count()}")
    print(f"   - Staff: {User.objects.filter(role='STAFF').count()}")
    print(f"   - Regular Users: {User.objects.filter(role='USER').count()}")
    print()
    
    # 5. Occupancy Rate
    total_slots = Slot.objects.count()
    occupied_slots = Slot.objects.filter(is_occupied=True).count()
    occupancy_rate = (occupied_slots / total_slots * 100) if total_slots > 0 else 0
    print(f"5. OCCUPANCY RATE: {occupancy_rate:.1f}%")
    print(f"   - Total slots: {total_slots}")
    print(f"   - Occupied slots: {occupied_slots}")
    print(f"   - Available slots: {total_slots - occupied_slots}")
    print()
    
    # 6. Zone Availability
    zones = Zone.objects.filter(is_active=True)
    zones_with_space = 0
    print(f"6. ZONES:")
    print(f"   - Total active zones: {zones.count()}")
    for zone in zones:
        available = zone.total_slots - zone.occupied_slots
        if available > 0:
            zones_with_space += 1
        print(f"   - {zone.name}: {available}/{zone.total_slots} available ({zone.occupied_slots} occupied)")
    print(f"   - Zones with free spots: {zones_with_space}/{zones.count()}")
    print()
    
    # 7. All Sessions Summary
    all_sessions = ParkingSession.objects.all()
    print(f"7. ALL SESSIONS SUMMARY:")
    print(f"   - Total sessions ever: {all_sessions.count()}")
    print(f"   - Active: {all_sessions.filter(status='active').count()}")
    print(f"   - Completed: {all_sessions.filter(status='completed').count()}")
    print(f"   - Reserved: {all_sessions.filter(status='reserved').count()}")
    print(f"   - Cancelled: {all_sessions.filter(status='cancelled').count()}")
    print()
    
    # 8. Payment Summary
    all_payments = Payment.objects.all()
    total_revenue = sum(payment.amount for payment in all_payments.filter(status='success'))
    print(f"8. PAYMENT SUMMARY:")
    print(f"   - Total payments: {all_payments.count()}")
    print(f"   - Successful: {all_payments.filter(status='success').count()}")
    print(f"   - Total revenue ever: Rs.{total_revenue}")
    print()

if __name__ == '__main__':
    check_dashboard_data()