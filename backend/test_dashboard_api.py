import os
import django
import json
from rest_framework.test import APIRequestFactory

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

def test_dashboard_api():
    from backend_analytics_api.views import DashboardAnalyticsView
    print("Testing Dashboard Analytics API View...")
    factory = APIRequestFactory()
    request = factory.get('/api/analytics/dashboard/')
    view = DashboardAnalyticsView.as_view()
    response = view(request)
    
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print("SUCCESS: API returned data")
        print(json.dumps(response.data, indent=2))
    else:
        print(f"FAILED: {response.data}")

if __name__ == "__main__":
    test_dashboard_api()
