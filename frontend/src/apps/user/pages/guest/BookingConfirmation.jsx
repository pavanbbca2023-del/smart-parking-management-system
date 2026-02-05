import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import PageHeader from '../../components/PageHeader';
import { Download, Home, Share2, Clock, Calendar, MapPin, CreditCard, Info } from 'lucide-react';

const BookingConfirmation = ({ bookingData, onNavigate }) => {
  if (!bookingData) {
    return (
      <div className="guest-page">
        <h2>No Booking Data</h2>
        <button onClick={() => onNavigate('home')}>Go Home</button>
      </div>
    );
  }

  // --- Logic & Helpers ---
  const isPending = ['PENDING_PAYMENT', 'RESERVED'].includes(bookingData.status);

  // Calculate Duration Hours for Pricing
  const getDurationHours = (start, end) => {
    if (!start || !end) return 1;
    let [h1, m1] = start.split(':').map(Number);
    let [h2, m2] = end.split(':').map(Number);
    let minutes1 = h1 * 60 + m1;
    let minutes2 = h2 * 60 + m2;
    if (minutes2 < minutes1) minutes2 += 24 * 60;
    const diff = minutes2 - minutes1;
    return Math.ceil(diff / 60);
  };

  const durationHrs = getDurationHours(bookingData.entryTime, bookingData.exitTime);
  const ratePerHour = bookingData.charges?.ratePerHour || 30; // Fallback to 30 if missing

  // Recalculate Total Amount to ensure consistency
  const totalAmount = durationHrs * ratePerHour;

  // If amountPaid is passed (and > 0), use it. Otherwise, assume 25% is due now.
  let amountPaid = parseFloat(bookingData.amountPaid || 0);

  // For display purposes, let's behave as if the 25% is the "Booking Fee".
  const bookingFee = Math.round(totalAmount * 0.25);

  // If 0 was passed for amountPaid, we assume the user NEEDS to pay the booking fee.
  const effectivelyPaid = amountPaid > 0 ? amountPaid : 0;
  const initialDue = bookingFee;

  // Remaining at Exit = Total - (What has been paid OR what is being paid now)
  const remainingAtExit = totalAmount - Math.max(effectivelyPaid, initialDue);

  // Helper to format 24h time to 12h AM/PM
  const formatTime = (timeStr) => {
    if (!timeStr) return '--:--';

    // Handle strings with T (ISO from backend)
    if (typeof timeStr === 'string' && timeStr.includes('T')) {
      return new Date(timeStr).toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }

    // Handle strings with : (HH:MM from frontend)
    if (typeof timeStr === 'string' && timeStr.includes(':')) {
      const parts = timeStr.split(':');
      const h = parseInt(parts[0]);
      const m = parseInt(parts[1]);
      const date = new Date();
      date.setHours(h, m);
      return date.toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }

    return timeStr;
  };

  // Helper to calculate duration accurately
  const getDuration = (start, end) => {
    if (!start || !end) return bookingData.duration || '0h 0m';

    // Only proceed if strings are HH:MM
    if (typeof start !== 'string' || !start.includes(':')) return bookingData.duration;
    if (typeof end !== 'string' || !end.includes(':')) return bookingData.duration;

    let [h1, m1] = start.split(':').map(Number);
    let [h2, m2] = end.split(':').map(Number);

    if (isNaN(h1) || isNaN(h2)) return bookingData.duration;

    let minutes1 = h1 * 60 + m1;
    let minutes2 = h2 * 60 + m2;

    // Handle overnight
    if (minutes2 < minutes1) {
      minutes2 += 24 * 60;
    }

    const diff = minutes2 - minutes1;
    const hrs = Math.floor(diff / 60);
    const mins = diff % 60;

    return `${hrs}h ${mins}m`;
  };

  const qrValue = bookingData.qrCode || JSON.stringify({
    session_id: bookingData.backendSessionId,
    vehicle_number: bookingData.vehicleNumber,
    type: 'parking_session'
  });

  return (
    <div className="guest-page confirmation-page" style={{ background: '#f1f5f9', minHeight: '100vh', paddingBottom: '40px' }}>
      <PageHeader
        title="Booking Confirmed"
        description="Your space is reserved successfully"
        icon="✅"
      />

      <div className="container" style={{ maxWidth: '600px', margin: '0 auto', padding: '0 20px' }}>

        {/* Ticket Card */}
        <div style={{
          background: 'white',
          borderRadius: '24px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
          overflow: 'hidden',
          position: 'relative'
        }}>

          {/* Top Green Banner */}
          <div style={{
            background: '#10b981',
            padding: '24px',
            textAlign: 'center',
            color: 'white',
            position: 'relative'
          }}>
            <div style={{
              background: 'white',
              color: '#10b981',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '30px',
              margin: '0 auto 12px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
            }}>
              ✓
            </div>
            <h2 style={{ fontSize: '22px', margin: '0 0 4px', fontWeight: '700' }}>
              {bookingData.status || 'RESERVED'}
            </h2>
            <div style={{ margin: '8px 0', opacity: 0.9, fontSize: '14px' }}>
              <span style={{
                background: 'rgba(255,255,255,0.2)',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Booking ID: {bookingData.bookingId}
              </span>
            </div>
          </div>

          {/* Ticket Body */}
          <div style={{ padding: '30px' }}>

            {/* QR Code Section */}
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div style={{
                background: 'white',
                padding: '16px',
                borderRadius: '16px',
                display: 'inline-block',
                border: '2px dashed #e2e8f0'
              }}>
                <QRCodeCanvas
                  value={qrValue}
                  size={180}
                  level={"H"}
                  imageSettings={{
                    src: "https://cdn-icons-png.flaticon.com/512/2991/2991231.png",
                    height: 30,
                    width: 30,
                    excavate: true,
                  }}
                />
              </div>
              <p style={{ color: '#64748b', fontSize: '13px', marginTop: '12px' }}>
                Scan this QR at the Entry & Exit gates
              </p>
            </div>

            {/* Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>

              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', color: '#64748b', fontSize: '12px' }}>
                  <Info size={14} /> Status
                </div>
                <div style={{
                  fontWeight: '700',
                  color: bookingData.status === 'ACTIVE' ? '#166534' : '#b45309',
                  fontSize: '15px'
                }}>
                  {bookingData.status || 'RESERVED'}
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', color: '#64748b', fontSize: '12px' }}>
                  <MapPin size={14} /> Zone
                </div>
                <div style={{ fontWeight: '700', color: '#1e293b' }}>
                  {bookingData.selectedZone} <span style={{ color: '#cbd5e1' }}>|</span> {bookingData.selectedSlot || 'Auto'}
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', color: '#64748b', fontSize: '12px' }}>
                  <Calendar size={14} /> Date
                </div>
                <div style={{ fontWeight: '700', color: '#1e293b' }}>
                  {bookingData.bookingTime ?
                    new Date(bookingData.bookingTime).toLocaleDateString(undefined, { day: '2-digit', month: 'short' }) :
                    new Date().toLocaleDateString(undefined, { day: '2-digit', month: 'short' })
                  }
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', color: '#64748b', fontSize: '12px' }}>
                  <Clock size={14} /> Start Time
                </div>
                <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '15px' }}>
                  {formatTime(bookingData.entryTime || bookingData.entry_time)}
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', color: '#64748b', fontSize: '12px' }}>
                  <Clock size={14} /> End Time
                </div>
                <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '15px' }}>
                  {formatTime(bookingData.exitTime || bookingData.exit_time)}
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', color: '#64748b', fontSize: '12px' }}>
                  <Calendar size={14} /> Vehicle
                </div>
                <div style={{ fontWeight: '700', color: '#1e293b' }}>
                  {bookingData.vehicleNumber}
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', color: '#64748b', fontSize: '12px' }}>
                  <Clock size={14} /> Total Duration
                </div>
                <div style={{ fontWeight: '700', color: '#1e293b' }}>
                  {getDuration(bookingData.entryTime, bookingData.exitTime)}
                </div>
              </div>
            </div>

            {/* Payment Breakdown */}
            <div style={{
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '20px',
              background: '#fff'
            }}>
              <h3 style={{ fontSize: '16px', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CreditCard size={18} color="#3b82f6" /> Payment Summary
              </h3>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' }}>
                <span style={{ color: '#64748b' }}>Total Estimate</span>
                <span style={{ fontWeight: '600' }}>₹{totalAmount.toFixed(2)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' }}>
                <span style={{ color: '#10b981' }}>Booking Fee (25%)</span>
                <span style={{ fontWeight: '600', color: '#10b981' }}>₹{initialDue.toFixed(2)}</span>
              </div>

              <div style={{ margin: '12px 0', borderTop: '1px dashed #e2e8f0' }}></div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}>
                <span style={{ color: '#ef4444', fontWeight: '500' }}>Balance at Exit</span>
                <span style={{ fontWeight: '800', color: '#ef4444' }}>₹{remainingAtExit.toFixed(2)}</span>
              </div>
            </div>

          </div>

          {/* Decorative Cutout Circles for Ticket Look */}
          <div style={{
            position: 'absolute',
            top: '220px',
            left: '-15px',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            background: '#f1f5f9'
          }}></div>
          <div style={{
            position: 'absolute',
            top: '220px',
            right: '-15px',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            background: '#f1f5f9'
          }}></div>

        </div>

        {/* Action Buttons */}
        <div style={{ marginTop: '30px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button
            onClick={() => onNavigate('home')}
            style={{
              padding: '14px 28px',
              borderRadius: '12px',
              border: 'none',
              background: '#3b82f6',
              color: 'white',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
            }}
          >
            <Home size={18} /> Return Home
          </button>

          <button
            onClick={() => window.print()}
            style={{
              padding: '14px 28px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              background: 'white',
              color: '#334155',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}
          >
            <Download size={18} /> Save Ticket
          </button>
        </div>

      </div>
    </div>
  );
};

export default BookingConfirmation;