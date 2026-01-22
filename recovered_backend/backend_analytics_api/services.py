# services.py - Analytics Business Logic

from django.db.models import Count, Sum, Q, Avg
from django.utils import timezone
from datetime import datetime, timedelta
from django.apps import apps
from decimal import Decimal


class AnalyticsService:
    """
    Service class containing all analytics business logic
    """
    
    @staticmethod
    def get_models():
        """
        Get models dynamically to avoid direct imports
        """
        ParkingSession = apps.get_model('backend_core_api', 'ParkingSession')
        ParkingSlot = apps.get_model('backend_core_api', 'ParkingSlot')
        ParkingZone = apps.get_model('backend_core_api', 'ParkingZone')
        Vehicle = apps.get_model('backend_core_api', 'Vehicle')
        try:
            Payment = apps.get_model('backend_core_api', 'Payment')
        except:
            Payment = None
        return ParkingSession, ParkingSlot, ParkingZone, Vehicle, Payment
    
    @staticmethod
    def get_dashboard_summary():
        """
        Get overall dashboard summary statistics
        """
        try:
            ParkingSession, ParkingSlot, ParkingZone, Vehicle, Payment = AnalyticsService.get_models()
            
            # Get current active sessions
            active_sessions = ParkingSession.objects.filter(exit_time__isnull=True).count()
            
            # Get total completed sessions
            completed_sessions = ParkingSession.objects.filter(exit_time__isnull=False).count()
            
            # Get total revenue from paid sessions
            total_revenue = ParkingSession.objects.filter(
                is_paid=True
            ).aggregate(total=Sum('amount_paid'))['total'] or Decimal('0.00')
            
            # Get total zones and slots
            total_zones = ParkingZone.objects.filter(is_active=True).count()
            total_slots = ParkingSlot.objects.count()
            occupied_slots = ParkingSlot.objects.filter(is_occupied=True).count()
            
            # Get total users
            from django.contrib.auth import get_user_model
            User = get_user_model()
            total_users = User.objects.count()
            
            # Get users joined this week
            seven_days_ago = timezone.now() - timedelta(days=7)
            users_this_week = User.objects.filter(date_joined__gte=seven_days_ago).count()
            
            # Calculate occupancy rate
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
                'users_this_week': users_this_week
            }
        except Exception as e:
            return {'error': str(e)}
    
    @staticmethod
    def get_zone_occupancy():
        """
        Get occupancy statistics for each zone
        """
        try:
            ParkingSession, ParkingSlot, ParkingZone, Vehicle, Payment = AnalyticsService.get_models()
            
            zones_data = []
            zones = ParkingZone.objects.filter(is_active=True)
            
            for zone in zones:
                # Get total slots in zone
                total_slots = zone.slots.count()
                
                # Get occupied slots in zone
                occupied_slots = zone.slots.filter(is_occupied=True).count()
                
                # Calculate occupancy rate
                occupancy_rate = (occupied_slots / total_slots * 100) if total_slots > 0 else 0
                
                # Get active sessions in zone
                active_sessions = zone.sessions.filter(exit_time__isnull=True).count()
                
                zones_data.append({
                    'zone_id': zone.id,
                    'zone_name': zone.name,
                    'hourly_rate': float(zone.hourly_rate),
                    'total_slots': total_slots,
                    'occupied_slots': occupied_slots,
                    'available_slots': total_slots - occupied_slots,
                    'occupancy_rate': round(occupancy_rate, 2),
                    'active_sessions': active_sessions
                })
            
            return zones_data
        except Exception as e:
            return {'error': str(e)}
    
    @staticmethod
    def get_revenue_report(from_date=None, to_date=None):
        """
        Get revenue report for specified date range
        """
        try:
            ParkingSession, ParkingSlot, ParkingZone, Vehicle, Payment = AnalyticsService.get_models()
            
            # Set default date range if not provided
            if not from_date:
                from_date = timezone.now().date() - timedelta(days=30)
            if not to_date:
                to_date = timezone.now().date()
            
            # Convert to datetime for filtering
            from_datetime = datetime.combine(from_date, datetime.min.time())
            to_datetime = datetime.combine(to_date, datetime.max.time())
            
            # Get sessions in date range
            sessions = ParkingSession.objects.filter(
                created_at__range=[from_datetime, to_datetime],
                is_paid=True
            )
            
            # Calculate total revenue
            total_revenue = sessions.aggregate(total=Sum('amount_paid'))['total'] or Decimal('0.00')
            
            # Get revenue by zone
            zone_revenue = sessions.values('zone__name').annotate(
                revenue=Sum('amount_paid'),
                session_count=Count('id')
            ).order_by('-revenue')
            
            # Get revenue by payment method
            payment_method_revenue = sessions.values('payment_method').annotate(
                revenue=Sum('amount_paid'),
                session_count=Count('id')
            )
            
            # Get daily revenue breakdown
            daily_revenue = sessions.values('created_at__date').annotate(
                revenue=Sum('amount_paid')
            ).order_by('created_at__date')
            
            return {
                'from_date': from_date.isoformat(),
                'to_date': to_date.isoformat(),
                'total_revenue': float(total_revenue),
                'total_sessions': sessions.count(),
                'zone_revenue': [
                    {'zone__name': item['zone__name'], 'revenue': float(item['revenue']), 'session_count': item['session_count']}
                    for item in zone_revenue
                ],
                'payment_method_revenue': [
                    {'payment_method': item['payment_method'], 'revenue': float(item['revenue']), 'session_count': item['session_count']}
                    for item in payment_method_revenue
                ],
                'daily_revenue': [
                    {'date': item['created_at__date'].isoformat(), 'revenue': float(item['revenue'])}
                    for item in daily_revenue
                ]
            }
        except Exception as e:
            return {'error': str(e)}
    
    @staticmethod
    def get_peak_hours():
        """
        Get peak hours analysis based on entry times
        """
        try:
            ParkingSession, ParkingSlot, ParkingZone, Vehicle, Payment = AnalyticsService.get_models()
            
            # Get sessions from last 30 days
            thirty_days_ago = timezone.now() - timedelta(days=30)
            sessions = ParkingSession.objects.filter(
                entry_time__gte=thirty_days_ago,
                entry_time__isnull=False
            )
            
            # Group by hour of day
            hourly_data = {}
            for session in sessions:
                hour = session.entry_time.hour
                if hour not in hourly_data:
                    hourly_data[hour] = 0
                hourly_data[hour] += 1
            
            # Convert to list format
            peak_hours = []
            for hour in range(24):
                peak_hours.append({
                    'hour': hour,
                    'session_count': hourly_data.get(hour, 0)
                })
            
            # Sort by session count to find peak hours
            peak_hours_sorted = sorted(peak_hours, key=lambda x: x['session_count'], reverse=True)
            
            return {
                'hourly_data': peak_hours,
                'top_peak_hours': peak_hours_sorted[:5]
            }
        except Exception as e:
            return {'error': str(e)}
    
    @staticmethod
    def get_active_sessions():
        """
        Get all currently active parking sessions
        """
        try:
            ParkingSession, ParkingSlot, ParkingZone, Vehicle, Payment = AnalyticsService.get_models()
            
            active_sessions = ParkingSession.objects.filter(
                exit_time__isnull=True
            ).select_related('vehicle', 'slot', 'zone')
            
            sessions_data = []
            for session in active_sessions:
                # Calculate duration
                duration = timezone.now() - session.entry_time if session.entry_time else timedelta(0)
                duration_hours = duration.total_seconds() / 3600
                
                sessions_data.append({
                    'session_id': session.id,
                    'vehicle_number': session.vehicle.vehicle_number,
                    'owner_name': session.vehicle.owner_name,
                    'zone_name': session.zone.name,
                    'slot_number': session.slot.slot_number,
                    'entry_time': session.entry_time.isoformat() if session.entry_time else None,
                    'duration_hours': round(duration_hours, 2),
                    'qr_code': session.qr_code,
                    'payment_status': session.payment_status
                })
            
            return sessions_data
        except Exception as e:
            return {'error': str(e)}
    
    @staticmethod
    def get_completed_sessions():
        """
        Get recently completed parking sessions
        """
        try:
            ParkingSession, ParkingSlot, ParkingZone, Vehicle, Payment = AnalyticsService.get_models()
            
            completed_sessions = ParkingSession.objects.filter(
                exit_time__isnull=False
            ).select_related('vehicle', 'slot', 'zone').order_by('-exit_time')[:50]
            
            sessions_data = []
            for session in completed_sessions:
                # Calculate duration
                if session.entry_time and session.exit_time:
                    duration = session.exit_time - session.entry_time
                    duration_hours = duration.total_seconds() / 3600
                else:
                    duration_hours = 0
                
                sessions_data.append({
                    'session_id': session.id,
                    'vehicle_number': session.vehicle.vehicle_number,
                    'owner_name': session.vehicle.owner_name,
                    'zone_name': session.zone.name,
                    'slot_number': session.slot.slot_number,
                    'entry_time': session.entry_time.isoformat() if session.entry_time else None,
                    'exit_time': session.exit_time.isoformat() if session.exit_time else None,
                    'duration_hours': round(duration_hours, 2),
                    'amount_paid': float(session.amount_paid),
                    'payment_method': session.payment_method,
                    'is_paid': session.is_paid
                })
            
            return sessions_data
        except Exception as e:
            return {'error': str(e)}
    
    @staticmethod
    def get_vehicle_history(vehicle_number):
        """
        Get parking history for a specific vehicle
        """
        try:
            ParkingSession, ParkingSlot, ParkingZone, Vehicle, Payment = AnalyticsService.get_models()
            
            # Get vehicle
            try:
                vehicle = Vehicle.objects.get(vehicle_number=vehicle_number)
            except Vehicle.DoesNotExist:
                return {'error': 'Vehicle not found'}
            
            # Get all sessions for this vehicle
            sessions = ParkingSession.objects.filter(
                vehicle=vehicle
            ).select_related('slot', 'zone').order_by('-created_at')
            
            sessions_data = []
            total_amount = Decimal('0.00')
            total_sessions = sessions.count()
            
            for session in sessions:
                # Calculate duration if both times exist
                duration_hours = 0
                if session.entry_time and session.exit_time:
                    duration = session.exit_time - session.entry_time
                    duration_hours = duration.total_seconds() / 3600
                
                sessions_data.append({
                    'session_id': session.id,
                    'zone_name': session.zone.name,
                    'slot_number': session.slot.slot_number,
                    'entry_time': session.entry_time.isoformat() if session.entry_time else None,
                    'exit_time': session.exit_time.isoformat() if session.exit_time else None,
                    'duration_hours': round(duration_hours, 2),
                    'amount_paid': float(session.amount_paid),
                    'payment_method': session.payment_method,
                    'is_paid': session.is_paid,
                    'status': 'Active' if session.exit_time is None else 'Completed'
                })
                
                total_amount += session.amount_paid
            
            return {
                'vehicle_number': vehicle.vehicle_number,
                'owner_name': vehicle.owner_name,
                'total_sessions': total_sessions,
                'total_amount_paid': float(total_amount),
                'sessions': sessions_data
            }
        except Exception as e:
            return {'error': str(e)}
    
    @staticmethod
    def get_payment_analytics():
        """
        Get payment analytics and statistics
        """
        try:
            ParkingSession, ParkingSlot, ParkingZone, Vehicle, Payment = AnalyticsService.get_models()
            
            # Get all paid sessions
            paid_sessions = ParkingSession.objects.filter(is_paid=True)
            
            # Total revenue
            total_revenue = paid_sessions.aggregate(total=Sum('amount_paid'))['total'] or Decimal('0.00')
            
            # Payment method breakdown
            payment_methods = paid_sessions.values('payment_method').annotate(
                count=Count('id'),
                revenue=Sum('amount_paid')
            )
            
            # Payment status breakdown
            payment_status = ParkingSession.objects.values('payment_status').annotate(
                count=Count('id')
            )
            
            # Average payment amount
            avg_payment = paid_sessions.aggregate(avg=Avg('amount_paid'))['avg'] or Decimal('0.00')
            
            # Recent payments (last 10)
            recent_payments = paid_sessions.select_related('vehicle', 'zone').order_by('-updated_at')[:10]
            
            recent_data = []
            for session in recent_payments:
                recent_data.append({
                    'session_id': session.id,
                    'vehicle_number': session.vehicle.vehicle_number,
                    'zone_name': session.zone.name,
                    'amount': float(session.amount_paid),
                    'payment_method': session.payment_method,
                    'payment_time': session.updated_at.isoformat()
                })
            
            return {
                'total_revenue': float(total_revenue),
                'total_paid_sessions': paid_sessions.count(),
                'average_payment': float(avg_payment),
                'payment_methods': list(payment_methods),
                'payment_status': list(payment_status),
                'recent_payments': recent_data
            }
        except Exception as e:
            return {'error': str(e)}
    
    @staticmethod
    def get_slot_usage():
        """
        Get slot usage analytics
        """
        try:
            ParkingSession, ParkingSlot, ParkingZone, Vehicle, Payment = AnalyticsService.get_models()
            
            slots_data = []
            slots = ParkingSlot.objects.select_related('zone')
            
            for slot in slots:
                # Get total sessions for this slot
                total_sessions = slot.sessions.count()
                
                # Get active session if any
                active_session = slot.sessions.filter(exit_time__isnull=True).first()
                
                # Calculate total revenue from this slot
                total_revenue = slot.sessions.filter(is_paid=True).aggregate(
                    total=Sum('amount_paid')
                )['total'] or Decimal('0.00')
                
                slots_data.append({
                    'slot_id': slot.id,
                    'zone_name': slot.zone.name,
                    'slot_number': slot.slot_number,
                    'is_occupied': slot.is_occupied,
                    'total_sessions': total_sessions,
                    'total_revenue': float(total_revenue),
                    'current_vehicle': active_session.vehicle.vehicle_number if active_session else None
                })
            
            # Sort by total sessions (most used first)
            slots_data.sort(key=lambda x: x['total_sessions'], reverse=True)
            
            return slots_data
        except Exception as e:
            return {'error': str(e)}