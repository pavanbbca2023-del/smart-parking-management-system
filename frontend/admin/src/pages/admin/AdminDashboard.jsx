import React, { useState } from 'react';

const AdminDashboard = () => {
  const [showQuickView, setShowQuickView] = useState(true);

  return (
    <div style={{
      padding: '24px',
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
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
      </div>

      {/* Quick View Section */}
      {showQuickView && (
        <div style={{
          marginBottom: '40px',
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '28px',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.05)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative background element */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '150px',
            height: '150px',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
            borderRadius: '50%',
            zIndex: 0
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '24px' }}>🅿️</span>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                  Zone B - Quick View
                </h2>
              </div>
              <button
                onClick={() => setShowQuickView(false)}
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#dc2626',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontWeight: '600',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseOver={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.2)'}
                onMouseOut={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.1)'}
              >
                Close Window
              </button>
            </div>

            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
              Real-time zone status and details
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px' }}>
              {[
                { label: 'Total Spots', value: '40', color: '#1e293b' },
                { label: 'Occupied', value: '27', color: '#ef4444' },
                { label: 'Available', value: '13', color: '#10b981' },
                { label: 'Status', value: 'Active', color: '#10b981', badge: true }
              ].map((item, idx) => (
                <div key={idx} style={{
                  background: 'rgba(255, 255, 255, 0.5)',
                  padding: '16px',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.8)'
                }}>
                  <p style={{ fontSize: '12px', fontWeight: '500', color: '#64748b', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {item.label}
                  </p>
                  {item.badge ? (
                    <span style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      color: item.color,
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '700'
                    }}>
                      ● {item.value}
                    </span>
                  ) : (
                    <p style={{ fontSize: '24px', fontWeight: '800', color: item.color, margin: 0 }}>
                      {item.value}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(255, 255, 255, 0.5)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.8)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>Occupancy Rate</span>
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#3b82f6' }}>68% occupied</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '68%', height: '100%', background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)', borderRadius: '4px' }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overview Section */}
      <div style={{ marginBottom: '32px' }}>
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
      <div style={{ marginBottom: '32px' }}>
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
      <div style={{ marginBottom: '32px' }}>
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