import React, { useState, useEffect } from 'react';
import apiService from '../../../services/apiService';
import { RefreshCw, Timer, Car, MapPin, AlertTriangle, User } from 'lucide-react';

const SessionManagement = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchActiveSessions();
    }, []);

    const fetchActiveSessions = async () => {
        try {
            setLoading(true);
            setError(null);
            
            console.log('Fetching active sessions...');
            const response = await apiService.getActiveSessions();
            console.log('Active sessions response:', response);
            
            // Handle the response format from backend analytics API
            let activeSessions = [];
            if (response && response.success && response.data) {
                activeSessions = response.data;
                console.log('Using response.data:', activeSessions.length, 'sessions');
            } else if (Array.isArray(response)) {
                activeSessions = response;
                console.log('Using array response:', activeSessions.length, 'sessions');
            } else if (response && response.sessions) {
                activeSessions = response.sessions;
                console.log('Using response.sessions:', activeSessions.length, 'sessions');
            } else {
                console.warn('Unexpected response format:', response);
            }

            const mappedSessions = activeSessions.map(item => ({
                ...item,
                id: item.session_id || item.id
            }));
            
            console.log('Mapped sessions:', mappedSessions.length);
            setSessions(mappedSessions);
            
        } catch (err) {
            console.error('Error fetching active sessions:', err);
            setError(`Failed to load active sessions: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const calculateDuration = (startTime) => {
        const start = new Date(startTime);
        const now = new Date();
        const diff = Math.floor((now - start) / (1000 * 60)); // minutes

        const hours = Math.floor(diff / 60);
        const mins = diff % 60;

        return `${hours}h ${mins}m`;
    };

    if (loading) return (
        <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
            <RefreshCw className="animate-spin" style={{ margin: '0 auto 16px auto', color: '#3b82f6' }} />
            <p style={{ fontWeight: '600' }}>Synchronizing active telemetry...</p>
        </div>
    );

    if (error) return (
        <div style={{ padding: '40px', textAlign: 'center', color: '#ef4444', backgroundColor: '#fef2f2', borderRadius: '20px', border: '1px solid #fee2e2' }}>
            <AlertTriangle style={{ margin: '0 auto 12px auto' }} />
            <p style={{ fontWeight: '700' }}>{error}</p>
        </div>
    );

    return (
        <div style={{
            animation: 'fadeIn 0.4s ease-out'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '12px', margin: 0 }}>
                        <Timer style={{ width: '28px', height: '28px', color: '#10b981' }} />
                        Live Active Sessions
                    </h2>
                    <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0 40px' }}>
                        {sessions.length} active vehicle{sessions.length !== 1 ? 's' : ''} currently parked
                    </p>
                </div>
                <button
                    onClick={fetchActiveSessions}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
                        background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px',
                        color: '#475569', fontWeight: '600', fontSize: '14px', cursor: 'pointer',
                        transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.transform = 'none'; }}
                >
                    <RefreshCw size={16} />
                    Refresh Feed
                </button>
            </div>

            <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px'
            }}>
                {sessions.length === 0 ? (
                    <div style={{
                        gridColumn: '1 / -1', padding: '100px 32px', textAlign: 'center',
                        background: 'rgba(255, 255, 255, 0.5)', borderRadius: '24px', border: '2px dashed #cbd5e1'
                    }}>
                        <Car size={60} style={{ margin: '0 auto 24px auto', color: '#cbd5e1', opacity: 0.5 }} />
                        <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#64748b' }}>No active vehicles detected</h3>
                        <p style={{ color: '#94a3b8' }}>Real-time parking floor is currently empty</p>
                    </div>
                ) : (
                    sessions.map((session, index) => (
                        <div key={session.id || index} style={{
                            background: 'white', padding: '24px', borderRadius: '24px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.04)', border: '1px solid #f1f5f9',
                            position: 'relative', overflow: 'hidden'
                        }}>
                            {/* Top indicator bar */}
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(to right, #10b981, #3b82f6)' }}></div>

                            <div style={{ display: 'flex', justifyBetween: 'space-between', alignItems: 'flex-start', marginBottom: '20px', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{
                                        width: '48px', height: '48px', borderRadius: '14px',
                                        background: '#f0fdf4', display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', color: '#10b981'
                                    }}>
                                        <Car size={24} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', margin: 0 }}>{session.vehicle_number}</h3>
                                        <p style={{ fontSize: '12px', color: '#94a3b8', margin: '2px 0 0 0' }}>SESSION #{session.id}</p>
                                    </div>
                                </div>
                                <span style={{
                                    padding: '4px 10px', background: '#eff6ff', color: '#3b82f6',
                                    borderRadius: '8px', fontSize: '11px', fontWeight: '800',
                                    textTransform: 'uppercase', letterSpacing: '0.05em', animation: 'pulse 2s infinite'
                                }}>
                                    Live
                                </span>
                            </div>

                            <div style={{ backgroundColor: '#f8fafc', borderRadius: '16px', padding: '16px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                    <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Timer size={14} /> Current Duration
                                    </span>
                                    <span style={{ fontWeight: '800', color: '#10b981' }}>
                                        {calculateDuration(session.entry_time)}
                                    </span>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                    <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <MapPin size={14} /> Parked At
                                    </span>
                                    <span style={{ fontWeight: '700', color: '#334155' }}>
                                        {session.zone_name || `Zone ${session.zone_id}`}
                                    </span>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                    <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <User size={14} /> Occupant
                                    </span>
                                    <span style={{ fontWeight: '700', color: '#334155' }}>
                                        {session.owner_name || 'Guest User'}
                                    </span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button style={{
                                    flex: 1, padding: '10px', background: '#f1f5f9', border: 'none',
                                    borderRadius: '12px', color: '#475569', fontWeight: '700',
                                    fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s'
                                }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e2e8f0'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}>
                                    Inspect Log
                                </button>
                                <button style={{
                                    flex: 1, padding: '10px', background: '#fef2f2', border: 'none',
                                    borderRadius: '12px', color: '#ef4444', fontWeight: '700',
                                    fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s'
                                }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}>
                                    Terminate
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <style>{`
                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.5; }
                    100% { opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default SessionManagement;
