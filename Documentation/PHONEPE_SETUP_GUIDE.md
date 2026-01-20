# 📱 PhonePe Payment Integration - Complete Setup Guide

**Date:** January 20, 2026  
**Status:** ✅ Ready for Integration

---

## 🎯 Overview

PhonePe is integrated into your Smart Parking Management System as the primary payment gateway. It provides:

- ✅ UPI payments (99% of Indian users)
- ✅ Debit/Credit Card support
- ✅ Instant payment confirmation
- ✅ Automatic refund processing
- ✅ Zero setup fees
- ✅ Low transaction costs (2%)

---

## 📋 Prerequisites

1. **PhonePe Business Account**
   - Visit: https://business.phonepe.com
   - Sign up as merchant
   - Get Merchant ID and API Key

2. **Python Packages** (Already installed)
   ```
   ✅ requests - for API calls
   ✅ Django - for backend
   ✅ djangorestframework - for APIs
   ```

3. **Django Settings** (Already configured)
   ```python
   # In smart_parking/settings.py
   PHONEPE_ENV = 'SANDBOX'  # Change to PRODUCTION after testing
   PHONEPE_MERCHANT_ID = 'YOUR_MERCHANT_ID'
   PHONEPE_API_KEY = 'YOUR_API_KEY'
   PHONEPE_SIMULATION_MODE = True  # Set to False for live API
   ```

---

## 🚀 Quick Start

### Step 1: Get PhonePe Credentials

1. Go to https://business.phonepe.com
2. Sign up and complete KYC
3. Get these credentials:
   - **Merchant ID** (e.g., `MCHNT12345`)
   - **API Key** (long string)
   - **API Secret** (if required)

### Step 2: Update Settings

Edit `smart_parking/settings.py`:

```python
# ============================================
# PhonePe Payment Gateway Configuration
# ============================================
PHONEPE_ENV = 'SANDBOX'  # First use SANDBOX for testing
PHONEPE_MERCHANT_ID = 'Your_Merchant_ID_Here'
PHONEPE_API_KEY = 'Your_API_Key_Here'
PHONEPE_CALLBACK_URL = 'http://yourserver.com/api/payment/callback/phonepe/'
PHONEPE_SIMULATION_MODE = False  # Set to False when using real API
```

### Step 3: Test the Integration

```bash
# Start Django server
python manage.py runserver

# Test Payment Creation (using curl or Postman)
curl -X POST http://localhost:8000/api/payment/phonepe/create/ \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": 1,
    "amount": 100.00,
    "user_id": 1
  }'
```

### Step 4: Production Setup

Once testing is complete:

```python
PHONEPE_ENV = 'PRODUCTION'  # Switch to production
PHONEPE_SIMULATION_MODE = False  # Use real API
PHONEPE_CALLBACK_URL = 'https://yourserver.com/api/payment/callback/phonepe/'
```

---

## 📚 API Endpoints

### 1. Create Payment Request

```
POST /api/payment/phonepe/create/
```

**Request:**
```json
{
  "session_id": 123,
  "amount": 100.50,
  "user_id": 1
}
```

**Response (Success):**
```json
{
  "success": true,
  "merchant_txn_id": "PARKING_abc123def456",
  "transaction_id": "TXN_xyz789",
  "upi_link": "upi://pay?pa=parking@phonepe&pn=SmartParking&am=100.50",
  "amount": 100.50,
  "status": "INITIATED",
  "payment_method": "PHONEPE_UPI",
  "message": "Payment link generated. Please complete payment via PhonePe."
}
```

**What to do with the response:**
- Save `merchant_txn_id` in your database
- Send `upi_link` to the user
- User can click the link to pay via PhonePe app

---

### 2. Verify Payment Status

```
POST /api/payment/phonepe/verify/
```

**Request:**
```json
{
  "merchant_txn_id": "PARKING_abc123def456",
  "session_id": 123
}
```

**Response (if paid):**
```json
{
  "success": true,
  "verified": true,
  "status": "COMPLETED",
  "amount": 100.50,
  "payment_method": "PHONEPE_UPI"
}
```

**Response (if not paid):**
```json
{
  "success": true,
  "verified": false,
  "status": "PENDING",
  "amount": 100.50
}
```

---

### 3. Process Refund

```
POST /api/payment/phonepe/refund/
```

**Request:**
```json
{
  "merchant_txn_id": "PARKING_abc123def456",
  "amount": 100.50,
  "reason": "User cancelled"
}
```

**Response:**
```json
{
  "success": true,
  "refund_id": "REFUND_abc123",
  "merchant_txn_id": "PARKING_abc123def456",
  "amount": 100.50,
  "status": "INITIATED",
  "message": "Refund initiated successfully"
}
```

---

### 4. Payment Callback (Webhook)

```
POST /api/payment/callback/phonepe/
```

**Automatic:** PhonePe calls this endpoint when payment is completed  
**You don't need to call this manually**

---

## 💻 Implementation Examples

### Example 1: Complete Parking Payment Flow

```python
# 1. User books parking and requests payment
POST /api/payment/phonepe/create/
{
  "session_id": 1,
  "amount": 50.00,
  "user_id": 1
}

# Response: Payment link received
# User scans UPI link or opens in PhonePe app
# User completes payment in PhonePe

# 2. Check payment status (after 10 seconds)
POST /api/payment/phonepe/verify/
{
  "merchant_txn_id": "PARKING_abc123",
  "session_id": 1
}

# Response: verified=true
# System marks session as paid
# User can now enter parking lot
```

