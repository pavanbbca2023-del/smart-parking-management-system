import React from 'react';
import PageHeader from '../../components/PageHeader';
import PageNavigation from '../../components/PageNavigation';

const Charges = ({ onNavigate }) => {
  const vehicleCharges = [
    { 
      type: 'Bike', 
      icon: '🏍️', 
      hourly: 10, 
      daily: 60, 
      monthly: 1500,
      description: 'Two-wheeler parking'
    },
    { 
      type: 'Auto', 
      icon: '🛺', 
      hourly: 15, 
      daily: 90, 
      monthly: 2000,
      description: 'Auto-rickshaw parking'
    },
    { 
      type: 'Car', 
      icon: '🚗', 
      hourly: 30, 
      daily: 200, 
      monthly: 4000,
      description: 'Standard car parking'
    },
    { 
      type: 'SUV', 
      icon: '🚙', 
      hourly: 40, 
      daily: 250, 
      monthly: 5000,
      description: 'Large vehicle parking'
    }
  ];

  const additionalCharges = [
    { service: 'Lost Ticket', charge: 100, description: 'Replacement fee for lost parking ticket' },
    { service: 'Overstay (per hour)', charge: 50, description: 'Additional charge for exceeding booked time' },
    { service: 'Valet Service', charge: 200, description: 'Optional valet parking service' },
    { service: 'Car Wash', charge: 300, description: 'Basic car washing service' },
    { service: 'Premium Wash', charge: 500, description: 'Complete car detailing service' }
  ];

  return (
    <div className="guest-page charges-page">
      <PageHeader 
        title="Parking Charges"
        description="Transparent pricing for all vehicle types"
        icon="💰"
      />

      {/* Main Pricing Section */}
      <div className="pricing-section">
        <div className="container">
          <h2>Vehicle Parking Rates</h2>
          <div className="pricing-grid">
            {vehicleCharges.map((charge, idx) => (
              <div key={idx} className="pricing-card">
                <div className="pricing-header">
                  <span className="vehicle-icon">{charge.icon}</span>
                  <h3>{charge.type}</h3>
                  <p className="description">{charge.description}</p>
                </div>
                
                <div className="price-list">
                  <div className="price-item">
                    <span>Hourly Rate</span>
                    <strong>₹{charge.hourly}</strong>
                  </div>
                  <div className="price-item">
                    <span>Daily Rate</span>
                    <strong>₹{charge.daily}</strong>
                  </div>
                  <div className="price-item">
                    <span>Monthly Pass</span>
                    <strong>₹{charge.monthly}</strong>
                  </div>
                </div>
                
                <button 
                  className="btn-primary"
                  onClick={() => onNavigate('book-slot')}
                >
                  Book {charge.type} Slot
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Services */}
      <div className="additional-charges-section">
        <div className="container">
          <h2>Additional Services & Charges</h2>
          <div className="charges-table-container">
            <table className="charges-table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Charge</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {additionalCharges.map((item, idx) => (
                  <tr key={idx}>
                    <td><strong>{item.service}</strong></td>
                    <td className="text-primary">₹{item.charge}</td>
                    <td>{item.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pricing Information */}
      <div className="info-section">
        <div className="container">
          <div className="info-box">
            <h3>Important Pricing Information</h3>
            <ul>
              <li><strong>Hourly Charges:</strong> Calculated per hour or part thereof</li>
              <li><strong>Daily Rates:</strong> Valid for 24-hour parking (6 AM to 6 AM next day)</li>
              <li><strong>Monthly Pass:</strong> Unlimited parking for 30 days from purchase date</li>
              <li><strong>GST:</strong> All prices include 18% GST</li>
              <li><strong>Payment:</strong> Cash, UPI, and Card payments accepted</li>
              <li><strong>Grace Period:</strong> 15 minutes free grace period for exit</li>
              <li><strong>Lost Ticket:</strong> ₹100 penalty + maximum daily rate applicable</li>
              <li><strong>Advance Booking:</strong> No additional charges for advance slot booking</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Discounts & Offers */}
      <div className="offers-section">
        <div className="container">
          <h2>Current Offers & Discounts</h2>
          <div className="offers-grid">
            <div className="offer-card">
              <h3>🎉 Weekend Special</h3>
              <p>20% off on weekend parking (Sat-Sun)</p>
              <span className="offer-code">Code: WEEKEND20</span>
            </div>
            <div className="offer-card">
              <h3>🚗 First Time User</h3>
              <p>50% off on your first booking</p>
              <span className="offer-code">Code: FIRST50</span>
            </div>
            <div className="offer-card">
              <h3>💳 Monthly Pass</h3>
              <p>Save 30% with monthly parking pass</p>
              <span className="offer-code">Auto Applied</span>
            </div>
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

export default Charges;