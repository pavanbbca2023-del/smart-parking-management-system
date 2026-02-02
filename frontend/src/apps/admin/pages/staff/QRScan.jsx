import React, { useState } from 'react';
import '../user/UserPages.css';

const QRScan = () => {
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const mockBookingData = {
    'PK123456': {
      bookingId: 'PK123456',
      customerName: 'Rahul Kumar',
      vehicleNumber: 'MH 01 AB 1234',
      vehicleType: 'Car',
      location: 'City Mall',
      date: '2024-01-19',
      time: '2:00 PM',
      duration: '3 hours',
      amount: '₹60',
      status: 'Confirmed'
    }
  };

  const handleScanStart = () => {
    setIsScanning(true);
    setTimeout(() => {
      const mockResult = 'PK123456';
      setScanResult(mockBookingData[mockResult] || null);
      setIsScanning(false);
    }, 2000);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <div className="welcome-section">
            <h1>📱 QR Code Scanner</h1>
            <p>Scan booking QR codes for quick entry/exit processing</p>
          </div>
        </div>
      </div>

      <div className="booking-form">
        <div className="form-section">
          <div className="scanner-area">
            {isScanning ? (
              <div className="scanning-animation">
                <p>🔍 Scanning QR Code...</p>
              </div>
            ) : (
              <div className="scanner-placeholder">
                <p>📷 Position QR code within frame</p>
              </div>
            )}
          </div>

          <button 
            className="quick-book-btn"
            onClick={handleScanStart}
            disabled={isScanning}
          >
            {isScanning ? '🔍 Scanning...' : '📱 Start QR Scan'}
          </button>

          {scanResult && (
            <div className="booking-details">
              <h3>✅ Booking Found</h3>
              <div className="detail-card">
                <p><strong>Booking ID:</strong> {scanResult.bookingId}</p>
                <p><strong>Customer:</strong> {scanResult.customerName}</p>
                <p><strong>Vehicle:</strong> {scanResult.vehicleNumber}</p>
                <p><strong>Amount:</strong> {scanResult.amount}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRScan;