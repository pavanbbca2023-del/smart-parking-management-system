import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, BarChart3, ArrowRight, Settings, Lock } from 'lucide-react';

const AdminLanding = () => {
    const navigate = useNavigate();

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f8fafc',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
            {/* Navbar */}
            <nav style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px 40px',
                maxWidth: '1200px',
                margin: '0 auto',
                backgroundColor: 'white',
                marginTop: '10px',
                borderRadius: '16px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        backgroundColor: '#1e293b',
                        padding: '8px',
                        borderRadius: '8px'
                    }}>
                        <Shield size={24} color="white" />
                    </div>
                    <span style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b' }}>PARK-ADMIN</span>
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            padding: '10px 16px',
                            backgroundColor: 'transparent',
                            color: '#64748b',
                            border: 'none',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '15px'
                        }}
                    >
                        Main Website
                    </button>
                    <button
                        onClick={() => navigate('/admin/login')}
                        style={{
                            padding: '10px 24px',
                            backgroundColor: '#1e293b',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '15px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        Portal Login
                    </button>
                </div>
            </nav >

            {/* Hero Section */}
            <div style={{
                maxWidth: '1200px',
                margin: '80px auto',
                padding: '0 40px',
                display: 'flex',
                alignItems: 'center',
                gap: '80px'
            }}>
                <div style={{ flex: 1.2 }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        color: '#2563eb',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: '700',
                        marginBottom: '24px'
                    }}>
                        <Lock size={16} />
                        Enterprise Control Suite v3.5
                    </div>
                    <h1 style={{
                        fontSize: '64px',
                        fontWeight: '800',
                        color: '#0f172a',
                        lineHeight: '1.05',
                        marginBottom: '32px',
                        letterSpacing: '-0.02em'
                    }}>
                        Total Command of Your <span style={{ color: '#2563eb' }}>Infrastructure.</span>
                    </h1>
                    <p style={{
                        fontSize: '20px',
                        color: '#475569',
                        lineHeight: '1.6',
                        marginBottom: '48px',
                        maxWidth: '540px'
                    }}>
                        Manage users, configure zones, and analyze financial performance with our enterprise-grade administration hub.
                    </p>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <button
                            onClick={() => navigate('/admin/login')}
                            style={{
                                padding: '18px 36px',
                                backgroundColor: '#1e293b',
                                color: 'white',
                                border: 'none',
                                borderRadius: '14px',
                                fontWeight: '700',
                                fontSize: '18px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                boxShadow: '0 20px 25px -5px rgba(30, 41, 59, 0.2)'
                            }}
                        >
                            Log in to Admin
                            <ArrowRight size={22} />
                        </button>
                    </div>
                </div>
                <div style={{ flex: 0.8 }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '40px',
                        borderRadius: '32px',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)',
                        border: '1px solid #e2e8f0',
                        position: 'relative'
                    }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                            {[
                                { title: 'Active Users', val: '1,284', color: '#3b82f6' },
                                { title: 'Total Revenue', val: '₹4.2M', color: '#10b981' },
                                { title: 'Occupancy', val: '78%', color: '#f59e0b' },
                                { title: 'Zones', val: '12', color: '#8b5cf6' }
                            ].map((stat, i) => (
                                <div key={i} style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '16px' }}>
                                    <p style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px' }}>{stat.title}</p>
                                    <p style={{ fontSize: '24px', fontWeight: '800', color: stat.color, margin: 0 }}>{stat.val}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Core Administrative Pillars */}
            <div style={{ borderTop: '1px solid #e2e8f0', backgroundColor: 'white', padding: '100px 40px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                        <h2 style={{ fontSize: '40px', fontWeight: '800', color: '#0f172a', marginBottom: '20px' }}>
                            Administrative Mastery
                        </h2>
                        <p style={{ fontSize: '18px', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>
                            Deep-dive into every aspect of your facility with precision tools.
                        </p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '40px'
                    }}>
                        {[
                            {
                                icon: <Users size={32} color="#2563eb" />,
                                title: "User Governance",
                                desc: "Manage permissions, roles, and security protocols for staff and customers."
                            },
                            {
                                icon: <BarChart3 size={32} color="#2563eb" />,
                                title: "Financial Intelligence",
                                desc: "Automated reporting and revenue analysis with deep granular insights."
                            },
                            {
                                icon: <Settings size={32} color="#2563eb" />,
                                title: "Zone Configuration",
                                desc: "Dynamic pricing and slot allocation management across all parking zones."
                            }
                        ].map((pillar, idx) => (
                            <div key={idx} style={{ textAlign: 'center' }}>
                                <div style={{
                                    backgroundColor: '#f0f7ff',
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '24px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 24px'
                                }}>
                                    {pillar.icon}
                                </div>
                                <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>{pillar.title}</h3>
                                <p style={{ color: '#64748b', lineHeight: '1.6', fontSize: '15px' }}>{pillar.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLanding;
