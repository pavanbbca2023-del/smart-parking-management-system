"""
Management command to set up initial parking system data
Run with: python manage.py setup_parking_system
"""

from django.core.management.base import BaseCommand
from django.db import transaction
from backend_core.parking.models_complete import ParkingZone, ParkingSlot


class Command(BaseCommand):
    help = 'Set up initial parking system data'

    def add_arguments(self, parser):
        parser.add_argument(
            '--reset',
            action='store_true',
            help='Reset all data before creating new data',
        )

    @transaction.atomic
    def handle(self, *args, **options):
        if options['reset']:
            self.stdout.write("🗑️  Resetting all parking data...")
            ParkingSlot.objects.all().delete()
            ParkingZone.objects.all().delete()
            self.stdout.write(self.style.SUCCESS("✅ Data reset complete"))

        self.stdout.write("🏗️  Setting up parking zones...")
        
        # Create parking zones
        zones_data = [
            {
                'name': 'Zone A - Premium',
                'hourly_rate': 50.00,
                'total_slots': 50,
                'slot_prefix': 'A'
            },
            {
                'name': 'Zone B - Standard',
                'hourly_rate': 30.00,
                'total_slots': 100,
                'slot_prefix': 'B'
            },
            {
                'name': 'Zone C - Economy',
                'hourly_rate': 20.00,
                'total_slots': 150,
                'slot_prefix': 'C'
            }
        ]
        
        for zone_data in zones_data:
            # Create zone
            zone, created = ParkingZone.objects.get_or_create(
                name=zone_data['name'],
                defaults={
                    'hourly_rate': zone_data['hourly_rate'],
                    'total_slots': zone_data['total_slots']
                }
            )
            
            if created:
                self.stdout.write(f"✅ Created zone: {zone.name}")
                
                # Create slots for this zone
                for i in range(1, zone_data['total_slots'] + 1):
                    slot_number = f"{zone_data['slot_prefix']}{i:03d}"
                    ParkingSlot.objects.create(
                        zone=zone,
                        slot_number=slot_number
                    )
                
                self.stdout.write(f"✅ Created {zone_data['total_slots']} slots for {zone.name}")
            else:
                self.stdout.write(f"ℹ️  Zone already exists: {zone.name}")
        
        # Summary
        total_zones = ParkingZone.objects.count()
        total_slots = ParkingSlot.objects.count()
        
        self.stdout.write("\n" + "="*50)
        self.stdout.write(self.style.SUCCESS("🎉 PARKING SYSTEM SETUP COMPLETE"))
        self.stdout.write("="*50)
        self.stdout.write(f"📊 Total Zones: {total_zones}")
        self.stdout.write(f"🅿️  Total Slots: {total_slots}")
        self.stdout.write("\n🚀 System is ready for use!")
        self.stdout.write("📝 Next steps:")
        self.stdout.write("   1. Run: python manage.py runserver")
        self.stdout.write("   2. Visit: http://localhost:8000/admin/")
        self.stdout.write("   3. Test APIs: http://localhost:8000/parking/api/zones/")
        self.stdout.write("="*50)