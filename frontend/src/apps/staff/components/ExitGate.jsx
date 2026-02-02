import React, { useState } from 'react';
import './StaffPages.css';

const ExitGate = () => {
  const [activeTab, setActiveTab] = useState('scan');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [exitQueue] = useState([
    { id: 1, vehicle: 'MH 01 AB 1234', duration: '2h 30m', amount: 50 },
    { id: 2, vehicle: 'MH 02 CD 5678', duration: '4h 15m', amount: 85 }
  ]);
  const [todaysExits] = useState(40);

  const handleQRScan = () => {
    alert('QR Scanner activated!\n\nScanning exit QR code...\n\nVehicle: MH 01 XY 9876\nParking Duration: 3h 15m\nAmount Due: ₹65');
  };

  const processPayment = () => {
    const amount = prompt('Enter payment amount:');
    if (amount) {
      alert(`Payment Processed!\n\nAmount: ₹${amount}\nMethod: ${paymentMethod.toUpperCase()}\nStatus: ✅ Success\n\nReceipt generated!`);
    }
  };

  const generateReceipt = () => {
    alert('🧾 Receipt Generated!\n\nTicket ID: TK123456\nVehicle: MH 01 AB 1234\nDuration: 3h 15m\nAmount: ₹65\nPayment: Cash\nExit Time: ' + new Date().toLocaleTimeString() + '\n\nThank you for using Quick Park!');
  };

  const processExitQueue = (entry) => {
    alert(`Processing exit for:\n\nVehicle: ${entry.vehicle}\nDuration: ${entry.duration}\nAmount: ₹${entry.amount}\n\nExit approved!`);
  };

  return (
    <div className="exit-gate">
      <div className="exit-gate-header">
        <h1>🚪 Exit Gate Management</h1>
        <div className="gate-stats">
          <div className="stat-item">
            <span className="stat-number">{exitQueue.length}</span>
            <span className="stat-label">Waiting</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{todaysExits}</span>
            <span className="stat-label">Today's Exits</span>
          </div>
        </div>
      </div>

      <div className="exit-gate-content">
        <div className="exit-controls">
          <div className="control-tabs">
            <button 
              className={`tab-btn ${activeTab === 'scan' ? 'active' : ''}`}
              onClick={() => setActiveTab('scan')}
            >
              📱 QR Scan
            </button>
            <button 
              className={`tab-btn ${activeTab === 'payment' ? 'active' : ''}`}
              onClick={() => setActiveTab('payment')}
            >
              💳 Payment
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'scan' && (
              <div className="qr-scan-section">
                <div className="qr-scanner">
                  <div className="scanner-frame">
                    <div className="scanner-overlay">
                      <div className="scan-line"></div>
                    </div>
                    <p>Scan exit QR code</p>
                  </div>
                  <button className="scan-btn" onClick={handleQRScan}>
                    📷 Scan Exit QR
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'payment' && (
              <div className="payment-section">
                <h3>💰 Payment Methods</h3>
                <div className="payment-methods">
                  <label className="payment-option">
                    <input 
                      type="radio" 
                      value="cash" 
                      checked={paymentMethod === 'cash'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>💵 Cash</span>
                  </label>
                  <label className="payment-option">
                    <input 
                      type="radio" 
                      value="card" 
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>💳 Card</span>
                  </label>
                  <label className="payment-option">
                    <input 
                      type="radio" 
                      value="upi" 
                      checked={paymentMethod === 'upi'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>📱 UPI</span>
                  </label>
                </div>
                <button className="payment-btn" onClick={processPayment}>
                  💰 Process Payment
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="exit-queue">
          <h3>🚗 Exit Queue ({exitQueue.length} waiting)</h3>
          <div className="queue-list">
            {exitQueue.map(entry => (
              <div key={entry.id} className="queue-item">
                <div className="queue-info">
                  <span className="vehicle-number">{entry.vehicle}</span>
                  <span className="duration">Duration: {entry.duration}</span>
                  <span className="amount">Amount: ₹{entry.amount}</span>
                </div>
                <button 
                  className="process-queue-btn"
                  onClick={() => processExitQueue(entry)}
                >
                  Process Exit
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <button className="action-btn receipt" onClick={generateReceipt}>
          🧾 Generate Receipt
        </button>
      </div>
    </div>
  );
};

export default ExitGate;
