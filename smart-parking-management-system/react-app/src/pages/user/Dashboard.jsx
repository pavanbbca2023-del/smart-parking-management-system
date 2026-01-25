import React from 'react';

const Dashboard = () => {
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
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div>
              <p style={{fontSize: '14px', color: '#64748b', margin: '0 0 8px 0', fontWeight: '500'}}>
                Today's Bookings
              </p>
              <p style={{fontSize: '32px', fontWeight: '700', color: '#2563eb', margin: '0'}}>
                127
              </p>
              <p style={{fontSize: '12px', color: '#059669', margin: '4px 0 0 0'}}>
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
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div>
              <p style={{fontSize: '14px', color: '#64748b', margin: '0 0 8px 0', fontWeight: '500'}}>
                Current Revenue
              </p>
              <p style={{fontSize: '32px', fontWeight: '700', color: '#059669', margin: '0'}}>
                ₹18,450
              </p>
              <p style={{fontSize: '12px', color: '#059669', margin: '4px 0 0 0'}}>
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
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div>
              <p style={{fontSize: '14px', color: '#64748b', margin: '0 0 8px 0', fontWeight: '500'}}>
                Active Sessions
              </p>
              <p style={{fontSize: '32px', fontWeight: '700', color: '#dc2626', margin: '0'}}>
                89
              </p>
              <p style={{fontSize: '12px', color: '#64748b', margin: '4px 0 0 0'}}>
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
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div>
              <p style={{fontSize: '14px', color: '#64748b', margin: '0 0 8px 0', fontWeight: '500'}}>
                Total Users
              </p>
              <p style={{fontSize: '32px', fontWeight: '700', color: '#7c3aed', margin: '0'}}>
                2,847
              </p>
              <p style={{fontSize: '12px', color: '#059669', margin: '4px 0 0 0'}}>
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
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div>
              <p style={{fontSize: '14px', color: '#64748b', margin: '0 0 8px 0', fontWeight: '500'}}>
                Occupancy Rate
              </p>
              <p style={{fontSize: '32px', fontWeight: '700', color: '#ea580c', margin: '0'}}>
                73%
              </p>
              <p style={{fontSize: '12px', color: '#64748b', margin: '4px 0 0 0'}}>
                365/500 spots occupied
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

        {/* Zone Availability */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div>
              <p style={{fontSize: '14px', color: '#64748b', margin: '0 0 8px 0', fontWeight: '500'}}>
                Zone Availability
              </p>
              <p style={{fontSize: '32px', fontWeight: '700', color: '#0891b2', margin: '0'}}>
                4/6
              </p>
              <p style={{fontSize: '12px', color: '#64748b', margin: '4px 0 0 0'}}>
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
      <div style={{marginTop: '32px'}}>
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
          
          {/* Zone A - High Occupancy */}
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '3px solid #dc2626',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              width: '12px',
              height: '12px',
              backgroundColor: '#dc2626',
              borderRadius: '50%'
            }}></div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1e293b',
              margin: '0 0 8px 0'
            }}>Zone A - Premium</h3>
            <p style={{
              fontSize: '14px',
              color: '#059669',
              fontWeight: '600',
              margin: '0 0 16px 0'
            }}>₹50/hour</p>
            <div style={{marginBottom: '16px'}}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px'
              }}>
                <span style={{fontSize: '14px', color: '#64748b'}}>Available: 8</span>
                <span style={{fontSize: '14px', color: '#64748b'}}>Occupied: 42</span>
              </div>
              <div style={{
                width: '100%',
                height: '8px',
                backgroundColor: '#f1f5f9',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: '84%',
                  height: '100%',
                  backgroundColor: '#dc2626',
                  borderRadius: '4px'
                }}></div>
              </div>
              <p style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#dc2626',
                margin: '8px 0 0 0'
              }}>84% Occupied</p>
            </div>
            <button style={{
              width: '100%',
              padding: '8px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}>Quick View</button>
          </div>

          {/* Zone B - Medium Occupancy */}
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '3px solid #f59e0b',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              width: '12px',
              height: '12px',
              backgroundColor: '#f59e0b',
              borderRadius: '50%'
            }}></div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1e293b',
              margin: '0 0 8px 0'
            }}>Zone B - Standard</h3>
            <p style={{
              fontSize: '14px',
              color: '#059669',
              fontWeight: '600',
              margin: '0 0 16px 0'
            }}>₹30/hour</p>
            <div style={{marginBottom: '16px'}}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px'
              }}>
                <span style={{fontSize: '14px', color: '#64748b'}}>Available: 18</span>
                <span style={{fontSize: '14px', color: '#64748b'}}>Occupied: 22</span>
              </div>
              <div style={{
                width: '100%',
                height: '8px',
                backgroundColor: '#f1f5f9',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: '55%',
                  height: '100%',
                  backgroundColor: '#f59e0b',
                  borderRadius: '4px'
                }}></div>
              </div>
              <p style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#f59e0b',
                margin: '8px 0 0 0'
              }}>55% Occupied</p>
            </div>
            <button style={{
              width: '100%',
              padding: '8px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}>Quick View</button>
          </div>

          {/* Zone C - Low Occupancy */}
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '3px solid #059669',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              width: '12px',
              height: '12px',
              backgroundColor: '#059669',
              borderRadius: '50%'
            }}></div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1e293b',
              margin: '0 0 8px 0'
            }}>Zone C - Economy</h3>
            <p style={{
              fontSize: '14px',
              color: '#059669',
              fontWeight: '600',
              margin: '0 0 16px 0'
            }}>₹20/hour</p>
            <div style={{marginBottom: '16px'}}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px'
              }}>
                <span style={{fontSize: '14px', color: '#64748b'}}>Available: 28</span>
                <span style={{fontSize: '14px', color: '#64748b'}}>Occupied: 12</span>
              </div>
              <div style={{
                width: '100%',
                height: '8px',
                backgroundColor: '#f1f5f9',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: '30%',
                  height: '100%',
                  backgroundColor: '#059669',
                  borderRadius: '4px'
                }}></div>
              </div>
              <p style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#059669',
                margin: '8px 0 0 0'
              }}>30% Occupied</p>
            </div>
            <button style={{
              width: '100%',
              padding: '8px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}>Quick View</button>
          </div>

          {/* Zone D - Very Low Occupancy */}
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '3px solid #10b981',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              width: '12px',
              height: '12px',
              backgroundColor: '#10b981',
              borderRadius: '50%'
            }}></div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1e293b',
              margin: '0 0 8px 0'
            }}>Zone D - Basic</h3>
            <p style={{
              fontSize: '14px',
              color: '#059669',
              fontWeight: '600',
              margin: '0 0 16px 0'
            }}>₹15/hour</p>
            <div style={{marginBottom: '16px'}}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px'
              }}>
                <span style={{fontSize: '14px', color: '#64748b'}}>Available: 35</span>
                <span style={{fontSize: '14px', color: '#64748b'}}>Occupied: 5</span>
              </div>
              <div style={{
                width: '100%',
                height: '8px',
                backgroundColor: '#f1f5f9',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: '12%',
                  height: '100%',
                  backgroundColor: '#10b981',
                  borderRadius: '4px'
                }}></div>
              </div>
              <p style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#10b981',
                margin: '8px 0 0 0'
              }}>12% Occupied</p>
            </div>
            <button style={{
              width: '100%',
              padding: '8px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}>Quick View</button>
          </div>

        </div>
      </div>

      {/* Quick Actions Panel */}
      <div style={{marginTop: '32px'}}>
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
      <div style={{marginTop: '32px'}}>
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
      <div style={{marginTop: '32px'}}>
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
              <tr style={{backgroundColor: '#f8fafc'}}>
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
              <tr style={{borderBottom: '1px solid #f3f4f6'}}>
                <td style={{padding: '16px', fontSize: '14px', color: '#1f2937'}}>MH12AB1234</td>
                <td style={{padding: '16px', fontSize: '14px', color: '#1f2937'}}>Zone A / Slot 15</td>
                <td style={{padding: '16px', fontSize: '14px', color: '#1f2937'}}>2h 35m</td>
                <td style={{padding: '16px'}}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '500',
                    backgroundColor: '#dcfce7',
                    color: '#166534'
                  }}>Paid</span>
                </td>
                <td style={{padding: '16px', textAlign: 'center'}}>
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
              <tr style={{borderBottom: '1px solid #f3f4f6'}}>
                <td style={{padding: '16px', fontSize: '14px', color: '#1f2937'}}>DL08CD5678</td>
                <td style={{padding: '16px', fontSize: '14px', color: '#1f2937'}}>Zone B / Slot 7</td>
                <td style={{padding: '16px', fontSize: '14px', color: '#1f2937'}}>1h 12m</td>
                <td style={{padding: '16px'}}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '500',
                    backgroundColor: '#fef3c7',
                    color: '#92400e'
                  }}>Pending</span>
                </td>
                <td style={{padding: '16px', textAlign: 'center'}}>
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
              <tr style={{borderBottom: '1px solid #f3f4f6'}}>
                <td style={{padding: '16px', fontSize: '14px', color: '#1f2937'}}>KA03EF9012</td>
                <td style={{padding: '16px', fontSize: '14px', color: '#1f2937'}}>Zone C / Slot 22</td>
                <td style={{padding: '16px', fontSize: '14px', color: '#1f2937'}}>45m</td>
                <td style={{padding: '16px'}}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '500',
                    backgroundColor: '#dcfce7',
                    color: '#166534'
                  }}>Paid</span>
                </td>
                <td style={{padding: '16px', textAlign: 'center'}}>
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
              <tr style={{borderBottom: '1px solid #f3f4f6'}}>
                <td style={{padding: '16px', fontSize: '14px', color: '#1f2937'}}>UP16GH3456</td>
                <td style={{padding: '16px', fontSize: '14px', color: '#1f2937'}}>Zone A / Slot 3</td>
                <td style={{padding: '16px', fontSize: '14px', color: '#1f2937'}}>3h 18m</td>
                <td style={{padding: '16px'}}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '500',
                    backgroundColor: '#fee2e2',
                    color: '#991b1b'
                  }}>Overdue</span>
                </td>
                <td style={{padding: '16px', textAlign: 'center'}}>
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
              <tr>
                <td style={{padding: '16px', fontSize: '14px', color: '#1f2937'}}>TN09IJ7890</td>
                <td style={{padding: '16px', fontSize: '14px', color: '#1f2937'}}>Zone D / Slot 11</td>
                <td style={{padding: '16px', fontSize: '14px', color: '#1f2937'}}>25m</td>
                <td style={{padding: '16px'}}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '500',
                    backgroundColor: '#dcfce7',
                    color: '#166534'
                  }}>Paid</span>
                </td>
                <td style={{padding: '16px', textAlign: 'center'}}>
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
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;