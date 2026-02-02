import React, { useState, useEffect } from 'react';
import { parkingApi } from '../api/api';
import './StaffPages.css';

const ZoneStatus = () => {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchZones();
    const interval = setInterval(fetchZones, 30000); // 30s refresh
    return () => clearInterval(interval);
  }, []);

  const fetchZones = async () => {
    try {
      const response = await parkingApi.getZones();
      if (response.data.success) {
        setZones(response.data.zones || []);
      }
    } catch (error) {
      console.error('Error fetching zones:', error);
    } finally {
      setLoading(false);
    }
  };

  const getZoneStatusColor = (rate) => {
    if (rate >= 90) return '#ef4444'; // Red
    if (rate >= 70) return '#f59e0b'; // Amber
    return '#10b981'; // Green
  };

  const viewRealTimeMap = () => {
    const popup = window.open('', '_blank', 'width=1000,height=700');
    let content = '';

    zones.forEach(zone => {
      let slotGrid = '';
      const zoneSlots = zone.slots || [];

      zoneSlots.forEach(slot => {
        slotGrid += `
          <div style="
            width: 45px; height: 60px; 
            background: ${slot.is_occupied ? '#fee2e2' : '#f0fdf4'}; 
            border: 2px solid ${slot.is_occupied ? '#ef4444' : '#10b981'};
            border-radius: 6px; display: flex; flex-direction: column; 
            align-items: center; justify-content: center; position: relative;
            transition: all 0.2s;
          ">
            <span style="font-size: 10px; font-weight: 700; color: ${slot.is_occupied ? '#991b1b' : '#166534'}">${slot.slot_number}</span>
            <span style="font-size: 14px;">${slot.is_occupied ? '🚗' : '🅿️'}</span>
          </div>
        `;
      });

      content += `
        <div style="margin-bottom: 30px; background: #fff; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <h3 style="margin-top:0; color: #1e293b; display: flex; justify-content: space-between;">
            <span>📍 ${zone.name}</span>
            <span style="font-size: 14px; color: #64748b;">${zone.available_slots} Free / ${zone.total_slots} Total</span>
          </h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(50px, 1fr)); gap: 10px;">
            ${slotGrid || '<p style="grid-column: 1/-1; color: #94a3b8; text-align: center;">No slots configured in this zone</p>'}
          </div>
        </div>
      `;
    });

    popup.document.write(`
      <html>
        <head><title>Real-time Parking Map</title></head>
        <body style="font-family: Arial; background: #f1f5f9; padding: 30px;">
          <h2 style="margin-bottom: 25px; color: #0f172a;">🗺️ Live Parking Map</h2>
          ${content}
          <button onclick="window.close()" style="padding: 12px 24px; background: #3b82f6; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">Close Map</button>
        </body>
      </html>
    `);
  };

  const viewOccupancyChart = () => {
    const popup = window.open('', '_blank', 'width=800,height=600');
    let chartRows = '';

    zones.forEach(zone => {
      const occRate = zone.total_slots > 0 ? (zone.current_occupancy.occupied / zone.total_slots) * 100 : 0;
      const color = getZoneStatusColor(occRate);

      chartRows += `
        <div style="margin-bottom: 24px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-weight: 600;">
            <span>${zone.name}</span>
            <span>${Math.round(occRate)}%</span>
          </div>
          <div style="width: 100%; height: 24px; background: #e2e8f0; border-radius: 12px; overflow: hidden;">
            <div style="width: ${occRate}%; height: 100%; background: ${color}; transition: width 1s ease;"></div>
          </div>
          <div style="display: flex; gap: 15px; margin-top: 5px; font-size: 12px; color: #64748b;">
            <span>Occupied: ${zone.current_occupancy.occupied}</span>
            <span>Available: ${zone.current_occupancy.available}</span>
          </div>
        </div>
      `;
    });

    popup.document.write(`
      <html>
        <head><title>Occupancy Analysis</title></head>
        <body style="font-family: Arial; background: #f8fafc; padding: 40px;">
          <div style="background: white; border-radius: 16px; padding: 40px; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
            <h2 style="margin:0 0 30px 0; color: #1e293b;">📊 Zone Occupancy Chart</h2>
            ${chartRows || '<p style="text-align:center; padding: 20px;">No data available</p>'}
            <button onclick="window.close()" style="margin-top: 30px; padding: 12px 24px; background: #1e293b; color: white; border: none; border-radius: 8px; cursor: pointer;">Close Analytics</button>
          </div>
        </body>
      </html>
    `);
  };

  if (loading && zones.length === 0) return <div style={{ padding: '20px', color: '#64748b' }}>Establishing live connection to zones...</div>;

  return (
    <div className="zone-status">
      <div className="zone-status-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ margin: 0 }}>🏢 Zone Status</h1>
          <div className="zone-actions" style={{ display: 'flex', gap: '12px' }}>
            <button className="action-btn" onClick={viewRealTimeMap} style={{ padding: '12px 20px', borderRadius: '10px', background: '#3b82f6', color: 'white', border: 'none', fontWeight: '600', cursor: 'pointer' }}>
              🗺️ Real-time Map
            </button>
            <button className="action-btn" onClick={viewOccupancyChart} style={{ padding: '12px 20px', borderRadius: '10px', background: '#8b5cf6', color: 'white', border: 'none', fontWeight: '600', cursor: 'pointer' }}>
              📊 Occupancy Chart
            </button>
          </div>
        </div>

        <div className="zones-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {zones.map(zone => {
            const occ = zone.current_occupancy || { total_slots: 0, occupied: 0, available: 0 };
            const rate = occ.total_slots > 0 ? (occ.occupied / occ.total_slots) * 100 : 0;
            const color = getZoneStatusColor(rate);

            return (
              <div key={zone.id} className="zone-card" style={{ background: 'white', borderRadius: '20px', padding: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderBottom: `5px solid ${color}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: '700', color: '#1e293b' }}>{zone.name}</span>
                  <span style={{ fontSize: '1.2rem' }}>{rate >= 90 ? '🔴' : rate >= 70 ? '🟡' : '🟢'}</span>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: '800', color: color }}>{occ.available}</span>
                    <span style={{ fontSize: '1.1rem', color: '#64748b' }}>/{occ.total_slots}</span>
                    <span style={{ marginLeft: '10px', fontSize: '0.9rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '600' }}>Available</span>
                  </div>
                </div>

                <div className="occupancy-bar" style={{ width: '100%', height: '10px', background: '#f1f5f9', borderRadius: '5px', overflow: 'hidden', marginBottom: '10px' }}>
                  <div style={{ width: `${rate}%`, height: '100%', background: color, transition: 'all 0.5s ease' }}></div>
                </div>

                <div style={{ textAlign: 'center', fontSize: '0.9rem', fontWeight: '600', color: '#475569' }}>
                  {Math.round(rate)}% Occupied {occ.reserved > 0 && `(+${occ.reserved} Reserved)`}
                </div>
              </div>
            );
          })}
        </div>

        {zones.length === 0 && (
          <div style={{ textAlign: 'center', padding: '100px 20px', background: 'white', borderRadius: '20px', color: '#94a3b8' }}>
            <p style={{ fontSize: '1.2rem' }}>No active parking zones found in the registry.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ZoneStatus;
