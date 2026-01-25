import React, { useState } from 'react';
import { Users, UserPlus, ShieldCheck, Calendar, BarChart3, ChevronRight } from 'lucide-react';
import StaffDirectory from '../../components/admin/staff/StaffDirectory';
import AddStaffForm from '../../components/admin/staff/AddStaffForm';
import StaffRoles from '../../components/admin/staff/StaffRoles';
import StaffSchedule from '../../components/admin/staff/StaffSchedule';
import StaffPerformance from '../../components/admin/staff/StaffPerformance';
import StaffAttendance from '../../components/admin/staff/StaffAttendance';

const StaffManagement = () => {
  const [activeTab, setActiveTab] = useState('directory');

  const tabs = [
    { id: 'directory', label: 'Staff Roster', icon: <Users size={18} />, color: '#3b82f6' },
    { id: 'add-new', label: 'Onboarding', icon: <UserPlus size={18} />, color: '#10b981' },
    { id: 'attendance', label: 'Attendance', icon: <ChevronRight size={18} />, color: '#10b981' },
    { id: 'roles', label: 'Permissions', icon: <ShieldCheck size={18} />, color: '#8b5cf6' },
    { id: 'schedule', label: 'Duty Roster', icon: <Calendar size={18} />, color: '#f59e0b' },
    { id: 'performance', label: 'Analytics', icon: <BarChart3 size={18} />, color: '#ec4899' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'directory':
        return <StaffDirectory />;
      case 'add-new':
        return <AddStaffForm />;
      case 'attendance':
        return <StaffAttendance />;
      case 'roles':
        return <StaffRoles />;
      case 'schedule':
        return <StaffSchedule />;
      case 'performance':
        return <StaffPerformance />;
      default:
        return <StaffDirectory />;
    }
  };

  return (
    <div style={{
      padding: '40px',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      minHeight: '100vh',
      fontFamily: '"Inter", -apple-system, sans-serif'
    }}>
      {/* Premium Header */}
      <div style={{
        marginBottom: '40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '14px', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <span>Admin</span>
            <ChevronRight size={14} />
            <span style={{ color: '#3b82f6' }}>Human Resources</span>
          </div>
          <h1 style={{
            fontSize: '36px',
            fontWeight: '900',
            color: '#1e293b',
            margin: 0,
            letterSpacing: '-0.02em',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            Staff Operations <span style={{ padding: '4px 12px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '12px', fontSize: '14px', fontWeight: '700' }}>Active System</span>
          </h1>
          <p style={{ fontSize: '16px', color: '#64748b', marginTop: '8px', fontWeight: '400' }}>
            Orchestrate your workforce, manage schedules, and audit team performance.
          </p>
        </div>
      </div>

      {/* Glassmorphic Tab Navigation */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '8px',
        marginBottom: '32px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        display: 'inline-flex',
        gap: '4px'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 24px',
              backgroundColor: activeTab === tab.id ? 'white' : 'transparent',
              color: activeTab === tab.id ? '#1e293b' : '#64748b',
              border: 'none',
              borderRadius: '14px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: activeTab === tab.id ? '0 4px 12px rgba(0,0,0,0.08)' : 'none',
              transform: activeTab === tab.id ? 'translateY(0)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== tab.id) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab.id) e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <span style={{
              color: activeTab === tab.id ? tab.color : '#94a3b8',
              transition: 'color 0.3s'
            }}>
              {tab.icon}
            </span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Area with Animation */}
      <div style={{
        animation: 'fadeIn 0.4s ease-out'
      }}>
        {renderContent()}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default StaffManagement;