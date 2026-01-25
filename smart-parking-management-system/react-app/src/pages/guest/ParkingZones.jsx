import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import PageNavigation from '../../components/PageNavigation';

const ParkingZones = ({ onNavigate }) => {
  const [selectedZone, setSelectedZone] = useState(null);

  const zones = [
    {
      id: 'A',
      name: 'Zone A',
      level: 'Ground Floor',
      totalSlots: 100,
      availableSlots: 45,
      occupiedSlots: 55,
      description: 'Premium parking zone near main entrance',
      color: '#3b82f6',
      features: ['Covered', 'CCTV', 'Easy Access', 'Near Elevator']
    },
    {
      id: 'B',
      name: 'Zone B',
      level: '1st Floor',
      totalSlots: 80,
      availableSlots: 32,
      occupiedSlots: 48,
      description: 'Standard parking zone on first floor',
      color: '#3b82f6',
      features: ['Covered', 'CCTV', 'Spacious', 'Well-lit']
    },
    {
      id: 'C',
      name: 'Zone C',
      level: '2nd Floor',
      totalSlots: 120,
      availableSlots: 68,
      occupiedSlots: 52,
      description: 'Large parking zone on second floor',
      color: '#3b82f6',
      features: ['Covered', 'CCTV', 'Ventilated', 'Fast Exit']
    },
    {
      id: 'D',
      name: 'Zone D',
      level: 'Basement',
      totalSlots: 150,
      availableSlots: 87,
      occupiedSlots: 63,
      description: 'Underground parking with climate control',
      color: '#3b82f6',
      features: ['Climate Controlled', 'CCTV', 'Security Guard', 'Safe']
    },
    {
      id: 'E',
      name: 'Zone E',
      level: '3rd Floor',
      totalSlots: 90,
      availableSlots: 42,
      occupiedSlots: 48,
      description: 'Open-air parking on third floor',
      color: '#3b82f6',
      features: ['Open Air', 'CCTV', 'Budget Friendly', 'Spacious']
    },
    {
      id: 'F',
      name: 'Zone F',
      level: 'Level -2',
      totalSlots: 110,
      availableSlots: 61,
      occupiedSlots: 49,
      description: 'Deep basement with 24/7 surveillance',
      color: '#3b82f6',
      features: ['Deep Underground', 'CCTV', 'Secure', 'Safe']
    }
  ];

  const calculateOccupancy = (available, total) => {
    return ((total - available) / total * 100).toFixed(1);
  };

  if (selectedZone) {
    const zone = zones.find(z => z.id === selectedZone);
    return (
      <div className="guest-page parking-zones-page">
        <div className="container">
          <button 
            className="btn-secondary"
            onClick={() => setSelectedZone(null)}
            style={{ marginBottom: '30px' }}
          >
            ← Back to All Zones
          </button>
        </div>

        <div className="zone-detail-header" style={{ borderTopColor: zone.color }}>
          <h2>{zone.name}</h2>
          <p className="zone-level">{zone.level}</p>
          <p className="zone-description">{zone.description}</p>
        </div>

        <div className="zone-detail-section">
          <div className="container">
            <div className="zone-detail-grid">
              <div className="zone-stat-card">
                <h3>Capacity</h3>
                <div className="stat-value">{zone.totalSlots}</div>
                <p>Total Slots</p>
              </div>

              <div className="zone-stat-card">
                <h3>Available</h3>
                <div className="stat-value available">{zone.availableSlots}</div>
                <p>Slots Free</p>
              </div>

              <div className="zone-stat-card">
                <h3>Occupied</h3>
                <div className="stat-value occupied">{zone.occupiedSlots}</div>
                <p>Slots Taken</p>
              </div>

              <div className="zone-stat-card">
                <h3>Occupancy</h3>
                <div className="stat-value">{calculateOccupancy(zone.availableSlots, zone.totalSlots)}%</div>
                <p>Usage Rate</p>
              </div>
            </div>
          </div>
        </div>

        <div className="zone-features-section">
          <div className="container">
            <h3>Zone Features</h3>
            <div className="features-grid">
              {zone.features.map((feature, idx) => (
                <div key={idx} className="feature-badge">
                  ✓ {feature}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="zone-progress-section">
          <div className="container">
            <h3>Space Availability</h3>
            <div className="progress-bar">
              <div 
                className="progress-fill available-fill"
                style={{ width: `${(zone.availableSlots / zone.totalSlots) * 100}%` }}
              ></div>
            </div>
            <div className="progress-legend">
              <span><strong>{zone.availableSlots}</strong> Available</span>
              <span><strong>{zone.occupiedSlots}</strong> Occupied</span>
            </div>
          </div>
        </div>

        <div className="zone-actions-section">
          <div className="container">
            <div className="zone-actions">
              <button 
                className="btn-primary"
                onClick={() => onNavigate('book-slot')}
              >
                📝 Book Slot in {zone.name}
              </button>
              <button 
                className="btn-secondary"
                onClick={() => onNavigate('view-slots')}
              >
                🔍 View All Slots
              </button>
            </div>
          </div>
        </div>

        {/* Page Navigation */}
        <PageNavigation 
          onNavigate={onNavigate} 
          currentPage="parking-zones" 
        />
      </div>
    );
  }

  return (
    <div className="guest-page parking-zones-page">
      {/* Page Header */}
      <PageHeader 
        title="Parking Zones"
        description="Explore different parking zones and their availability"
        icon="🅿️"
      />

      <div className="zones-summary">
        <div className="container">
          <div className="summary-grid">
            <div className="summary-card">
              <h3>Total Zones</h3>
              <p>{zones.length}</p>
            </div>
            <div className="summary-card">
              <h3>Total Slots</h3>
              <p>{zones.reduce((sum, z) => sum + z.totalSlots, 0)}</p>
            </div>
            <div className="summary-card">
              <h3>Available Slots</h3>
              <p className="text-success">{zones.reduce((sum, z) => sum + z.availableSlots, 0)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="zones-grid">
        <div className="container">
          <div className="zones-cards">
            {zones.map((zone) => (
              <div 
                key={zone.id} 
                className="zone-card"
                style={{ borderTopColor: zone.color }}
              >
                <div className="zone-card-header">
                  <h3>{zone.name}</h3>
                  <span className="zone-badge">{zone.level}</span>
                </div>

                <p className="zone-description">{zone.description}</p>

                <div className="zone-stats" style={{ paddingRight:'5px' }}>
                  <div className="stat">
                    <span className="label">Total:</span>
                    <span className="value" style={{ fontSize: '1.2rem' }}>{zone.totalSlots}</span>
                  </div>
                  <div className="stat">
                    <span className="label">Available:</span>
                    <span className="value available" style={{ fontSize: '1rem' }}>{zone.availableSlots}</span>
                  </div>
                </div>

                <div className="zone-progress-small">
                  <div className="progress-bar-small">
                    <div 
                      className="progress-fill available-fill"
                      style={{ width: `${(zone.availableSlots / zone.totalSlots) * 100}%` }}
                    ></div>
                  </div>
                  <span className="occupancy-text">
                    {calculateOccupancy(zone.availableSlots, zone.totalSlots)}% occupied
                  </span>
                </div>

                <div className="zone-features-small">
                  {zone.features.slice(0, 2).map((feature, idx) => (
                    <span key={idx} className="feature-tag">
                      {feature}
                    </span>
                  ))}
                </div>

                <button 
                  className="btn-primary-small"
                  onClick={() => setSelectedZone(zone.id)}
                >
                  View Details →
                </button>
              </div>
            ))}
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

export default ParkingZones;
