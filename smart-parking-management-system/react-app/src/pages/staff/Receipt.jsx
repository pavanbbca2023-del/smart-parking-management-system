import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader';

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
    <div className="page">
      <PageHeader 
        title="Receipt Management"
        description="Print or reprint parking receipts"
        icon="🧾"
      />

      <div className="card">
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
            <button type="submit" className="btn-secondary">
              🔍 Search Receipt
            </button>
          </form>
          <p style={{marginTop: '10px', color: '#64748b', fontSize: '14px'}}>💡 Try: RCP123456</p>
        </div>

        {receiptDetails && (
          <div className="form-section" style={{marginTop: '30px'}}>
            <div className="receipt-actions" style={{marginBottom: '20px'}}>
              <button className="btn-primary" onClick={handlePrint}>
                🖨️ Print Receipt
              </button>
            </div>

            <div className="receipt-preview">
              <h3 style={{textAlign: 'center', marginBottom: '20px', color: '#1e293b'}}>🅿️ SMART PARKING</h3>
              <div className="card" style={{background: '#f8fafc', border: '1px solid #e2e8f0'}}>
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