import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import PageHeader from '../../components/PageHeader';

const BookingConfirmation = ({ bookingData, onNavigate }) => {
  if (!bookingData) {
    return (
      <div className="guest-page">
        <h2>No Booking Data</h2>
        <button onClick={() => onNavigate('home')}>Go Home</button>
      </div>
    );
  }

  const qrValue = bookingData.qrCode || JSON.stringify({
    session_id: bookingData.backendSessionId,
    vehicle_number: bookingData.vehicleNumber,
    type: 'parking_session'
  });

  return (
    <div className="guest-page confirmation-page">
      <PageHeader
        title="Booking Confirmed"
        description="Your parking slot has been successfully reserved"
        icon="✅"
      />

      <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <div style={{
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          marginBottom: '30px'
        }}>
          {/* Success Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
            padding: '30px',
            textAlign: 'center',
            color: 'white'
          }}>
            <div style={{ fontSize: '50px', marginBottom: '10px' }}>✅</div>
            <h2 style={{ margin: '0', fontSize: '24px' }}>Reservation Successful!</h2>
            <p style={{ margin: '5px 0 0 0', opacity: '0.9' }}>Show this QR code at the entry gate</p>
          </div>

          <div style={{ padding: '40px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px' }}>
            {/* Left Column: Details */}
            <div>
              <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', height: '100%' }}>
                <h3 style={{ margin: '0 0 20px 0', color: '#1e293b', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
                  📄 Booking Details
                </h3>

                <div style={{ display: 'grid', gap: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ color: '#64748b', fontSize: '13px', display: 'block' }}>Booking ID</span>
                      <span style={{ fontWeight: '700', color: '#3b82f6', fontSize: '18px' }}>{bookingData.bookingId}</span>
                    </div>
                    {bookingData.status && (
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '700',
                        backgroundColor: bookingData.status === 'ACTIVE' ? '#dcfce7' : '#fef9c3',
                        color: bookingData.status === 'ACTIVE' ? '#166534' : '#854d0e',
                        border: `1px solid ${bookingData.status === 'ACTIVE' ? '#bbf7d0' : '#fef08a'}`
                      }}>
                        ● {bookingData.status}
                      </span>
                    )}
                  </div>

                  <div>
                    <span style={{ color: '#64748b', fontSize: '13px', display: 'block' }}>Vehicle Information</span>
                    <span style={{ fontWeight: '600' }}>{bookingData.vehicleNumber} ({bookingData.vehicleType})</span>
                  </div>

                  <div>
                    <span style={{ color: '#64748b', fontSize: '13px', display: 'block' }}>Zone & Slot</span>
                    <span style={{ fontWeight: '600' }}>{bookingData.selectedZone} / {bookingData.selectedSlot || 'Auto-assign'}</span>
                  </div>

                  <div style={{ marginTop: '10px', padding: '15px', background: 'white', borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ fontSize: '14px', color: '#64748b' }}>Total Estimated:</span>
                      <span style={{ fontWeight: '600' }}>₹{bookingData.totalAmount}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ fontSize: '14px', color: '#059669' }}>
                        {bookingData.amountPaid > 0 ? 'Paid (25%):' : 'Initial Payment Due (25%):'}
                      </span>
                      <span style={{ fontWeight: '700', color: '#059669' }}>
                        ₹{bookingData.amountPaid > 0 ? bookingData.amountPaid : (bookingData.totalAmount * 0.25).toFixed(2)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #e2e8f0', paddingTop: '5px', marginTop: '5px' }}>
                      <span style={{ fontSize: '14px', color: '#dc2626' }}>Pending at Exit:</span>
                      <span style={{ fontWeight: '700', color: '#dc2626' }}>₹{bookingData.remainingBalance}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: QR Code */}
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{
                background: 'white',
                padding: '20px',
                borderRadius: '15px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                border: '1px solid #f1f5f9',
                marginBottom: '15px'
              }}>
                <QRCodeCanvas
                  value={qrValue}
                  size={200}
                  level={"H"}
                  includeMargin={true}
                  imageSettings={{
                    src: "https://cdn-icons-png.flaticon.com/512/2991/2991231.png",
                    x: undefined,
                    y: undefined,
                    height: 40,
                    width: 40,
                    excavate: true,
                  }}
                />
              </div>
              <p style={{ margin: '0', fontSize: '14px', color: '#64748b' }}>Scan at entry for verification</p>
              <div style={{ marginTop: '20px', fontSize: '12px', color: '#94a3b8' }}>
                {bookingData.status === 'RESERVED'
                  ? (bookingData.fullExpiryTime
                    ? `Booking expires on ${new Date(bookingData.fullExpiryTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}`
                    : `Booking expires at ${bookingData.exitTime}`)
                  : `Entry Time: ${bookingData.entryTime}`}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            className="btn-primary"
            onClick={() => onNavigate('home')}
            style={{ padding: '12px 40px', fontSize: '16px', fontWeight: '600' }}
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;