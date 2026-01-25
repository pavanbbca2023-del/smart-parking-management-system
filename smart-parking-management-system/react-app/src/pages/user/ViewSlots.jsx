import React, { useState } from 'react';

const ViewSlots = () => {
  const [selectedZone, setSelectedZone] = useState('all');

  const slots = [
    { id: 'A-01', zone: 'Zone A', floor: 1, type: 'Regular', status: 'available', price: 50 },
    { id: 'A-02', zone: 'Zone A', floor: 1, type: 'Regular', status: 'occupied', price: 50 },
    { id: 'A-03', zone: 'Zone A', floor: 1, type: 'Premium', status: 'available', price: 75 },
    { id: 'B-01', zone: 'Zone B', floor: 2, type: 'Regular', status: 'available', price: 40 },
    { id: 'B-02', zone: 'Zone B', floor: 2, type: 'Regular', status: 'available', price: 40 },
    { id: 'C-01', zone: 'Zone C', floor: 3, type: 'Economy', status: 'available', price: 30 },
    { id: 'C-02', zone: 'Zone C', floor: 3, type: 'Economy', status: 'occupied', price: 30 },
    { id: 'D-01', zone: 'Zone D', floor: 1, type: 'Premium', status: 'reserved', price: 75 },
  ];

  const filteredSlots = selectedZone === 'all' 
    ? slots 
    : slots.filter(slot => slot.zone === selectedZone);

  const getStatusColor = (status) => {
    switch(status) {
      case 'available': return 'green';
      case 'occupied': return 'red';
      case 'reserved': return 'orange';
      default: return 'gray';
    }
  };

  return (
    <div className="page">
      <h1>View Slots</h1>
      <p>Check parking slot availability</p>

      <div className="filter-section">
        <label>Filter by Zone:</label>
        <select value={selectedZone} onChange={(e) => setSelectedZone(e.target.value)}>
          <option value="all">All Zones</option>
          <option value="Zone A">Zone A</option>
          <option value="Zone B">Zone B</option>
          <option value="Zone C">Zone C</option>
          <option value="Zone D">Zone D</option>
        </select>
      </div>

      <div className="slots-container">
        <table className="slots-table">
          <thead>
            <tr>
              <th>Slot ID</th>
              <th>Zone</th>
              <th>Floor</th>
              <th>Type</th>
              <th>Status</th>
              <th>Price/Hour</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredSlots.map(slot => (
              <tr key={slot.id}>
                <td><strong>{slot.id}</strong></td>
                <td>{slot.zone}</td>
                <td>{slot.floor}</td>
                <td>{slot.type}</td>
                <td>
                  <span className={`status-badge status-${slot.status}`}>
                    {slot.status.charAt(0).toUpperCase() + slot.status.slice(1)}
                  </span>
                </td>
                <td>₹{slot.price}</td>
                <td>
                  <button 
                    className={`btn-small ${slot.status === 'available' ? 'btn-primary' : 'btn-disabled'}`}
                    disabled={slot.status !== 'available'}
                  >
                    {slot.status === 'available' ? 'Book' : 'Unavailable'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="legend">
        <p><span className="status-dot available"></span> Available</p>
        <p><span className="status-dot occupied"></span> Occupied</p>
        <p><span className="status-dot reserved"></span> Reserved</p>
      </div>
    </div>
  );
};

export default ViewSlots;
