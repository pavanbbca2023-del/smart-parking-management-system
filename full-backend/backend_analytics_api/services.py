from django.db.models import Count, Sum, Q, Avg
from django.utils import timezone
from datetime import datetime, timedelta
from django.apps import apps
from decimal import Decimal

class AnalyticsService:
    @staticmethod
    def get_models():
        from django.apps import apps
        ParkingSession = apps.get_model('backend_core_api', 'ParkingSession')
        Zone = apps.get_model('backend_core_api', 'Zone')
        Vehicle = apps.get_model('backend_core_api', 'Vehicle')
        Slot = apps.get_model('backend_core_api', 'Slot')
        try:
            Payment = apps.get_model('backend_core_api', 'Payment')
        except:
            Payment = None
        return ParkingSession, Zone, Vehicle, Payment, Slot
    
    @staticmethod
    def get_dashboard_summary():
        try:
            ParkingSession, Zone, Vehicle, Payment, Slot = AnalyticsService.get_models()
            active_sessions = ParkingSession.objects.filter(status='active').count()
            completed_sessions = ParkingSession.objects.filter(status='completed').count()
            total_revenue = ParkingSession.objects.filter(payment_status='paid').aggregate(total=Sum('amount_paid'))['total'] or Decimal('0.00')
            total_zones = Zone.objects.filter(is_active=True).count()
            total_slots = Slot.objects.count()
            occupied_slots = Slot.objects.filter(is_occupied=True).count()
            
            from django.contrib.auth import get_user_model
            User = get_user_model()
            total_users = User.objects.count()
            occupancy_rate = (occupied_slots / total_slots * 100) if total_slots > 0 else 0
            
            return {
                'active_sessions': active_sessions,
                'completed_sessions': completed_sessions,
                'total_revenue': float(total_revenue),
                'total_zones': total_zones,
                'total_slots': total_slots,
                'occupied_slots': occupied_slots,
                'occupancy_rate': round(occupancy_rate, 2),
                'total_users': total_users,
                'users_this_week': 0
            }
        except Exception as e:
            return {'error': str(e)}

    @staticmethod
    def get_zone_occupancy():
        try:
            ParkingSession, Zone, Vehicle, Payment, Slot = AnalyticsService.get_models()
            zones_data = []
            for zone in Zone.objects.filter(is_active=True):
                total_slots = zone.total_slots
                occupied_slots = zone.slots.filter(is_occupied=True).count()
                occupancy_rate = (occupied_slots / total_slots * 100) if total_slots > 0 else 0
                
                zones_data.append({
                    'zone_id': zone.id,
                    'zone_name': zone.name,
                    'hourly_rate': float(zone.base_price),
                    'total_slots': total_slots,
                    'occupied_slots': occupied_slots,
                    'available_slots': total_slots - occupied_slots,
                    'occupancy_rate': round(occupancy_rate, 2),
                    'active_sessions': occupied_slots
                })
            return zones_data
        except Exception as e:
            return {'error': str(e)}

    @staticmethod
    def get_revenue_report(from_date=None, to_date=None):
        try:
            ParkingSession, Zone, Vehicle, Payment, Slot = AnalyticsService.get_models()
            if not from_date: from_date = timezone.now().date() - timedelta(days=30)
            if not to_date: to_date = timezone.now().date()
            
            from_datetime = datetime.combine(from_date, datetime.min.time())
            to_datetime = datetime.combine(to_date, datetime.max.time())
            
            sessions = ParkingSession.objects.filter(entry_time__range=[from_datetime, to_datetime], payment_status='paid')
            total_revenue = sessions.aggregate(total=Sum('amount_paid'))['total'] or Decimal('0.00')
            zone_revenue = sessions.values('zone__name').annotate(revenue=Sum('amount_paid'), session_count=Count('id')).order_by('-revenue')
            
            # Calculate daily revenue
            from django.db.models.functions import TruncDate
            daily_revenue = sessions.annotate(date=TruncDate('entry_time')).values('date').annotate(
                revenue=Sum('amount_paid')
            ).order_by('date')
            
            # Calculate payment method revenue
            payment_method_revenue = sessions.values('payment_method').annotate(
                revenue=Sum('amount_paid')
            ).order_by('-revenue')
            
            return {
                'from_date': from_date.isoformat(),
                'to_date': to_date.isoformat(),
                'total_revenue': float(total_revenue),
                'total_sessions': sessions.count(),
                'zone_revenue': list(zone_revenue),
                'payment_method_revenue': [
                    {'payment_method': pm['payment_method'] or 'Cash', 'revenue': float(pm['revenue'])}
                    for pm in payment_method_revenue
                ],
                'daily_revenue': [
                    {'date': dr['date'].isoformat(), 'revenue': float(dr['revenue'])}
                    for dr in daily_revenue
                ]
            }
        except Exception as e:
            return {'error': str(e)}

    @staticmethod
    def get_peak_hours():
        try:
            ParkingSession, Zone, Vehicle, Payment, Slot = AnalyticsService.get_models()
            sessions = ParkingSession.objects.filter(entry_time__gte=timezone.now() - timedelta(days=30))
            hourly_data = {}
            for session in sessions:
                hour = session.entry_time.hour
                hourly_data[hour] = hourly_data.get(hour, 0) + 1
            
            peak_hours = [{'hour': h, 'session_count': hourly_data.get(h, 0)} for h in range(24)]
            return {'hourly_data': peak_hours, 'top_peak_hours': sorted(peak_hours, key=lambda x: x['session_count'], reverse=True)[:5]}
        except Exception as e:
            return {'error': str(e)}

    @staticmethod
    def get_active_sessions():
        try:
            ParkingSession, Zone, Vehicle, Payment, Slot = AnalyticsService.get_models()
            return ParkingSession.objects.filter(status='active').select_related('zone')
        except Exception as e:
            return []

    @staticmethod
    def get_completed_sessions():
        try:
            ParkingSession, Zone, Vehicle, Payment, Slot = AnalyticsService.get_models()
            return ParkingSession.objects.filter(status='completed').select_related('zone').order_by('-exit_time')[:50]
        except Exception as e:
            return []