### Example 2: Refund for Cancelled Session

```python
# User wants to cancel parking before exiting
# System initiates refund

POST /api/payment/phonepe/refund/
{
  "merchant_txn_id": "PARKING_abc123",
  "amount": 50.00,
  "reason": "User cancelled within 5 minutes"
}

# Money is refunded to user's account within 2-4 hours
```

### Example 3: Using in Python Code

```python
from backend_core_api.phonepe_service import get_phonepe_service
from decimal import Decimal

# Get service (real or simulation based on settings)
phonepe = get_phonepe_service()

# Create payment
payment = phonepe.create_payment_request(
    amount=Decimal('100.00'),
    user_id=1,
    session_id=123,
    vehicle_number='KA-01-AB-1234'
)

print(f"Payment link: {payment['upi_link']}")

# Later, verify payment
verification = phonepe.verify_payment(
    merchant_txn_id=payment['merchant_txn_id']
)

if verification['verified']:
    print("Payment confirmed!")
else:
    print("Payment pending...")
```

---

## 🧪 Testing Guide

### Test in SANDBOX Mode

**Settings:**
```python
PHONEPE_ENV = 'SANDBOX'
PHONEPE_SIMULATION_MODE = True  # Simulates API responses
```

**Test Cases:**

1. **Create Payment** - Works instantly
2. **Verify Payment** - Always returns verified=true in test mode
3. **Process Refund** - Works instantly

### Test with Real PhonePe Account

**Settings:**
```python
PHONEPE_ENV = 'SANDBOX'  # Use sandbox, not production
PHONEPE_SIMULATION_MODE = False  # Use real API
```

**To Test:**
1. Create payment request
2. Scan QR code with PhonePe app
3. Complete payment (use test cards if available)
4. Check payment status immediately
5. Test refund if needed

### Common Test Scenarios

| Scenario | Steps | Expected Result |
|----------|-------|-----------------|
| Successful Payment | Create → User pays → Verify | verified=true |
| Pending Payment | Create → Don't pay → Verify | verified=false |
| Refund | Create → Verify → Refund | refund_id issued |

---

## 🔒 Security Features

✅ **SHA256 Checksum** - All requests verified with API key  
✅ **Merchant Transaction IDs** - Unique per transaction  
✅ **HTTPS Only** - All API calls encrypted  
✅ **Webhook Validation** - Verify callback authenticity  
✅ **Timeout Handling** - 10-second timeout on API calls  

---

## 🐛 Troubleshooting

### Issue: "MERCHANT_ID not found"

**Cause:** Merchant ID not set or incorrect  
**Fix:**
```python
# Check settings
PHONEPE_MERCHANT_ID = 'Correct_ID_From_Dashboard'
```

### Issue: "Checksum mismatch"

**Cause:** API key is wrong or corrupted  
**Fix:**
```python
# Regenerate API key from PhonePe dashboard
# Copy exactly without extra spaces
PHONEPE_API_KEY = 'ExactKeyFromDashboard'
```

### Issue: "Connection timeout"

**Cause:** PhonePe API server slow or network issue  
**Fix:**
```python
# Increase timeout in phonepe_service.py
timeout=10  # Currently 10 seconds, can increase to 30
```

### Issue: "Refund failed"

**Cause:** Merchant doesn't have sufficient balance  
**Fix:**
- Ensure merchant account has funds
- Check transaction status before refunding
- Contact PhonePe support if issue persists

---

## 📊 Database Schema

PhonePe transaction details are stored in the `ParkingSession` model:

```python
# Fields that store PhonePe data:
ParkingSession.payment_method = 'PHONEPE'  # Payment method
ParkingSession.amount_paid = 100.50  # Amount paid
ParkingSession.is_paid = True  # Payment confirmation

# Additional metadata (store as needed):
# merchant_txn_id - For verification
# transaction_id - PhonePe reference
# refund_id - If refunded
```

---

## 📞 Support

**PhonePe Business Support:**
- Website: https://business.phonepe.com
- Email: merchant-support@phonepe.com
- Phone: +91-XXXX-XXXX-XX

**Your System Support:**
- Check logs in: logs/django.log
- Enable DEBUG mode: DEBUG = True in settings.py

---

## ✅ Checklist for Production

- [ ] PhonePe Merchant Account created
- [ ] Merchant ID and API Key obtained
- [ ] Settings updated with credentials
- [ ] Testing completed in SANDBOX mode
- [ ] Callback URL configured in PhonePe dashboard
- [ ] HTTPS enabled for your server
- [ ] Error handling tested
- [ ] Refund process verified
- [ ] API rate limits understood (check PhonePe docs)
- [ ] Monitoring and logging set up

---

## 🎉 You're All Set!

Your Smart Parking Management System now supports **PhonePe payments**!

**Next Steps:**
1. Get PhonePe merchant account
2. Add credentials to settings.py
3. Test the API endpoints
4. Deploy to production

**Questions?** Check the INFO.txt or contact PhonePe support.

---

**Last Updated:** January 20, 2026  
**Version:** 1.0 - PhonePe Integration Complete
