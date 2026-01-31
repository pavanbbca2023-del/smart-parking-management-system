import React from 'react';
import PageHeader from '../../components/PageHeader';

const Receipt = ({ onNavigate, receiptData }) => {
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();

  return (
    <div className="guest-page receipt-page">
      {/* Page Header */}
      <PageHeader
        title="Payment Receipt"
        description="Your parking session has been completed successfully"
        icon="🧾"
      />

      <div className="receipt-container" style={{
        background: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '16px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
        margin: '32px auto',
        maxWidth: '1200px',
        width: 'calc(100% - 48px)',
        padding: '40px'
      }}>
        {/* Receipt Header */}
        <div className="receipt-header" style={{
          textAlign: 'center',
          borderBottom: '2px solid #e5e7eb',
          paddingBottom: '24px',
          marginBottom: '32px'
        }}>
          <h2 style={{ color: '#059669', margin: '0 0 8px 0' }}>✅ Payment Successful</h2>
          <p style={{ color: '#6b7280', margin: '0' }}>Receipt ID: {receiptData?.receiptId || 'EXIT123456'}</p>
          <p style={{ color: '#6b7280', margin: '4px 0 0 0', fontSize: '14px' }}>{currentDate} at {currentTime}</p>
        </div>

        {/* Two Column Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
          {/* Left Column */}
          <div>
            {/* Vehicle & Booking Details */}
            <div className="receipt-card" style={{
              background: '#f8fafc',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px'
            }}>
              <h3>🚗 Vehicle Details</h3>
              <div className="info-group" style={{ display: 'grid', gap: '12px' }}>
                <div className="info-item" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>Booking ID:</span>
                  <span style={{ fontWeight: '600', color: '#3b82f6' }}>{receiptData?.bookingId || 'BK001'}</span>
                </div>
                <div className="info-item" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>Vehicle Number:</span>
                  <span style={{ fontWeight: '600' }}>{receiptData?.vehicleNumber || 'DL 01 AB 1234'}</span>
                </div>
                <div className="info-item" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>Vehicle Type:</span>
                  <span>{receiptData?.vehicleType || 'Car'}</span>
                </div>
                <div className="info-item" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>Parking Slot:</span>
                  <span style={{ fontWeight: '600', color: '#059669' }}>{receiptData?.slotNumber || 'A-001'}</span>
                </div>
              </div>
            </div>

            {/* Parking Duration */}
            <div className="receipt-card" style={{
              background: '#f8fafc',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '24px'
            }}>
              <h3>⏱️ Parking Duration</h3>
              <div className="info-group" style={{ display: 'grid', gap: '12px' }}>
                <div className="info-item" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>Entry Time:</span>
                  <span style={{ fontWeight: '600' }}>{receiptData?.entryTime || '09:00'}</span>
                </div>
                <div className="info-item" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>Exit Time:</span>
                  <span style={{ fontWeight: '600' }}>{receiptData?.exitTime || '12:00'}</span>
                </div>
                <div className="info-item" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>Total Duration:</span>
                  <span style={{ fontWeight: '600', color: '#059669' }}>{receiptData?.duration || '3 hours'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            {/* Payment Summary */}
            <div className="receipt-card" style={{
              background: '#f8fafc',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px'
            }}>
              <h3>💰 Payment Summary</h3>
              <div className="charges-breakdown" style={{ display: 'grid', gap: '12px' }}>
                <div className="charge-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                  <span style={{ color: '#6b7280' }}>Rate per Hour:</span>
                  <span style={{ fontWeight: '600' }}>₹30</span>
                </div>
                <div className="charge-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                  <span style={{ color: '#6b7280' }}>Duration:</span>
                  <span style={{ fontWeight: '600' }}>{receiptData?.duration || '3 hours'}</span>
                </div>
                <div className="charge-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                  <span style={{ color: '#6b7280' }}>Base Charge:</span>
                  <span style={{ fontWeight: '600' }}>₹{receiptData?.baseAmount || '76'}</span>
                </div>
                <div className="charge-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                  <span style={{ color: '#6b7280' }}>GST (18%):</span>
                  <span style={{ fontWeight: '600' }}>₹{receiptData?.gstAmount || '14'}</span>
                </div>
                <div className="charge-item total" style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: '#dcfce7', borderRadius: '8px', marginTop: '12px' }}>
                  <span style={{ fontWeight: '700', color: '#166534', fontSize: '18px' }}>Total Paid:</span>
                  <span style={{ fontWeight: '700', color: '#166534', fontSize: '20px' }}>₹{receiptData?.totalAmount || '90'}</span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="receipt-card" style={{
              background: '#f8fafc',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '24px'
            }}>
              <h3>💳 Payment Details</h3>
              <div className="info-group" style={{ display: 'grid', gap: '12px' }}>
                <div className="info-item" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>Payment Method:</span>
                  <span style={{ fontWeight: '600' }}>{receiptData?.paymentMethod || 'UPI'}</span>
                </div>
                <div className="info-item" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>Transaction ID:</span>
                  <span style={{ fontWeight: '600', fontSize: '14px' }}>{receiptData?.transactionId || 'TXN789012345'}</span>
                </div>
                <div className="info-item" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>Status:</span>
                  <span style={{ fontWeight: '600', color: '#059669' }}>✅ Completed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Thank You Message */}
        <div className="thank-you-section" style={{
          background: 'linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%)',
          border: '1px solid #bfdbfe',
          borderRadius: '12px',
          padding: '24px',
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <h3 style={{ color: '#1e40af', margin: '0 0 8px 0' }}>🙏 Thank You!</h3>
          <p style={{ color: '#1e40af', margin: '0', fontSize: '16px' }}>Your parking session has been completed successfully. Have a safe journey!</p>
        </div>

        {/* Action Buttons */}
        <div className="receipt-actions" style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            className="btn-primary"
            onClick={() => onNavigate('home')}
            style={{ padding: '12px 32px', fontSize: '16px', fontWeight: '600' }}
          >
            Back to Home
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="actions-section">
        <div className="container">
          <div className="page-actions">
            <button className="btn-secondary" onClick={() => onNavigate('home')}>
              ← Back to Home
            </button>
            <button className="btn-primary" onClick={() => onNavigate('book-slot')}>
              Book New Slot →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receipt;