import React, { useState, useEffect } from 'react';
import apiService from '../../../services/apiService';
import { Calendar, User, CreditCard, CheckCircle, XCircle, Clock } from 'lucide-react';

const BookingHistory = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await apiService.getSessions().catch(() => ({ data: [] }));
            const sessions = Array.isArray(response) ? response : (response.data || response.sessions || []);

            // Show all sessions instead of filtering
            const bookingData = sessions;

            const mappedBookings = bookingData.map(item => ({
                ...item,
                id: item.session_id || item.id
            }));

            // Sort by newest first (booking_time or entry_time)
            const sortedSessions = mappedBookings.sort((a, b) =>
                new Date(b.booking_time || b.entry_time) - new Date(a.booking_time || a.entry_time)
            );

            setBookings(sortedSessions);
        } catch (err) {
            console.error('Error fetching booking history:', err);
            setError('Failed to load booking history');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
            <div className="spinner">⌛</div>
            <p style={{ fontWeight: '500', marginTop: '16px' }}>Fetching historical records...</p>
        </div>
    );

    if (error) return (
        <div style={{
            padding: '40px', textAlign: 'center', color: '#ef4444',
            background: '#fef2f2', borderRadius: '16px', border: '1px solid #fee2e2'
        }}>
            <Calendar style={{ margin: '0 auto 12px auto' }} />
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
                    <Calendar style={{ width: '24px', height: '24px', color: '#8b5cf6' }} />
                    Historical Booking Ledger
                </h2>
                <div style={{ fontSize: '14px', color: '#64748b', background: '#f8fafc', padding: '6px 16px', borderRadius: '30px', fontWeight: '600', border: '1px solid #e2e8f0' }}>
                    Total Records: {bookings.length}
                </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0' }}>
                    <thead>
                        <tr style={{ background: 'rgba(248, 250, 252, 0.5)' }}>
                            <th style={{ padding: '16px 32px', textAlign: 'left', fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Booking ID</th>
                            <th style={{ padding: '16px 32px', textAlign: 'left', fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Booking Date</th>
                            <th style={{ padding: '16px 32px', textAlign: 'left', fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Vehicle Number</th>
                            <th style={{ padding: '16px 32px', textAlign: 'left', fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Zone</th>
                            <th style={{ padding: '16px 32px', textAlign: 'left', fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Amount Paid</th>
                            <th style={{ padding: '16px 32px', textAlign: 'left', fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ padding: '80px 32px', textAlign: 'center', color: '#94a3b8' }}>
                                    <div style={{ fontSize: '40px', marginBottom: '16px', opacity: 0.3 }}>📅</div>
                                    <p style={{ fontSize: '16px', fontWeight: '500' }}>No historical booking data available</p>
                                </td>
                            </tr>
                        ) : (
                            bookings.map((booking, index) => {
                                const entry = new Date(booking.entry_time);
                                const exit = booking.exit_time ? new Date(booking.exit_time) : new Date();
                                const durationHours = booking.duration_hours || ((exit - entry) / (1000 * 60 * 60)).toFixed(1);

                                return (
                                    <tr key={booking.id || index} style={{ transition: 'all 0.2s' }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                        <td style={{ padding: '20px 32px' }}>
                                            <span style={{ fontFamily: 'monospace', padding: '4px 8px', backgroundColor: '#f1f5f9', borderRadius: '6px', color: '#475569', fontSize: '13px', fontWeight: '600' }}>
                                                #{String(booking.id).padStart(3, '0')}
                                            </span>
                                        </td>
                                        <td style={{ padding: '20px 32px' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>
                                                    {booking.booking_time ? new Date(booking.booking_time).toLocaleDateString() : new Date(booking.entry_time).toLocaleDateString()}
                                                </span>
                                                <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                                                    {booking.booking_time ? new Date(booking.booking_time).toLocaleTimeString() : new Date(booking.entry_time).toLocaleTimeString()}
                                                </span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '20px 32px', color: '#334155', fontWeight: '700', fontSize: '15px' }}>
                                            {booking.vehicle_number}
                                        </td>
                                        <td style={{ padding: '20px 32px', color: '#64748b', fontSize: '14px' }}>
                                            {booking.zone_name || `Zone ${booking.zone_id || '?'}`}
                                        </td>
                                        <td style={{ padding: '20px 32px' }}>
                                            <span style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>
                                                ₹{parseFloat(booking.total_amount_paid || 0).toFixed(2)}
                                            </span>
                                        </td>
                                        <td style={{ padding: '20px 32px' }}>
                                            <span style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px',
                                                borderRadius: '8px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase',
                                                backgroundColor: booking.status === 'completed' ? '#dcfce7' : booking.status === 'reserved' ? '#fef9c3' : '#fff7ed',
                                                color: booking.status === 'completed' ? '#166534' : booking.status === 'reserved' ? '#854d0e' : '#d97706',
                                                border: booking.status === 'completed' ? '1px solid #bbf7d0' : booking.status === 'reserved' ? '1px solid #fef08a' : '1px solid #ffedd5'
                                            }}>
                                                <Clock size={12} /> 
                                                {booking.status === 'completed' ? 'Completed' : 
                                                 booking.status === 'reserved' ? 'Reserved' : 
                                                 booking.status === 'active' ? 'Active' :
                                                 'Pending Payment'}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BookingHistory;
