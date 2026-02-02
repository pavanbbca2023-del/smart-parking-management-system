import React, { useState, useEffect } from 'react';
import { analyticsApi } from '../../api/api';

const ParkingZones = () => {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await analyticsApi.getZoneAnalytics();
        if (response.data && response.data.data) {
          // Map backend zones to frontend structure
          const mappedZones = response.data.data.map(z => ({
            id: z.zone_id,
            name: z.zone_name,
            location: 'Main Facility',
            totalSlots: z.total_slots,
            availableSlots: z.available_slots,
            type: z.hourly_rate >= 50 ? 'Premium' : 'Standard'
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

  if (loading) return <div className="page">Loading real-time zone status...</div>;

  return (
    <div className="page">
      <h1>Parking Zones</h1>
      <p>Browse available parking zones near you</p>

      <div className="zones-summary" style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <div className="summary-card" style={{ background: '#f0f9ff', padding: '20px', borderRadius: '12px', flex: 1, textAlign: 'center' }}>
          <h3>Total Zones</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{zones.length}</p>
        </div>
        <div className="summary-card" style={{ background: '#f0fdf4', padding: '20px', borderRadius: '12px', flex: 1, textAlign: 'center' }}>
          <h3>Total Slots</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{zones.reduce((sum, z) => sum + z.totalSlots, 0)}</p>
        </div>
        <div className="summary-card" style={{ background: '#fdf2f2', padding: '20px', borderRadius: '12px', flex: 1, textAlign: 'center' }}>
          <h3>Available Slots</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#166534' }}>{zones.reduce((sum, z) => sum + z.availableSlots, 0)}</p>
        </div>
      </div>

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
