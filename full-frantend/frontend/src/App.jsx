import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

const API_BASE = 'http://localhost:8000'

function App() {
  const [data, setData] = useState({
    zones: [],
    sessions: [],
    loading: true,
    error: null
  })

  const [stats, setStats] = useState({
    activeSessions: 0,
    totalRevenue: 0,
    occupancyRate: 0,
    availableSlots: 0
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setData(prev => ({ ...prev, loading: true }))
      
      const [zonesRes, sessionsRes, analyticsRes] = await Promise.all([
        axios.get(`${API_BASE}/api/zones/`),
        axios.get(`${API_BASE}/api/sessions/`),
        axios.get(`${API_BASE}/api/analytics/dashboard/`)
      ])

      setData({
        zones: zonesRes.data.zones || [],
        sessions: sessionsRes.data.sessions || [],
        loading: false,
        error: null
      })

      // Calculate stats
      const activeSessions = sessionsRes.data.sessions?.filter(s => !s.exit_time).length || 0
      const totalRevenue = sessionsRes.data.sessions?.reduce((sum, s) => sum + parseFloat(s.amount_paid || 0), 0) || 0
      const totalSlots = zonesRes.data.zones?.reduce((sum, z) => sum + (z.total_slots || 0), 0) || 0
      const occupiedSlots = activeSessions
      const occupancyRate = totalSlots > 0 ? Math.round((occupiedSlots / totalSlots) * 100) : 0

      setStats({
        activeSessions,
        totalRevenue,
        occupancyRate,
        availableSlots: totalSlots - occupiedSlots
      })

    } catch (error) {
      console.error('API Error:', error)
      setData(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load data'
      }))
    }
  }

  if (data.loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading Smart Parking Dashboard...</p>
      </div>
    )
  }

  if (data.error) {
    return (
      <div className="error">
        <h2>❌ Error</h2>
        <p>{data.error}</p>
        <button onClick={fetchData}>Retry</button>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🚗 Smart Parking Management</h1>
        <button onClick={fetchData} className="refresh-btn">🔄 Refresh</button>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Active Sessions</h3>
          <div className="stat-value">{stats.activeSessions}</div>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <div className="stat-value">₹{stats.totalRevenue.toFixed(2)}</div>
        </div>
        <div className="stat-card">
          <h3>Occupancy Rate</h3>
          <div className="stat-value">{stats.occupancyRate}%</div>
        </div>
        <div className="stat-card">
          <h3>Available Slots</h3>
          <div className="stat-value">{stats.availableSlots}</div>
        </div>
      </div>

      <div className="content-grid">
        <div className="zones-section">
          <h2>🏢 Parking Zones</h2>
          <div className="zones-grid">
            {data.zones.map(zone => (
              <div key={zone.id} className="zone-card">
                <h3>{zone.name}</h3>
                <p>Rate: ₹{zone.hourly_rate}/hour</p>
                <p>Slots: {zone.available_slots || 0}/{zone.total_slots || 0}</p>
                <div className={`status ${zone.is_active ? 'active' : 'inactive'}`}>
                  {zone.is_active ? '🟢 Active' : '🔴 Inactive'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="sessions-section">
          <h2>🚙 Recent Sessions</h2>
          <div className="sessions-list">
            {data.sessions.slice(0, 10).map(session => (
              <div key={session.id} className="session-card">
                <div className="session-info">
                  <strong>{session.vehicle_number}</strong>
                  <span className="zone">{session.zone_name}</span>
                </div>
                <div className="session-details">
                  <span className="amount">₹{session.amount_paid}</span>
                  <span className={`status ${session.exit_time ? 'completed' : 'active'}`}>
                    {session.exit_time ? '✅ Completed' : '🔄 Active'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App