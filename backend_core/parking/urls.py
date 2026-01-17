from django.urls import path
from . import views

# URL patterns for parking management
urlpatterns = [
    # Vehicle entry endpoint
    path('entry/', views.vehicle_entry, name='vehicle_entry'),
    
    # Vehicle exit endpoint
    path('exit/', views.vehicle_exit, name='vehicle_exit'),
    
    # Zone occupancy status endpoint
    path('zone/<str:zone_id>/status/', views.zone_status, name='zone_status'),
]
