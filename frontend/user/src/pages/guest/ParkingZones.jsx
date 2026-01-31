import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/PageHeader';
import PageNavigation from '../../components/PageNavigation';
import { analyticsApi, parkingApi } from '../../api/api';

const ParkingZones = ({ onNavigate }) => {
  const [selectedZoneId, setSelectedZoneId] = useState(null);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await parkingApi.getZones();
        if (response.data && response.data.zones) {
          // Map backend zones to frontend structure
          const mappedZones = response.data.zones.map(z => ({
            id: z.id,
            name: z.name,
            level: 'Ground Floor',
            totalSlots: z.total_slots,
            availableSlots: z.available_slots,
            occupiedSlots: z.occupied_slots,
            reservedSlots: z.reserved_slots,
            description: z.description || `Rate: ₹${z.base_price}/hour. Access real-time availability for ${z.name}.`,
            color: '#3b82f6',
            features: ['Covered', 'CCTV', '24/7 Security'],
            occupancyRate: z.total_slots > 0 ? (z.occupied_slots / z.total_slots) * 100 : 0
          }));
          setZones(mappedZones);
        }
      } catch (error) {
        console.error("Failed to fetch zone stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchZones();
  }, []);

  const calculateOccupancy = (available, total) => {
    return ((total - available) / total * 100).toFixed(1);
  };

  if (selectedZoneId) {
    const zone = zones.find(z => z.id === selectedZoneId);
    if (!zone) return <div className="guest-page">Loading zone details...</div>;
    return (
      <div className="guest-page parking-zones-page">
        <div className="container">
          <button
            className="btn-secondary"
            onClick={() => setSelectedZoneId(null)}
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
            </div>
          </div>
        </div>

        <div className="zone-actions-section">
          <div className="container">
            <div className="zone-actions">
              <button
                className="btn-primary"
                onClick={() => onNavigate('book-slot', { zoneId: zone.id })}
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
            {loading ? (
              <p style={{ width: '100%', textAlign: 'center', padding: '50px' }}>Loading real-time zone data...</p>
            ) : zones.map((zone) => (
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

                <div className="zone-stats" style={{ paddingRight: '5px' }}>
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
                  onClick={() => setSelectedZoneId(zone.id)}
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
