import React, { useState, useEffect } from 'react';
import { alertApi } from '../api/api';
import './StaffPages.css';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await alertApi.getAll();
      setAlerts(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    return alert.type === filter;
  });

  const getAlertClass = (type) => {
    switch (type) {
      case 'critical': return 'alert-critical';
      case 'warning': return 'alert-warning';
      case 'success': return 'alert-success';
      default: return 'alert-info';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'critical': return '🚨';
      case 'warning': return '⚠️';
      case 'success': return '✅';
      default: return 'ℹ️';
    }
  };

  const markAsRead = async (alertId) => {
    try {
      await alertApi.markAsRead(alertId);
      setAlerts(alerts.map(a => a.id === alertId ? { ...a, is_read: true } : a));
    } catch (error) {
      console.error('Error marking alert as read:', error);
    }
  };

  const clearAllAlerts = async () => {
    alert('Clear all feature pending backend implementation');
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading alerts...</div>;

  return (
    <div className="alerts">
      <div className="alerts-header">
        <h1>⚠️ Alerts & Notifications</h1>
      </div>

      <div className="alerts-content">
        <div className="alerts-controls">
          <div className="alert-filters">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({alerts.length})
            </button>
            <button
              className={`filter-btn ${filter === 'critical' ? 'active' : ''}`}
              onClick={() => setFilter('critical')}
            >
              Critical ({alerts.filter(a => a.type === 'critical').length})
            </button>
            <button
              className={`filter-btn ${filter === 'warning' ? 'active' : ''}`}
              onClick={() => setFilter('warning')}
            >
              Warning ({alerts.filter(a => a.type === 'warning').length})
            </button>
            <button
              className={`filter-btn ${filter === 'info' ? 'active' : ''}`}
              onClick={() => setFilter('info')}
            >
              Info ({alerts.filter(a => a.type === 'info').length})
            </button>
          </div>

          <button className="clear-all-btn" onClick={clearAllAlerts}>
            Clear All
          </button>
        </div>

        <div className="alerts-list">
          {filteredAlerts.map(alert => (
            <div key={alert.id} className={`alert-item ${getAlertClass(alert.type)} ${alert.is_read ? 'read' : 'unread'}`}>
              <div className="alert-icon">
                {getAlertIcon(alert.type)}
              </div>
              <div className="alert-content">
                <div className="alert-header">
                  <h3 className="alert-title">{alert.title}</h3>
                  <span className="alert-time">{new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="alert-message">{alert.message}</p>
              </div>
              {!alert.is_read && (
                <div className="alert-actions">
                  <button
                    className="mark-read-btn"
                    onClick={() => markAsRead(alert.id)}
                  >
                    Mark as Read
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredAlerts.length === 0 && (
          <div className="no-alerts">
            <h3>No alerts found</h3>
            <p>No alerts match the selected filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;
