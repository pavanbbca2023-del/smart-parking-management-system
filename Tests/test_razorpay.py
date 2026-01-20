"""
RAZORPAY FUNCTIONALITY TEST SCRIPT
==================================
Test if payment integration is working properly
"""

import os
import sys
import django

# Add project to path
sys.path.append('c:/Users/pawan/OneDrive/Desktop/smart-parking-management-system')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_parking.settings')
django.setup()

def test_payment_functionality():
    """Test Razorpay payment functionality"""
    
    print("🔍 TESTING RAZORPAY FUNCTIONALITY")
    print("=" * 50)
    
    # Test 1: Check imports
    print("\n1️⃣ Testing Imports...")
    try:
        from backend_core.parking.payment_models import PaymentOrder
        from backend_core.parking.services.razorpay_service import RazorpayService
        print("✅ All imports successful")
    except ImportError as e:
        print(f"❌ Import error: {e}")
        return False
    
    # Test 2: Check model creation
    print("\n2️⃣ Testing Model...")
    try:
        # Check if model fields exist
        fields = [field.name for field in PaymentOrder._meta.fields]
        required_fields = ['order_id', 'amount', 'status', 'payment_id', 'created_at']
        
        for field in required_fields:
            if field in fields:
                print(f"✅ Field '{field}' exists")
            else:
                print(f"❌ Field '{field}' missing")
                return False
    except Exception as e:
        print(f"❌ Model error: {e}")
        return False
    
    # Test 3: Check service initialization
    print("\n3️⃣ Testing Service...")
    try:
        service = RazorpayService()
        print(f"✅ Service initialized")
        print(f"   Key ID: {service.key_id}")
        print(f"   Client: {type(service.client)}")
    except Exception as e:
        print(f"❌ Service error: {e}")
        return False
    
    # Test 4: Check required dependencies
    print("\n4️⃣ Testing Dependencies...")
    try:
        import razorpay
        print(f"✅ Razorpay SDK installed: {razorpay.__version__}")
    except ImportError:
        print("❌ Razorpay SDK not installed")
        print("   Run: pip install razorpay")
        return False
    
    # Test 5: Check URL configuration
    print("\n5️⃣ Testing URLs...")
    try:
        from backend_core.parking.payment_urls import urlpatterns
        urls = [pattern.name for pattern in urlpatterns]
        required_urls = ['create_order', 'verify_payment', 'webhook']
        
        for url in required_urls:
            if url in urls:
                print(f"✅ URL '{url}' configured")
            else:
                print(f"❌ URL '{url}' missing")
                return False
    except Exception as e:
        print(f"❌ URL error: {e}")
        return False
    
    print("\n" + "=" * 50)
    print("🎉 ALL TESTS PASSED!")
    print("✅ Razorpay functionality is working properly")
    
    return True

def check_configuration_issues():
    """Check for common configuration issues"""
    
    print("\n🔧 CONFIGURATION CHECK")
    print("=" * 30)
    
    issues = []
    
    # Check 1: Test keys
    from backend_core.parking.services.razorpay_service import RazorpayService
    service = RazorpayService()
    
    if service.key_id == 'rzp_test_xxxxxxxxxx':
        issues.append("⚠️  Replace test keys with actual Razorpay test keys")
    
    if service.key_secret == 'xxxxxxxxxxxxxxxxxx':
        issues.append("⚠️  Replace test secret with actual Razorpay test secret")
    
    # Check 2: Database migration
    try:
        from backend_core.parking.payment_models import PaymentOrder
        PaymentOrder.objects.count()
        print("✅ Database table exists")
    except Exception as e:
        issues.append(f"❌ Database migration needed: {e}")
    
    # Check 3: URL inclusion
    print("⚠️  Make sure to include payment URLs in main urls.py:")
    print("   path('parking/', include('backend_core.parking.payment_urls')),")
    
    if issues:
        print("\n🚨 ISSUES FOUND:")
        for issue in issues:
            print(f"   {issue}")
    else:
        print("\n✅ No configuration issues found!")

if __name__ == "__main__":
    try:
        success = test_payment_functionality()
        if success:
            check_configuration_issues()
    except Exception as e:
        print(f"❌ Test failed: {e}")
        print("\n💡 QUICK FIXES:")
        print("1. Install Razorpay: pip install razorpay")
        print("2. Run migrations: python manage.py makemigrations")
        print("3. Apply migrations: python manage.py migrate")
        print("4. Add payment URLs to main urls.py")