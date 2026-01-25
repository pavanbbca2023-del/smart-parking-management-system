import React, { useState } from 'react';
import './StaffPages.css';

const EntryGate = () => {
  const [activeTab, setActiveTab] = useState('scan');
  const [manualEntry, setManualEntry] = useState({
    vehicleNumber: '',
    vehicleType: 'car',
    bookingId: ''
  });
  const [entryQueue] = useState([
    { id: 1, vehicle: 'MH 01 AB 1234', time: '2:45 PM', type: 'Booking' },
    { id: 2, vehicle: 'MH 02 CD 5678', time: '2:47 PM', type: 'Walk-in' },
    { id: 3, vehicle: 'MH 03 EF 9012', time: '2:48 PM', type: 'Booking' }
  ]);
  const [todaysEntries] = useState(45);

  const handleManualEntry = (e) => {
    e.preventDefault();
    if (!manualEntry.vehicleNumber) {
      alert('Please enter vehicle number');
      return;
    }
    
    const ticketId = 'TK' + Date.now().toString().slice(-6);
    alert(`Entry Processed!\n\nTicket ID: ${ticketId}\nVehicle: ${manualEntry.vehicleNumber}\nType: ${manualEntry.vehicleType}\nEntry Time: ${new Date().toLocaleTimeString()}\n\nTicket printed successfully!`);
    
    setManualEntry({
      vehicleNumber: '',
      vehicleType: 'car',
      bookingId: ''
    });
  };

  const handleQRScan = () => {
    alert('QR Scanner activated!\n\nPlease ask customer to show their booking QR code to the camera.');
  };

  const validateBooking = () => {
    const bookingId = prompt('Enter Booking ID to validate:');
    if (bookingId) {
      alert(`Booking Validation:\n\nBooking ID: ${bookingId}\nStatus: ✅ Valid\nVehicle: MH 01 XY 9876\nSlot: A-15\nDuration: 3 hours\nAmount Paid: ₹60`);
    }
  };

  const printTicket = () => {
    alert('Printing entry ticket...\n\n🎫 Ticket printed successfully!\nPlease hand over to customer.');
  };

  const processQueueEntry = (entry) => {
    alert(`Processing entry for:\n\nVehicle: ${entry.vehicle}\nWaiting Time: ${entry.time}\nType: ${entry.type}\n\nEntry approved!`);
  };

  return (
    <div className="entry-gate">
      <div className="entry-gate-header">
        <h1>🚗 Entry Gate Management</h1>
        <div className="gate-stats">
          <div className="stat-item">
            <span className="stat-number">{entryQueue.length}</span>
            <span className="stat-label">Waiting</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{todaysEntries}</span>
            <span className="stat-label">Today's Entries</span>
          </div>
        </div>
      </div>

      <div className="entry-gate-content">
        <div className="entry-controls">
          <div className="control-tabs">
            <button 
              className={`tab-btn ${activeTab === 'scan' ? 'active' : ''}`}
              onClick={() => setActiveTab('scan')}
            >
              📱 QR Scan
            </button>
            <button 
              className={`tab-btn ${activeTab === 'manual' ? 'active' : ''}`}
              onClick={() => setActiveTab('manual')}
            >
              ✍️ Manual Entry
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
                    <p>Position QR code within frame</p>
                  </div>
                  <button className="scan-btn" onClick={handleQRScan}>
                    📷 Start QR Scanner
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'manual' && (
              <div className="manual-entry-section">
                <form onSubmit={handleManualEntry} className="manual-form">
                  <div className="form-group">
                    <label>🚙 Vehicle Number *</label>
                    <input 
                      type="text"
                      placeholder="e.g., MH 01 AB 1234"
                      value={manualEntry.vehicleNumber}
                      onChange={(e) => setManualEntry({...manualEntry, vehicleNumber: e.target.value.toUpperCase()})}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>🚗 Vehicle Type</label>
                    <select 
                      value={manualEntry.vehicleType}
                      onChange={(e) => setManualEntry({...manualEntry, vehicleType: e.target.value})}
                    >
                      <option value="car">Car</option>
                      <option value="bike">Motorcycle</option>
                      <option value="suv">SUV</option>
                      <option value="van">Van</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>🎫 Booking ID (Optional)</label>
                    <input 
                      type="text"
                      placeholder="Enter if pre-booked"
                      value={manualEntry.bookingId}
                      onChange={(e) => setManualEntry({...manualEntry, bookingId: e.target.value})}
                    />
                  </div>

                  <button type="submit" className="process-btn">
                    ✅ Process Entry
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        <div className="entry-queue">
          <h3>⏳ Entry Queue ({entryQueue.length} waiting)</h3>
          <div className="queue-list">
            {entryQueue.map(entry => (
              <div key={entry.id} className="queue-item">
                <div className="queue-info">
                  <span className="vehicle-number">{entry.vehicle}</span>
                  <span className="wait-time">{entry.time}</span>
                  <span className={`entry-type ${entry.type.toLowerCase()}`}>
                    {entry.type}
                  </span>
                </div>
                <button 
                  className="process-queue-btn"
                  onClick={() => processQueueEntry(entry)}
                >
                  Process
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <button className="action-btn validate" onClick={validateBooking}>
          🔍 Validate Booking
        </button>
        <button className="action-btn print" onClick={printTicket}>
          🖨️ Print Ticket
        </button>
      </div>
    </div>
  );
};

export default EntryGate;
