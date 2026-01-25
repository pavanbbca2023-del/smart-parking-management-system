import React from 'react';

const BookingConfirmation = ({ bookingData, onNavigate }) => {
  if (!bookingData) {
    return (
      <div className="guest-page">
        <h2>No Booking Data</h2>
        <button onClick={() => onNavigate('home')}>Go Home</button>
      </div>
    );
  }

  return (
    <div className="guest-page">
      <h2>Booking Confirmed!</h2>
      
      <div>
        <h3>Booking Details</h3>
        <p><strong>Booking ID:</strong> {bookingData.bookingId}</p>
        <p><strong>Vehicle Number:</strong> {bookingData.vehicleNumber}</p>
        <p><strong>Vehicle Type:</strong> {bookingData.vehicleType}</p>
        <p><strong>Mobile Number:</strong> {bookingData.mobileNumber}</p>
        {bookingData.slotNumber && <p><strong>Slot Number:</strong> {bookingData.slotNumber}</p>}
      </div>
      
      <div>
        <h3>QR Code</h3>
        <div style={{ border: '1px solid #ccc', padding: '20px', textAlign: 'center' }}>
          QR Code: {bookingData.bookingId}
        </div>
      </div>
      
      <button onClick={() => onNavigate('home')}>Back to Home</button>
    </div>
  );
};

export default BookingConfirmation;