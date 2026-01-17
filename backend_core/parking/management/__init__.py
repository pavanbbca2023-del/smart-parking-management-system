"""
Django management command to create test data
Run with: python manage.py create_test_data
"""

from django.core.management.base import BaseCommand
from django.utils import timezone
from backend_core.parking.models import ParkingZone, ParkingSlot, Vehicle, ParkingSession
from backend_core.parking.services.qr_service import QRService
from datetime import timedelta
import random


class Command(BaseCommand):
    help = 'Create test data for Smart Parking System'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing data before creating new test data',
        )

    def handle(self, *args, **options):
        # Clear existing data if requested
        if options['clear']:
            self.stdout.write("🗑️  Clearing existing data...")
            ParkingSession.objects.all().delete()
            ParkingSlot.objects.all().delete()
            ParkingZone.objects.all().delete()
            Vehicle.objects.all().delete()
            self.stdout.write(self.style.SUCCESS("✅ Data cleared!"))

        # Create Parking Zones
        self.stdout.write("\n📍 Creating Parking Zones...")
        zones = []

        zone_a = ParkingZone.objects.get_or_create(
            name="Zone A",
            defaults={
                'total_slots': 50,
                'hourly_rate': 40,
                'is_active': True
            }
        )
        zones.append(zone_a[0])
        self.stdout.write(f"   ✅ Created: Zone A (50 slots, ₹40/hour)")

        zone_b = ParkingZone.objects.get_or_create(
            name="Zone B",
            defaults={
                'total_slots': 100,
                'hourly_rate': 50,
                'is_active': True
            }
        )
        zones.append(zone_b[0])
        self.stdout.write(f"   ✅ Created: Zone B (100 slots, ₹50/hour)")

        zone_c = ParkingZone.objects.get_or_create(
            name="Zone C - Disabled",
            defaults={
                'total_slots': 25,
                'hourly_rate': 30,
                'is_active': False
            }
        )
        zones.append(zone_c[0])
        self.stdout.write(f"   ✅ Created: Zone C (25 slots, ₹30/hour) - DISABLED")

        # Create Parking Slots
        self.stdout.write("\n🅿️  Creating Parking Slots...")

        # Zone A slots
        for i in range(1, 51):
            slot_number = f"A{i:03d}"
            ParkingSlot.objects.get_or_create(
                zone=zones[0],
                slot_number=slot_number,
                defaults={'is_occupied': False}
            )
        self.stdout.write(f"   ✅ Created 50 slots for Zone A")

        # Zone B slots
        for i in range(1, 101):
            slot_number = f"B{i:03d}"
            ParkingSlot.objects.get_or_create(
                zone=zones[1],
                slot_number=slot_number,
                defaults={'is_occupied': False}
            )
        self.stdout.write(f"   ✅ Created 100 slots for Zone B")

        # Zone C slots
        for i in range(1, 26):
            slot_number = f"C{i:03d}"
            ParkingSlot.objects.get_or_create(
                zone=zones[2],
                slot_number=slot_number,
                defaults={'is_occupied': False}
            )
        self.stdout.write(f"   ✅ Created 25 slots for Zone C")

        # Create Test Vehicles
        self.stdout.write("\n🚗 Creating Test Vehicles...")

        vehicles_data = [
            {"number": "KA-01-AB-0001", "type": "Car", "owner": "Rajesh Kumar"},
            {"number": "KA-01-AB-0002", "type": "Bike", "owner": "Priya Singh"},
            {"number": "KA-01-AB-0003", "type": "Car", "owner": "Amit Patel"},
            {"number": "KA-01-AB-0004", "type": "SUV", "owner": "Neha Sharma"},
            {"number": "KA-01-AB-0005", "type": "Car", "owner": "Vikram Desai"},
            {"number": "KA-01-AB-0006", "type": "Bike", "owner": "Anjali Verma"},
            {"number": "KA-01-AB-0007", "type": "Car", "owner": "Rohan Nair"},
            {"number": "KA-01-AB-0008", "type": "Car", "owner": "Sneha Gupta"},
            {"number": "KA-01-AB-0009", "type": "Bike", "owner": "Arjun Singh"},
            {"number": "KA-01-AB-0010", "type": "Car", "owner": "Disha Kapoor"},
        ]

        vehicles = []
        for v_data in vehicles_data:
            vehicle, created = Vehicle.objects.get_or_create(
                vehicle_number=v_data['number'],
                defaults={
                    'vehicle_type': v_data['type'],
                    'owner_name': v_data['owner']
                }
            )
            vehicles.append(vehicle)
            status = "✅ Created" if created else "✓ Already exists"
            self.stdout.write(f"   {status}: {v_data['number']} ({v_data['type']})")

        # Create Test Parking Sessions
        self.stdout.write("\n🎫 Creating Test Parking Sessions...")

        # Session 1: Currently parked (30 minutes ago)
        vehicle1 = vehicles[0]
        slot1 = ParkingSlot.objects.filter(zone=zones[0], is_occupied=False).first()
        if slot1:
            slot1.is_occupied = True
            slot1.save()

            session1 = ParkingSession.objects.create(
                vehicle=vehicle1,
                slot=slot1,
                zone=zones[0],
                qr_code=QRService.generate_qr(),
                entry_time=timezone.now() - timedelta(minutes=30),
                exit_time=None,
                amount_paid=None,
                is_paid=False
            )
            self.stdout.write(f"   ✅ Active Session 1: {vehicle1.vehicle_number} in {slot1.slot_number}")

        # Session 2: Completed (2 hours, paid ₹80)
        vehicle2 = vehicles[1]
        session2 = ParkingSession.objects.create(
            vehicle=vehicle2,
            slot=None,
            zone=zones[0],
            qr_code=QRService.generate_qr(),
            entry_time=timezone.now() - timedelta(hours=3),
            exit_time=timezone.now() - timedelta(hours=1),
            amount_paid=80,
            is_paid=True
        )
        self.stdout.write(f"   ✅ Completed Session 2: {vehicle2.vehicle_number} (₹80, 2 hours)")

        # Session 3: Currently parked (1 hour ago)
        vehicle3 = vehicles[2]
        slot3 = ParkingSlot.objects.filter(zone=zones[1], is_occupied=False).first()
        if slot3:
            slot3.is_occupied = True
            slot3.save()

            session3 = ParkingSession.objects.create(
                vehicle=vehicle3,
                slot=slot3,
                zone=zones[1],
                qr_code=QRService.generate_qr(),
                entry_time=timezone.now() - timedelta(hours=1),
                exit_time=None,
                amount_paid=None,
                is_paid=False
            )
            self.stdout.write(f"   ✅ Active Session 3: {vehicle3.vehicle_number} in {slot3.slot_number}")

        # Session 4: Completed (15 minutes, FREE)
        vehicle4 = vehicles[3]
        session4 = ParkingSession.objects.create(
            vehicle=vehicle4,
            slot=None,
            zone=zones[1],
            qr_code=QRService.generate_qr(),
            entry_time=timezone.now() - timedelta(hours=2, minutes=15),
            exit_time=timezone.now() - timedelta(hours=1),
            amount_paid=0,
            is_paid=True
        )
        self.stdout.write(f"   ✅ Completed Session 4: {vehicle4.vehicle_number} (₹0, 15 minutes - FREE)")

        # Session 5: Unpaid session
        vehicle5 = vehicles[4]
        session5 = ParkingSession.objects.create(
            vehicle=vehicle5,
            slot=None,
            zone=zones[0],
            qr_code=QRService.generate_qr(),
            entry_time=timezone.now() - timedelta(hours=5),
            exit_time=timezone.now() - timedelta(hours=2),
            amount_paid=120,
            is_paid=False
        )
        self.stdout.write(f"   ✅ Unpaid Session 5: {vehicle5.vehicle_number} (₹120 - UNPAID)")

        # Print Summary
        self.stdout.write(self.style.SUCCESS("\n" + "=" * 60))
        self.stdout.write(self.style.SUCCESS("✅ TEST DATA CREATED SUCCESSFULLY!"))
        self.stdout.write(self.style.SUCCESS("=" * 60))

        # Statistics
        total_zones = ParkingZone.objects.count()
        total_slots = ParkingSlot.objects.count()
        total_vehicles = Vehicle.objects.count()
        total_sessions = ParkingSession.objects.count()
        occupied_slots = ParkingSlot.objects.filter(is_occupied=True).count()
        active_sessions = ParkingSession.objects.filter(exit_time__isnull=True).count()
        completed_sessions = ParkingSession.objects.filter(exit_time__isnull=False).count()
        paid_sessions = ParkingSession.objects.filter(is_paid=True).count()
        unpaid_sessions = ParkingSession.objects.filter(is_paid=False, exit_time__isnull=False).count()

        self.stdout.write(f"\n📊 STATISTICS:")
        self.stdout.write(f"   Zones:             {total_zones}")
        self.stdout.write(f"   Total Slots:       {total_slots}")
        self.stdout.write(f"   Occupied Slots:    {occupied_slots}")
        self.stdout.write(f"   Available Slots:   {total_slots - occupied_slots}")
        self.stdout.write(f"\n   Vehicles:          {total_vehicles}")
        self.stdout.write(f"   Total Sessions:    {total_sessions}")
        self.stdout.write(f"   Active Sessions:   {active_sessions}")
        self.stdout.write(f"   Completed:         {completed_sessions}")
        self.stdout.write(f"   Paid Sessions:     {paid_sessions}")
        self.stdout.write(f"   Unpaid Sessions:   {unpaid_sessions}")

        self.stdout.write(f"\n🧪 READY TO TEST!")
        self.stdout.write(f"   Server: http://localhost:8000/")
        self.stdout.write(f"   Admin:  http://localhost:8000/admin/")
        self.stdout.write(f"\n📝 TEST A VEHICLE ENTRY:")
        vehicle = vehicles[5]
        zone = zones[0]
        self.stdout.write(f"   vehicle_number: {vehicle.vehicle_number}")
        self.stdout.write(f"   zone_id: {zone.id}")

        self.stdout.write(self.style.SUCCESS("\n" + "=" * 60 + "\n"))
