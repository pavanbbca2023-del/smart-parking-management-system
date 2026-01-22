# populate_analytics.py - Generate Analytics Data

from django.core.management.base import BaseCommand
from django.utils import timezone
from backend_analytics_api.models import DailyReport, ZoneAnalytics, VehicleAnalytics, RevenueReport, PeakHourAnalytics
from backend_core_api.models import ParkingSession, ParkingZone, Vehicle
from datetime import datetime, timedelta, date
from django.db.models import Count, Sum, Avg

class Command(BaseCommand):
    help = 'Generate analytics data from existing parking sessions'

    def handle(self, *args, **options):
        self.stdout.write('Generating analytics data...')
        
        # Generate daily reports for last 30 days
        end_date = date.today()
        start_date = end_date - timedelta(days=30)
        
        for single_date in self.daterange(start_date, end_date):
            sessions = ParkingSession.objects.filter(
                entry_time__date=single_date,
                exit_time__isnull=False
            )
            
            if sessions.exists():
                total_revenue = sessions.aggregate(Sum('amount_paid'))['amount_paid__sum'] or 0
                total_sessions = sessions.count()
                
                # Calculate occupancy rate (simplified)
                total_slots = 200  # Assuming 200 total slots
                occupancy_rate = min((total_sessions / total_slots) * 100, 100)
                
                DailyReport.objects.update_or_create(
                    date=single_date,
                    defaults={
                        'total_sessions': total_sessions,
                        'total_revenue': total_revenue,
                        'occupancy_rate': occupancy_rate,
                    }
                )
        
        self.stdout.write('Created daily reports')
        
        # Generate zone analytics
        zones = ParkingZone.objects.all()
        for zone in zones:
            for single_date in self.daterange(start_date, end_date):
                sessions = ParkingSession.objects.filter(
                    zone=zone,
                    entry_time__date=single_date,
                    exit_time__isnull=False
                )
                
                if sessions.exists():
                    revenue = sessions.aggregate(Sum('amount_paid'))['amount_paid__sum'] or 0
                    sessions_count = sessions.count()
                    
                    ZoneAnalytics.objects.update_or_create(
                        zone=zone,
                        date=single_date,
                        defaults={
                            'sessions_count': sessions_count,
                            'revenue': revenue,
                            'occupancy_rate': min((sessions_count / 50) * 100, 100),  # 50 slots per zone
                        }
                    )
        
        self.stdout.write('Created zone analytics')
        
        # Generate vehicle analytics
        vehicles = Vehicle.objects.all()
        for vehicle in vehicles:
            sessions = ParkingSession.objects.filter(vehicle=vehicle)
            if sessions.exists():
                total_amount = sessions.aggregate(Sum('amount_paid'))['amount_paid__sum'] or 0
                total_sessions = sessions.count()
                last_visit = sessions.order_by('-entry_time').first().entry_time
                
                # Find favorite zone
                favorite_zone = sessions.values('zone').annotate(
                    count=Count('zone')
                ).order_by('-count').first()
                
                favorite_zone_obj = None
                if favorite_zone:
                    favorite_zone_obj = ParkingZone.objects.get(id=favorite_zone['zone'])
                
                VehicleAnalytics.objects.update_or_create(
                    vehicle=vehicle,
                    defaults={
                        'total_sessions': total_sessions,
                        'total_amount_paid': total_amount,
                        'favorite_zone': favorite_zone_obj,
                        'last_visit': last_visit,
                    }
                )
        
        self.stdout.write('Created vehicle analytics')
        
        # Generate revenue reports
        RevenueReport.objects.update_or_create(
            period_type='MONTHLY',
            start_date=start_date,
            end_date=end_date,
            defaults={
                'total_revenue': ParkingSession.objects.filter(
                    entry_time__date__range=[start_date, end_date]
                ).aggregate(Sum('amount_paid'))['amount_paid__sum'] or 0,
                'total_sessions': ParkingSession.objects.filter(
                    entry_time__date__range=[start_date, end_date]
                ).count(),
                'cash_revenue': ParkingSession.objects.filter(
                    entry_time__date__range=[start_date, end_date],
                    payment_method='CASH'
                ).aggregate(Sum('amount_paid'))['amount_paid__sum'] or 0,
                'online_revenue': ParkingSession.objects.filter(
                    entry_time__date__range=[start_date, end_date],
                    payment_method='ONLINE'
                ).aggregate(Sum('amount_paid'))['amount_paid__sum'] or 0,
            }
        )
        
        self.stdout.write('Created revenue reports')
        
        # Generate peak hour analytics
        for single_date in self.daterange(start_date, end_date):
            for hour in range(24):
                sessions = ParkingSession.objects.filter(
                    entry_time__date=single_date,
                    entry_time__hour=hour
                )
                
                if sessions.exists():
                    PeakHourAnalytics.objects.update_or_create(
                        date=single_date,
                        hour=hour,
                        defaults={
                            'sessions_count': sessions.count(),
                            'occupancy_rate': min((sessions.count() / 10) * 100, 100),  # Simplified
                        }
                    )
        
        self.stdout.write('Created peak hour analytics')
        
        # Summary
        self.stdout.write('\\nAnalytics Summary:')
        self.stdout.write(f'   Daily Reports: {DailyReport.objects.count()}')
        self.stdout.write(f'   Zone Analytics: {ZoneAnalytics.objects.count()}')
        self.stdout.write(f'   Vehicle Analytics: {VehicleAnalytics.objects.count()}')
        self.stdout.write(f'   Revenue Reports: {RevenueReport.objects.count()}')
        self.stdout.write(f'   Peak Hour Analytics: {PeakHourAnalytics.objects.count()}')
        
        self.stdout.write('\\nAnalytics data generated successfully!')
    
    def daterange(self, start_date, end_date):
        for n in range(int((end_date - start_date).days)):
            yield start_date + timedelta(n)