import React, { useState } from 'react';
import EntryExitLogs from '../../components/admin/operations/EntryExitLogs';
import BookingHistory from '../../components/admin/operations/BookingHistory';
import SessionManagement from '../../components/admin/operations/SessionManagement';
import DisputesIssues from '../../components/admin/operations/DisputesIssues';
import CancellationLogs from '../../components/admin/operations/CancellationLogs';

const ParkingOperations = () => {
  const [activeTab, setActiveTab] = useState('entry-exit');

  const tabs = [
    { id: 'entry-exit', label: 'Entry/Exit Logs', icon: '🚪' },
    { id: 'booking-history', label: 'Booking History', icon: '📅' },
    { id: 'sessions', label: 'Session Management', icon: '🔄' },
    { id: 'disputes', label: 'Disputes/Issues', icon: '⚠️' },
    { id: 'cancellations', label: 'Cancellation Logs', icon: '📋' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'entry-exit':
        return <EntryExitLogs />;
      case 'booking-history':
        return <BookingHistory />;
      case 'sessions':
        return <SessionManagement />;
      case 'disputes':
        return <DisputesIssues />;
      case 'cancellations':
        return <CancellationLogs />;
      default:
        return <EntryExitLogs />;
    }
  };

  return (
    <div style={{
      padding: '32px',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      minHeight: '100vh',
      fontFamily: '"Inter", -apple-system, sans-serif'
    }}>
      {/* Header Section */}
      <div style={{
        marginBottom: '40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline'
      }}>
        <div>
          <h1 style={{
            fontSize: '36px',
            fontWeight: '800',
            background: 'linear-gradient(to right, #1e293b, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 10px 0',
            letterSpacing: '-0.025em'
          }}>
            🚗 PARKING OPERATIONS
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#64748b',
            margin: '0',
            fontWeight: '500'
          }}>
            Manage live parking activities, logs, and session records
          </p>
        </div>
        <div style={{
          fontSize: '14px',
          color: '#94a3b8',
          fontStyle: 'italic'
        }}>
          Real-time Monitoring Active
        </div>
      </div>

      {/* Modern Glassmorphic Tab Navigation */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '8px',
        marginBottom: '32px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 24px',
              backgroundColor: activeTab === tab.id ? '#3b82f6' : 'transparent',
              color: activeTab === tab.id ? 'white' : '#64748b',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: activeTab === tab.id ? '0 10px 15px -3px rgba(59, 130, 246, 0.3)' : 'none',
              transform: activeTab === tab.id ? 'translateY(-1px)' : 'none'
            }}
          >
            <span style={{ fontSize: '18px' }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area with smooth transition */}
      <div style={{
        animation: 'fadeIn 0.5s ease-out'
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

export default ParkingOperations;