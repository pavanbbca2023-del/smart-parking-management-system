# apps.py - Analytics API App Configuration

from django.apps import AppConfig


class BackendAnalyticsApiConfig(AppConfig):
    """
    Configuration for Backend Analytics API app
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'backend_analytics_api'
    verbose_name = 'Smart Parking Analytics'