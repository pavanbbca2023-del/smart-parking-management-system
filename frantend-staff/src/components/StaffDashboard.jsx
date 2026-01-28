import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { parkingApi, alertApi } from '../api/api';
import Payment from './Payment';

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    vehiclesEntered: 0,
    vehiclesExited: 0,
    currentOccupancy: 0,
    totalRevenue: 0,
    totalSlots: 0,
    occupiedSlots: 0
  });
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Auto-refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [analyticsRes, coreRes] = await Promise.all([
        parkingApi.getDashboardStats(),
        parkingApi.getZones()
      ]);

      if (analyticsRes.data.success) {
        const d = analyticsRes.data.data;
        setStats({
          vehiclesEntered: d.vehicles_entered,
          vehiclesExited: d.completed_sessions,
          currentOccupancy: Math.round(d.occupancy_rate),
          totalRevenue: d.total_revenue,
          totalSlots: d.total_slots,
          occupiedSlots: d.occupied_slots
        });
      }

      if (coreRes.data.success) {
        setZones(coreRes.data.zones || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentShift = {
    staffName: 'Staff Member',
    staffId: 'STAFF001',
    shiftStart: '6:00 AM',
    shiftEnd: '2:00 PM',
    gate: 'Main Gate'
  };

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading dashboard...</div>;

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#f1f5f9',
      minHeight: '100vh',
      padding: '0'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#1e293b',
        color: 'white',
        padding: '20px 24px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              backgroundImage: 'url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop&crop=center")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '8px',
              border: '2px solid #3b82f6'
            }}></div>
            <div>
              <h1 style={{
                fontSize: '24px',
                fontWeight: '700',
                margin: '0',
                color: 'white'
              }}>Staff Dashboard</h1>
              <p style={{
                fontSize: '14px',
                color: '#94a3b8',
                margin: '4px 0 0 0'
              }}>Welcome back, {currentShift.staffName}</p>
            </div>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#3b82f6',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: '600',
              fontSize: '16px'
            }}>SM</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '24px'
      }}>
        {/* Payment Processing Section */}
        <Payment />

        {/* Zone Status Section */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0',
          marginBottom: '32px'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1e293b',
            margin: '0 0 20px 0'
          }}>🏢 Zone Status</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            {zones.map(zone => {
              const occupancy = zone.current_occupancy || { total_slots: 0, occupied: 0, available: 0 };
              const occRate = occupancy.total_slots > 0 ? (occupancy.occupied / occupancy.total_slots) * 100 : 0;
              return (
                <div key={zone.id} style={{
                  padding: '16px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  textAlign: 'center'
                }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1e293b',
                    margin: '0 0 8px 0'
                  }}>{zone.name}</h3>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: occupancy.available === 0 ? '#dc2626' : '#10b981',
                    marginBottom: '4px'
                  }}>{occupancy.available}</div>
                  <div style={{
                    fontSize: '12px',
                    color: '#64748b',
                    marginBottom: '8px'
                  }}>Available</div>
                  <div style={{
                    width: '100%',
                    height: '6px',
                    backgroundColor: '#f1f5f9',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${occRate}%`,
                      height: '100%',
                      backgroundColor: occRate >= 90 ? '#dc2626' : '#3b82f6',
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: '#64748b',
                    marginTop: '4px'
                  }}>
                    {occupancy.occupied} occupied • {occupancy.reserved || 0} reserved
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#64748b',
              margin: '0 0 16px 0',
              textTransform: 'uppercase'
            }}>Vehicles Entered</h3>
            <div style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#1e293b',
              marginBottom: '8px'
            }}>{stats.vehiclesEntered}</div>
            <p style={{
              fontSize: '14px',
              color: '#10b981',
              margin: '0',
              fontWeight: '500'
            }}>↗ +12% from yesterday</p>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#64748b',
              margin: '0 0 16px 0',
              textTransform: 'uppercase'
            }}>Vehicles Exited</h3>
            <div style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#1e293b',
              marginBottom: '8px'
            }}>{stats.vehiclesExited}</div>
            <p style={{
              fontSize: '14px',
              color: '#10b981',
              margin: '0',
              fontWeight: '500'
            }}>↗ +8% from yesterday</p>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#64748b',
              margin: '0 0 16px 0',
              textTransform: 'uppercase'
            }}>Current Occupancy</h3>
            <div style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#1e293b',
              marginBottom: '8px'
            }}>{stats.occupiedSlots}</div>
            <p style={{
              fontSize: '14px',
              color: stats.currentOccupancy > 90 ? '#dc2626' : '#f59e0b',
              margin: '0',
              fontWeight: '500'
            }}>⚡ {stats.currentOccupancy}% capacity</p>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#64748b',
              margin: '0 0 16px 0',
              textTransform: 'uppercase'
            }}>Revenue Today</h3>
            <div style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#1e293b',
              marginBottom: '8px'
            }}>₹{stats.totalRevenue.toLocaleString()}</div>
            <p style={{
              fontSize: '14px',
              color: '#10b981',
              margin: '0',
              fontWeight: '500'
            }}>↗ +15% from yesterday</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1e293b',
            margin: '0 0 20px 0'
          }}>Quick Actions</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            <button
              onClick={() => navigate('/gate-control', { state: { mode: 'entry' } })}
              style={{
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                padding: '16px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                borderRadius: '8px'
              }}
            >
              🚗 Vehicle Entry
            </button>
            <button
              onClick={() => navigate('/gate-control', { state: { mode: 'exit' } })}
              style={{
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                padding: '16px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                borderRadius: '8px'
              }}
            >
              🏁 Vehicle Exit
            </button>
            <button
              onClick={() => navigate('/payments-mgmt')}
              style={{
                backgroundColor: '#8b5cf6',
                color: 'white',
                border: 'none',
                padding: '16px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Payment Management
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StaffDashboard;
