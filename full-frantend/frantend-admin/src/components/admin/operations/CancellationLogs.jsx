import React, { useState, useEffect } from 'react';
import apiService from '../../../services/apiService';
import { XCircle, Calendar, User } from 'lucide-react';

const CancellationLogs = () => {
    const [cancellations, setCancellations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCancellations();
    }, []);

    const fetchCancellations = async () => {
        try {
            setLoading(true);
            const response = await apiService.getCompletedSessions().catch(() => ({ data: [] }));
            const sessions = Array.isArray(response) ? response : (response.data || response.sessions || []);

            // Filter for cancelled sessions
            const cancelled = sessions.filter(s => s.status === 'Cancelled' || s.status === 'CANCELLED');

            setCancellations(cancelled.map(item => ({
                ...item,
                id: item.session_id || item.id
            })));
        } catch (err) {
            console.error('Error fetching cancellations:', err);
            setError('Failed to load cancellation logs');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
            <div className="spinner">⌛</div>
            <p style={{ fontWeight: '500', marginTop: '16px' }}>Auditing cancellation records...</p>
        </div>
    );

    if (error) return (
        <div style={{
            padding: '40px', textAlign: 'center', color: '#ef4444',
            background: '#fef2f2', borderRadius: '16px', border: '1px solid #fee2e2'
        }}>
            <XCircle style={{ margin: '0 auto 12px auto' }} />
            <p style={{ fontWeight: '600' }}>{error}</p>
        </div>
    );

    return (
        <div style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.6)',
            overflow: 'hidden'
        }}>
            <div style={{
                padding: '24px 32px', borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '12px', margin: 0 }}>
                    <XCircle style={{ width: '24px', height: '24px', color: '#ef4444' }} />
                    Cancellation Audit Trail
                </h2>
                <div style={{ fontSize: '13px', fontWeight: '800', color: '#ef4444', background: '#fef2f2', padding: '4px 12px', borderRadius: '20px' }}>
                    {cancellations.length} Revoked Sessions
                </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0' }}>
                    <thead>
                        <tr style={{ background: 'rgba(248, 250, 252, 0.5)' }}>
                            <th style={{ padding: '16px 32px', textAlign: 'left', fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Audit ID</th>
                            <th style={{ padding: '16px 32px', textAlign: 'left', fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Booking Info</th>
                            <th style={{ padding: '16px 32px', textAlign: 'left', fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Revocation Date</th>
                            <th style={{ padding: '16px 32px', textAlign: 'left', fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Reasoning</th>
                            <th style={{ padding: '16px 32px', textAlign: 'left', fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Refund Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cancellations.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ padding: '80px 32px', textAlign: 'center', color: '#94a3b8' }}>
                                    <div style={{ fontSize: '40px', marginBottom: '16px', opacity: 0.3 }}>📋</div>
                                    <p style={{ fontSize: '16px', fontWeight: '500' }}>No cancellation events logged</p>
                                </td>
                            </tr>
                        ) : (
                            cancellations.map((log, index) => (
                                <tr key={log.id || index} style={{ transition: 'all 0.2s' }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                    <td style={{ padding: '20px 32px' }}>
                                        <span style={{ fontFamily: 'monospace', color: '#64748b', fontSize: '13px' }}>#C-{log.id}</span>
                                    </td>
                                    <td style={{ padding: '20px 32px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>{log.vehicle_number}</span>
                                            <span style={{ fontSize: '12px', color: '#94a3b8' }}>Owner: {log.owner_name}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '20px 32px', color: '#64748b', fontSize: '14px' }}>
                                        {new Date(log.exit_time || log.entry_time).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '20px 32px', color: '#475569', fontSize: '14px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {log.cancellation_reason || 'System Revocation'}
                                    </td>
                                    <td style={{ padding: '20px 32px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontWeight: '800', color: '#0f172a', fontSize: '14px' }}>₹{log.amount_paid || 0}</span>
                                            <span style={{ fontSize: '10px', fontWeight: '700', backgroundColor: '#f1f5f9', color: '#475569', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>Processed</span>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CancellationLogs;
