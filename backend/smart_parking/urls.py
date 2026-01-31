from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from backend_core_api.views import home, CoreDashboardView, ParkingSessionViewSet
from backend_analytics_api.views import DashboardAnalyticsView

urlpatterns = [
    path('', home, name='home'),
    path('admin/', admin.site.urls),
    
    # Auth endpoints
    path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Unified App Includes
    path('api/core/', include('backend_core_api.urls')),
    path('api/analytics/', include('backend_analytics_api.urls')),
    
    # Dashboard Aliases
    path('api/dashboard/', CoreDashboardView.as_view(), name='core-dashboard'),
    
    # Specialized Parking Logic (Direct Overrides for specific frontend paths)
    path('api/parking/book/', ParkingSessionViewSet.as_view({'post': 'book_parking'})),
    path('api/parking/scan-entry/', ParkingSessionViewSet.as_view({'post': 'scan_entry'})),
    path('api/parking/scan-exit/', ParkingSessionViewSet.as_view({'post': 'scan_exit'})),
    path('api/parking/refund/', ParkingSessionViewSet.as_view({'post': 'refund'})),
    path('api/parking/payment-status/', ParkingSessionViewSet.as_view({'post': 'payment_status'})),
]
