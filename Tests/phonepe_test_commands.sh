#!/bin/bash
# phonepe_test_commands.sh
# Quick test commands for PhonePe payment integration
# Use these to test the payment APIs

# ============================================
# 1. CREATE PAYMENT REQUEST
# ============================================
echo "1️⃣ Creating PhonePe Payment Request..."
echo "POST /api/payment/phonepe/create/"
echo ""

curl -X POST http://localhost:8000/api/payment/phonepe/create/ \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": 1,
    "amount": 100.50,
    "user_id": 1
  }' | python -m json.tool

# Save the merchant_txn_id from response for next steps
# Example: PARKING_abc123def456

echo ""
echo "============================================"
echo ""

# ============================================
# 2. VERIFY PAYMENT STATUS
# ============================================
echo "2️⃣ Verifying Payment Status..."
echo "POST /api/payment/phonepe/verify/"
echo ""
echo "⚠️ REPLACE 'PARKING_ABC123' with the transaction ID from step 1"
echo ""

curl -X POST http://localhost:8000/api/payment/phonepe/verify/ \
  -H "Content-Type: application/json" \
  -d '{
    "merchant_txn_id": "PARKING_ABC123",
    "session_id": 1
  }' | python -m json.tool

echo ""
echo "============================================"
echo ""

# ============================================
# 3. PROCESS REFUND
# ============================================
echo "3️⃣ Processing Refund..."
echo "POST /api/payment/phonepe/refund/"
echo ""
echo "⚠️ REPLACE 'PARKING_ABC123' with the transaction ID from step 1"
echo ""

curl -X POST http://localhost:8000/api/payment/phonepe/refund/ \
  -H "Content-Type: application/json" \
  -d '{
    "merchant_txn_id": "PARKING_ABC123",
    "amount": 100.50,
    "reason": "User cancelled"
  }' | python -m json.tool

echo ""
echo "============================================"
echo ""

# ============================================
# ADVANCED TESTING
# ============================================

echo "📌 MANUAL TESTING STEPS:"
echo ""
echo "1. Start Django server:"
echo "   python manage.py runserver"
echo ""
echo "2. Open terminal/PowerShell and run:"
echo "   bash phonepe_test_commands.sh"
echo ""
echo "3. OR use Postman/Insomnia to test individually:"
echo ""
echo "   🎯 Create Payment:"
echo "   URL: POST http://localhost:8000/api/payment/phonepe/create/"
echo "   Body:"
echo "   {\"session_id\": 1, \"amount\": 100.50, \"user_id\": 1}"
echo ""
echo "   🎯 Verify Payment:"
echo "   URL: POST http://localhost:8000/api/payment/phonepe/verify/"
echo "   Body:"
echo "   {\"merchant_txn_id\": \"<from-response>\", \"session_id\": 1}"
echo ""
echo "   🎯 Refund Payment:"
echo "   URL: POST http://localhost:8000/api/payment/phonepe/refund/"
echo "   Body:"
echo "   {\"merchant_txn_id\": \"<from-response>\", \"amount\": 100.50}"
echo ""

# ============================================
# EXPECTED RESPONSES
# ============================================

echo "✅ EXPECTED RESPONSES:"
echo ""
echo "1️⃣ Create Payment (Success):"
echo '{
  "success": true,
  "merchant_txn_id": "PARKING_abc123def456",
  "transaction_id": "TXN_xyz789",
  "upi_link": "upi://pay?pa=parking@phonepe&pn=SmartParking&am=100.50",
  "amount": 100.50,
  "status": "INITIATED",
  "payment_method": "PHONEPE_UPI",
  "message": "Payment link generated..."
}'
echo ""
echo "2️⃣ Verify Payment (Success):"
echo '{
  "success": true,
  "verified": true,
  "status": "COMPLETED",
  "amount": 100.50,
  "payment_method": "PHONEPE_UPI"
}'
echo ""
echo "3️⃣ Verify Payment (Pending):"
echo '{
  "success": true,
  "verified": false,
  "status": "PENDING",
  "amount": 100.50
}'
echo ""
echo "4️⃣ Refund (Success):"
echo '{
  "success": true,
  "refund_id": "REFUND_abc123",
  "merchant_txn_id": "PARKING_abc123def456",
  "amount": 100.50,
  "status": "INITIATED",
  "message": "Refund initiated successfully"
}'
echo ""

# ============================================
# PYTHON SCRIPT EXAMPLE
# ============================================

echo "============================================"
echo ""
echo "🐍 Python Script Example:"
echo ""
echo "# save as test_phonepe.py"
echo ""

cat << 'EOF'
import os
import json
import requests

os.environ['DJANGO_SETTINGS_MODULE'] = 'smart_parking.settings'
import django
django.setup()

from backend_core_api.phonepe_service import get_phonepe_service
from decimal import Decimal

# Get PhonePe service
phonepe = get_phonepe_service()

# Test 1: Create payment
print("1️⃣ Creating payment...")
payment = phonepe.create_payment_request(
    amount=Decimal('100.00'),
    user_id=1,
    session_id=1,
    vehicle_number='KA-01-AB-1234'
)
print(json.dumps(payment, indent=2))
print(f"\nTransaction ID: {payment['merchant_txn_id']}")

# Test 2: Verify payment
print("\n2️⃣ Verifying payment...")
merchant_txn_id = payment['merchant_txn_id']
verification = phonepe.verify_payment(merchant_txn_id)
print(json.dumps(verification, indent=2))

# Test 3: Refund payment
print("\n3️⃣ Processing refund...")
refund = phonepe.refund_payment(
    merchant_txn_id=merchant_txn_id,
    amount=Decimal('100.00'),
    refund_reason='Test refund'
)
print(json.dumps(refund, indent=2))
EOF

echo ""
echo "Run it with:"
echo "python test_phonepe.py"
echo ""

# ============================================
# PRODUCTION CHECKLIST
# ============================================

echo "============================================"
echo ""
echo "✅ PRODUCTION CHECKLIST:"
echo ""
echo "Before going live with PhonePe payments:"
echo ""
echo "[ ] Get PhonePe merchant account"
echo "[ ] Get Merchant ID from dashboard"
echo "[ ] Get API Key from dashboard"
echo "[ ] Update PHONEPE_MERCHANT_ID in settings"
echo "[ ] Update PHONEPE_API_KEY in settings"
echo "[ ] Set PHONEPE_ENV = 'PRODUCTION'"
echo "[ ] Set PHONEPE_SIMULATION_MODE = False"
echo "[ ] Update callback URL to HTTPS domain"
echo "[ ] Enable HTTPS on your server"
echo "[ ] Test with small amounts first"
echo "[ ] Test refund functionality"
echo "[ ] Set up error monitoring"
echo "[ ] Train staff on new payment system"
echo "[ ] Inform customers about PhonePe option"
echo ""

echo "============================================"
echo "✨ PhonePe Payment Testing Complete!"
echo "============================================"
