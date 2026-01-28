import React, { useState } from 'react';
import '../user/UserPages.css';

const ExitBilling = () => {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [parkingData, setParkingData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const mockParkingData = {
    'MH01AB1234': {
      vehicleNumber: 'MH 01 AB 1234',
      customerName: 'Rahul Kumar',
      slot: 'A-15',
      entryTime: '10:30 AM',
      ratePerHour: 20,
      parkedHours: 3.5,
      totalAmount: 70
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const searchKey = vehicleNumber.replace(/\s/g, '').toUpperCase();
    const data = mockParkingData[searchKey];
    
    if (data) {
      setParkingData(data);
    } else {
      alert('Vehicle not found. Please check the vehicle number.');
      setParkingData(null);
    }
  };

  const handleProcessExit = () => {
    if (!parkingData) return;

    const receiptId = 'RCP' + Date.now().toString().slice(-6);
    alert(`Exit Processed Successfully!\n\nReceipt ID: ${receiptId}\nVehicle: ${parkingData.vehicleNumber}\nTotal Amount: ₹${parkingData.totalAmount}\nPayment: ${paymentMethod.toUpperCase()}`);
    
    setVehicleNumber('');
    setParkingData(null);
    setPaymentMethod('cash');
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <div className="welcome-section">
            <h1>🧾 Exit & Billing</h1>
            <p>Process vehicle exit and generate final bill</p>
          </div>
        </div>
      </div>

      <div className="booking-form">
        <div className="form-section">
          <h3>🔍 Find Vehicle</h3>
          <form onSubmit={handleSearch}>
            <div className="form-group">
              <label>Vehicle Number</label>
              <input 
                type="text"
                placeholder="e.g., MH 01 AB 1234"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                required
              />
            </div>
            <button type="submit" className="quick-book-btn secondary">
              🔍 Search
            </button>
          </form>
          <p>💡 Try: MH01AB1234</p>
        </div>

        {parkingData && (
          <div className="form-section">
            <h3>📋 Vehicle Details</h3>
            <div className="detail-card">
              <p><strong>Vehicle:</strong> {parkingData.vehicleNumber}</p>
              <p><strong>Customer:</strong> {parkingData.customerName}</p>
              <p><strong>Slot:</strong> {parkingData.slot}</p>
              <p><strong>Entry:</strong> {parkingData.entryTime}</p>
              <p><strong>Duration:</strong> {parkingData.parkedHours} hours</p>
              <p><strong>Total Amount:</strong> ₹{parkingData.totalAmount}</p>
            </div>

            <div className="form-group">
              <label>💳 Payment Method</label>
              <select 
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="cash">💵 Cash</option>
                <option value="card">💳 Card</option>
                <option value="upi">📱 UPI</option>
              </select>
            </div>

            <button className="quick-book-btn" onClick={handleProcessExit}>
              ✅ Process Exit & Generate Receipt
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExitBilling;