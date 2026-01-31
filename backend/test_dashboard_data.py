import os
import django
import json
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

from backend_analytics_api.services import AnalyticsService

def test_dashboard():
    print("Fetching Dashboard Summary...")
    summary = AnalyticsService.get_dashboard_summary()
    
    if 'error' in summary:
        print(f"FAILED: {summary['error']}")
    else:
        print("SUCCESS: Dashboard data retrieved")
        print(f" - Staff: {summary.get('current_staff_name')}")
        print(f" - Entries: {summary.get('vehicles_entered')}")
        print(f" - Exits: {summary.get('completed_sessions')}")
        print(f" - Total Revenue: {summary.get('total_revenue')}")
        print(f" - Cash: {summary.get('cash_revenue')}")
        print(f" - Online: {summary.get('online_revenue')}")

if __name__ == "__main__":
    test_dashboard()
