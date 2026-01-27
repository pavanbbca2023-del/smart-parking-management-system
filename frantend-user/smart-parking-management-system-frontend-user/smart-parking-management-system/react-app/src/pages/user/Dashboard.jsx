import React, { useState, useEffect } from 'react';
import { analyticsApi } from '../../api/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_bookings: 0,
    total_revenue: 0,
    available_slots: 0,
    reserved_slots: 0,
    total_zones: 0,
    occupancy_rate: 0,
    active_count: 0,
    total_users: 0
  });
  const [zones, setZones] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [summaryRes, zonesRes, sessionsRes] = await Promise.all([
          analyticsApi.getDashboardSummary(),
          analyticsApi.getZoneAnalytics(),
          analyticsApi.getActiveSessions()
        ]);

        if (summaryRes.data && summaryRes.data.data) {
          const d = summaryRes.data.data;
          setStats({
            ...d,
            // available_slots is already calculated by the backend including reservations
            available_slots: d.available_slots
          });
        }

        if (zonesRes.data && zonesRes.data.data) {
          setZones(zonesRes.data.data);
        }

        if (sessionsRes.data && sessionsRes.data.data) {
          setSessions(sessionsRes.data.data);
        }

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div style={{ padding: '24px' }}>Loading Dashboard...</div>;
  return (
    <div style={{
      padding: '24px',
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
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
          Your parking overview & quick stats
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px'
      }}>

        {/* Today's Bookings */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 8px 0', fontWeight: '500' }}>
                Today's Bookings
              </p>
              <p style={{ fontSize: '32px', fontWeight: '700', color: '#2563eb', margin: '0' }}>
                {stats.total_bookings}
              </p>
              <p style={{ fontSize: '12px', color: '#059669', margin: '4px 0 0 0' }}>
                +12% from yesterday
              </p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#dbeafe',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              📅
            </div>
          </div>
        </div>

        {/* Current Revenue */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 8px 0', fontWeight: '500' }}>
                Current Revenue
              </p>
              <p style={{ fontSize: '32px', fontWeight: '700', color: '#059669', margin: '0' }}>
                ₹{stats.total_revenue}
              </p>
              <p style={{ fontSize: '12px', color: '#059669', margin: '4px 0 0 0' }}>
                +8% from last week
              </p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#d1fae5',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              💰
            </div>
          </div>
        </div>

        {/* Active Sessions */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 8px 0', fontWeight: '500' }}>
                Active Sessions
              </p>
              <p style={{ fontSize: '32px', fontWeight: '700', color: '#dc2626', margin: '0' }}>
                {stats.active_count}
              </p>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
                Currently parked
              </p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#fee2e2',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              🚗
            </div>
          </div>
        </div>

        {/* Total Users */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 8px 0', fontWeight: '500' }}>
                Total Users
              </p>
              <p style={{ fontSize: '32px', fontWeight: '700', color: '#7c3aed', margin: '0' }}>
                {stats.total_users || 0}
              </p>
              <p style={{ fontSize: '12px', color: '#059669', margin: '4px 0 0 0' }}>
                +23 new this week
              </p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#ede9fe',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              👥
            </div>
          </div>
        </div>

        {/* Occupancy Rate */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 8px 0', fontWeight: '500' }}>
                Occupancy Rate
              </p>
              <p style={{ fontSize: '32px', fontWeight: '700', color: '#ea580c', margin: '0' }}>
                {stats.occupancy_rate}%
              </p>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
                Spots Occupied
              </p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#fed7aa',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              📊
            </div>
          </div>
        </div>

        {/* Reserved Slots */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 8px 0', fontWeight: '500' }}>
                Reserved Slots
              </p>
              <p style={{ fontSize: '32px', fontWeight: '700', color: '#f59e0b', margin: '0' }}>
                {stats.reserved_slots}
              </p>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
                Booked but not entered
              </p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#fef3c7',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              🔒
            </div>
          </div>
        </div>

        {/* Zone Availability */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 8px 0', fontWeight: '500' }}>
                Zone Availability
              </p>
              <p style={{ fontSize: '32px', fontWeight: '700', color: '#0891b2', margin: '0' }}>
                4/6
              </p>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
                Zones with free spots
              </p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#cffafe',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              🏢
            </div>
          </div>
        </div>

      </div>

      {/* Zone Status Overview */}
      <div style={{ marginTop: '32px' }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#1e293b',
          margin: '0 0 24px 0'
        }}>
          📊 Zone Status Overview
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {zones.map(zone => (
            <div key={zone.zone_name} style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: `3px solid ${zone.occupancy_percentage > 80 ? '#dc2626' : zone.occupancy_percentage > 50 ? '#f59e0b' : '#059669'}`,
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                width: '12px',
                height: '12px',
                backgroundColor: zone.occupancy_percentage > 80 ? '#dc2626' : zone.occupancy_percentage > 50 ? '#f59e0b' : '#059669',
                borderRadius: '50%'
              }}></div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1e293b',
                margin: '0 0 8px 0'
              }}>{zone.zone_name}</h3>
              <p style={{
                fontSize: '14px',
                color: '#059669',
                fontWeight: '600',
                margin: '0 0 16px 0'
              }}>Total: {zone.total_slots}</p>
              <div style={{ marginBottom: '16px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}>
                  <span style={{ fontSize: '14px', color: '#64748b' }}>Available: {zone.total_slots - zone.occupied_slots}</span>
                  <span style={{ fontSize: '14px', color: '#64748b' }}>Occupied: {zone.occupied_slots}</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: '#f1f5f9',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${zone.occupancy_percentage}%`,
                    height: '100%',
                    backgroundColor: zone.occupancy_percentage > 80 ? '#dc2626' : zone.occupancy_percentage > 50 ? '#f59e0b' : '#059669',
                    borderRadius: '4px'
                  }}></div>
                </div>
                <p style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: zone.occupancy_percentage > 80 ? '#dc2626' : zone.occupancy_percentage > 50 ? '#f59e0b' : '#059669',
                  margin: '8px 0 0 0'
                }}>{zone.occupancy_percentage}% Occupied</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div style={{ marginTop: '32px' }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#1e293b',
          margin: '0 0 24px 0'
        }}>
          📱 Quick Actions Panel
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px'
        }}>

          {/* Create New Zone */}
          <button style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#dbeafe',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>🏗️</div>
            <div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#1e293b',
                margin: '0 0 4px 0'
              }}>Create New Zone</h3>
              <p style={{
                fontSize: '12px',
                color: '#64748b',
                margin: '0'
              }}>Add new parking zones</p>
            </div>
          </button>

          {/* Add Staff User */}
          <button style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#d1fae5',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>👤</div>
            <div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#1e293b',
                margin: '0 0 4px 0'
              }}>Add Staff User</h3>
              <p style={{
                fontSize: '12px',
                color: '#64748b',
                margin: '0'
              }}>Create staff accounts</p>
            </div>
          </button>

          {/* Generate Report */}
          <button style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#ede9fe',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>📊</div>
            <div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#1e293b',
                margin: '0 0 4px 0'
              }}>Generate Report</h3>
              <p style={{
                fontSize: '12px',
                color: '#64748b',
                margin: '0'
              }}>Create analytics reports</p>
            </div>
          </button>

          {/* System Settings */}
          <button style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#fed7aa',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>⚙️</div>
            <div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#1e293b',
                margin: '0 0 4px 0'
              }}>System Settings</h3>
              <p style={{
                fontSize: '12px',
                color: '#64748b',
                margin: '0'
              }}>Configure system options</p>
            </div>
          </button>

          {/* Send Notification */}
          <button style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#cffafe',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>🔔</div>
            <div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#1e293b',
                margin: '0 0 4px 0'
              }}>Send Notification</h3>
              <p style={{
                fontSize: '12px',
                color: '#64748b',
                margin: '0'
              }}>Broadcast messages</p>
            </div>
          </button>

        </div>
      </div>

      {/* Revenue Charts Section */}
      <div style={{ marginTop: '32px' }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#1e293b',
          margin: '0 0 24px 0'
        }}>
          📈 Revenue Analytics
        </h2>

        {/* Charts Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '24px'
        }}>

          {/* Daily Revenue Chart */}
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1e293b',
              margin: '0 0 16px 0'
            }}>
              📊 Daily Revenue (Line Chart)
            </h3>
            <div style={{
              height: '250px',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b',
              fontSize: '14px',
              border: '2px dashed #e2e8f0'
            }}>
              📈 Line chart showing daily revenue trends over the last 30 days
            </div>
          </div>

          {/* Zone-wise Revenue Chart */}
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1e293b',
              margin: '0 0 16px 0'
            }}>
              📊 Zone-wise Revenue (Bar Chart)
            </h3>
            <div style={{
              height: '250px',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b',
              fontSize: '14px',
              border: '2px dashed #e2e8f0'
            }}>
              📊 Bar chart comparing revenue across different parking zones
            </div>
          </div>

          {/* Payment Method Distribution Chart */}
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1e293b',
              margin: '0 0 16px 0'
            }}>
              🥧 Payment Method Distribution (Pie Chart)
            </h3>
            <div style={{
              height: '250px',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b',
              fontSize: '14px',
              border: '2px dashed #e2e8f0'
            }}>
              🥧 Pie chart showing payment methods: UPI, Card, Cash, Wallet
            </div>
          </div>

          {/* Occupancy Trends Chart */}
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1e293b',
              margin: '0 0 16px 0'
            }}>
              📈 Occupancy Trends (Area Chart)
            </h3>
            <div style={{
              height: '250px',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b',
              fontSize: '14px',
              border: '2px dashed #e2e8f0'
            }}>
              📈 Area chart displaying parking occupancy patterns throughout the day
            </div>
          </div>

        </div>
      </div>

      {/* Live Parking Sessions Table */}
      <div style={{ marginTop: '32px' }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#1e293b',
          margin: '0 0 24px 0'
        }}>
          🚗 Live Parking Sessions
        </h2>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <th style={{
                  padding: '16px',
                  textAlign: 'left',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  borderBottom: '1px solid #e5e7eb'
                }}>Vehicle Number</th>
                <th style={{
                  padding: '16px',
                  textAlign: 'left',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  borderBottom: '1px solid #e5e7eb'
                }}>Zone/Slot</th>
                <th style={{
                  padding: '16px',
                  textAlign: 'left',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  borderBottom: '1px solid #e5e7eb'
                }}>Duration</th>
                <th style={{
                  padding: '16px',
                  textAlign: 'left',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  borderBottom: '1px solid #e5e7eb'
                }}>Payment Status</th>
                <th style={{
                  padding: '16px',
                  textAlign: 'center',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  borderBottom: '1px solid #e5e7eb'
                }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessions.length > 0 ? sessions.map(session => {
                const duration = session.duration || '0m';
                const isOverdue = session.payment_status === 'overdue' || (session.status === 'reserved' && false); // Future logic

                return (
                  <tr key={session.session_id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#1f2937' }}>{session.vehicle_number}</td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#1f2937' }}>{session.zone_name}</td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#1f2937' }}>{duration}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500',
                        backgroundColor: session.status === 'reserved' ? '#ebf5ff' : (session.payment_status === 'paid' ? '#dcfce7' : '#fef3c7'),
                        color: session.status === 'reserved' ? '#1e40af' : (session.payment_status === 'paid' ? '#166534' : '#92400e')
                      }}>{session.status === 'reserved' ? 'Reserved' : (session.payment_status.charAt(0).toUpperCase() + session.payment_status.slice(1))}</span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <button style={{
                        padding: '6px 12px',
                        marginRight: '8px',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}>View</button>
                      <button style={{
                        padding: '6px 12px',
                        backgroundColor: '#f59e0b',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}>Edit</button>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                    No active or reserved parking sessions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;