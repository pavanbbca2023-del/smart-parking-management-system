"""
Simple Razorpay Test - No Emojis
"""

# Test 1: Check if razorpay is installed
try:
    import razorpay
    print("SUCCESS: Razorpay SDK is installed")
except ImportError:
    print("ERROR: Razorpay SDK not installed")
    print("Run: pip install razorpay")
    exit(1)

# Test 2: Check Django imports
try:
    import os
    import sys
    import django
    
    sys.path.append('c:/Users/pawan/OneDrive/Desktop/smart-parking-management-system')
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
    django.setup()
    
    print("SUCCESS: Django setup complete")
except Exception as e:
    print(f"ERROR: Django setup failed - {e}")
    exit(1)

# Test 3: Check payment models
try:
    from backend_core.parking.payment_models import PaymentOrder
    print("SUCCESS: PaymentOrder model imported")
    
    # Check fields
    fields = [field.name for field in PaymentOrder._meta.fields]
    required = ['order_id', 'amount', 'status', 'payment_id', 'created_at']
    
    for field in required:
        if field in fields:
            print(f"SUCCESS: Field '{field}' exists")
        else:
            print(f"ERROR: Field '{field}' missing")
            
except Exception as e:
    print(f"ERROR: Model import failed - {e}")

# Test 4: Check service
try:
    from backend_core.parking.services.razorpay_service import RazorpayService
    service = RazorpayService()
    print("SUCCESS: RazorpayService imported and initialized")
    print(f"Key ID: {service.key_id}")
    
except Exception as e:
    print(f"ERROR: Service failed - {e}")

# Test 5: Check views
try:
    from backend_core.parking import payment_views
    print("SUCCESS: Payment views imported")
    
    # Check if functions exist
    functions = ['create_order_api', 'verify_payment_api', 'webhook_handler']
    for func in functions:
        if hasattr(payment_views, func):
            print(f"SUCCESS: Function '{func}' exists")
        else:
            print(f"ERROR: Function '{func}' missing")
            
except Exception as e:
    print(f"ERROR: Views import failed - {e}")

print("\n" + "="*50)
print("RAZORPAY FUNCTIONALITY CHECK COMPLETE")
print("="*50)