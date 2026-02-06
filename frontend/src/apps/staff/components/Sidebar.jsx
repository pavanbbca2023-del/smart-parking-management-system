import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { attendanceApi } from '../api/api';

const Sidebar = () => {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await attendanceApi.logExit();
        } catch (error) {
            console.error('Attendance exit recording failed:', error);
        }
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/');
    };

    const menuItems = [
        { name: 'Dashboard', icon: '📊', path: '/staff/dashboard' },
        { name: 'Gate Control', icon: '🚧', path: '/staff/gate-control' },
        { name: 'Reports', icon: '📋', path: '/staff/reports' },
        { name: 'Zone Status', icon: '🏢', path: '/staff/zones' },
        { name: 'Active Sessions', icon: '⏱️', path: '/staff/active-sessions' },
        { name: 'Alerts', icon: '⚠️', path: '/staff/alerts' },
        { name: 'Payments Mgmt', icon: '💳', path: '/staff/payments-mgmt' },
    ];

    const sidebarStyles = {
        width: '260px',
        background: 'linear-gradient(180deg, #1e3a8a 0%, #1e40af 50%, #1d4ed8 100%)',
        color: 'white',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '4px 0 20px rgba(0, 0, 0, 0.15)',
        zIndex: 1000,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        transition: 'transform 0.3s ease-in-out'
    };

    const mobileSidebarStyles = {
        ...sidebarStyles,
        transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)'
    };

    return (
        <>
            {/* Mobile Hamburger Button */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                style={{
                    display: 'none',
                    position: 'fixed',
                    top: '16px',
                    left: '16px',
                    zIndex: 1001,
                    backgroundColor: '#1e40af',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                    fontSize: '24px',
                    lineHeight: '1'
                }}
                className="mobile-menu-toggle"
            >
                {isMobileMenuOpen ? '✕' : '☰'}
            </button>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{
                        display: 'none',
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 999
                    }}
                    className="mobile-overlay"
                />
            )}

            <aside style={sidebarStyles} className="sidebar-desktop">
                {/* Header - Fixed */}
                <div style={{
                    padding: '24px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    flexShrink: 0
                }}>
                    <div style={{
                        backgroundColor: '#3b82f6',
                        padding: '8px',
                        borderRadius: '8px',
                        fontSize: '24px',
                        lineHeight: '1'
                    }}>
                        🅿️
                    </div>
                    <span style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        letterSpacing: '0.5px'
                    }}>Quick Park</span>
                </div>

                {/* Navigation - Scrollable */}
                <nav style={{
                    padding: '20px 12px',
                    flex: 1,
                    overflowY: 'auto',
                    overflowX: 'hidden'
                }}>
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px 16px',
                                color: isActive ? 'white' : 'rgba(255, 255, 255, 0.7)',
                                backgroundColor: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                                borderRight: isActive ? '4px solid #60a5fa' : 'none',
                                textDecoration: 'none',
                                borderRadius: '8px',
                                marginBottom: '4px',
                                transition: 'all 0.2s ease',
                                fontWeight: isActive ? '600' : '400'
                            })}
                        >
                            <span style={{ fontSize: '20px' }}>{item.icon}</span>
                            <span>{item.name}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Footer - Fixed */}
                <div style={{
                    padding: '16px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    flexShrink: 0
                }}>
                    <button style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        color: '#fca5a5',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        borderRadius: '8px',
                        fontSize: '15px',
                        fontWeight: '600',
                        transition: 'background-color 0.2s'
                    }}
                        onClick={handleLogout}
                    >
                        <span style={{ fontSize: '20px' }}>🚪</span>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar */}
            <aside style={mobileSidebarStyles} className="sidebar-mobile">
                {/* Header - Fixed */}
                <div style={{
                    padding: '24px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    flexShrink: 0
                }}>
                    <div style={{
                        backgroundColor: '#3b82f6',
                        padding: '8px',
                        borderRadius: '8px',
                        fontSize: '24px',
                        lineHeight: '1'
                    }}>
                        🅿️
                    </div>
                    <span style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        letterSpacing: '0.5px'
                    }}>Quick Park</span>
                </div>

                {/* Navigation - Scrollable */}
                <nav style={{
                    padding: '20px 12px',
                    flex: 1,
                    overflowY: 'auto',
                    overflowX: 'hidden'
                }}>
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px 16px',
                                color: isActive ? 'white' : 'rgba(255, 255, 255, 0.7)',
                                backgroundColor: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                                borderRight: isActive ? '4px solid #60a5fa' : 'none',
                                textDecoration: 'none',
                                borderRadius: '8px',
                                marginBottom: '4px',
                                transition: 'all 0.2s ease',
                                fontWeight: isActive ? '600' : '400'
                            })}
                        >
                            <span style={{ fontSize: '20px' }}>{item.icon}</span>
                            <span>{item.name}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Footer - Fixed */}
                <div style={{
                    padding: '16px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    flexShrink: 0
                }}>
                    <button style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        color: '#fca5a5',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        borderRadius: '8px',
                        fontSize: '15px',
                        fontWeight: '600',
                        transition: 'background-color 0.2s'
                    }}
                        onClick={handleLogout}
                    >
                        <span style={{ fontSize: '20px' }}>🚪</span>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            <style>{`
                @media (max-width: 768px) {
                    .sidebar-desktop {
                        display: none !important;
                    }
                    .sidebar-mobile {
                        display: flex !important;
                    }
                    .mobile-menu-toggle {
                        display: block !important;
                    }
                    .mobile-overlay {
                        display: block !important;
                    }
                }
                @media (min-width: 769px) {
                    .sidebar-mobile {
                        display: none !important;
                    }
                }
            `}</style>
        </>
    );
};

export default Sidebar;
