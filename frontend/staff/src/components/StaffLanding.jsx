import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, ShieldCheck, Clock, ArrowRight, CheckCircle } from 'lucide-react';

const StaffLanding = () => {
    const navigate = useNavigate();

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: 'white',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
            {/* Navbar */}
            <nav style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px 40px',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        backgroundColor: '#3b82f6',
                        padding: '8px',
                        borderRadius: '8px'
                    }}>
                        <Building2 size={24} color="white" />
                    </div>
                    <span style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b' }}>PARK-PRO</span>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <button
                        onClick={() => navigate('/login')}
                        style={{
                            padding: '10px 24px',
                            backgroundColor: 'white',
                            color: '#3b82f6',
                            border: '1px solid #3b82f6',
                            borderRadius: '8px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '15px'
                        }}
                    >
                        Login
                    </button>

                </div>
            </nav>

            {/* Hero Section */}
            <div style={{
                maxWidth: '1200px',
                margin: '60px auto',
                padding: '0 40px',
                display: 'flex',
                alignItems: 'center',
                gap: '60px'
            }}>
                <div style={{ flex: 1 }}>
                    <span style={{
                        backgroundColor: '#eff6ff',
                        color: '#3b82f6',
                        padding: '6px 16px',
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: '600',
                        marginBottom: '24px',
                        display: 'inline-block'
                    }}>
                        Staff Portal v2.0
                    </span>
                    <h1 style={{
                        fontSize: '56px',
                        fontWeight: '800',
                        color: '#0f172a',
                        lineHeight: '1.1',
                        marginBottom: '24px'
                    }}>
                        Smart Parking Management <span style={{ color: '#3b82f6' }}>Simplified.</span>
                    </h1>
                    <p style={{
                        fontSize: '18px',
                        color: '#64748b',
                        lineHeight: '1.6',
                        marginBottom: '40px',
                        maxWidth: '500px'
                    }}>
                        Streamline operational workflows, manage vehicle entries, and monitor zone status in real-time. The ultimate tool for parking staff.
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        style={{
                            padding: '16px 32px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            fontWeight: '600',
                            fontSize: '16px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.3)'
                        }}
                        onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                        onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                        Access Dashboard
                        <ArrowRight size={20} />
                    </button>
                </div>
                <div style={{ flex: 1, position: 'relative' }}>
                    <div style={{
                        position: 'absolute',
                        top: '0',
                        right: '0',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                        borderRadius: '24px',
                        opacity: '0.1',
                        transform: 'rotate(3deg)'
                    }}></div>
                    <img
                        src="/just.jpg"
                        alt="Parking Management"
                        style={{
                            width: '110%',
                            height: '600px',
                            objectFit: 'cover',
                            borderRadius: '24px',
                            position: 'relative',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                        }}
                    />
                </div>
            </div>

            {/* Features Grid */}
            <div style={{ backgroundColor: '#f8fafc', padding: '80px 40px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#0f172a', marginBottom: '16px' }}>
                            Operational Capabilities
                        </h2>
                        <p style={{ color: '#64748b' }}>Everything you need to manage the facility efficiently.</p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '30px'
                    }}>
                        {[
                            {
                                icon: <ShieldCheck size={32} color="#3b82f6" />,
                                title: "Secure Access",
                                desc: "Enterprise-grade security for staff authentication and role management."
                            },
                            {
                                icon: <Clock size={32} color="#3b82f6" />,
                                title: "Real-time Monitoring",
                                desc: "Live updates on zone occupancy, vehicle flows, and payment status."
                            },
                            {
                                icon: <CheckCircle size={32} color="#3b82f6" />,
                                title: "Shift Management",
                                desc: "Track shift logs, attendance, and performance metrics effortlessly."
                            }
                        ].map((feature, idx) => (
                            <div key={idx} style={{
                                backgroundColor: 'white',
                                padding: '32px',
                                borderRadius: '16px',
                                border: '1px solid #e2e8f0',
                                transition: 'transform 0.2s',
                            }}>
                                <div style={{
                                    backgroundColor: '#eff6ff',
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '20px'
                                }}>
                                    {feature.icon}
                                </div>
                                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', marginBottom: '12px' }}>
                                    {feature.title}
                                </h3>
                                <p style={{ color: '#64748b', lineHeight: '1.5' }}>
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffLanding;
