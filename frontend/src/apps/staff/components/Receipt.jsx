import React, { useState } from 'react';
import './StaffPages.css';

const Receipt = () => {
  const [receiptId, setReceiptId] = useState('');
  const [receiptDetails, setReceiptDetails] = useState(null);

  const mockReceiptData = {
    'RCP123456': {
      receiptId: 'RCP123456',
      vehicleNumber: 'MH 01 AB 1234',
      customerName: 'Rahul Kumar',
      entryDate: '2024-01-19',
      entryTime: '10:30 AM',
      exitTime: '2:00 PM',
      duration: '3.5 hours',
      slot: 'A-15',
      totalAmount: 70,
      paymentMethod: 'Cash'
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const receipt = mockReceiptData[receiptId.toUpperCase()];
    
    if (receipt) {
      setReceiptDetails(receipt);
    } else {
      alert('Receipt not found. Please check the Receipt ID.');
      setReceiptDetails(null);
    }
  };

  const handlePrint = () => {
    if (receiptDetails) {
      alert('Receipt sent to printer successfully!');
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <div className="welcome-section">
            <h1>🧾 Receipt Management</h1>
            <p>Print or reprint parking receipts</p>
          </div>
        </div>
      </div>

      <div className="booking-form">
        <div className="form-section">
          <h3>🔍 Find Receipt</h3>
          <form onSubmit={handleSearch}>
            <div className="form-group">
              <label>Receipt ID</label>
              <input 
                type="text"
                placeholder="e.g., RCP123456"
                value={receiptId}
                onChange={(e) => setReceiptId(e.target.value.toUpperCase())}
                required
              />
            </div>
            <button type="submit" className="quick-book-btn secondary">
              🔍 Search Receipt
            </button>
          </form>
          <p>💡 Try: RCP123456</p>
        </div>

        {receiptDetails && (
          <div className="form-section">
            <div className="receipt-actions">
              <button className="quick-book-btn" onClick={handlePrint}>
                🖨️ Print Receipt
              </button>
            </div>

            <div className="receipt-preview">
              <h3>🅿️ SMART PARKING</h3>
              <div className="detail-card">
                <p><strong>Receipt ID:</strong> {receiptDetails.receiptId}</p>
                <p><strong>Customer:</strong> {receiptDetails.customerName}</p>
                <p><strong>Vehicle:</strong> {receiptDetails.vehicleNumber}</p>
                <p><strong>Slot:</strong> {receiptDetails.slot}</p>
                <p><strong>Entry:</strong> {receiptDetails.entryDate} {receiptDetails.entryTime}</p>
                <p><strong>Exit:</strong> {receiptDetails.exitTime}</p>
                <p><strong>Duration:</strong> {receiptDetails.duration}</p>
                <p><strong>Total Amount:</strong> ₹{receiptDetails.totalAmount}</p>
                <p><strong>Payment:</strong> {receiptDetails.paymentMethod}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Receipt;
