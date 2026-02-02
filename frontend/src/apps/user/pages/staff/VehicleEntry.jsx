import React, { useState } from 'react';
import '../user/UserPages.css';

const VehicleEntry = () => {
  const [entryData, setEntryData] = useState({
    vehicleNumber: '',
    vehicleType: 'car',
    customerName: ''
  });

  const [selectedSlot, setSelectedSlot] = useState('');
  const availableSlots = ['A-01', 'A-05', 'B-03', 'C-02'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!entryData.vehicleNumber || !selectedSlot) {
      alert('Please fill all required fields and select a slot');
      return;
    }

    const ticketId = 'TKT' + Date.now().toString().slice(-6);
    alert(`Vehicle Entry Successful!\n\nTicket ID: ${ticketId}\nVehicle: ${entryData.vehicleNumber}\nSlot: ${selectedSlot}`);

    setEntryData({ vehicleNumber: '', vehicleType: 'car', customerName: '' });
    setSelectedSlot('');
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <div className="welcome-section">
            <h1>🚗 Vehicle Entry</h1>
            <p>Register new vehicle and assign parking slot</p>
          </div>
        </div>
      </div>

      <div className="booking-form">
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>🚙 Vehicle Information</h3>

            <div className="form-group">
              <label>Vehicle Number *</label>
              <input
                type="text"
                placeholder="e.g., MH 01 AB 1234"
                value={entryData.vehicleNumber}
                onChange={(e) => setEntryData({ ...entryData, vehicleNumber: e.target.value.toUpperCase() })}
                required
              />
            </div>

            <div className="form-group">
              <label>Vehicle Type</label>
              <select
                value={entryData.vehicleType}
                onChange={(e) => setEntryData({ ...entryData, vehicleType: e.target.value })}
              >
                <option value="car">Car</option>
                <option value="bike">Motorcycle</option>
                <option value="suv">SUV</option>
              </select>
            </div>

            <div className="form-group">
              <label>Customer Name</label>
              <input
                type="text"
                placeholder="Enter customer name"
                value={entryData.customerName}
                onChange={(e) => setEntryData({ ...entryData, customerName: e.target.value })}
              />
            </div>
          </div>

          <div className="form-section">
            <h3>🅿️ Available Slots</h3>
            <div className="slots-grid">
              {availableSlots.map(slot => (
                <button
                  key={slot}
                  type="button"
                  className={`slot-btn ${selectedSlot === slot ? 'selected' : ''}`}
                  onClick={() => setSelectedSlot(slot)}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="quick-book-btn">
            ✅ Process Entry
          </button>
        </form>
      </div>
    </div>
  );
};

export default VehicleEntry;