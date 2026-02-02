import React, { useState } from 'react';
import '../user/UserPages.css';

const StaffDashboard = () => {
  const [currentShift] = useState({
    staffName: 'Rajesh Kumar',
    staffId: 'STAFF001',
    shiftStart: '6:00 AM',
    shiftEnd: '2:00 PM',
    gate: 'Main Gate'
  });

  const [todayStats] = useState({
    vehiclesEntered: 145,
    vehiclesExited: 132,
    currentOccupancy: 89,
    totalRevenue: 12450
  });

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <div className="welcome-section">
            <h1>👋 Welcome, {currentShift.staffName}</h1>
            <p>Staff ID: {currentShift.staffId} | {currentShift.gate} | Shift: {currentShift.shiftStart} - {currentShift.shiftEnd}</p>
          </div>
          <div className="header-stats">
            <div className="mini-stat">
              <span className="mini-stat-value">{todayStats.vehiclesEntered}</span>
              <span className="mini-stat-label">Vehicles In</span>
            </div>
            <div className="mini-stat">
              <span className="mini-stat-value">{todayStats.vehiclesExited}</span>
              <span className="mini-stat-label">Vehicles Out</span>
            </div>
          </div>
        </div>
        <div className="header-actions">
          <span className="status-badge success">🟢 On Duty</span>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🚗</div>
          <div className="stat-content">
            <h3>Vehicles Entered</h3>
            <p className="stat-value">{todayStats.vehiclesEntered}</p>
            <span className="stat-label">Today</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🚙</div>
          <div className="stat-content">
            <h3>Vehicles Exited</h3>
            <p className="stat-value">{todayStats.vehiclesExited}</p>
            <span className="stat-label">Today</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🅿️</div>
          <div className="stat-content">
            <h3>Current Occupancy</h3>
            <p className="stat-value">{todayStats.currentOccupancy}</p>
            <span className="stat-label">Vehicles parked</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Revenue Today</h3>
            <p className="stat-value">₹{todayStats.totalRevenue.toLocaleString()}</p>
            <span className="stat-label">Total collected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;