"""
Django Template Context Patch for Python 3.14 Compatibility
Fixes: AttributeError: 'super' object has no attribute 'dicts'
"""
import sys
from copy import copy as _copy

def patch_django_context():
    """Monkey patch Django's template context for Python 3.14 compatibility"""
    try:
        from django.template.context import Context
        
        # Store the original __copy__ method
        original_copy = Context.__copy__
        
        def patched_copy(self):
            """
            Fixed __copy__ method that works with Python 3.14
            Avoids the issue with setting attributes on super() objects
            """
            try:
                # Try the original method first
                return original_copy(self)
            except (AttributeError, TypeError):
                # Fallback for Python 3.14: manually copy the context
                from copy import copy as _copy_func
                new_context = object.__new__(Context)
                
                # Copy all instance attributes
                for key, value in self.__dict__.items():
                    try:
                        setattr(new_context, key, _copy_func(value))
                    except:
                        setattr(new_context, key, value)
                
                return new_context
        
        # Apply the patch
        Context.__copy__ = patched_copy
        return True
    except Exception as e:
        print(f"Warning: Could not apply Django context patch: {e}")
        return False

# Apply patch on import
if sys.version_info >= (3, 14):
    patch_django_context()
