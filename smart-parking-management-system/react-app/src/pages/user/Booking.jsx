import React, { useState } from 'react';
import './UserPages.css';

const Booking = () => {
  const [bookingData, setBookingData] = useState({
    location: '',
    vehicleNumber: '',
    vehicleType: 'car',
    date: '',
    time: '',
    duration: ''
  });

  const [availableSlots, setAvailableSlots] = useState({
    mall: 15,
    office: 8,
    airport: 23,
    hospital: 5
  });

  const [pricePerHour] = useState({
    mall: 20,
    office: 15,
    airport: 30,
    hospital: 10
  });

  const calculateTotal = () => {
    if (bookingData.location && bookingData.duration) {
      return pricePerHour[bookingData.location] * parseInt(bookingData.duration);
    }
    return 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!bookingData.location || !bookingData.vehicleNumber || !bookingData.date || !bookingData.time || !bookingData.duration) {
      alert('Please fill all required fields');
      return;
    }
    
    const total = calculateTotal();
    const bookingId = 'PK' + Date.now().toString().slice(-6);
    
    alert(`Booking Confirmed!\n\nBooking ID: ${bookingId}\nLocation: ${bookingData.location}\nVehicle: ${bookingData.vehicleNumber}\nDate: ${bookingData.date}\nTime: ${bookingData.time}\nDuration: ${bookingData.duration} hours\nTotal Amount: ₹${total}\n\nPayment: Pay at entry gate`);
    
    // Reset form
    setBookingData({
      location: '',
      vehicleNumber: '',
      vehicleType: 'car',
      date: '',
      time: '',
      duration: ''
    });
  };

  return (
    <div className="booking">
      <div className="booking-header">
        <h1>🚗 Smart Parking Booking</h1>
        <p>Reserve your parking spot in advance</p>
      </div>
      
      <div className="booking-container">
        <div className="booking-form">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>📍 Parking Location *</label>
                <select 
                  value={bookingData.location}
                  onChange={(e) => setBookingData({...bookingData, location: e.target.value})}
                  required
                >
                  <option value="">Select Location</option>
                  <option value="mall">🏬 City Mall - ₹20/hr ({availableSlots.mall} slots)</option>
                  <option value="office">🏢 Business District - ₹15/hr ({availableSlots.office} slots)</option>
                  <option value="airport">✈️ International Airport - ₹30/hr ({availableSlots.airport} slots)</option>
                  <option value="hospital">🏥 General Hospital - ₹10/hr ({availableSlots.hospital} slots)</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>🚙 Vehicle Number *</label>
                <input 
                  type="text"
                  placeholder="e.g., MH 01 AB 1234"
                  value={bookingData.vehicleNumber}
                  onChange={(e) => setBookingData({...bookingData, vehicleNumber: e.target.value.toUpperCase()})}
                  required
                />
              </div>
              <div className="form-group">
                <label>🚗 Vehicle Type</label>
                <select 
                  value={bookingData.vehicleType}
                  onChange={(e) => setBookingData({...bookingData, vehicleType: e.target.value})}
                >
                  <option value="car">Car</option>
                  <option value="bike">Motorcycle</option>
                  <option value="suv">SUV</option>
                  <option value="van">Van</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>📅 Date *</label>
                <input 
                  type="date"
                  value={bookingData.date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>🕐 Time *</label>
                <input 
                  type="time"
                  value={bookingData.time}
                  onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>⏱️ Duration (hours) *</label>
                <select 
                  value={bookingData.duration}
                  onChange={(e) => setBookingData({...bookingData, duration: e.target.value})}
                  required
                >
                  <option value="">Select Duration</option>
                  <option value="1">1 hour</option>
                  <option value="2">2 hours</option>
                  <option value="3">3 hours</option>
                  <option value="4">4 hours</option>
                  <option value="6">6 hours</option>
                  <option value="8">8 hours</option>
                  <option value="12">12 hours</option>
                  <option value="24">24 hours</option>
                </select>
              </div>
            </div>

            {bookingData.location && bookingData.duration && (
              <div className="price-summary">
                <div className="price-row">
                  <span>Rate per hour:</span>
                  <span>₹{pricePerHour[bookingData.location]}</span>
                </div>
                <div className="price-row">
                  <span>Duration:</span>
                  <span>{bookingData.duration} hours</span>
                </div>
                <div className="price-row total">
                  <span>Total Amount:</span>
                  <span>₹{calculateTotal()}</span>
                </div>
              </div>
            )}

            <button type="submit" className="book-btn">
              🎫 Confirm Booking
            </button>
          </form>
        </div>

        <div className="booking-info">
          <div className="info-card">
            <h3>📋 Booking Instructions</h3>
            <ul>
              <li>✅ Arrive within 15 minutes of booked time</li>
              <li>💳 Payment at entry gate (Cash/Card/UPI)</li>
              <li>📱 Show booking confirmation to security</li>
              <li>🚫 No refund for early departure</li>
              <li>⏰ Late arrival may result in slot cancellation</li>
            </ul>
          </div>
          
          <div className="info-card">
            <h3>🎯 Popular Locations</h3>
            <div className="location-stats">
              <div className="stat">
                <span>🏬 City Mall</span>
                <span className={availableSlots.mall > 10 ? 'available' : 'limited'}>
                  {availableSlots.mall} slots
                </span>
              </div>
              <div className="stat">
                <span>✈️ Airport</span>
                <span className={availableSlots.airport > 10 ? 'available' : 'limited'}>
                  {availableSlots.airport} slots
                </span>
              </div>
              <div className="stat">
                <span>🏢 Business District</span>
                <span className={availableSlots.office > 10 ? 'available' : 'limited'}>
                  {availableSlots.office} slots
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
