import React, { useState, useEffect } from 'react';
import apiService from '../../services/apiService';

const ZoneManagement = () => {
  const [activeTab, setActiveTab] = useState('all-zones');
  const [showAddForm, setShowAddForm] = useState(false);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newZone, setNewZone] = useState({ name: '', capacity: '', rate: '', location: '' });

  useEffect(() => {
    fetchZones();
  }, []);

  const fetchZones = async () => {
    try {
      setLoading(true);
      const data = await apiService.adminGetAllZones();
      setZones(Array.isArray(data) ? data : (data.zones || []));
      setError(null);
    } catch (error) {
      console.error('Error fetching zones:', error);
      setError(`Failed to load zones: ${error.message}. Check if backend is running on port 8000.`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateZone = async () => {
    if (newZone.name && newZone.capacity && newZone.rate) {
      try {
        await apiService.adminCreateZone({
          name: newZone.name,
          hourly_rate: newZone.rate,
          capacity: parseInt(newZone.capacity)
        });
        alert('✅ Zone created successfully!');
        setNewZone({ name: '', capacity: '', rate: '', location: '' });
        fetchZones();
        setActiveTab('all-zones');
      } catch (error) {
        console.error('Error creating zone:', error);
        alert('❌ Failed to create zone');
      }
    } else {
      alert('⚠️ Please fill all fields');
    }
  };

  const handleDeleteZone = async (zoneId) => {
    if (confirm('Are you sure you want to delete this zone?')) {
      try {
        await apiService.adminDeleteZone(zoneId);
        alert('✅ Zone deleted successfully!');
        fetchZones();
      } catch (error) {
        console.error('Error deleting zone:', error);
        alert('❌ Failed to delete zone');
      }
    }
  };

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
        {error && (
          <div style={{
            padding: '12px 20px',
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            borderRadius: '8px',
            border: '1px solid #fecaca',
            fontSize: '14px',
            fontWeight: '500',
            textAlign: 'center'
          }}>
            ⚠️ {error}
          </div>
        )}
        <button
          onClick={() => setActiveTab('add-zone')}
          style={{
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
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b' }}>{zones.length}</div>
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
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b' }}>
                {zones.reduce((acc, z) => acc + z.current_occupancy.total_slots, 0)}
              </div>
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
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#dc2626' }}>
                {zones.reduce((acc, z) => acc + z.current_occupancy.occupied, 0)}
              </div>
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
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>
                {zones.reduce((acc, z) => acc + z.current_occupancy.available, 0)}
              </div>
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
              const { total_slots, occupied, available } = zone.current_occupancy;
              const occupancyPercentage = total_slots > 0 ? Math.round((occupied / total_slots) * 100) : 0;
              const statusLabel = zone.is_active ? 'active' : 'inactive';
              const statusColors = getStatusBadge(statusLabel);

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
                      }}>📍 {zone.location || 'Parking Area'}</p>
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
                      {statusLabel}
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
                      }}>{total_slots}</div>
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
                      }}>₹{zone.hourly_rate}</div>
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
                      <span>🚗 {occupied} Occupied</span>
                      <span>✅ {available} Available</span>
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
                    <button
                      onClick={() => handleDeleteZone(zone.id)}
                      style={{
                        flex: 1,
                        padding: '8px 16px',
                        backgroundColor: '#fee2e2',
                        color: '#991b1b',
                        border: '1px solid #fecaca',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}>Delete Zone</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Zone Tab */}
      {activeTab === 'add-zone' && (
        <div style={{
          backgroundColor: 'white',
          padding: '32px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#1e293b',
            marginBottom: '24px'
          }}>
            ➕ Add New Parking Zone
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px',
            marginBottom: '24px'
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>Zone Name</label>
              <input
                type="text"
                placeholder="e.g., Zone E - VIP"
                value={newZone.name}
                onChange={(e) => setNewZone({ ...newZone, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>Capacity (Total Slots)</label>
              <input
                type="number"
                placeholder="e.g., 30"
                value={newZone.capacity}
                onChange={(e) => setNewZone({ ...newZone, capacity: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>Hourly Rate (₹)</label>
              <input
                type="number"
                placeholder="e.g., 25"
                value={newZone.rate}
                onChange={(e) => setNewZone({ ...newZone, rate: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>Location</label>
              <input
                type="text"
                placeholder="e.g., North Wing"
                value={newZone.location}
                onChange={(e) => setNewZone({ ...newZone, location: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleCreateZone}
              style={{
                padding: '12px 24px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              ✅ Create Zone
            </button>
            <button
              onClick={() => {
                setNewZone({ name: '', capacity: '', rate: '', location: '' });
                setActiveTab('all-zones');
              }}
              style={{
                padding: '12px 24px',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              ❌ Cancel
            </button>
          </div>
        </div>
      )}

      {/* Zone Mapping Tab */}
      {activeTab === 'zone-mapping' && (
        <div style={{
          backgroundColor: 'white',
          padding: '32px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#1e293b',
            marginBottom: '24px'
          }}>
            📍 Zone Layout & Mapping
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px',
            marginBottom: '24px'
          }}>
            {zones.map(zone => (
              <div key={zone.id} style={{
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
                backgroundColor: zone.status === 'active' ? '#f0fdf4' : '#fef3c7'
              }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1e293b',
                  marginBottom: '12px'
                }}>{zone.name}</h3>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 1fr)',
                  gap: '4px',
                  marginBottom: '12px'
                }}>
                  {Array.from({ length: Math.min(zone.capacity, 25) }, (_, i) => (
                    <div key={i} style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: i < zone.occupied ? '#dc2626' : '#10b981',
                      borderRadius: '4px',
                      fontSize: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: '500'
                    }}>
                      {i + 1}
                    </div>
                  ))}
                </div>

                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  🔴 Occupied: {zone.occupied} | 🟢 Available: {zone.capacity - zone.occupied}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            padding: '20px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '16px',
                height: '16px',
                backgroundColor: '#dc2626',
                borderRadius: '4px'
              }}></div>
              <span style={{ fontSize: '14px', color: '#374151' }}>Occupied</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '16px',
                height: '16px',
                backgroundColor: '#10b981',
                borderRadius: '4px'
              }}></div>
              <span style={{ fontSize: '14px', color: '#374151' }}>Available</span>
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div style={{
          backgroundColor: 'white',
          padding: '32px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#1e293b',
            marginBottom: '24px'
          }}>
            ⚙️ Zone Settings
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            <div style={{
              padding: '24px',
              border: '1px solid #e2e8f0',
              borderRadius: '12px'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '16px'
              }}>
                🕰️ Operating Hours
              </h3>
              <div style={{ marginBottom: '12px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  color: '#374151',
                  marginBottom: '4px'
                }}>Opening Time</label>
                <input
                  type="time"
                  defaultValue="06:00"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px'
                  }}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  color: '#374151',
                  marginBottom: '4px'
                }}>Closing Time</label>
                <input
                  type="time"
                  defaultValue="22:00"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px'
                  }}
                />
              </div>
              <button style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer'
              }}>
                Update Hours
              </button>
            </div>

            <div style={{
              padding: '24px',
              border: '1px solid #e2e8f0',
              borderRadius: '12px'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '16px'
              }}>
                💰 Default Pricing
              </h3>
              <div style={{ marginBottom: '12px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  color: '#374151',
                  marginBottom: '4px'
                }}>Base Rate (₹/hour)</label>
                <input
                  type="number"
                  defaultValue="20"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px'
                  }}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  color: '#374151',
                  marginBottom: '4px'
                }}>Peak Hour Multiplier</label>
                <select style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px'
                }}>
                  <option value="1.0">1.0x (No change)</option>
                  <option value="1.5">1.5x (+50%)</option>
                  <option value="2.0">2.0x (+100%)</option>
                </select>
              </div>
              <button style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer'
              }}>
                Update Pricing
              </button>
            </div>

            <div style={{
              padding: '24px',
              border: '1px solid #e2e8f0',
              borderRadius: '12px'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '16px'
              }}>
                🚨 Notifications
              </h3>
              <div style={{ marginBottom: '12px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  color: '#374151'
                }}>
                  <input type="checkbox" defaultChecked />
                  Zone full alerts
                </label>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  color: '#374151'
                }}>
                  <input type="checkbox" defaultChecked />
                  Maintenance reminders
                </label>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  color: '#374151'
                }}>
                  <input type="checkbox" />
                  Revenue reports
                </label>
              </div>
              <button style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer'
              }}>
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZoneManagement;