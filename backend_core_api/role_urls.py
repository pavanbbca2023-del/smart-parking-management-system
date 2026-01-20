# role_urls.py - Role-based URL configuration

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .viewsets import UserBookingViewSet, StaffOperationsViewSet, AdminReportsViewSet

# Create routers
router = DefaultRouter()

# Register viewsets
router.register(r'user', UserBookingViewSet, basename='user')
router.register(r'staff', StaffOperationsViewSet, basename='staff')
router.register(r'admin', AdminReportsViewSet, basename='admin')

urlpatterns = [
    # JWT Authentication
    path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Role-based APIs
    path('api/', include(router.urls)),
    
    # Specific endpoints
    path('api/user/book-slot/', UserBookingViewSet.as_view({'post': 'book_slot'}), name='book_slot'),
    path('api/user/bookings/', UserBookingViewSet.as_view({'get': 'bookings'}), name='user_bookings'),
    path('api/user/current-session/', UserBookingViewSet.as_view({'get': 'current_session'}), name='current_session'),
    
    path('api/staff/entry/', StaffOperationsViewSet.as_view({'post': 'entry'}), name='staff_entry'),
    path('api/staff/exit/', StaffOperationsViewSet.as_view({'post': 'exit'}), name='staff_exit'),
    path('api/staff/current-sessions/', StaffOperationsViewSet.as_view({'get': 'current_sessions'}), name='staff_sessions'),
    
    path('api/admin/payments/', AdminReportsViewSet.as_view({'get': 'payments'}), name='admin_payments'),
    path('api/admin/reports/', AdminReportsViewSet.as_view({'get': 'reports'}), name='admin_reports'),
]