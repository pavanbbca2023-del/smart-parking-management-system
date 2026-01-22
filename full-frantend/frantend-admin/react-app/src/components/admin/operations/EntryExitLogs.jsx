import React, { useState, useEffect } from 'react';
import apiService from '../../../services/apiService';
import { Clock, Car, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';

const EntryExitLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const [activeData, completedData] = await Promise.all([
                apiService.getActiveSessions().catch(() => ({ data: [] })),
                apiService.getCompletedSessions().catch(() => ({ data: [] }))
            ]);

            const getList = (d) => {
                if (!d) return [];
                if (Array.isArray(d)) return d;
                const list = d.data || d.sessions || [];
                return list.map(item => ({
                    ...item,
                    id: item.session_id || item.id,
                    is_active: !item.exit_time
                }));
            };

            const activeSessions = getList(activeData);
            const completedSessions = getList(completedData);

            // Combine and sort by entry time (newest first)
            const allLogs = [...activeSessions, ...completedSessions].sort((a, b) =>
                new Date(b.entry_time) - new Date(a.entry_time)
            );

            setLogs(allLogs);
        } catch (err) {
            console.error('Error fetching entry/exit logs:', err);
            setError('Failed to load entry/exit logs');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
            <div className="spinner" style={{ marginBottom: '16px' }}>⌛</div>
            <p style={{ fontWeight: '500' }}>Streaming log records...</p>
        </div>
    );

    if (error) return (
        <div style={{
            padding: '40px',
            textAlign: 'center',
            color: '#ef4444',
            background: '#fef2f2',
            borderRadius: '16px',
            border: '1px solid #fee2e2'
        }}>
            <AlertCircle style={{ margin: '0 auto 12px auto' }} />
            <p style={{ fontWeight: '600' }}>{error}</p>
        </div>
    );

    return (
        <div style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.6)',
            overflow: 'hidden'
        }}>
            <div style={{
                padding: '24px 32px',
                borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <h2 style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#1e293b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    margin: 0
                }}>
                    <Clock style={{ width: '24px', height: '24px', color: '#3b82f6' }} />
                    Log Activity Stream
                </h2>
                <span style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#64748b',
                    background: '#f1f5f9',
                    padding: '4px 12px',
                    borderRadius: '20px'
                }}>
                    {logs.length} Total Logs
                </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0' }}>
                    <thead>
                        <tr style={{ background: 'rgba(248, 250, 252, 0.5)' }}>
                            <th style={{ padding: '16px 32px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Vehicle Details</th>
                            <th style={{ padding: '16px 32px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Entry Timeline</th>
                            <th style={{ padding: '16px 32px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Exit Timeline</th>
                            <th style={{ padding: '16px 32px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Assigned Zone</th>
                            <th style={{ padding: '16px 32px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Operation Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ padding: '80px 32px', textAlign: 'center', color: '#94a3b8' }}>
                                    <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}>📂</div>
                                    <p style={{ fontSize: '18px', fontWeight: '500' }}>No entry/exit records found in database</p>
                                    <p style={{ fontSize: '14px' }}>Try refreshing or check system connectivity</p>
                                </td>
                            </tr>
                        ) : (
                            logs.map((log, index) => (
                                <tr key={log.id || index} style={{
                                    transition: 'background-color 0.2s',
                                    borderBottom: '1px solid rgba(0, 0, 0, 0.03)'
                                }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.02)'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                    <td style={{ padding: '20px 32px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <div style={{
                                                width: '44px',
                                                height: '44px',
                                                borderRadius: '12px',
                                                background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#3b82f6',
                                                boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.1)'
                                            }}>
                                                <Car size={22} />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '15px' }}>{log.vehicle_number || 'REG-XXXX'}</div>
                                                <div style={{ fontSize: '12px', color: '#94a3b8' }}>ID: #{log.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '20px 32px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#475569' }}>
                                            <ArrowRight size={16} style={{ color: '#10b981' }} />
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontWeight: '600', fontSize: '14px' }}>{new Date(log.entry_time).toLocaleDateString()}</span>
                                                <span style={{ fontSize: '12px', color: '#64748b' }}>{new Date(log.entry_time).toLocaleTimeString()}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '20px 32px' }}>
                                        {log.exit_time ? (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#475569' }}>
                                                <ArrowLeft size={16} style={{ color: '#ef4444' }} />
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span style={{ fontWeight: '600', fontSize: '14px' }}>{new Date(log.exit_time).toLocaleDateString()}</span>
                                                    <span style={{ fontSize: '12px', color: '#64748b' }}>{new Date(log.exit_time).toLocaleTimeString()}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <span style={{
                                                fontSize: '13px',
                                                color: '#cbd5e1',
                                                fontStyle: 'italic',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px'
                                            }}>
                                                <Clock size={14} /> In Progress
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ padding: '20px 32px' }}>
                                        <div style={{
                                            padding: '6px 14px',
                                            background: '#f8fafc',
                                            borderRadius: '8px',
                                            display: 'inline-block',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            color: '#475569',
                                            border: '1px solid #e2e8f0'
                                        }}>
                                            {log.zone_name || `Zone ${log.zone_id || '?'}`}
                                        </div>
                                    </td>
                                    <td style={{ padding: '20px 32px' }}>
                                        <span style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            padding: '6px 14px',
                                            borderRadius: '10px',
                                            fontSize: '12px',
                                            fontWeight: '700',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.025em',
                                            backgroundColor: log.is_active ? '#dcfce7' : '#f1f5f9',
                                            color: log.is_active ? '#15803d' : '#475569',
                                            boxShadow: log.is_active ? '0 4px 6px -1px rgba(34, 197, 94, 0.1)' : 'none'
                                        }}>
                                            <div style={{
                                                width: '6px',
                                                height: '6px',
                                                borderRadius: '50%',
                                                backgroundColor: log.is_active ? '#22c55e' : '#64748b',
                                                animation: log.is_active ? 'pulse 2s infinite' : 'none'
                                            }}></div>
                                            {log.is_active ? 'Active' : 'Completed'}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <style>{`
                @keyframes pulse {
                    0% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(1.2); }
                    100% { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

export default EntryExitLogs;
