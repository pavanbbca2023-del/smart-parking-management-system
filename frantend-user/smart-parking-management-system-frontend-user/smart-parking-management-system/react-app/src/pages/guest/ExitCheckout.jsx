import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import Receipt from './Receipt';

const ExitCheckout = ({ onNavigate }) => {
  const [bookingIdInput, setBookingIdInput] = useState('');
  const [checkoutData, setCheckoutData] = useState(null);
  const [exitTimeInput, setExitTimeInput] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  // Mock booking data
  const mockBookings = {
    'BK001': {
      bookingId: 'BK001',
      vehicleNumber: 'DL 01 AB 1234',
      slotNumber: 'A-001',
      entryTime: '09:00',
      vehicleType: 'Car'
    },
    'BK002': {
      bookingId: 'BK002',
      vehicleNumber: 'DL 02 CD 5678',
      slotNumber: 'B-005',
      entryTime: '14:30',
      vehicleType: 'Car'
    }
  };

  const handleSearch = () => {
    if (!bookingIdInput.trim()) {
      alert('Please enter a booking ID');
      return;
    }

    const booking = mockBookings[bookingIdInput.toUpperCase()];
    if (booking) {
      setCheckoutData(booking);
    } else {
      alert('Booking ID not found. Please check and try again.');
    }
  };

  const handleCheckout = () => {
    if (!exitTimeInput) {
      alert('Please enter exit time');
      return;
    }

    // Generate exit receipt
    const receiptId = 'EXIT' + Math.floor(Math.random() * 1000000);
    const duration = calculateDuration(checkoutData.entryTime, exitTimeInput);
    const totalAmount = calculateAmount(duration);
    const baseAmount = Math.round(totalAmount / 1.18);
    const gstAmount = totalAmount - baseAmount;

    const receipt = {
      receiptId,
      bookingId: checkoutData.bookingId,
      vehicleNumber: checkoutData.vehicleNumber,
      vehicleType: checkoutData.vehicleType,
      slotNumber: checkoutData.slotNumber,
      entryTime: checkoutData.entryTime,
      exitTime: exitTimeInput,
      duration,
      baseAmount,
      gstAmount,
      totalAmount,
      paymentMethod: 'UPI',
      transactionId: 'TXN' + Math.floor(Math.random() * 1000000000)
    };

    setReceiptData(receipt);
    setShowReceipt(true);
  };

  return (
    <div className="guest-page exit-checkout-page">
      {showReceipt ? (
        <Receipt 
          onNavigate={(page) => {
            if (page === 'home') {
              setShowReceipt(false);
              setCheckoutData(null);
              setBookingIdInput('');
              setExitTimeInput('');
              setReceiptData(null);
              onNavigate('home');
            } else {
              onNavigate(page);
            }
          }} 
          receiptData={receiptData} 
        />
      ) : (
        <>
          {/* Page Header */}
          <PageHeader 
        title="Exit & Checkout"
        description="Complete your parking session and get your receipt"
        icon="🚗"
      />

      {!checkoutData ? (
        <div className="checkout-container" style={{
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '16px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
          margin: '32px auto',
          maxWidth: '1200px',
          width: 'calc(100% - 48px)',
          padding: '40px'
        }}>
          {/* Two Column Layout */}
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px'}}>
            {/* Left Column - Search Section */}
            <div>
              <div className="search-section" style={{textAlign: 'center'}}>
                <h3>🔍 Retrieve Your Booking</h3>
                <p>Enter your Booking ID to proceed with checkout</p>

                <div className="search-input-group" style={{display: 'flex', flexDirection: 'column', gap: '16px', margin: '24px 0'}}>
                  <input
                    type="text"
                    value={bookingIdInput}
                    onChange={(e) => setBookingIdInput(e.target.value.toUpperCase())}
                    placeholder="e.g., BK001, BK002, BK003..."
                    className="search-input"
                    style={{padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '16px'}}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <button onClick={handleSearch} className="btn-primary" style={{width: '100%'}}>
                    Search Booking
                  </button>
                </div>

                <div className="search-help" style={{background: '#f8fafc', padding: '16px', borderRadius: '8px', marginTop: '24px'}}>
                  <p><strong>Sample Booking IDs:</strong> BK001, BK002 (for testing)</p>
                  <p>Your booking ID was provided during confirmation</p>
                </div>
              </div>
            </div>

            {/* Right Column - QR Section */}
            <div>
              <div className="qr-section" style={{textAlign: 'center'}}>
                <h3>📱 Scan QR Code</h3>
                <p>Scan your booking QR code at the exit gate</p>
                <div className="qr-placeholder" style={{
                  background: '#f3f4f6',
                  border: '2px dashed #d1d5db',
                  borderRadius: '12px',
                  padding: '40px',
                  margin: '24px 0'
                }}>
                  <p style={{fontSize: '48px', margin: '0 0 8px 0'}}>📱</p>
                  <p style={{margin: '0', color: '#6b7280'}}>QR Scanner</p>
                  <p className="qr-note" style={{margin: '8px 0 0 0', fontSize: '14px', color: '#9ca3af'}}>Point camera at QR code</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="checkout-container checkout-active" style={{
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '16px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
          margin: '32px auto',
          maxWidth: '1200px',
          width: 'calc(100% - 48px)',
          padding: '40px'
        }}>
          {/* Two Column Layout */}
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px'}}>
            {/* Left Column */}
            <div>
              {/* Vehicle Information */}
              <div className="checkout-card" style={{
                background: '#f8fafc',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '24px',
                height: 'fit-content'
              }}>
                <h3>🚗 Vehicle Information</h3>
                <div className="info-group" style={{display: 'grid', gap: '16px'}}>
                  <div className="info-item" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <label style={{fontWeight: '600', color: '#374151'}}>Booking ID:</label>
                    <span className="booking-id" style={{fontWeight: '700', color: '#3b82f6'}}>{checkoutData.bookingId}</span>
                  </div>
                  <div className="info-item" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <label style={{fontWeight: '600', color: '#374151'}}>Vehicle Number:</label>
                    <span className="vehicle-number" style={{fontWeight: '600'}}>{checkoutData.vehicleNumber}</span>
                  </div>
                  <div className="info-item" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <label style={{fontWeight: '600', color: '#374151'}}>Vehicle Type:</label>
                    <span>{checkoutData.vehicleType}</span>
                  </div>
                  <div className="info-item" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <label style={{fontWeight: '600', color: '#374151'}}>Parking Slot:</label>
                    <span className="slot-number" style={{fontWeight: '600', color: '#059669'}}>{checkoutData.slotNumber}</span>
                  </div>
                </div>
              </div>

              {/* Parking Duration */}
              <div className="checkout-card" style={{
                background: '#f8fafc',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '24px',
                height: 'fit-content'
              }}>
                <h3>⏱️ Parking Duration</h3>
                <div className="info-group" style={{display: 'grid', gap: '16px'}}>
                  <div className="info-item" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <label style={{fontWeight: '600', color: '#374151'}}>Entry Time:</label>
                    <span>{checkoutData.entryTime}</span>
                  </div>
                  <div className="info-item" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <label style={{fontWeight: '600', color: '#374151'}}>Exit Time:</label>
                    <input
                      type="time"
                      value={exitTimeInput}
                      onChange={(e) => setExitTimeInput(e.target.value)}
                      className="time-input"
                      style={{padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db'}}
                    />
                  </div>
                  {exitTimeInput && (
                    <div className="info-item" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <label style={{fontWeight: '600', color: '#374151'}}>Total Duration:</label>
                      <span className="duration" style={{fontWeight: '600', color: '#059669'}}>{calculateDuration(checkoutData.entryTime, exitTimeInput)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              {/* Charges */}
              {exitTimeInput && (
                <div className="checkout-card charges" style={{
                  background: '#f8fafc',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '24px',
                  marginBottom: '24px',
                  height: 'fit-content'
                }}>
                  <h3>💰 Charges Summary</h3>
                  <div className="charges-breakdown" style={{display: 'grid', gap: '12px'}}>
                    <div className="charge-item" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #e5e7eb'}}>
                      <span style={{color: '#374151'}}>Rate per Hour ({checkoutData.vehicleType}):</span>
                      <span style={{fontWeight: '600'}}>₹30</span>
                    </div>
                    <div className="charge-item" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #e5e7eb'}}>
                      <span style={{color: '#374151'}}>Duration:</span>
                      <span style={{fontWeight: '600'}}>{calculateDuration(checkoutData.entryTime, exitTimeInput)}</span>
                    </div>
                    <div className="charge-item" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #e5e7eb'}}>
                      <span style={{color: '#374151'}}>Base Charge:</span>
                      <span style={{fontWeight: '600'}}>₹{Math.round(calculateAmount(calculateDuration(checkoutData.entryTime, exitTimeInput)) / 1.18)}</span>
                    </div>
                    <div className="charge-item" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #e5e7eb'}}>
                      <span style={{color: '#374151'}}>GST (18%):</span>
                      <span style={{fontWeight: '600'}}>₹{Math.round(calculateAmount(calculateDuration(checkoutData.entryTime, exitTimeInput)) - calculateAmount(calculateDuration(checkoutData.entryTime, exitTimeInput)) / 1.18)}</span>
                    </div>
                    <div className="charge-item total" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', background: '#eff6ff', borderRadius: '8px', paddingLeft: '16px', paddingRight: '16px', marginTop: '8px'}}>
                      <span style={{fontWeight: '700', color: '#1e293b', fontSize: '18px'}}>Total Amount Due:</span>
                      <span className="amount" style={{fontWeight: '700', color: '#3b82f6', fontSize: '20px'}}>₹{calculateAmount(calculateDuration(checkoutData.entryTime, exitTimeInput))}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Method */}
              <div className="checkout-card" style={{
                background: '#f8fafc',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '24px',
                height: 'fit-content'
              }}>
                <h3>💳 Payment Method</h3>
                <div className="payment-options-small" style={{display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '16px'}}>
                  <div className="option" style={{textAlign: 'center', padding: '12px', background: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', flex: '1'}}>
                    <span className="option-icon" style={{fontSize: '20px', display: 'block', marginBottom: '6px'}}>💳</span>
                    <p style={{margin: '0', fontWeight: '600', fontSize: '14px'}}>Card</p>
                  </div>
                  <div className="option" style={{textAlign: 'center', padding: '12px', background: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', flex: '1'}}>
                    <span className="option-icon" style={{fontSize: '20px', display: 'block', marginBottom: '6px'}}>📱</span>
                    <p style={{margin: '0', fontWeight: '600', fontSize: '14px'}}>UPI</p>
                  </div>
                  <div className="option" style={{textAlign: 'center', padding: '12px', background: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', flex: '1'}}>
                    <span className="option-icon" style={{fontSize: '20px', display: 'block', marginBottom: '6px'}}>💰</span>
                    <p style={{margin: '0', fontWeight: '600', fontSize: '14px'}}>Cash</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="checkout-actions" style={{display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '32px'}}>
            <button
              className="btn-secondary"
              onClick={() => {
                setCheckoutData(null);
                setBookingIdInput('');
                setExitTimeInput('');
              }}
              style={{padding: '12px 24px'}}
            >
              ← Back
            </button>
            <button
              className="btn-primary btn-large"
              onClick={handleCheckout}
              disabled={!exitTimeInput}
              style={{padding: '12px 32px', fontSize: '16px', fontWeight: '600'}}
            >
              Complete Exit & Pay
            </button>
          </div>
        </div>
      )}
        </>
      )}

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

function calculateDuration(entryTime, exitTime) {
  if (!entryTime || !exitTime) return '-';
  const [entryH, entryM] = entryTime.split(':').map(Number);
  const [exitH, exitM] = exitTime.split(':').map(Number);
  const minutes = (exitH * 60 + exitM) - (entryH * 60 + entryM);
  const hours = Math.ceil(minutes / 60);
  return `${hours} hour${hours > 1 ? 's' : ''}`;
}

function calculateAmount(duration) {
  if (duration === '-') return 0;
  const hours = parseInt(duration);
  const baseAmount = hours * 30;
  return Math.round(baseAmount * 1.18); // Including 18% GST
}

export default ExitCheckout;
