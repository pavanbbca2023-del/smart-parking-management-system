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
            now = timezone.now()
            local_now = timezone.localtime(now)
            today_start = local_now.replace(hour=0, minute=0, second=0, microsecond=0)
            
            # Use filters consistently
            vehicles_entered = ParkingSession.objects.filter(entry_time__gte=today_start).count()
            vehicles_exited = ParkingSession.objects.filter(status='completed', exit_time__gte=today_start).count()
            active_sessions = ParkingSession.objects.filter(status='active').count()
            
            total_revenue = Decimal('0.00')
            cash_revenue = Decimal('0.00')
            online_revenue = Decimal('0.00')
            
            if Payment:
                today_payments = Payment.objects.filter(created_at__gte=today_start, status='success')
                total_revenue = today_payments.aggregate(total=Sum('amount'))['total'] or Decimal('0.00')
                cash_revenue = today_payments.filter(payment_method__iexact='cash').aggregate(total=Sum('amount'))['total'] or Decimal('0.00')
                online_revenue = total_revenue - cash_revenue
            
            total_zones = Zone.objects.filter(is_active=True).count()
            total_slots = Slot.objects.filter(is_active=True).count()
            occupied_slots = Slot.objects.filter(is_occupied=True, is_active=True).count()
            reserved_slots = Slot.objects.filter(is_reserved=True, is_active=True).count()
            occupancy_rate = (occupied_slots / total_slots * 100) if total_slots > 0 else 0
            
            from django.contrib.auth import get_user_model
            User = get_user_model()
            total_users = User.objects.count()
            
            current_staff_name = 'No Active Shift'
            Attendance = apps.get_model('backend_core_api', 'Attendance')
            if Attendance:
                last_duty = Attendance.objects.filter(status='on-duty').select_related('staff').last()
                if last_duty:
                    current_staff_name = last_duty.staff.get_full_name() or last_duty.staff.username

            return {
                'active_sessions': active_sessions,
                'completed_sessions': vehicles_exited,
                'vehicles_entered': vehicles_entered,
                'total_revenue': float(total_revenue),
                'cash_revenue': float(cash_revenue),
                'online_revenue': float(online_revenue),
                'current_staff_name': current_staff_name,
                'total_zones': total_zones,
                'total_slots': total_slots,
                'occupied_slots': occupied_slots,
                'reserved_slots': reserved_slots,
                'available_slots': total_slots - occupied_slots - reserved_slots,
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
                occupied_slots = zone.occupied_slots
                reserved_slots = zone.reserved_slots
                available_slots = zone.available_slots
                occupancy_rate = ((occupied_slots + reserved_slots) / total_slots * 100) if total_slots > 0 else 0
                
                zones_data.append({
                    'zone_id': zone.id,
                    'zone_name': zone.name,
                    'hourly_rate': float(zone.base_price),
                    'total_slots': total_slots,
                    'occupied_slots': occupied_slots,
                    'reserved_slots': reserved_slots,
                    'available_slots': available_slots,
                    'occupancy_rate': round(occupancy_rate, 2),
                    'active_sessions': occupied_slots + reserved_slots
                })
            return zones_data
        except Exception as e:
            return {'error': str(e)}

    @staticmethod
    def get_revenue_report(from_date=None, to_date=None, period='ALL'):
        try:
            ParkingSession, Zone, Vehicle, Payment, Slot = AnalyticsService.get_models()
            now = timezone.now()
            
            if not from_date:
                if period == 'DAILY':
                    from_date = now.date()
                else:
                    from_date = now.date() - timedelta(days=30)
            if not to_date: to_date = now.date()
            
            from_datetime = datetime.combine(from_date, datetime.min.time())
            to_datetime = datetime.combine(to_date, datetime.max.time())
            
            if Payment:
                # Still need sessions for count
                sessions = ParkingSession.objects.filter(entry_time__range=[from_datetime, to_datetime], payment_status='paid')
                
                payments_query = Payment.objects.filter(
                    created_at__range=[from_datetime, to_datetime],
                    status='success'
                )
                
                total_revenue = payments_query.aggregate(total=Sum('amount'))['total'] or Decimal('0.00')
                cash_revenue = payments_query.filter(payment_method__iexact='cash').aggregate(total=Sum('amount'))['total'] or Decimal('0.00')
                online_revenue = Decimal(total_revenue) - Decimal(cash_revenue)
                
                total_sessions = sessions.count()
                
                # Zone revenue still needs to join with session
                zone_revenue = payments_query.values('session__zone__name').annotate(
                    revenue=Sum('amount'), 
                    session_count=Count('session', distinct=True)
                ).order_by('-revenue')
                
                from django.db.models.functions import TruncDate
                daily_revenue = payments_query.annotate(date=TruncDate('created_at')).values('date').annotate(
                    revenue=Sum('amount')
                ).order_by('date')
                
                payment_method_revenue = payments_query.values('payment_method').annotate(
                    revenue=Sum('amount')
                ).order_by('-revenue')
            else:
                total_revenue = Decimal('0.00')
                cash_revenue = Decimal('0.00')
                online_revenue = Decimal('0.00')
                total_sessions = 0
                zone_revenue = []
                daily_revenue = []
                payment_method_revenue = []
            
            return {
                'from_date': from_date.isoformat(),
                'to_date': to_date.isoformat(),
                'total_revenue': float(total_revenue),
                'cash_revenue': float(cash_revenue),
                'online_revenue': float(online_revenue),
                'total_sessions': total_sessions,
                'zone_revenue': list(zone_revenue),
                'payment_method_revenue': [
                    {'payment_method': pm['payment_method'] or 'Unknown', 'revenue': float(pm['revenue'])}
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
            return ParkingSession.objects.filter(status__in=['active', 'reserved']).select_related('zone').order_by('-entry_time')
        except Exception as e:
            return []

    @staticmethod
    def get_completed_sessions():
        try:
            ParkingSession, Zone, Vehicle, Payment, Slot = AnalyticsService.get_models()
            return ParkingSession.objects.filter(status='completed').select_related('zone').order_by('-exit_time')[:50]
        except Exception as e:
            return []

class AlertService:
    @staticmethod
    def create_alert(alert_type, title, message):
        """Create a new alert in the system"""
        from .models import Alert
        return Alert.objects.create(
            type=alert_type,
            title=title,
            message=message
        )

    @staticmethod
    def check_zone_capacity(zone_id):
        """Check if zone is nearing capacity and create alerts if needed"""
        from backend_core_api.models import Zone
        try:
            zone = Zone.objects.get(id=zone_id)
            total = zone.total_slots
            occupied = zone.slots.filter(is_occupied=True).count()
            
            if total > 0:
                occupancy = (occupied / total) * 100
                if occupancy >= 100:
                    AlertService.create_alert(
                        'critical',
                        f'ZONE FULL: {zone.name}',
                        f'Zone {zone.name} has reached 100% capacity. No more entries allowed.'
                    )
                elif occupancy >= 90:
                    AlertService.create_alert(
                        'warning',
                        f'Zone Nearing Capacity: {zone.name}',
                        f'Zone {zone.name} is at {round(occupancy, 1)}% occupancy ({occupied}/{total} slots).'
                    )
        except Exception as e:
            print(f"Error checking zone capacity: {e}")
