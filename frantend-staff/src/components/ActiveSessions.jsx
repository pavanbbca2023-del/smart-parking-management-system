import React, { useState, useEffect } from 'react';
import { parkingApi } from '../api/api';
import './StaffPages.css';

const ActiveSessions = () => {
  const [activeSessions, setActiveSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveSessions();
    const interval = setInterval(fetchActiveSessions, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const fetchActiveSessions = async () => {
    try {
      setLoading(true);
      const response = await parkingApi.getActiveSessions();
      if (response.data.success) {
        setActiveSessions(response.data.sessions || []);
      }
    } catch (error) {
      console.error('Error fetching active sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentlyParked = activeSessions.length;
  // Simplified long duration check for example
  const longDurationCount = activeSessions.filter(s => s.duration && s.duration.includes('h') && parseInt(s.duration) >= 4).length;

  const viewSessionDetails = (session) => {
    alert(`Session Details:\n\nVehicle: ${session.vehicle_number}\nZone: ${session.zone_name}\nSlot: ${session.slot_number}\nEntry: ${new Date(session.entry_time).toLocaleString()}\nDuration: ${session.duration}\nStatus: ${session.status}`);
  };

  const contactOwner = (session) => {
    alert(`Contact feature requires user profile integration.\nVehicle: ${session.vehicle_number}`);
  };

  const extendSession = (session) => {
    alert(`Extend session: ${session.vehicle_number}\nThis feature is handled by the regular exit/payment flow.`);
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading active sessions...</div>;

  return (
    <div className="active-sessions">
      <div className="sessions-header">
        <h1>⏰ Active Sessions Management</h1>
        <div className="sessions-stats">
          <div className="stat-item">
            <span className="stat-number">{currentlyParked}</span>
            <span className="stat-label">Currently Parked</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{longDurationCount}</span>
            <span className="stat-label">Long Duration (&gt;4h)</span>
          </div>
        </div>
      </div>

      <div className="sessions-content">
        <div className="sessions-list">
          <h3>🚗 Active Parking Sessions</h3>
          <div className="sessions-grid">
            {activeSessions.map(session => (
              <div key={session.id} className={`session-card ${session.duration && session.duration.includes('h') && parseInt(session.duration) >= 4 ? 'long' : 'regular'}`}>
                <div className="session-header">
                  <span className="vehicle-number">{session.vehicle_number}</span>
                  <span className={`duration-badge ${session.duration && session.duration.includes('h') && parseInt(session.duration) >= 4 ? 'long' : 'regular'}`}>
                    {session.duration}
                  </span>
                </div>

                <div className="session-info">
                  <div className="info-row">
                    <span className="label">🅿️ Zone:</span>
                    <span className="value">{session.zone_name} • {session.slot_number}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">🕐 Entry:</span>
                    <span className="value">{new Date(session.entry_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">📊 Status:</span>
                    <span className="value">{session.status}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">💳 Payment:</span>
                    <span className="value">{session.payment_status}</span>
                  </div>
                </div>

                <div className="session-actions">
                  <button
                    className="action-btn details"
                    onClick={() => viewSessionDetails(session)}
                  >
                    📋 Details
                  </button>
                  <button
                    className="action-btn contact"
                    onClick={() => contactOwner(session)}
                  >
                    📞 Contact
                  </button>
                  <button
                    className="action-btn extend"
                    onClick={() => extendSession(session)}
                  >
                    ⏰ Extend
                  </button>
                </div>
              </div>
            ))}
          </div>

          {activeSessions.length === 0 && (
            <div className="no-sessions" style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '12px' }}>
              <p>No active sessions found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActiveSessions;
