import React, { useState, useEffect } from 'react';
import { parkingApi } from '../../api/api';

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

  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await parkingApi.getZones();
        if (response.data && response.data.zones) {
          setZones(response.data.zones);
        }
      } catch (error) {
        console.error("Failed to fetch zones for booking:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchZones();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const selectedZone = zones.find(z => z.name === formData.zone);
      if (!selectedZone) {
        alert('Please select a valid zone');
        return;
      }

      const bookingData = {
        vehicleNumber: formData.vehicleNumber,
        selectedZone: selectedZone.id,
        vehicleType: formData.vehicleType,
        entryTime: `${formData.date} ${formData.startTime}`,
        exitTime: `${formData.date} ${formData.endTime}`,
        mobileNumber: localStorage.getItem('user_phone') || '',
        email: localStorage.getItem('user_email') || ''
      };

      const response = await parkingApi.bookSlot(bookingData);
      
      if (response.success) {
        setBookingConfirmed(true);
        alert(`✅ Booking Confirmed!\n\nBooking ID: ${response.data.session_id}\nSlot: ${response.data.slot_number}\nAmount: ₹${response.data.amount}`);
        
        // Reset form
        setFormData({
          zone: '',
          slotType: '',
          date: '',
          startTime: '',
          endTime: '',
          vehicleNumber: '',
          vehicleType: 'Car'
        });
        
        setTimeout(() => setBookingConfirmed(false), 5000);
      }
    } catch (error) {
      console.error('Booking error:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Network error. Please check your connection.';
      alert(`❌ Booking Failed\n\n${errorMsg}`);
    } finally {
      setLoading(false);
    }
  }

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
              <option value="">{loading ? 'Loading zones...' : 'Choose a zone...'}</option>
              {zones.map(z => (
                <option key={z.id} value={z.name}>
                  {z.name} - ₹{z.base_price}/hr ({z.available_slots} available)
                </option>
              ))}
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

          <button type="submit" className="btn-primary btn-large" disabled={loading}>
            {loading ? 'Processing...' : 'Confirm Booking'}
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
