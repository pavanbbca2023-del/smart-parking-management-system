import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/PageHeader';
import PageNavigation from '../../components/PageNavigation';
import { parkingApi } from '../../api/api';

const ViewSlots = ({ onNavigate }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [slots, setSlots] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await parkingApi.getZones();
        if (response.data && response.data.zones) {
          const fetchedZones = response.data.zones;
          setZones(fetchedZones);

          // Map backend slots to frontend card format
          const mappedSlots = fetchedZones.flatMap(zone =>
            zone.slots.map(slot => ({
              id: slot.slot_number,
              zoneId: zone.id, // Store ID for matching
              zone: zone.name,
              level: 'Ground Floor', // Default, or could be extracted from zone name
              status: slot.is_occupied ? 'occupied' : 'available',
              type: 'Car', // Default
              rate: zone.base_price,
              is_active: slot.is_active
            }))
          );
          setSlots(mappedSlots);
        }
      } catch (error) {
        console.error("Failed to fetch guest slots:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredSlots = slots.filter(slot => {
    if (selectedFilter === 'all') return true;

    // Check if filter is a zone name
    if (zones.some(z => z.name === selectedFilter)) {
      return slot.zone === selectedFilter;
    }

    if (selectedFilter === 'available' || selectedFilter === 'occupied' || selectedFilter === 'reserved') {
      return slot.status === selectedFilter;
    }
    return slot.id === selectedFilter;
  }).filter(slot => slot.status === 'available');

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available': return '✅';
      case 'occupied': return '❌';
      case 'reserved': return '🔒';
      default: return '❓';
    }
  };

  const getVehicleIcon = (type) => {
    switch (type) {
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
          <div className="slots-summary" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
            <div className="summary-card available" style={{ padding: '24px', textAlign: 'center' }}>
              <h3>Available</h3>
              <p>{zones.reduce((sum, z) => sum + z.available_slots, 0)}</p>
            </div>
            <div className="summary-card total" style={{ padding: '24px', textAlign: 'center' }}>
              <h3>Total</h3>
              <p>{zones.reduce((sum, z) => sum + z.total_slots, 0)}</p>
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
        <div style={{ padding: '24px 24px 0 24px' }}>
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '16px', width: '200px' }}
          >
            <option value="all">All Zones</option>
            {zones.map(zone => (
              <option key={zone.id} value={zone.name}>{zone.name}</option>
            ))}
          </select>
        </div>

        <div className="slots-grid" style={{ overflowX: 'hidden', display: 'flex', flexWrap: 'wrap', gap: '24px', padding: '24px' }}>
          {loading ? (
            <p style={{ width: '100%', textAlign: 'center', padding: '50px' }}>Loading real-time slot data...</p>
          ) : filteredSlots.length > 0 ? (
            filteredSlots.map(slot => (
              <div key={slot.id} className={`slot-card ${slot.status}`} style={{ flex: '1 1 calc(33.333% - 16px)', minWidth: '280px', maxWidth: '350px' }}>
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
                    onClick={() => onNavigate('book-slot', { slotId: slot.id, zoneId: slot.zoneId })}
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
            ))
          ) : (
            <p style={{ width: '100%', textAlign: 'center', padding: '50px' }}>No slots found matching your filter.</p>
          )}
        </div>
      </div>

      {/* Legend - Simplified for available only */}
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
          <div className="legend-item" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="legend-dot available"></span>
            <span>Available - Ready for booking</span>
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