import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    QrCode,
    CreditCard,
    UserPlus,
    LogOut,
    FileText,
    AlertTriangle,
    History,
    Building2
} from 'lucide-react';

const Sidebar = () => {
    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
        { name: 'Gate Control', icon: <Building2 size={20} />, path: '/gate-control' },
        { name: 'Reports', icon: <FileText size={20} />, path: '/reports' },
        { name: 'Zone Status', icon: <Building2 size={20} />, path: '/zones' },
        { name: 'Active Sessions', icon: <History size={20} />, path: '/active-sessions' },
        { name: 'Alerts', icon: <AlertTriangle size={20} />, path: '/alerts' },
        { name: 'Payments Mgmt', icon: <CreditCard size={20} />, path: '/payments-mgmt' },
    ];

    return (
        <aside style={{
            width: '260px',
            backgroundColor: '#1e293b',
            color: 'white',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '4px 0 10px rgba(0,0,0,0.1)',
            zIndex: 1000
        }}>
            <div style={{
                padding: '24px',
                borderBottom: '1px solid #334155',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
            }}>
                <div style={{
                    backgroundColor: '#3b82f6',
                    padding: '8px',
                    borderRadius: '8px'
                }}>
                    <Building2 size={24} color="white" />
                </div>
                <span style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    letterSpacing: '0.5px'
                }}>PARK-PRO</span>
            </div>

            <nav style={{
                padding: '20px 12px',
                flex: 1,
                overflowY: 'auto'
            }}>
                {menuItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px 16px',
                            color: isActive ? 'white' : '#94a3b8',
                            backgroundColor: isActive ? '#3b82f6' : 'transparent',
                            textDecoration: 'none',
                            borderRadius: '8px',
                            marginBottom: '4px',
                            transition: 'all 0.2s ease',
                            fontWeight: isActive ? '600' : '400'
                        })}
                    >
                        {item.icon}
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div style={{
                padding: '16px',
                borderTop: '1px solid #334155'
            }}>
                <button style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    color: '#f87171',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: '600',
                    transition: 'background-color 0.2s'
                }}>
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
