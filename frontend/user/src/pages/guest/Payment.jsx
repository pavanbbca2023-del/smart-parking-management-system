import React, { useState } from 'react';
import { parkingApi } from '../../api/api';
import PageHeader from '../../components/PageHeader';
import './Payment.css';

const RazorpayKey = 'rzp_test_McYq7U16tKqjNa';

const Payment = ({ bookingData, onNavigate }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    cardNumber: '4242 4242 4242 4242',
    cardName: 'Test User',
    expiryDate: '12/26',
    cvv: '123',
    upiId: 'test@quickpay',
    bankName: ''
  });
  const [loading, setLoading] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [receiptId, setReceiptId] = useState('');

  const calculateAmounts = () => {
    if (!bookingData) return { total: 0, initial: 0, balance: 0 };

    // Use the amount from bookingData if available (passed from BookSlot)
    if (bookingData.charges) {
      return {
        total: bookingData.charges.estimatedAmount,
        initial: bookingData.charges.initialPayment,
        balance: bookingData.charges.estimatedAmount - bookingData.charges.initialPayment
      };
    }

    // Fallback calculation if not passed
    const [entryH, entryM] = (bookingData.entryTime || '09:00').split(':').map(Number);
    const [exitH, exitM] = (bookingData.exitTime || '10:00').split(':').map(Number);
    const minutes = (exitH * 60 + exitM) - (entryH * 60 + entryM);
    const hours = Math.ceil(minutes / 60);
    const rate = bookingData.vehicleType === 'Bike' ? 10 : (bookingData.vehicleType === 'Auto' ? 15 : 30);
    const total = hours * rate;
    const initial = Math.round(total * 0.25);
    return { total, initial, balance: total - initial };
  };

  const { total: totalAmount, initial: initialPaid, balance: remainingBalance } = calculateAmounts();

  const calculateDuration = (entryTime, exitTime) => {
    if (!entryTime || !exitTime) return '0 hours';
    const [entryH, entryM] = entryTime.split(':').map(Number);
    const [exitH, exitM] = exitTime.split(':').map(Number);
    const minutes = (exitH * 60 + exitM) - (entryH * 60 + entryM);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours === 0) {
      return `${remainingMinutes} minutes`;
    } else if (remainingMinutes === 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    } else {
      return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} minutes`;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const bookingId = bookingData?.id || bookingData?.bookingId || bookingData?.backendSessionId;
      console.log('DEBUG: Initiating payment for Booking ID:', bookingId);

      if (!bookingId) {
        throw new Error("Missing Booking ID. Please try booking again.");
      }

      // 1. Create Order on Backend
      const response = await parkingApi.createRazorpayOrder(bookingId, initialPaid);
      const order = response.data.order;
      console.log('DEBUG: Razorpay Order created:', order);

      // 2. Open Razorpay Checkout
      const options = {
        key: RazorpayKey,
        amount: order.amount,
        currency: order.currency,
        name: "Smart Parking System",
        description: `Parking for ${bookingData.vehicleNumber}`,
        order_id: order.id,
        handler: async function (paymentResponse) {
          console.log('DEBUG: Razorpay payment successful, verifying...', paymentResponse);
          try {
            // 3. Verify Payment on Backend
            const verifyResponse = await parkingApi.verifyRazorpayPayment({
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_signature: paymentResponse.razorpay_signature,
              session_id: bookingId,
              amount: initialPaid
            });

            if (verifyResponse.data.success) {
              console.log('DEBUG: Payment verification success');
              onNavigate('payment-success');
            } else {
              alert("Payment verification failed: " + verifyResponse.data.error);
            }
          } catch (verifyError) {
            console.error("Verification Error:", verifyError);
            alert("Failed to verify payment. Please contact support.");
          }
        },
        prefill: {
          name: bookingData.ownerName || "Guest User",
          email: bookingData.email || "guest@example.com",
          contact: bookingData.mobileNumber || "9999999999"
        },
        theme: { color: "#2563eb" },
        modal: {
          ondismiss: function () {
            console.log('DEBUG: Razorpay modal dismissed');
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error("Payment Initiation Error:", error);
      const errorMsg = error.response?.data?.error || error.message;
      alert(`Payment Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  if (!bookingData) {
    return (
      <div className="guest-page">
        <p>No booking data found. Please book a slot first.</p>
        <button onClick={() => onNavigate('book-slot')}>Go to Booking</button>
      </div>
    );
  }



  if (paymentCompleted) {
    return (
      <div className="guest-page payment-page success">
        <div className="receipt-container">
          <div className="receipt-card success-card">
            <h2>✅ Payment Successful!</h2>
            <h3>Receipt</h3>
            <div className="receipt-header">
              <p className="receipt-id">Receipt ID: {receiptId}</p>
              <p className="receipt-time">{new Date().toLocaleString()}</p>
            </div>

            <div className="receipt-section">
              <h4>Booking Information</h4>
              <div className="receipt-item">
                <span>Booking ID:</span>
                <span>{bookingData.bookingId}</span>
              </div>
              <div className="receipt-item">
                <span>Vehicle:</span>
                <span>{bookingData.vehicleNumber} ({bookingData.vehicleType})</span>
              </div>
              <div className="receipt-item">
                <span>Slot Number:</span>
                <span>{bookingData.slotNumber}</span>
              </div>
              <div className="receipt-item">
                <span>Mobile Number:</span>
                <span>{bookingData.mobileNumber}</span>
              </div>
            </div>

            <div className="receipt-section">
              <h4>Parking Duration</h4>
              <div className="receipt-item">
                <span>Entry Time:</span>
                <span>{bookingData.entryTime}</span>
              </div>
              <div className="receipt-item">
                <span>Exit Time:</span>
                <span>{bookingData.exitTime}</span>
              </div>
            </div>

            <div className="receipt-section">
              <h4>Amount Details</h4>
              <div className="receipt-item">
                <span>Duration:</span>
                <span>{calculateDuration(bookingData.entryTime, bookingData.exitTime)}</span>
              </div>
              <div className="receipt-item">
                <span>Total Estimated:</span>
                <span>₹{totalAmount}</span>
              </div>
              <div className="receipt-item total">
                <span>Initial Payment (25% Paid):</span>
                <span>₹{initialPaid}</span>
              </div>
              <div className="receipt-item" style={{ marginTop: '8px', color: '#dc2626', fontWeight: 'bold' }}>
                <span>Balance at Exit:</span>
                <span>₹{remainingBalance}</span>
              </div>
            </div>

            <div className="receipt-section">
              <h4>Payment Method</h4>
              <div className="receipt-item">
                <span>Method:</span>
                <span>{paymentMethod.toUpperCase()}</span>
              </div>
              <div className="receipt-item">
                <span>Status:</span>
                <span className="status-success">✅ CONFIRMED</span>
              </div>
            </div>

            <div className="receipt-footer">
              <p>This is your proof of payment. Please keep it safe.</p>
              <p>Your booking ID is required for exit.</p>
            </div>
            <div className="action-buttons">
              <button className="btn-secondary" onClick={() => onNavigate('home')}>
                Back to Home
              </button>
              <button className="btn-primary" onClick={() => onNavigate('booking-confirmation')}>
                View QR Code
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="guest-page payment-page">
      <PageHeader
        title="Complete Payment"
        description="Finalize your booking by making payment"
        icon="💳"
      />

      <div className="payment-container">
        <div className="payment-details-section">
          <div className="detail-card">
            <div className="detail-card-header">
              <h3>🅿️ Parking Details</h3>
            </div>
            <div className="detail-item">
              <span className="label">Booking ID:</span>
              <span className="value">{bookingData.bookingId}</span>
            </div>
            <div className="detail-item">
              <span className="label">Vehicle Number:</span>
              <span className="value">{bookingData.vehicleNumber}</span>
            </div>
            <div className="detail-item">
              <span className="label">Vehicle Type:</span>
              <span className="value">{bookingData.vehicleType}</span>
            </div>
            <div className="detail-item">
              <span className="label">Parking Slot:</span>
              <span className="value badge-info">{bookingData.selectedSlot || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="label">Mobile:</span>
              <span className="value">{bookingData.mobileNumber}</span>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-card-header">
              <h3>⏱️ Parking Duration</h3>
            </div>
            <div className="detail-item">
              <span className="label">Entry Time:</span>
              <span className="value">{bookingData.entryTime}</span>
            </div>
            <div className="detail-item">
              <span className="label">Exit Time:</span>
              <span className="value">{bookingData.exitTime}</span>
            </div>
            <div className="detail-item highlight">
              <span className="label">Total Duration:</span>
              <span className="value duration">{calculateDuration(bookingData.entryTime, bookingData.exitTime)}</span>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-card-header">
              <h3>💰 Charges Breakdown</h3>
            </div>
            <div className="charges-table">
              <div className="charge-row">
                <span className="charge-label">Parking Duration:</span>
                <span className="charge-value">{calculateDuration(bookingData.entryTime, bookingData.exitTime)}</span>
              </div>
              <div className="charge-row">
                <span className="charge-label">Total Estimated Amount:</span>
                <span className="charge-value">₹{totalAmount}</span>
              </div>
              <div className="charge-row">
                <span className="charge-label">Initial Payment (25%):</span>
                <span className="charge-value">₹{initialPaid}</span>
              </div>
              <div className="charge-row total-row">
                <span className="charge-label" style={{ color: '#dc2626' }}>Remaining Balance:</span>
                <span className="charge-value total-amount" style={{ color: '#dc2626' }}>₹{remainingBalance}</span>
              </div>
              <p style={{ fontSize: '12px', color: '#666', marginTop: '10px', textAlign: 'center' }}>
                Remaining 75% will be collected by staff at the time of exit.
              </p>
            </div>
          </div>
        </div>

        <div className="payment-form-section">
          <div className="payment-card">
            <h3>Select Payment Method</h3>

            <div className="payment-methods">
              <label className={`payment-method ${paymentMethod === 'card' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="method-icon">💳</span>
                <span>Credit/Debit Card</span>
              </label>

              <label className={`payment-method ${paymentMethod === 'upi' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="upi"
                  checked={paymentMethod === 'upi'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="method-icon">📱</span>
                <span>UPI</span>
              </label>

              <label className={`payment-method ${paymentMethod === 'netbanking' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="netbanking"
                  checked={paymentMethod === 'netbanking'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="method-icon">🏦</span>
                <span>Net Banking</span>
              </label>
            </div>

            <form onSubmit={handlePayment} className="payment-form">
              {paymentMethod === 'card' && (
                <div className="form-section">
                  <h4>Card Details</h4>
                  <div className="form-group">
                    <label>Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Cardholder Name</label>
                    <input
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry Date</label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        maxLength="5"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        maxLength="3"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div className="form-section">
                  <h4>UPI Details</h4>
                  <div className="form-group">
                    <label>UPI ID</label>
                    <input
                      type="text"
                      name="upiId"
                      value={formData.upiId || 'test@quickpay'}
                      onChange={handleInputChange}
                      placeholder="e.g., test@quickpay"
                      required
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div className="form-section">
                  <h4>Bank Details</h4>
                  <div className="form-group">
                    <label>Select Bank</label>
                    <select
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Choose your bank</option>
                      <option value="sbi">State Bank of India</option>
                      <option value="hdfc">HDFC Bank</option>
                      <option value="icici">ICICI Bank</option>
                      <option value="axis">Axis Bank</option>
                      <option value="pnb">Punjab National Bank</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="payment-summary">
                <div className="summary-row">
                  <span>Initial Amount to Pay (25%):</span>
                  <span className="amount">₹{initialPaid}</span>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => onNavigate('book-slot')}>
                  Back to Booking
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Processing...' : `Pay Now ₹${initialPaid}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="actions-section">
        <div className="container">
          <div className="page-actions">
            <button className="btn-secondary" onClick={() => onNavigate('home')}>
              ← Back to Home
            </button>
            <button className="btn-primary" onClick={() => onNavigate('book-slot')}>
              Book Parking Slot →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;