import React from 'react';

const ParkingZones = () => {
  const zones = [
    { id: 1, name: 'Zone A', location: 'Building A', totalSlots: 50, availableSlots: 12, type: 'Premium' },
    { id: 2, name: 'Zone B', location: 'Building B', totalSlots: 75, availableSlots: 28, type: 'Standard' },
    { id: 3, name: 'Zone C', location: 'Building C', totalSlots: 100, availableSlots: 45, type: 'Economy' },
    { id: 4, name: 'Zone D', location: 'Ground Floor', totalSlots: 40, availableSlots: 5, type: 'Premium' },
  ];

  return (
    <div className="page">
      <h1>Parking Zones</h1>
      <p>Browse available parking zones near you</p>
      
      <div className="zones-grid">
        {zones.map(zone => (
          <div key={zone.id} className="zone-card">
            <h3>{zone.name}</h3>
            <p><strong>Location:</strong> {zone.location}</p>
            <p><strong>Type:</strong> <span className="badge">{zone.type}</span></p>
            <p><strong>Total Slots:</strong> {zone.totalSlots}</p>
            <p><strong>Available:</strong> <span className="available">{zone.availableSlots}</span>/{zone.totalSlots}</p>
            <div className="capacity-bar">
              <div className="capacity-fill" style={{ width: `${(zone.availableSlots / zone.totalSlots) * 100}%` }}></div>
            </div>
            <button className="btn-primary">View Details</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParkingZones;
