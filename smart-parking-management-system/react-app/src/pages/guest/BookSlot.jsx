import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/PageHeader';

const BookSlot = ({ onNavigate, selectedSlot }) => {
  const [formData, setFormData] = useState({
    selectedZone: '',
    selectedSlot: '',
    vehicleNumber: '',
    vehicleType: 'Car',
    mobileNumber: '',
    email: '',
    entryTime: '',
    exitTime: '',
    paymentMethod: 'Cash'
  });

  const [availableZones] = useState([
    { id: 'A', name: 'Zone A - Ground Floor', vehicleTypes: ['Bike', 'Auto', 'Car', 'SUV'], availableSlots: 15 },
    { id: 'B', name: 'Zone B - Ground Floor', vehicleTypes: ['Bike', 'Auto', 'Car', 'SUV'], availableSlots: 12 },
    { id: 'C', name: 'Zone C - First Floor', vehicleTypes: ['Bike', 'Auto', 'Car', 'SUV'], availableSlots: 8 },
    { id: 'D', name: 'Zone D - First Floor', vehicleTypes: ['Bike', 'Auto', 'Car', 'SUV'], availableSlots: 5 },
    { id: 'E', name: 'Zone E - Second Floor', vehicleTypes: ['Bike', 'Auto', 'Car', 'SUV'], availableSlots: 10 },
    { id: 'F', name: 'Zone F - Basement', vehicleTypes: ['Bike', 'Auto', 'Car', 'SUV'], availableSlots: 20 }
  ]);

  const [availableSlots, setAvailableSlots] = useState([]);

  const [slot] = useState(selectedSlot || {
    slotNumber: '',
    zone: '',
    slotType: '',
    status: 'Available'
  });

  const [charges, setCharges] = useState({
    ratePerHour: 30,
    duration: 0,
    estimatedAmount: 0,
    initialPayment: 50
  });

  useEffect(() => {
    // Generate available slots when zone is selected
    if (formData.selectedZone) {
      const zone = availableZones.find(z => z.id === formData.selectedZone);
      if (zone) {
        const slots = [];
        for (let i = 1; i <= zone.availableSlots + 5; i++) {
          slots.push({
            id: `${zone.id}-${i.toString().padStart(3, '0')}`,
            number: `${zone.id}-${i.toString().padStart(3, '0')}`,
            status: i <= zone.availableSlots ? 'Available' : 'Occupied'
          });
        }
        setAvailableSlots(slots.filter(s => s.status === 'Available'));
      }
    } else {
      setAvailableSlots([]);
    }
  }, [formData.selectedZone, availableZones]);

  useEffect(() => {
    // Auto-fill current time
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    setFormData(prev => ({ ...prev, entryTime: currentTime }));
  }, []);

  useEffect(() => {
    // Calculate charges when times change
    if (formData.entryTime && formData.exitTime) {
      const entry = new Date(`2024-01-01T${formData.entryTime}`);
      const exit = new Date(`2024-01-01T${formData.exitTime}`);
      
      if (exit > entry) {
        const durationHours = Math.ceil((exit - entry) / (1000 * 60 * 60));
        const rate = formData.vehicleType === 'Bike' ? 15 : 30;
        const amount = durationHours * rate;
        
        setCharges(prev => ({
          ...prev,
          ratePerHour: rate,
          duration: durationHours,
          estimatedAmount: amount
        }));
      }
    }
  }, [formData.entryTime, formData.exitTime, formData.vehicleType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.vehicleNumber || !formData.mobileNumber) {
      alert('Please fill in all required fields');
      return;
    }
    
    if (!formData.exitTime || formData.exitTime <= formData.entryTime) {
      alert('Exit time must be after entry time');
      return;
    }

    // Generate unique booking ID
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000);
    const bookingId = `BK${timestamp}${randomNum}`;
    
    // Generate QR code data
    const qrData = `BOOKING:${bookingId}|SLOT:${slot.slotNumber}|VEHICLE:${formData.vehicleNumber}|ENTRY:${formData.entryTime}|EXIT:${formData.exitTime}|MOBILE:${formData.mobileNumber}`;
    
    // Prepare complete booking data
    const bookingData = {
      ...formData,
      slot,
      charges,
      bookingId,
      qrCode: qrData,
      bookingTime: new Date().toLocaleString(),
      status: 'PENDING_PAYMENT'
    };
    
    // Reserve the slot (in real app, this would be an API call)
    console.log('Slot reserved:', slot.slotNumber);
    console.log('Booking data:', bookingData);
    
    // Redirect to payment page
    onNavigate('payment', bookingData);
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
              <div className="form-group" style={{marginBottom: '20px'}}>
                <label htmlFor="vehicleType">Vehicle Type *</label>
                <select
                  id="vehicleType"
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  required
                  style={{padding: '10px', fontSize: '16px', borderRadius: '6px', border: '1px solid #ddd'}}
                >
                  <option value="Bike">🏍️ Bike</option>
                  <option value="Auto">🛺 Auto</option>
                  <option value="Car">🚗 Car</option>
                  <option value="SUV">🚙 SUV</option>
                </select>
              </div>

              {/* Zone Selection */}
              <div className="form-group" style={{marginBottom: '20px'}}>
                <label htmlFor="selectedZone">Select Zone *</label>
                <select
                  id="selectedZone"
                  name="selectedZone"
                  value={formData.selectedZone}
                  onChange={handleChange}
                  required
                  style={{padding: '10px', fontSize: '16px', borderRadius: '6px', border: '1px solid #ddd'}}
                >
                  <option value="">Choose a parking zone...</option>
                  {getFilteredZones().map(zone => (
                    <option key={zone.id} value={zone.id}>
                      {zone.name} ({zone.availableSlots} slots available)
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
                    style={{padding: '10px', fontSize: '16px', borderRadius: '6px', border: '1px solid #ddd'}}
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
                  style={{padding: '10px', fontSize: '16px', borderRadius: '6px', border: '1px solid #ddd', width: '100%'}}
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
                <label>Payment Method *</label>
                <div className="payment-methods">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Cash"
                      checked={formData.paymentMethod === 'Cash'}
                      onChange={handleChange}
                    />
                    💰 Cash
                  </label>
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
          {/* Parking Charges Box */}
          <div className="info-box">
            <h3 style={{marginBottom: '20px', color: '#2c3e50', borderBottom: '2px solid #3498db', paddingBottom: '10px'}}>💰 Parking Charges</h3>
            <div className="charges-info" style={{display: 'grid', gap: '12px'}}>
              <div className="charge-display" style={{
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '12px 16px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                // border: '1px solid #27ae60'
              }}>
                <span style={{fontSize: '16px', fontWeight: '500'}}>🏍️ Bike</span>
                <strong style={{fontSize: '18px', color: '#3498db'}}>₹10/hr</strong>
              </div>
              <div className="charge-display" style={{
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '12px 16px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                // border: '1px solid #f39c12'
              }}>
                <span style={{fontSize: '16px', fontWeight: '500'}}>🛺 Auto</span>
                <strong style={{fontSize: '18px', color: '#3498db'}}>₹15/hr</strong>
              </div>
              <div className="charge-display" style={{
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '12px 16px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                // border: '1px solid #3498db'
              }}>
                <span style={{fontSize: '16px', fontWeight: '500'}}>🚗 Car</span>
                <strong style={{fontSize: '18px', color: '#3498db'}}>₹30/hr</strong>
              </div>
              <div className="charge-display" style={{
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '12px 16px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                // border: '1px solid #e74c3c'
              }}>
                <span style={{fontSize: '16px', fontWeight: '500'}}>🚙 SUV</span>
                <strong style={{fontSize: '18px', color: '#3498db'}}>₹40/hr</strong>
              </div>
            </div>
            <div style={{
              marginTop: '15px',
              padding: '10px',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              textAlign: 'center',
              fontSize: '14px',
              color: '#6c757d'
            }}>
              ⏰ Charges calculated per hour or part thereof
            </div>
          </div>

          {/* Initial Payment Box */}
          <div className="info-box">
            <h4 style={{marginBottom: '15px', color: '#2c3e50', borderBottom: '2px solid #3498db', paddingBottom: '10px'}}>💳 Initial Payment</h4>
            <p>A minimum initial payment is required for booking (50% of the total parking charges).</p>
          </div>

          {/* Booking Information Box */}
          <div className="info-box">
            <h4 style={{marginBottom: '15px', color: '#2c3e50', borderBottom: '2px solid #3498db', paddingBottom: '10px'}}>📋 Booking Information</h4>
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
