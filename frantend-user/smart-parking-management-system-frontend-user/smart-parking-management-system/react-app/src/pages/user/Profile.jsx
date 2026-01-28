import React, { useState } from 'react';
import './UserPages.css';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91 9876543210',
    vehicle: 'MH 01 AB 1234',
    address: 'Mumbai, Maharashtra',
    joinDate: 'January 2024',
    totalBookings: 45,
    rating: 4.8
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    console.log('Profile updated:', profile);
    alert('Profile updated successfully!');
  };

  const stats = [
    { icon: '🎫', label: 'Total Bookings', value: profile.totalBookings },
    { icon: '⭐', label: 'Rating', value: profile.rating },
    { icon: '💰', label: 'Total Spent', value: '₹12,450' },
    { icon: '🏆', label: 'Member Since', value: profile.joinDate }
  ];

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar-section">
          <div className="profile-avatar">
            <span className="avatar-text">RS</span>
          </div>
          <div className="profile-basic-info">
            <h1 className="profile-name">{profile.name}</h1>
            <p className="profile-email">{profile.email}</p>
            <div className="profile-badges">
              <span className="badge verified">✓ Verified</span>
              <span className="badge premium">⭐ Premium</span>
            </div>
          </div>
        </div>
        <div className="profile-actions-header">
          {isEditing ? (
            <>
              <button className="btn-save" onClick={handleSave}>
                <span className="btn-icon">💾</span>
                Save Changes
              </button>
              <button className="btn-cancel" onClick={() => setIsEditing(false)}>
                <span className="btn-icon">✕</span>
                Cancel
              </button>
            </>
          ) : (
            <button className="btn-edit" onClick={() => setIsEditing(true)}>
              <span className="btn-icon">✏️</span>
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="profile-stats">
        {stats.map((stat, index) => (
          <div key={index} className="stat-item">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="profile-content">
        <div className="profile-main">
          <div className="profile-section">
            <div className="section-header">
              <h3>👤 Personal Information</h3>
            </div>
            <div className="profile-fields">
              <div className="profile-field">
                <label>Full Name</label>
                {isEditing ? (
                  <input 
                    className="profile-input"
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                  />
                ) : (
                  <span className="profile-value">{profile.name}</span>
                )}
              </div>
              <div className="profile-field">
                <label>Email Address</label>
                {isEditing ? (
                  <input 
                    className="profile-input"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                  />
                ) : (
                  <span className="profile-value">{profile.email}</span>
                )}
              </div>
              <div className="profile-field">
                <label>Phone Number</label>
                {isEditing ? (
                  <input 
                    className="profile-input"
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  />
                ) : (
                  <span className="profile-value">{profile.phone}</span>
                )}
              </div>
              <div className="profile-field">
                <label>Address</label>
                {isEditing ? (
                  <input 
                    className="profile-input"
                    value={profile.address}
                    onChange={(e) => setProfile({...profile, address: e.target.value})}
                  />
                ) : (
                  <span className="profile-value">{profile.address}</span>
                )}
              </div>
            </div>
          </div>

          <div className="profile-section">
            <div className="section-header">
              <h3>🚗 Vehicle Information</h3>
            </div>
            <div className="profile-fields">
              <div className="profile-field">
                <label>Vehicle Number</label>
                {isEditing ? (
                  <input 
                    className="profile-input"
                    value={profile.vehicle}
                    onChange={(e) => setProfile({...profile, vehicle: e.target.value})}
                  />
                ) : (
                  <span className="profile-value">{profile.vehicle}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="profile-sidebar">
          <div className="profile-section">
            <div className="section-header">
              <h3>🔒 Account Security</h3>
            </div>
            <div className="security-items">
              <div className="security-item">
                <div className="security-info">
                  <span className="security-label">Password</span>
                  <span className="security-status">Last changed 30 days ago</span>
                </div>
                <button className="security-btn">Change</button>
              </div>
              <div className="security-item">
                <div className="security-info">
                  <span className="security-label">Two-Factor Auth</span>
                  <span className="security-status enabled">Enabled</span>
                </div>
                <button className="security-btn">Manage</button>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <div className="section-header">
              <h3>🎯 Quick Actions</h3>
            </div>
            <div className="quick-actions">
              <button className="quick-action-btn">
                <span className="action-icon">📄</span>
                Download Data
              </button>
              <button className="quick-action-btn">
                <span className="action-icon">🔔</span>
                Notifications
              </button>
              <button className="quick-action-btn">
                <span className="action-icon">💳</span>
                Payment Methods
              </button>
              <button className="quick-action-btn danger">
                <span className="action-icon">🗑️</span>
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
