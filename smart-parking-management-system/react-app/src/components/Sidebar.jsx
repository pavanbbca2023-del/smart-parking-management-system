import React from 'react';
import './Sidebar.css';

const Sidebar = ({ currentPage, onPageChange, isOpen = true }) => {
  const userMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'parking-zones', label: 'Parking Zones', icon: '🗺️' },
    { id: 'view-slots', label: 'Parking Slots', icon: '🚗' },
    { id: 'book-slot', label: 'Book Parking Slot', icon: '📝' },
    { id: 'payment', label: 'Payment', icon: '💳' },
    { id: 'exit-checkout', label: 'Exit / Checkout', icon: '🚪' },
    { id: 'receipt', label: 'Receipt', icon: '🧾' }
  ];

  const handleItemClick = (itemId) => {
    onPageChange(itemId);
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">
            🅿️
          </div>
          {isOpen && (
            <div className="logo-text">
              <h2>Smart Parking</h2>
              <p>Management</p>
            </div>
          )}
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {userMenuItems.map((item) => (
            <li key={item.id} className="nav-item">
              <button
                className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
                onClick={() => handleItemClick(item.id)}
                title={!isOpen ? item.label : ''}
              >
                <span className="nav-icon">{item.icon}</span>
                {isOpen && <span className="nav-label">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">
            <span>👤</span>
          </div>
          {isOpen && (
            <div className="user-info">
              <p className="user-name">Guest User</p>
              <p className="user-role">Parking Customer</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;