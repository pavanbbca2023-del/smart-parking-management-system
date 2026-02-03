import React, { useState, useEffect } from 'react';
import { 
  Home, Users, Building, DollarSign, Car, UserCheck, 
  RefreshCw, Calendar, TrendingUp, BarChart3, Settings,
  Bell, Plus, FileText, Eye, Edit, AlertCircle
} from 'lucide-react';
import apiService from '../../services/apiService';

const AdminDashboard = ({ onPageChange }) => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    todayBookings: 0,
    currentRevenue: 0,
    activeSessions: 0,
    totalUsers: 0,
    occupancyRate: 0,
    zoneAvailability: 0,
    zones: [],
    sessions: []
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch analytics data
      const analyticsRes = await apiService.getAnalyticsDashboard();
      const analytics = analyticsRes.data || analyticsRes || {};
      
      // Fetch zones data
      const zonesRes = await apiService.adminGetAllZones();
      const zones = Array.isArray(zonesRes) ? zonesRes : zonesRes.data || [];
      
      // Fetch sessions data with zone details
      const sessionsRes = await apiService.getSessions();
      const allSessions = sessionsRes.sessions || sessionsRes.data || [];
      
      // Calculate today's bookings
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayBookings = allSessions.filter(session => {
        const sessionDate = new Date(session.entry_time || session.created_at);
        return sessionDate >= today;
      }).length;
      
      // Calculate today's revenue
      const todayRevenue = allSessions
        .filter(session => {
          const sessionDate = new Date(session.entry_time || session.created_at);
          return sessionDate >= today && session.payment_status === 'paid';
        })
        .reduce((sum, session) => sum + (parseFloat(session.total_amount_paid) || parseFloat(session.initial_amount_paid) || 0), 0);
      
      // Get active sessions with proper zone/slot mapping
      const activeSessions = allSessions.filter(s => s.status === 'active');
      
      // Map sessions with zone names
      const sessionsWithZones = activeSessions.map(session => {
        const zone = zones.find(z => z.id === session.zone_id || z.id === session.zone);
        return {
          ...session,
          zoneName: zone ? zone.name : `Zone ${session.zone_id || session.zone || 'Unknown'}`,
          slotNumber: session.slot?.slot_number || session.slot_number || 'N/A'
        };
      });
      
      // Calculate metrics
      const totalSlots = zones.reduce((sum, zone) => sum + (zone.total_slots || 0), 0);
      const occupiedSlots = zones.reduce((sum, zone) => sum + (zone.occupied_slots || 0), 0);
      const reservedSlots = zones.reduce((sum, zone) => sum + (zone.reserved_slots || 0), 0);
      const occupancyRate = totalSlots > 0 ? Math.round((occupiedSlots / totalSlots) * 100) : 0;
      const availableZones = zones.filter(zone => (zone.total_slots - zone.occupied_slots) > 0).length;
      const vehiclesReserved = allSessions.filter(s => s.status === 'reserved' || s.status === 'pending_payment').length;
      
      setDashboardData({
        todayBookings: todayBookings,
        currentRevenue: Math.round(todayRevenue),
        activeSessions: activeSessions.length,
        totalUsers: analytics.total_users || allSessions.length || 0,
        occupancyRate: occupancyRate,
        zoneAvailability: availableZones,
        vehiclesReserved: vehiclesReserved,
        totalZones: zones.length,
        zones: zones.map(zone => ({
          ...zone,
          displayName: zone.name || `Zone ${zone.id}`,
          available: (zone.total_slots || 0) - (zone.occupied_slots || 0),
          occupied: zone.occupied_slots || 0,
          occupancyPercent: zone.total_slots > 0 ? Math.round((zone.occupied_slots / zone.total_slots) * 100) : 0
        })),
        sessions: sessionsWithZones.slice(0, 5)
      });
      
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const formatDuration = (entryTime) => {
    const now = new Date();
    const entry = new Date(entryTime);
    const diff = now - entry;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <div style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>
            📊 Admin Dashboard
          </h1>
          <p style={{ color: '#64748b', fontSize: '16px' }}>Real-time parking management overview</p>
        </div>
        <button 
          onClick={fetchDashboardData}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px',
            backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px',
            fontSize: '14px', fontWeight: '600', cursor: 'pointer'
          }}
        >
          <RefreshCw size={16} /> 🔄 Refresh Data
        </button>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '20px', marginBottom: '32px' }}>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Calendar size={20} color="#3b82f6" />
            <span style={{ fontSize: '14px', color: '#64748b' }}>Today's Bookings</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b' }}>{dashboardData.todayBookings}</div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>Since midnight</div>
          <div style={{ fontSize: '20px', marginTop: '4px' }}>📅</div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <DollarSign size={20} color="#10b981" />
            <span style={{ fontSize: '14px', color: '#64748b' }}>Current Revenue</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b' }}>₹{dashboardData.currentRevenue}</div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            {dashboardData.currentRevenue > 0 ? 'Today\'s earnings' : 'No revenue yet today'}
          </div>
          <div style={{ fontSize: '20px', marginTop: '4px' }}>💰</div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Car size={20} color="#8b5cf6" />
            <span style={{ fontSize: '14px', color: '#64748b' }}>Active Sessions</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b' }}>{dashboardData.activeSessions}</div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>Currently parked</div>
          <div style={{ fontSize: '20px', marginTop: '4px' }}>🚗</div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Users size={20} color="#f59e0b" />
            <span style={{ fontSize: '14px', color: '#64748b' }}>Total Users</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b' }}>{dashboardData.totalUsers}</div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>+0 new this week</div>
          <div style={{ fontSize: '20px', marginTop: '4px' }}>👥</div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <BarChart3 size={20} color="#ef4444" />
            <span style={{ fontSize: '14px', color: '#64748b' }}>Occupancy Rate</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b' }}>{dashboardData.occupancyRate}%</div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            {dashboardData.activeSessions}/{dashboardData.zones.reduce((sum, z) => sum + z.total_slots, 0)} spots occupied
          </div>
          <div style={{ fontSize: '20px', marginTop: '4px' }}>📊</div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Building size={20} color="#06b6d4" />
            <span style={{ fontSize: '14px', color: '#64748b' }}>Vehicles Reserved</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b' }}>{dashboardData.vehiclesReserved || 0}</div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>Booked but not entered</div>
          <div style={{ fontSize: '20px', marginTop: '4px' }}>🔒</div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Building size={20} color="#06b6d4" />
            <span style={{ fontSize: '14px', color: '#64748b' }}>Zone Availability</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b' }}>
            {dashboardData.zoneAvailability}/{dashboardData.totalZones}
          </div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>Zones with free spots</div>
          <div style={{ fontSize: '20px', marginTop: '4px' }}>🏢</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
        {/* Zone Status */}
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', color: '#1e293b' }}>
            📊 Zone Status Overview
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {dashboardData.zones.map((zone, index) => (
              <div key={index} style={{
                border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px',
                backgroundColor: '#f8fafc'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>{zone.displayName}</h3>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>₹{zone.base_price || zone.hourly_rate}/hour</span>
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ fontSize: '14px', color: '#64748b' }}>Available: {zone.available}</div>
                  <div style={{ fontSize: '14px', color: '#64748b' }}>Occupied: {zone.occupied}</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
                    {zone.occupancyPercent}% Occupied
                  </div>
                </div>
                <button 
                  onClick={() => onPageChange('zone-management')}
                  style={{
                    padding: '6px 12px', fontSize: '12px', backgroundColor: '#3b82f6',
                    color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'
                  }}
                >
                  Quick View
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', color: '#1e293b' }}>
            📱 Quick Actions Panel
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { icon: '🏗️', label: 'Create New Zone', desc: 'Add new parking zones', page: 'zone-management' },
              { icon: '👤', label: 'Add Staff User', desc: 'Create staff accounts', page: 'staff-management' },
              { icon: '📊', label: 'Generate Report', desc: 'Create analytics reports', page: 'financial' },
              { icon: '🔔', label: 'Send Notification', desc: 'Broadcast messages', page: 'notifications' }
            ].map((action, i) => (
              <button
                key={i}
                onClick={() => onPageChange(action.page)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '12px',
                  backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px',
                  cursor: 'pointer', textAlign: 'left', width: '100%'
                }}
              >
                <span style={{ fontSize: '20px' }}>{action.icon}</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>{action.label}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{action.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live Sessions */}
      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', color: '#1e293b' }}>
          🚗 Live Parking Sessions
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ textAlign: 'left', padding: '12px', fontSize: '14px', fontWeight: '600', color: '#64748b' }}>Vehicle Number</th>
                <th style={{ textAlign: 'left', padding: '12px', fontSize: '14px', fontWeight: '600', color: '#64748b' }}>Zone/Slot</th>
                <th style={{ textAlign: 'left', padding: '12px', fontSize: '14px', fontWeight: '600', color: '#64748b' }}>Duration</th>
                <th style={{ textAlign: 'left', padding: '12px', fontSize: '14px', fontWeight: '600', color: '#64748b' }}>Payment Status</th>
                <th style={{ textAlign: 'left', padding: '12px', fontSize: '14px', fontWeight: '600', color: '#64748b' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.sessions.map((session, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px', fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
                    {session.vehicle_number}
                  </td>
                  <td style={{ padding: '12px', fontSize: '14px', color: '#64748b' }}>
                    {session.zoneName} / {session.slotNumber !== 'N/A' ? `Slot ${session.slotNumber}` : 'No Slot'}
                  </td>
                  <td style={{ padding: '12px', fontSize: '14px', color: '#64748b' }}>
                    {formatDuration(session.entry_time)}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '600',
                      backgroundColor: session.payment_status === 'paid' ? '#dcfce7' : '#fee2e2',
                      color: session.payment_status === 'paid' ? '#166534' : '#dc2626'
                    }}>
                      {session.payment_status === 'paid' ? 'Paid' : session.payment_status === 'pending' ? 'Pending' : 'Overdue'}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button style={{
                        padding: '4px 8px', fontSize: '12px', backgroundColor: '#3b82f6',
                        color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'
                      }}>
                        View
                      </button>
                      <button style={{
                        padding: '4px 8px', fontSize: '12px', backgroundColor: '#64748b',
                        color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'
                      }}>
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {dashboardData.sessions.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
                    No active sessions
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: '16px', textAlign: 'right' }}>
          <button 
            onClick={() => onPageChange('parking-operations')}
            style={{
              padding: '8px 16px', fontSize: '14px', backgroundColor: '#3b82f6',
              color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer'
            }}
          >
            View All Sessions →
          </button>
        </div>
      </div>

      {/* System Status */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px', color: '#1e293b' }}>
          ⚡ System Status
        </h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ color: '#10b981', fontWeight: '600' }}>System Online</span>
            <span style={{ color: '#64748b', marginLeft: '8px' }}>- All zones operational</span>
          </div>
          <div style={{ fontSize: '14px', color: '#64748b' }}>
            Last updated: {new Date().toLocaleTimeString('en-IN', { hour12: false })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;