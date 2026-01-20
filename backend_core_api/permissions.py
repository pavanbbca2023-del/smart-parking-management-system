# permissions.py - Custom permissions for role-based access

from rest_framework.permissions import BasePermission


class IsAdminUser(BasePermission):
    """Permission for Admin users only"""
    
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            hasattr(request.user, 'role') and
            request.user.role == 'ADMIN'
        )


class IsStaffUser(BasePermission):
    """Permission for Staff users only"""
    
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            hasattr(request.user, 'role') and
            request.user.role in ['ADMIN', 'STAFF']
        )


class IsRegularUser(BasePermission):
    """Permission for regular Users only"""
    
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            hasattr(request.user, 'role') and
            request.user.role == 'USER'
        )


class IsOwnerOrAdmin(BasePermission):
    """Permission for object owner or admin"""
    
    def has_object_permission(self, request, view, obj):
        if hasattr(request.user, 'role') and request.user.role == 'ADMIN':
            return True
        
        if hasattr(obj, 'booked_by'):
            return obj.booked_by == request.user
        
        return False