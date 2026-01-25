import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import PageNavigation from '../../components/PageNavigation';

const ViewSlots = ({ onNavigate }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const slots = [
    { id: 'A-001', zone: 'Zone A', level: 'Ground Floor', status: 'available', type: 'Car', rate: 30 },
    { id: 'A-002', zone: 'Zone A', level: 'Ground Floor', status: 'occupied', type: 'Car', rate: 30 },
    { id: 'A-003', zone: 'Zone A', level: 'Ground Floor', status: 'available', type: 'Car', rate: 30 },
    { id: 'A-004', zone: 'Zone A', level: 'Ground Floor', status: 'reserved', type: 'Car', rate: 30 },
    { id: 'B-001', zone: 'Zone B', level: '1st Floor', status: 'available', type: 'Car', rate: 30 },
    { id: 'B-002', zone: 'Zone B', level: '1st Floor', status: 'occupied', type: 'SUV', rate: 40 },
    { id: 'B-003', zone: 'Zone B', level: '1st Floor', status: 'available', type: 'Car', rate: 30 },
    { id: 'C-001', zone: 'Zone C', level: '2nd Floor', status: 'available', type: 'Bike', rate: 10 },
    { id: 'C-002', zone: 'Zone C', level: '2nd Floor', status: 'available', type: 'Car', rate: 30 },
    { id: 'C-003', zone: 'Zone C', level: '2nd Floor', status: 'occupied', type: 'Car', rate: 30 },
  ];

  const filteredSlots = slots.filter(slot => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'Zone A' || selectedFilter === 'Zone B' || selectedFilter === 'Zone C') {
      return slot.zone === selectedFilter;
    }
    if (selectedFilter === 'available' || selectedFilter === 'occupied' || selectedFilter === 'reserved') {
      return slot.status === selectedFilter;
    }
    return slot.id === selectedFilter;
  });

  const getStatusIcon = (status) => {
    switch(status) {
      case 'available': return '✅';
      case 'occupied': return '❌';
      case 'reserved': return '🔒';
      default: return '❓';
    }
  };

  const getVehicleIcon = (type) => {
    switch(type) {
      case 'Car': return '🚗';
      case 'SUV': return '🚙';
      case 'Bike': return '🏍️';
      case 'Auto': return '🛺';
      default: return '🚗';
    }
  };

  return (
    <div className="guest-page view-slots-page">
      <PageHeader 
        title="Parking Slots"
        description="Browse available parking slots in real-time"
        icon="🅿️"
      />

       {/* Stats Summary */}
      <div className="stats-section">
        <div className="container">
          <div className="slots-summary" style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px'}}>
            <div className="summary-card available" style={{padding: '24px', textAlign: 'center'}}>
              <h3>Available</h3>
              <p>{filteredSlots.filter(s => s.status === 'available').length}</p>
            </div>
            <div className="summary-card occupied" style={{padding: '24px', textAlign: 'center'}}>
              <h3>Occupied</h3>
              <p>{filteredSlots.filter(s => s.status === 'occupied').length}</p>
            </div>
            <div className="summary-card reserved" style={{padding: '24px', textAlign: 'center'}}>
              <h3>Reserved</h3>
              <p>{filteredSlots.filter(s => s.status === 'reserved').length}</p>
            </div>
            <div className="summary-card total" style={{padding: '24px', textAlign: 'center'}}>
              <h3>Total</h3>
              <p>{filteredSlots.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Slots Grid */}
      <div className="slots-section" style={{
        background: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '16px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
        margin: '32px auto',
        maxWidth: '1200px',
        width: 'calc(100% - 48px)',
        minHeight: '600px'
      }}>
        {/* Filter */}
        <div style={{padding: '24px 24px 0 24px'}}>
          <select 
            value={selectedFilter} 
            onChange={(e) => setSelectedFilter(e.target.value)}
            style={{padding: '8px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '16px', width: '200px'}}
          >
            <option value="all">All Slots</option>
            <option value="Zone A">Zone A</option>
            <option value="Zone B">Zone B</option>
            <option value="Zone C">Zone C</option>
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="reserved">Reserved</option>
          </select>
        </div>
        
        <div className="slots-grid" style={{overflowX: 'hidden', display: 'flex', flexWrap: 'wrap', gap: '24px', padding: '24px'}}>
          {filteredSlots.map(slot => (
            <div key={slot.id} className={`slot-card ${slot.status}`} style={{flex: '1 1 calc(33.333% - 16px)', minWidth: '280px', maxWidth: '350px'}}>
              <div className="slot-header">
                <h3>{slot.id}</h3>
                <span className={`status-badge ${slot.status}`}>
                  {getStatusIcon(slot.status)} {slot.status.toUpperCase()}
                </span>
              </div>
              
              <div className="slot-details">
                <p><strong>Zone:</strong> {slot.zone}</p>
                <p><strong>Level:</strong> {slot.level}</p>
                <p><strong>Vehicle Type:</strong> {getVehicleIcon(slot.type)} {slot.type}</p>
                <p><strong>Rate:</strong> ₹{slot.rate}/hour</p>
              </div>
              
              {slot.status === 'available' && (
                <button 
                  className="btn-primary"
                  onClick={() => onNavigate('book-slot', { slotId: slot.id, zone: slot.zone })}
                >
                  Book This Slot
                </button>
              )}
              
              {slot.status === 'occupied' && (
                <button className="btn-disabled" disabled>
                  Currently Occupied
                </button>
              )}
              
              {slot.status === 'reserved' && (
                <button className="btn-disabled" disabled>
                  Reserved
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="legend-section" style={{
        background: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '16px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
        margin: '32px auto',
        maxWidth: '1200px',
        width: 'calc(100% - 48px)',
        padding: '24px'
      }}>
        <div className="legend-items" style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '40px',
          flexWrap: 'wrap'
        }}>
          <div className="legend-item" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
            <span className="legend-dot available"></span>
            <span>Available - Ready for booking</span>
          </div>
          <div className="legend-item" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
            <span className="legend-dot occupied"></span>
            <span>Occupied - Currently in use</span>
          </div>
          <div className="legend-item" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
            <span className="legend-dot reserved"></span>
            <span>Reserved - Booked by another user</span>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="actions-section">
        <div className="container">
          <div className="page-actions">
            <button className="btn-secondary" onClick={() => onNavigate('home')}>
              ← Back to Home
            </button>
            <button className="btn-primary" onClick={() => onNavigate('book-slot')}>
              Book Parking Slot →
            </button>
          </div>
        </div>
      </div>
    </div>

  );
};

export default ViewSlots;