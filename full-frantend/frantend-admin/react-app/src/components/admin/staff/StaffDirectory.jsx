import React, { useState, useEffect } from 'react';
import apiService from '../../../services/apiService';
import { Users, Mail, Phone, Shield, MoreVertical } from 'lucide-react';

const StaffDirectory = () => {
    // Initial state with improved mock data for better visualization
    const [staffList, setStaffList] = useState([
        { id: 101, name: 'Admin User', email: 'admin@parking.io', role: 'Security Admin', status: 'Active', phone: '+91 99990 11110', joinDate: '2023-05-12' },
        { id: 102, name: 'Vikram Singh', email: 'vikram@parking.io', role: 'Floor Supervisor', status: 'Active', phone: '+91 99990 11111', joinDate: '2023-08-20' },
        { id: 103, name: 'Priya Sharma', email: 'priya@parking.io', role: 'Attendant', status: 'On Break', phone: '+91 99990 11112', joinDate: '2024-01-05' }
    ]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            setLoading(true);
            const response = await apiService.adminGetAllUsers('STAFF').catch(() => []);
            if (response && response.length > 0) {
                setStaffList(response.map(user => ({
                    id: user.id || user.user_id,
                    name: user.username || user.full_name || 'Anonymous Staff',
                    email: user.email || 'N/A',
                    role: user.role === 'STAFF' ? 'Attendant' : (user.role || 'Staff'),
                    status: user.is_active ? 'Active' : 'Deactivated',
                    phone: user.phone || 'N/A',
                    joinDate: user.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'N/A'
                })));
            }
        } catch (err) {
            console.error('Error fetching staff:', err);
            setError('Operational database synchronization failed');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div style={{ padding: '80px', textAlign: 'center', color: '#64748b' }}>
            <div className="spinner">⌛</div>
            <p style={{ fontWeight: '600', marginTop: '16px', letterSpacing: '0.05em' }}>Synchronizing Personnel Data...</p>
        </div>
    );

    if (error) return (
        <div style={{ padding: '40px', textAlign: 'center', color: '#ef4444', background: '#fef2f2', borderRadius: '24px', border: '1px solid #fee2e2' }}>
            <Shield size={40} style={{ margin: '0 auto 20px auto', opacity: 0.5 }} />
            <p style={{ fontWeight: '800', fontSize: '18px' }}>Security Access Fault</p>
            <p style={{ fontSize: '14px', marginTop: '4px' }}>{error}</p>
        </div>
    );

    return (
        <div style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(30px)',
            borderRadius: '32px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.7)',
            overflow: 'hidden'
        }}>
            <div style={{
                padding: '32px 40px', borderBottom: '1px solid rgba(0, 0, 0, 0.04)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: 'rgba(248, 250, 252, 0.4)'
            }}>
                <div>
                    <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '14px', margin: 0 }}>
                        <Users style={{ width: '28px', height: '28px', color: '#3b82f6' }} />
                        Personnel Management
                    </h2>
                    <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px', fontWeight: '500' }}>Review and manage your security and floor staff</p>
                </div>
                <div style={{
                    fontSize: '13px', color: '#3b82f6', background: '#eff6ff',
                    padding: '8px 20px', borderRadius: '40px', fontWeight: '800',
                    border: '1px solid #dbeafe', display: 'flex', alignItems: 'center', gap: '8px'
                }}>
                    <Users size={14} /> Total Force: {staffList.length}
                </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0' }}>
                    <thead>
                        <tr style={{ background: 'rgba(248, 250, 252, 0.5)' }}>
                            <th style={{ padding: '20px 40px', textAlign: 'left', fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Personnel Identity</th>
                            <th style={{ padding: '20px 40px', textAlign: 'left', fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Communication Details</th>
                            <th style={{ padding: '20px 40px', textAlign: 'left', fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Assign Roles</th>
                            <th style={{ padding: '20px 40px', textAlign: 'left', fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Operational Status</th>
                            <th style={{ padding: '20px 40px', textAlign: 'center', fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Command</th>
                        </tr>
                    </thead>
                    <tbody>
                        {staffList.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ padding: '100px 40px', textAlign: 'center', color: '#94a3b8' }}>
                                    <div style={{ fontSize: '50px', marginBottom: '20px', opacity: 0.2 }}>🔍</div>
                                    <p style={{ fontSize: '18px', fontWeight: '600' }}>No personnel records located</p>
                                    <p style={{ fontSize: '14px', marginTop: '4px' }}>Verify database connectivity or initialize onboarding</p>
                                </td>
                            </tr>
                        ) : (
                            staffList.map((staff, index) => (
                                <tr key={staff.id || index} style={{ transition: 'all 0.3s' }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = 'rgba(241, 245, 249, 0.5)';
                                        e.currentTarget.style.transform = 'scale(1.002)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                        e.currentTarget.style.transform = 'none';
                                    }}>
                                    <td style={{ padding: '24px 40px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                            <div style={{
                                                width: '48px', height: '48px', borderRadius: '16px',
                                                background: `linear-gradient(135deg, ${index % 2 === 0 ? '#3b82f6' : '#8b5cf6'} 0%, ${index % 2 === 0 ? '#60a5fa' : '#a78bfa'} 100%)`,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: 'white', fontWeight: '800', fontSize: '18px',
                                                boxShadow: '0 8px 16px -4px rgba(59, 130, 246, 0.3)'
                                            }}>
                                                {staff.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '16px', fontWeight: '800', color: '#1e293b', marginBottom: '2px' }}>{staff.name}</div>
                                                <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ID-{String(staff.id).padStart(5, '0')}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '24px 40px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#475569', fontWeight: '600' }}>
                                                <Mail size={13} style={{ color: '#94a3b8' }} /> {staff.email}
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748b' }}>
                                                <Phone size={13} style={{ color: '#94a3b8' }} /> {staff.phone}
                                            </span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '24px 40px' }}>
                                        <div style={{
                                            display: 'flex', alignItems: 'center', gap: '10px', px: '12px', py: '6px',
                                            borderRadius: '10px', fontSize: '13px', fontWeight: '700',
                                            backgroundColor: '#f8fafc', color: '#1e293b', border: '1px solid #e2e8f0', width: 'fit-content', padding: '6px 14px'
                                        }}>
                                            <Shield size={14} style={{ color: '#3b82f6' }} />
                                            {staff.role}
                                        </div>
                                    </td>
                                    <td style={{ padding: '24px 40px' }}>
                                        <span style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                                            padding: '6px 14px', borderRadius: '12px', fontSize: '12px', fontWeight: '700',
                                            backgroundColor: staff.status === 'Active' ? '#f0fdf4' : staff.status === 'On Break' ? '#fffbeb' : '#fef2f2',
                                            color: staff.status === 'Active' ? '#10b981' : staff.status === 'On Break' ? '#f59e0b' : '#ef4444',
                                            border: `1px solid ${staff.status === 'Active' ? '#dcfce7' : staff.status === 'On Break' ? '#fef3c7' : '#fee2e2'}`
                                        }}>
                                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'currentColor' }}></span>
                                            {staff.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '24px 40px', textAlign: 'center' }}>
                                        <button style={{
                                            padding: '10px', background: 'white', border: '1px solid #e2e8f0',
                                            borderRadius: '12px', color: '#94a3b8', cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }} onMouseEnter={(e) => { e.currentTarget.style.color = '#1e293b'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = '#e2e8f0'; }}>
                                            <MoreVertical size={18} />
                                        </button>
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

export default StaffDirectory;
