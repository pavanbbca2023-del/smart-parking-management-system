import React from 'react';
import './Navbar.css';

const Navbar = ({ sidebarOpen, toggleSidebar, title = "Smart Parking Management" }) => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button 
          className="sidebar-toggle-btn"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <span className={`hamburger ${sidebarOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
        <h1 className="navbar-title">{title}</h1>
      </div>
      
      <div className="navbar-right">
        <div className="status-indicator">
          <span className="status-dot"></span>
          <span className="status-text">System Online</span>
        </div>
        <div className="user-info">
          <span className="user-avatar">👤</span>
          <span className="user-name">Guest User</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;