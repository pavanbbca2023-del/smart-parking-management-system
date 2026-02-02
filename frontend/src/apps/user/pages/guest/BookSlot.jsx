import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/PageHeader';
import { parkingApi } from '../../api/api';

const BookSlot = ({ onNavigate, bookingData }) => {
  const [formData, setFormData] = useState({
    selectedZone: '',
    selectedSlot: '',
    vehicleNumber: '',
    vehicleType: 'Car',
    mobileNumber: '',
    email: '',
    entryTime: '',
    exitTime: '',
    paymentMethod: 'UPI'
  });

  const [availableZones, setAvailableZones] = useState([]);
  const [loadingZones, setLoadingZones] = useState(true);

  const [availableSlots, setAvailableSlots] = useState([]);

  const [slot] = useState({
    slotNumber: '',
    zone: '',
    slotType: '',
    status: 'Available'
  });

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await parkingApi.getZones();
        if (response.data && response.data.zones) {
          setAvailableZones(response.data.zones);
        }
      } catch (error) {
        console.error("Failed to fetch booking zones:", error);
      } finally {
        setLoadingZones(false);
      }
    };
    fetchZones();
  }, []);

  useEffect(() => {
    // Pre-populate if navigation data exists
    if (bookingData && availableZones.length > 0) {
      if (bookingData.zoneId) {
        setFormData(prev => ({
          ...prev,
          selectedZone: bookingData.zoneId.toString(),
          selectedSlot: bookingData.slotId || ''
        }));
      }
    }
  }, [bookingData, availableZones]);

  const [charges, setCharges] = useState({
    ratePerHour: 30,
    duration: 0,
    estimatedAmount: 0,
    initialPayment: 50
  });

  useEffect(() => {
    // Generate available slots when zone is selected
    if (formData.selectedZone) {
      const zone = availableZones.find(z => z.id.toString() === formData.selectedZone.toString());
      if (zone && zone.slots) {
        // Map backend slots to dropdown format
        const slots = zone.slots
          .filter(s => !s.is_occupied && s.is_active)
          .map(s => ({
            id: s.slot_number,
            number: s.slot_number,
            status: 'Available'
          }));
        setAvailableSlots(slots);
      }
    } else {
      setAvailableSlots([]);
    }
  }, [formData.selectedZone, availableZones]);

  useEffect(() => {
    // Auto-fill current time
    const now = new Date();
    const entryTime = now.toTimeString().slice(0, 5);

    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    const exitTime = oneHourLater.toTimeString().slice(0, 5);

    setFormData(prev => ({
      ...prev,
      entryTime: entryTime,
      exitTime: exitTime
    }));
  }, []);

  useEffect(() => {
    // Calculate charges when times change
    if (formData.entryTime && formData.exitTime) {
      const entry = new Date(`2024-01-01T${formData.entryTime}`);
      const exit = new Date(`2024-01-01T${formData.exitTime}`);

      if (exit > entry) {
        const durationHours = Math.ceil((exit - entry) / (1000 * 60 * 60));

        // Use real zone rate if zone is selected, else default
        let rate = 30;
        if (formData.selectedZone) {
          const zone = availableZones.find(z => z.id.toString() === formData.selectedZone.toString());
          if (zone) rate = parseFloat(zone.base_price || 30);
        } else {
          rate = formData.vehicleType === 'Bike' ? 10 : (formData.vehicleType === 'Auto' ? 15 : 30);
        }

        const amount = durationHours * rate;

        setCharges(prev => ({
          ...prev,
          ratePerHour: rate,
          duration: durationHours,
          estimatedAmount: amount,
          initialPayment: Math.round(amount * 0.25) // 25% of total
        }));
      }
    }
  }, [formData.entryTime, formData.exitTime, formData.vehicleType, formData.selectedZone, availableZones]);

  const handleChange = (e) => {
    let { name, value } = e.target;

    // Auto-format Vehicle Number (No spaces, Uppercase)
    if (name === 'vehicleNumber') {
      value = value.replace(/\s+/g, '').toUpperCase();
    }

    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset slot selection when zone changes
      ...(name === 'selectedZone' && { selectedSlot: '' })
    }));
  };

  const getFilteredZones = () => {
    return availableZones;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.vehicleNumber || !formData.mobileNumber) {
      alert('Please fill in all required fields');
      return;
    }

    if (!formData.exitTime || formData.exitTime <= formData.entryTime) {
      alert('Exit time must be after entry time');
      return;
    }

    try {
      // Call Backend API
      const response = await parkingApi.bookSlot(formData);

      // Use response data from backend
      const bookingId = response.id; // Or response.booking_id if configured
      const qrData = response.qr_code_data || JSON.stringify(response.qr_code);

      // Prepare complete booking data for next screen
      const bookingData = {
        ...formData,
        slot,
        charges,
        totalAmount: charges.estimatedAmount,
        amountPaid: charges.initialPayment,
        remainingBalance: charges.estimatedAmount - charges.initialPayment,
        bookingId: bookingId,
        qrCode: qrData,
        bookingTime: new Date().toLocaleString(),
        status: 'RESERVED',
        backendSessionId: response.id
      };

      console.log('Booking successful:', response);

      // Redirect to payment page (or confirmation directly as per flow)
      onNavigate('payment', bookingData);

    } catch (error) {
      alert('Booking Failed: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="guest-page book-slot-page">
      <PageHeader
        title="Book Parking Slot"
        description="Complete your booking details"
        icon="📋"
      />

      <div className="booking-layout">
        <div className="booking-left">
          <form onSubmit={handleSubmit} className="booking-form">

            {/* Zone and Slot Selection */}
            <div className="form-section">
              <h3>🏢 Select Parking Zone & Slot</h3>

              {/* Vehicle Type Selection */}
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label htmlFor="vehicleType">Vehicle Type *</label>
                <select
                  id="vehicleType"
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  required
                  style={{ padding: '10px', fontSize: '16px', borderRadius: '6px', border: '1px solid #ddd' }}
                >
                  <option value="Bike">🏍️ Bike</option>
                  <option value="Auto">🛺 Auto</option>
                  <option value="Car">🚗 Car</option>
                  <option value="SUV">🚙 SUV</option>
                </select>
              </div>

              {/* Zone Selection */}
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label htmlFor="selectedZone">Select Zone *</label>
                <select
                  id="selectedZone"
                  name="selectedZone"
                  value={formData.selectedZone}
                  onChange={handleChange}
                  required
                  style={{ padding: '10px', fontSize: '16px', borderRadius: '6px', border: '1px solid #ddd' }}
                >
                  <option value="">{loadingZones ? 'Loading zones...' : 'Choose a parking zone...'}</option>
                  {availableZones.map(zone => (
                    <option key={zone.id} value={zone.id}>
                      {zone.name} ({zone.available_slots} slots available)
                    </option>
                  ))}
                </select>
              </div>

              {/* Slot Selection */}
              {formData.selectedZone && (
                <div className="form-group">
                  <label htmlFor="selectedSlot">Select Slot *</label>
                  <select
                    id="selectedSlot"
                    name="selectedSlot"
                    value={formData.selectedSlot}
                    onChange={handleChange}
                    required
                    style={{ padding: '10px', fontSize: '16px', borderRadius: '6px', border: '1px solid #ddd' }}
                  >
                    <option value="">Choose a slot...</option>
                    {availableSlots.map(slot => (
                      <option key={slot.id} value={slot.number}>
                        Slot {slot.number}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Vehicle Details */}
            <div className="form-section">
              <h3>🚗 Vehicle Information</h3>
              <div className="form-group">
                <label htmlFor="vehicleNumber">Vehicle Number *</label>
                <input
                  type="text"
                  id="vehicleNumber"
                  name="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={handleChange}
                  placeholder="e.g., DL 01 AB 1234"
                  required
                  style={{ padding: '10px', fontSize: '16px', borderRadius: '6px', border: '1px solid #ddd', width: '100%' }}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="form-section">
              <h3>Contact Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="mobileNumber">Mobile Number *</label>
                  <input
                    type="tel"
                    id="mobileNumber"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    placeholder="Enter 10-digit mobile number"
                    pattern="[0-9]{10}"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email ID</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email (optional)"
                  />
                </div>
              </div>
            </div>

            {/* Parking Time Details */}
            <div className="form-section">
              <h3>Parking Time Details</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="entryTime">Entry Time *</label>
                  <input
                    type="time"
                    id="entryTime"
                    name="entryTime"
                    value={formData.entryTime}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="exitTime">Expected Exit Time *</label>
                  <input
                    type="time"
                    id="exitTime"
                    name="exitTime"
                    value={formData.exitTime}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="form-section">
              <div className="form-group">
                <label>Payment Method * (Online Only for Booking)</label>
                <div className="payment-methods">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="UPI"
                      checked={formData.paymentMethod === 'UPI'}
                      onChange={handleChange}
                    />
                    📱 UPI
                  </label>
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Card"
                      checked={formData.paymentMethod === 'Card'}
                      onChange={handleChange}
                    />
                    💳 Card
                  </label>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="form-section">
              <label className="checkbox-label">
                <input type="checkbox" required />
                I agree to the parking rules and charges
              </label>
            </div>

            {/* Action Buttons */}
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => onNavigate('view-slots')}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Confirm Booking
              </button>
            </div>
          </form>
        </div>

        <div className="booking-right">


          {/* Initial Payment Box */}
          <div className="info-box">
            <h4 style={{ marginBottom: '15px', color: '#2c3e50', borderBottom: '2px solid #3498db', paddingBottom: '10px' }}>💳 Initial Payment</h4>
            <p>A minimum initial payment of <strong>25%</strong> is required for booking (₹{charges.initialPayment}).</p>
            <p style={{ marginTop: '8px', fontSize: '13px' }}>The remaining 75% will be collected by staff at the time of exit.</p>
          </div>

          {/* Booking Information Box */}
          <div className="info-box">
            <h4 style={{ marginBottom: '15px', color: '#2c3e50', borderBottom: '2px solid #3498db', paddingBottom: '10px' }}>📋 Booking Information</h4>
            <ul>
              <li>Booking confirmation will be sent via SMS</li>
              <li>Keep your booking ID safe for entry/exit</li>
              <li>Initial payment secures your slot</li>
              <li>Final payment due at exit based on actual duration</li>
              <li>Free cancellation within 30 minutes</li>
            </ul>
          </div>
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
              Book Parking Slot →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookSlot;
