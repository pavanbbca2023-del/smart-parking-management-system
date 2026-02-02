import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import BookingConfirmation from './guest/BookingConfirmation';

const TestPage = () => {
  const [showQRTest, setShowQRTest] = useState(false);
  const [showBookingTest, setShowBookingTest] = useState(false);

  // Sample booking data for testing
  const sampleBookingData = {
    bookingId: 'BK' + Date.now(),
    ownerName: 'John Doe',
    vehicleNumber: 'DL 01 AB 1234',
    vehicleType: 'Car',
    mobile: '9876543210',
    slotNumber: 'A-001',
    entryTime: '10:00',
    exitTime: '14:00',
    paymentStatus: 'CONFIRMED'
  };

  const handleNavigate = (page, data) => {
    console.log('Navigate to:', page, data);
  };

  return (
    <div style={{padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh'}}>
      <h1 style={{color: '#333', fontSize: '24px', marginBottom: '20px'}}>QR Code & Booking Test Page</h1>
      
      <div style={{marginBottom: '30px'}}>
        <button 
          onClick={() => setShowQRTest(!showQRTest)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          {showQRTest ? 'Hide' : 'Show'} QR Code Test
        </button>
        
        <button 
          onClick={() => setShowBookingTest(!showBookingTest)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          {showBookingTest ? 'Hide' : 'Show'} Booking Confirmation Test
        </button>
      </div>

      {showQRTest && (
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2>QR Code Generation Test</h2>
          <p>Booking ID: <strong>{sampleBookingData.bookingId}</strong></p>
          <div style={{textAlign: 'center', padding: '20px'}}>
            <QRCodeCanvas 
              value={sampleBookingData.bookingId}
              size={200}
              level="H"
              includeMargin={true}
              bgColor="#ffffff"
              fgColor="#000000"
            />
            <p style={{marginTop: '10px', color: '#666'}}>Scan this QR code for entry/exit</p>
          </div>
        </div>
      )}

      {showBookingTest && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <BookingConfirmation 
            bookingData={sampleBookingData}
            onNavigate={handleNavigate}
          />
        </div>
      )}

      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '12px',
        marginTop: '20px'
      }}>
        <h3>Implementation Status ✅</h3>
        <ul style={{lineHeight: '1.6'}}>
          <li>✅ QR code generation using qrcode.react library</li>
          <li>✅ Unique Booking ID generation (timestamp + random)</li>
          <li>✅ BookingConfirmation component with QR display</li>
          <li>✅ Payment flow integration</li>
          <li>✅ Guest-based booking (no login required)</li>
          <li>✅ QR code contains Booking ID for entry/exit verification</li>
          <li>✅ Clean UI suitable for college project</li>
        </ul>
      </div>
    </div>
  );
};

export default TestPage;