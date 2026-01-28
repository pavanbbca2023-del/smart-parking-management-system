import React, { useState } from 'react';
import { Shield, Check, Edit2, Lock } from 'lucide-react';

const StaffRoles = () => {
    // Mock roles data
    const [roles] = useState([
        {
            id: 1,
            title: 'Administrator',
            description: 'Full system access and management.',
            permissions: ['Manage Users', 'Manage Staff', 'Financial Reports', 'System Settings', 'Edit Zones'],
            usersCount: 2,
            isSystem: true
        },
        {
            id: 2,
            title: 'Manager',
            description: 'Can manage operations and staff, but restricted from system settings.',
            permissions: ['Manage Staff', 'View Reports', 'Edit Zones', 'Handle Disputes'],
            usersCount: 3,
            isSystem: false
        },
        {
            id: 3,
            title: 'Parking Attendant',
            description: 'Can handle entry/exit and basic operations.',
            permissions: ['Scan Entry/Exit', 'View Bookings', 'Basic Support'],
            usersCount: 8,
            isSystem: false
        }
    ]);

    return (
        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '12px', margin: 0 }}>
                    <Shield style={{ width: '24px', height: '24px', color: '#8b5cf6' }} />
                    Access Control Matrix
                </h2>
                <button style={{
                    padding: '12px 24px', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    color: 'white', border: 'none', borderRadius: '14px', fontSize: '14px',
                    fontWeight: '700', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.2)'
                }}>
                    + Initialize New Protocol
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                {roles.map((role) => (
                    <div key={role.id} style={{
                        background: 'white', borderRadius: '28px',
                        boxShadow: '0 15px 30px -10px rgba(0, 0, 0, 0.05)', border: '1px solid #f1f5f9',
                        display: 'flex', flexDirection: 'column', transition: 'all 0.3s'
                    }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = '#f1f5f9'; }}>

                        <div style={{ padding: '32px', borderBottom: '1px solid #f1f5f9' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', margin: 0 }}>{role.title}</h3>
                                {role.isSystem && (
                                    <span style={{
                                        padding: '4px 10px', background: '#f8fafc', color: '#64748b',
                                        borderRadius: '8px', fontSize: '11px', fontWeight: '800',
                                        display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid #e2e8f0'
                                    }}>
                                        <Lock size={10} /> SYSTEM SECURED
                                    </span>
                                )}
                            </div>
                            <p style={{ fontSize: '14px', color: '#64748b', margin: 0, lineHeight: '1.6' }}>{role.description}</p>
                        </div>

                        <div style={{ padding: '32px', flex: 1, background: '#fafbfc' }}>
                            <h4 style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Authorizations</h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {role.permissions.map((perm, idx) => (
                                    <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#475569', fontWeight: '600' }}>
                                        <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '1.5px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Check size={10} style={{ color: '#10b981', strokeWidth: 3 }} />
                                        </div>
                                        {perm}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div style={{ padding: '24px 32px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600' }}>{role.usersCount} Active Assets</span>
                            {!role.isSystem && (
                                <button style={{
                                    background: 'none', border: 'none', color: '#3b82f6',
                                    fontWeight: '800', fontSize: '13px', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', gap: '6px'
                                }}>
                                    <Edit2 size={14} /> Update Logic
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StaffRoles;
