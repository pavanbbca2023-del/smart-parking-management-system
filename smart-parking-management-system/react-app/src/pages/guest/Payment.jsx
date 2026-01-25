import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import './Payment.css';

const Payment = ({ bookingData, onNavigate }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    upiId: '',
    bankName: ''
  });
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [receiptId, setReceiptId] = useState('');

  const calculateAmount = () => {
    if (!bookingData || !bookingData.entryTime || !bookingData.exitTime) return 0;
    const [entryH, entryM] = bookingData.entryTime.split(':').map(Number);
    const [exitH, exitM] = bookingData.exitTime.split(':').map(Number);
    const minutes = (exitH * 60 + exitM) - (entryH * 60 + entryM);
    const hours = Math.ceil(minutes / 60);
    const baseAmount = hours * 30;
    const gst = baseAmount * 0.18;
    return Math.round(baseAmount + gst);
  };

  const calculateDuration = (entryTime, exitTime) => {
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

  const handlePayment = (e) => {
    e.preventDefault();
    
    if (paymentMethod === 'card' && (!formData.cardNumber || !formData.cvv)) {
      alert('Please fill in card details');
      return;
    }
    if (paymentMethod === 'upi' && !formData.upiId) {
      alert('Please enter UPI ID');
      return;
    }
    if (paymentMethod === 'netbanking' && !formData.bankName) {
      alert('Please select a bank');
      return;
    }

    // Generate unique booking ID if not already present
    const bookingId = bookingData.bookingId || 'BK' + Date.now() + Math.floor(Math.random() * 1000);
    const newReceiptId = 'RCP' + Math.floor(Math.random() * 1000000);
    
    // Update booking data with booking ID and payment info
    const updatedBookingData = {
      ...bookingData,
      bookingId,
      receiptId: newReceiptId,
      paymentMethod,
      paymentStatus: 'CONFIRMED',
      paymentTime: new Date().toLocaleString()
    };
    
    // Navigate to booking confirmation with QR code
    onNavigate('booking-confirmation', updatedBookingData);
  };

  if (!bookingData) {
    return (
      <div className="guest-page">
        <p>No booking data found. Please book a slot first.</p>
        <button onClick={() => onNavigate('book-slot')}>Go to Booking</button>
      </div>
    );
  }

  const totalAmount = calculateAmount();

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
                <span>Parking Rate (Car):</span>
                <span>₹30/hour</span>
              </div>
              <div className="receipt-item">
                <span>Duration:</span>
                <span>{calculateDuration(bookingData.entryTime, bookingData.exitTime)}</span>
              </div>
              <div className="receipt-item">
                <span>Base Amount:</span>
                <span>₹{Math.round(totalAmount / 1.18)}</span>
              </div>
              <div className="receipt-item">
                <span>GST (18%):</span>
                <span>₹{Math.round(totalAmount - (totalAmount / 1.18))}</span>
              </div>
              <div className="receipt-item total">
                <span>Total Paid:</span>
                <span>₹{totalAmount}</span>
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
                <span className="charge-label">Parking Rate:</span>
                <span className="charge-value">₹30/hour</span>
              </div>
              <div className="charge-row">
                <span className="charge-label">Parking Duration:</span>
                <span className="charge-value">{calculateDuration(bookingData.entryTime, bookingData.exitTime)}</span>
              </div>
              <div className="charge-row">
                <span className="charge-label">Base Amount:</span>
                <span className="charge-value">₹{Math.round(totalAmount / 1.18)}</span>
              </div>
              <div className="charge-row">
                <span className="charge-label">GST (18%):</span>
                <span className="charge-value">₹{Math.round(totalAmount - (totalAmount / 1.18))}</span>
              </div>
              <div className="charge-row total-row">
                <span className="charge-label">Total Amount:</span>
                <span className="charge-value total-amount">₹{totalAmount}</span>
              </div>
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
                      value={formData.upiId}
                      onChange={handleInputChange}
                      placeholder="yourname@paytm"
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
                  <span>Total Amount:</span>
                  <span className="amount">₹{totalAmount}</span>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => onNavigate('book-slot')}>
                  Back to Booking
                </button>
                <button type="submit" className="btn-primary">
                  Pay ₹{totalAmount}
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