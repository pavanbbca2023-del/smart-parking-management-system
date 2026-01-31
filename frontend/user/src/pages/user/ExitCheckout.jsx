import React, { useState } from 'react';

const ExitCheckout = () => {
  const [scanResult, setScanResult] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  // Mock data for scanned vehicle
  const vehicleData = {
    bookingId: 'BK005',
    slotId: 'D-01',
    zone: 'Zone D',
    vehicleNumber: 'DL 04 GH 3456',
    entryTime: '08:00',
    exitTime: '10:15',
    duration: '2 hours 15 minutes',
    baseCharge: 150,
    extraCharge: 25,
    totalAmount: 175,
    parkingType: 'Premium'
  };

  const handleScan = () => {
    setScanResult(vehicleData);
    setShowCheckout(true);
  };

  const handlePayment = () => {
    alert(`Payment of ₹${vehicleData.totalAmount} processed via ${paymentMethod.toUpperCase()}. Thank you!`);
    setScanResult(null);
    setShowCheckout(false);
  };

  return (
    <div className="page">
      <h1>Exit Checkout</h1>
      <p>Complete your parking session and make payment</p>

      {!scanResult ? (
        <div className="scan-section">
          <div className="qr-placeholder">
            <h2>📱 QR Code Scanner</h2>
            <p>Scan your parking ticket QR code</p>
          </div>
          <button className="btn-primary btn-large" onClick={handleScan}>
            Simulate Scan Vehicle
          </button>
        </div>
      ) : (
        <>
          <div className="checkout-card">
            <div className="vehicle-info">
              <h2>🚗 Vehicle Details</h2>
              <p><strong>Booking ID:</strong> {vehicleData.bookingId}</p>
              <p><strong>Slot ID:</strong> {vehicleData.slotId}</p>
              <p><strong>Zone:</strong> {vehicleData.zone}</p>
              <p><strong>Vehicle Number:</strong> {vehicleData.vehicleNumber}</p>
              <p><strong>Parking Type:</strong> {vehicleData.parkingType}</p>
            </div>

            <div className="parking-duration">
              <h2>⏱️ Parking Duration</h2>
              <p><strong>Entry Time:</strong> {vehicleData.entryTime}</p>
              <p><strong>Exit Time:</strong> {vehicleData.exitTime}</p>
              <p><strong>Total Duration:</strong> {vehicleData.duration}</p>
            </div>

            <div className="charges-breakdown">
              <h2>💰 Charges Breakdown</h2>
              <div className="charge-item">
                <span>Base Parking Charge</span>
                <strong>₹{vehicleData.baseCharge}</strong>
              </div>
              <div className="charge-item">
                <span>Late Checkout (15 min @ ₹25/hr)</span>
                <strong>₹{vehicleData.extraCharge}</strong>
              </div>
              <div className="charge-item total">
                <span>TOTAL AMOUNT</span>
                <strong className="total-amount">₹{vehicleData.totalAmount}</strong>
              </div>
            </div>

            {showCheckout && (
              <div className="payment-section">
                <h2>💳 Payment Method</h2>
                <div className="payment-options">
                  <label className="radio-option">
                    <input 
                      type="radio" 
                      value="card" 
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>Credit/Debit Card</span>
                  </label>
                  <label className="radio-option">
                    <input 
                      type="radio" 
                      value="upi" 
                      checked={paymentMethod === 'upi'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>UPI</span>
                  </label>
                  <label className="radio-option">
                    <input 
                      type="radio" 
                      value="wallet" 
                      checked={paymentMethod === 'wallet'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>Digital Wallet</span>
                  </label>
                  <label className="radio-option">
                    <input 
                      type="radio" 
                      value="cash" 
                      checked={paymentMethod === 'cash'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>Cash at Counter</span>
                  </label>
                </div>

                <div className="payment-actions">
                  <button className="btn-primary btn-large" onClick={handlePayment}>
                    Pay ₹{vehicleData.totalAmount}
                  </button>
                  <button 
                    className="btn-secondary" 
                    onClick={() => {
                      setScanResult(null);
                      setShowCheckout(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ExitCheckout;
