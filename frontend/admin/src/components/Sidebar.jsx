import React from 'react';
import { useNavigate } from 'react-router-dom'; // Added import
import './Sidebar.css';
import './AdminLogos.css';

const Sidebar = ({ currentPage, onPageChange, userType, onUserTypeChange }) => {
  const navigate = useNavigate(); // Hook for navigation

  const handleLogout = () => {
    // Clear tokens
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    // Determine redirect based on userType (optional, but good for safety)
    if (userType === 'staff') {
      // Redirect to Staff Dashboard (relative path supports production)
      window.location.href = '/staff/dashboard';
    } else {
      // Default admin logout behavior - maybe refresh or redirect to login (if admin login exists)
      // For now, reload or specific logic
      window.location.href = '/login';
    }
  };


  const adminMenuItems = [
    { id: 'dashboard', label: 'DASHBOARD', icon: '🏠' },
    { id: 'user-management', label: 'USER MANAGEMENT', icon: '👥' },
    { id: 'zone-management', label: 'ZONE MANAGEMENT', icon: '🏢' },
    { id: 'financial', label: 'FINANCIAL REPORT', icon: '💰' },
    { id: 'parking-operations', label: 'PARKING OPERATIONS', icon: '🚗' },
    { id: 'staff-management', label: 'STAFF MANAGEMENT', icon: '👮' }
  ];

  const staffMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'qr-scanner', label: 'QR Scanner', icon: '📱' },
    { id: 'vehicle-entry', label: 'Vehicle Entry', icon: '🚗' },
    { id: 'exit-billing', label: 'Exit & Billing', icon: '🧾' },
    { id: 'receipt', label: 'Print Receipt', icon: '🖨️' },
    { id: 'active-sessions', label: 'Current Sessions', icon: '⏱️' }
  ];

  const userMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'quick-stats', label: 'Quick Stats', icon: '⚡' }
  ];

  const getMenuItems = () => {
    switch (userType) {
      case 'admin': return adminMenuItems;
      case 'staff': return staffMenuItems;
      case 'user': return userMenuItems;
      default: return adminMenuItems;
    }
  };

  const handleItemClick = (itemId) => {
    onPageChange(itemId);
  };

  const handleUserTypeSwitch = (type) => {
    onUserTypeChange(type);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 14h20v12H10V14z" stroke="#3B82F6" strokeWidth="1.5" fill="none" />
              <path d="M13 17h3v6h-3v-6zM16.5 17h3v6h-3v-6zM20 17h3v6h-3v-6zM23.5 17h3v6h-3v-6z" fill="#3B82F6" />
              <circle cx="20" cy="30" r="2.5" fill="#10B981" />
              <path d="M18 30l1.5 1.5L22 28" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="logo-text">
            <h2>Smart Parking</h2>
            <p>Management System</p>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {getMenuItems().map((item) => (
            <li key={item.id} className="nav-item">
              <button
                className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
                onClick={() => handleItemClick(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-switcher">
        <div className="switcher-section">
          <h4>Switch Portal</h4>
          <div className="switcher-buttons">
            <button
              className={`switcher-btn ${userType === 'admin' ? 'active' : ''}`}
              onClick={() => handleUserTypeSwitch('admin')}
              title="ADMIN (Super User) - Full System Control"
            >
              <div className="switcher-content">
                <span className="switcher-title">👨‍💼 Admin Panel</span>
                <span className="switcher-subtitle">Super User</span>
              </div>
            </button>
            <button
              className={`switcher-btn ${userType === 'staff' ? 'active' : ''}`}
              onClick={() => handleUserTypeSwitch('staff')}
              title="STAFF (Parking Attendant) - Daily Operations: QR scan, payments, vehicle entry/exit, sessions view, slot check. Cannot create zones or change rates."
            >
              <div className="switcher-content">
                <span className="switcher-title">👷‍♂️ Staff Portal</span>
                <span className="switcher-subtitle">Parking Attendant</span>
              </div>
            </button>
            <button
              className={`switcher-btn ${userType === 'user' ? 'active' : ''}`}
              onClick={() => handleUserTypeSwitch('user')}
              title="USER (Customer) - Mobile App/Website Access: Book slots, view zones, generate QR, online payment, history, session status. No admin access or other users' data."
            >
              <div className="switcher-content">
                <span className="switcher-title">👤 User Portal</span>
                <span className="switcher-subtitle">Customer</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">
            <span>{userType === 'admin' ? 'AD' : userType === 'staff' ? 'ST' : 'US'}</span>
          </div>
          <div className="user-info">
            <p className="user-name">
              {userType === 'admin' ? 'Admin User' : userType === 'staff' ? 'Staff Member' : 'Customer'}
            </p>
            <p className="user-role">
              {userType === 'admin' ? 'Super User' : userType === 'staff' ? 'Parking Attendant' : 'Customer'}
            </p>
          </div>
          {/* Added Logout Button */}
          <button
            onClick={handleLogout}
            style={{
              marginLeft: 'auto',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#ef4444' // Red color for logout
            }}
            title="Logout"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;