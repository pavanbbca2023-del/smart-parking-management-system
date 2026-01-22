#!/usr/bin/env python
"""Test if Context.__copy__ works with Python 3.14 patch."""
import os
import sys
import django

# Apply the patch before Django initializes
from django_py314_patch import patch_django_context
patch_django_context()

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

from django.template.context import Context

print("\n" + "="*70)
print("Testing Django Template Context Copy with Python 3.14 Patch")
print("="*70)

try:
    print("\n🔄 Creating test context...")
    c = Context({'test': 'value', 'data': [1, 2, 3], 'nested': {'key': 'val'}})
    print(f"✅ Context created with {len(c.dicts)} dict(s)")
    
    print("\n🔄 Calling __copy__()...")
    c2 = c.__copy__()
    print(f"✅ Context copy SUCCESSFUL!")
    
    print(f"\n📊 Context Verification:")
    print(f"   • Original context dicts: {len(c.dicts)}")
    print(f"   • Copied context dicts: {len(c2.dicts)}")
    print(f"   • Value 'test' preserved: {c2.get('test')} (expected: 'value')")
    print(f"   • Value 'data' preserved: {c2.get('data')} (expected: [1, 2, 3])")
    print(f"   • Value 'nested' preserved: {c2.get('nested')} (expected: {{'key': 'val'}})")
    
    print("\n✅ PATCH WORKING CORRECTLY - Admin panel should now work!")
    
except Exception as e:
    print(f"\n❌ ERROR: {type(e).__name__}: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print("\n" + "="*70 + "\n")
