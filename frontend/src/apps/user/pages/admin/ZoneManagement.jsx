import React, { useState } from 'react';

const ZoneManagement = () => {
  const [activeTab, setActiveTab] = useState('all-zones');
  
  const zones = [
    { id: 1, name: 'Zone A - Premium', capacity: 50, occupied: 42, rate: 50, status: 'active', location: 'Main Entrance' },
    { id: 2, name: 'Zone B - Standard', capacity: 40, occupied: 28, rate: 30, status: 'active', location: 'Side Building' },
    { id: 3, name: 'Zone C - Economy', capacity: 35, occupied: 19, rate: 20, status: 'active', location: 'Back Area' },
    { id: 4, name: 'Zone D - Basic', capacity: 25, occupied: 10, rate: 15, status: 'maintenance', location: 'Rear Parking' }
  ];

  const getOccupancyColor = (percentage) => {
    if (percentage >= 80) return '#dc2626';
    if (percentage >= 60) return '#f59e0b';
    if (percentage >= 40) return '#3b82f6';
    return '#10b981';
  };

  const getStatusBadge = (status) => {
    const colors = {
      active: { bg: '#dcfce7', text: '#166534' },
      maintenance: { bg: '#fef3c7', text: '#92400e' },
      inactive: { bg: '#fee2e2', text: '#991b1b' }
    };
    return colors[status] || colors.active;
  };

  return (
    <div style={{
      padding: '24px',
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px'
      }}>
        <div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#1e293b',
            margin: '0 0 8px 0'
          }}>
            🏢 Zone Management
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#64748b',
            margin: '0'
          }}>
            Manage parking zones and layouts
          </p>
        </div>
        <button style={{
          padding: '12px 24px',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          ➕ Add New Zone
        </button>
      </div>

      {/* Tab Navigation */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '6px',
        marginBottom: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e2e8f0',
        display: 'flex',
        gap: '4px'
      }}>
        {[
          { id: 'all-zones', label: '🅿️ All Zones', icon: '🅿️' },
          { id: 'add-zone', label: '➕ Add Zone', icon: '➕' },
          { id: 'zone-mapping', label: '📍 Zone Mapping', icon: '📍' },
          { id: 'settings', label: '⚙️ Settings', icon: '⚙️' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 20px',
              backgroundColor: activeTab === tab.id ? '#3b82f6' : 'transparent',
              color: activeTab === tab.id ? 'white' : '#64748b',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* All Zones Tab */}
      {activeTab === 'all-zones' && (
        <div>
          {/* Zone Stats Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>🏢</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b' }}>4</div>
              <div style={{ fontSize: '14px', color: '#64748b' }}>Total Zones</div>
            </div>
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>🅿️</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b' }}>150</div>
              <div style={{ fontSize: '14px', color: '#64748b' }}>Total Capacity</div>
            </div>
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>🚗</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#dc2626' }}>99</div>
              <div style={{ fontSize: '14px', color: '#64748b' }}>Currently Occupied</div>
            </div>
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>✅</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>51</div>
              <div style={{ fontSize: '14px', color: '#64748b' }}>Available Spots</div>
            </div>
          </div>

          {/* Zones Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '20px'
          }}>
            {zones.map(zone => {
              const occupancyPercentage = Math.round((zone.occupied / zone.capacity) * 100);
              const statusColors = getStatusBadge(zone.status);
              
              return (
                <div key={zone.id} style={{
                  backgroundColor: 'white',
                  padding: '24px',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  border: '1px solid #e2e8f0',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                }}>
                  {/* Zone Header */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '16px'
                  }}>
                    <div>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1e293b',
                        margin: '0 0 4px 0'
                      }}>{zone.name}</h3>
                      <p style={{
                        fontSize: '14px',
                        color: '#64748b',
                        margin: '0'
                      }}>📍 {zone.location}</p>
                    </div>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '500',
                      backgroundColor: statusColors.bg,
                      color: statusColors.text,
                      textTransform: 'capitalize'
                    }}>
                      {zone.status}
                    </span>
                  </div>

                  {/* Zone Stats */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '16px',
                    marginBottom: '16px'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: '#1e293b'
                      }}>{zone.capacity}</div>
                      <div style={{
                        fontSize: '12px',
                        color: '#64748b'
                      }}>Total Capacity</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: '#10b981'
                      }}>₹{zone.rate}</div>
                      <div style={{
                        fontSize: '12px',
                        color: '#64748b'
                      }}>Per Hour</div>
                    </div>
                  </div>

                  {/* Occupancy Bar */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '8px'
                    }}>
                      <span style={{
                        fontSize: '14px',
                        color: '#64748b'
                      }}>Occupancy</span>
                      <span style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: getOccupancyColor(occupancyPercentage)
                      }}>{occupancyPercentage}%</span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '8px',
                      backgroundColor: '#f1f5f9',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${occupancyPercentage}%`,
                        height: '100%',
                        backgroundColor: getOccupancyColor(occupancyPercentage),
                        borderRadius: '4px',
                        transition: 'width 0.3s ease'
                      }}></div>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginTop: '8px',
                      fontSize: '12px',
                      color: '#64748b'
                    }}>
                      <span>🚗 {zone.occupied} Occupied</span>
                      <span>✅ {zone.capacity - zone.occupied} Available</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{
                    display: 'flex',
                    gap: '8px'
                  }}>
                    <button style={{
                      flex: 1,
                      padding: '8px 16px',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}>View Details</button>
                    <button style={{
                      flex: 1,
                      padding: '8px 16px',
                      backgroundColor: '#f8fafc',
                      color: '#64748b',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}>Edit Zone</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Other Tabs Content */}
      {activeTab !== 'all-zones' && (
        <div style={{
          backgroundColor: 'white',
          padding: '48px 24px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛠️</div>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1e293b',
            margin: '0 0 8px 0'
          }}>Coming Soon</h3>
          <p style={{
            fontSize: '16px',
            color: '#64748b',
            margin: '0'
          }}>This feature is under development</p>
        </div>
      )}
    </div>
  );
};

export default ZoneManagement;