import React from 'react';

const AdminDashboard = () => {
  return (
    <div style={{
      padding: '24px',
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{marginBottom: '32px'}}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '700',
          color: '#1e293b',
          margin: '0 0 8px 0'
        }}>
          🏠 Dashboard
        </h1>
        <p style={{
          fontSize: '16px',
          color: '#64748b',
          margin: '0'
        }}>
          Admin control center overview
        </p>
      </div>

      {/* Overview Section */}
      <div style={{marginBottom: '32px'}}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#1e293b',
          margin: '0 0 24px 0'
        }}>
          📊 Overview
        </h2>
        
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <p style={{
            fontSize: '16px',
            color: '#64748b',
            margin: '0',
            textAlign: 'center',
            padding: '40px 0'
          }}>
            📊 System overview content will be displayed here
          </p>
        </div>
      </div>

      {/* Analytics Section */}
      <div style={{marginBottom: '32px'}}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#1e293b',
          margin: '0 0 24px 0'
        }}>
          📈 Analytics
        </h2>
        
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <p style={{
            fontSize: '16px',
            color: '#64748b',
            margin: '0',
            textAlign: 'center',
            padding: '40px 0'
          }}>
            📈 Analytics and charts will be displayed here
          </p>
        </div>
      </div>

      {/* Quick Stats Section */}
      <div style={{marginBottom: '32px'}}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#1e293b',
          margin: '0 0 24px 0'
        }}>
          ⚡ Quick Stats
        </h2>
        
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <p style={{
            fontSize: '16px',
            color: '#64748b',
            margin: '0',
            textAlign: 'center',
            padding: '40px 0'
          }}>
            ⚡ Quick statistics and metrics will be displayed here
          </p>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;