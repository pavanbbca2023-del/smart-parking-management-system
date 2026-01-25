import React, { useState } from 'react';

const SlotBooking = () => {
  const [formData, setFormData] = useState({
    zone: '',
    slotType: '',
    date: '',
    startTime: '',
    endTime: '',
    vehicleNumber: '',
    vehicleType: 'Car'
  });

  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setBookingConfirmed(true);
    setTimeout(() => setBookingConfirmed(false), 5000);
  };

  return (
    <div className="page">
      <h1>Book a Parking Slot</h1>
      <p>Reserve your parking slot easily</p>

      {bookingConfirmed && (
        <div className="success-message">
          ✅ Booking Confirmed! Your slot has been reserved. Check booking history for details.
        </div>
      )}

      <div className="booking-container">
        <form className="booking-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Zone *</label>
            <select 
              name="zone" 
              value={formData.zone} 
              onChange={handleChange} 
              required
            >
              <option value="">Choose a zone...</option>
              <option value="Zone A">Zone A - Building A (Premium)</option>
              <option value="Zone B">Zone B - Building B (Standard)</option>
              <option value="Zone C">Zone C - Building C (Economy)</option>
              <option value="Zone D">Zone D - Ground Floor (Premium)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Slot Type *</label>
            <select 
              name="slotType" 
              value={formData.slotType} 
              onChange={handleChange} 
              required
            >
              <option value="">Choose slot type...</option>
              <option value="Economy">Economy - ₹30/hr</option>
              <option value="Standard">Standard - ₹40/hr</option>
              <option value="Premium">Premium - ₹75/hr</option>
            </select>
          </div>

          <div className="form-group">
            <label>Booking Date *</label>
            <input 
              type="date" 
              name="date" 
              value={formData.date} 
              onChange={handleChange} 
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Time *</label>
              <input 
                type="time" 
                name="startTime" 
                value={formData.startTime} 
                onChange={handleChange} 
                required
              />
            </div>
            <div className="form-group">
              <label>End Time *</label>
              <input 
                type="time" 
                name="endTime" 
                value={formData.endTime} 
                onChange={handleChange} 
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Vehicle Type *</label>
            <select 
              name="vehicleType" 
              value={formData.vehicleType} 
              onChange={handleChange} 
              required
            >
              <option value="Car">Car</option>
              <option value="Bike">Bike</option>
              <option value="SUV">SUV</option>
              <option value="Truck">Truck</option>
            </select>
          </div>

          <div className="form-group">
            <label>Vehicle Number *</label>
            <input 
              type="text" 
              name="vehicleNumber" 
              placeholder="e.g., DL 01 AB 1234"
              value={formData.vehicleNumber} 
              onChange={handleChange} 
              required
            />
          </div>

          <button type="submit" className="btn-primary btn-large">
            Confirm Booking
          </button>
        </form>

        <div className="booking-summary">
          <h3>Booking Summary</h3>
          {formData.zone && (
            <>
              <p><strong>Zone:</strong> {formData.zone}</p>
              <p><strong>Slot Type:</strong> {formData.slotType || '-'}</p>
              <p><strong>Date:</strong> {formData.date || '-'}</p>
              <p><strong>Time:</strong> {formData.startTime && formData.endTime ? `${formData.startTime} - ${formData.endTime}` : '-'}</p>
              <p><strong>Vehicle:</strong> {formData.vehicleType} ({formData.vehicleNumber || '-'})</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SlotBooking;
