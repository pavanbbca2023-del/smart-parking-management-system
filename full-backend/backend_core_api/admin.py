from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Slot, Attendance, Zone, ParkingSession, Payment, Vehicle, Dispute, Schedule

@admin.register(Slot)
class SlotAdmin(admin.ModelAdmin):
    list_display = ('slot_number', 'zone', 'is_occupied', 'is_active')
    list_filter = ('zone', 'is_occupied', 'is_active')
    search_fields = ('slot_number',)

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'role', 'position', 'is_staff')
    list_filter = ('role', 'is_staff', 'is_superuser')
    fieldsets = UserAdmin.fieldsets + (
        ('Custom Profile', {'fields': ('role', 'salary', 'position', 'phone_number')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Custom Profile', {'fields': ('role', 'salary', 'position', 'phone_number')}),
    )

@admin.register(Zone)
class ZoneAdmin(admin.ModelAdmin):
    list_display = ('name', 'total_slots', 'base_price', 'is_active', 'created_at')
    list_filter = ('is_active',)
    search_fields = ('name',)

@admin.register(ParkingSession)
class ParkingSessionAdmin(admin.ModelAdmin):
    list_display = ('vehicle_number', 'zone', 'entry_time', 'exit_time', 'status', 'payment_status')
    list_filter = ('status', 'payment_status', 'zone')
    search_fields = ('vehicle_number',)

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('transaction_id', 'session', 'amount', 'payment_method', 'status', 'created_at')
    list_filter = ('payment_method', 'status')
    search_fields = ('transaction_id',)

@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ('staff', 'entry_time', 'exit_time', 'status')
    list_filter = ('status', 'entry_time')
    search_fields = ('staff__username',)

@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = ('vehicle_number', 'user', 'vehicle_type', 'created_at')
    search_fields = ('vehicle_number', 'user__username')

@admin.register(Dispute)
class DisputeAdmin(admin.ModelAdmin):
    list_display = ('id', 'session', 'user', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('user__username', 'reason')

@admin.register(Schedule)
class ScheduleAdmin(admin.ModelAdmin):
    list_display = ('staff', 'day', 'shift_start', 'shift_end', 'is_active')
    list_filter = ('day', 'is_active')
    search_fields = ('staff__username',)
