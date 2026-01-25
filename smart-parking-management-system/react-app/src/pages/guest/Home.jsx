import React from 'react';
import PageHeader from '../../components/PageHeader';
import PageNavigation from '../../components/PageNavigation';

const Home = ({ onNavigate }) => {
  const parkingStats = {
    totalSlots: 500,
    availableSlots: 147,
    occupiedSlots: 353
  };

  return (
    <div className="guest-page home-page">
      {/* Page Header */}
      <PageHeader 
        title="Smart Parking "
        description="Find, book, and manage your parking space with ease"
        icon="🚗"
      />

      {/* Parking Status Section */}
      <div className="status-section">
        <div className="container">
          <h2>Real-Time Parking Status</h2>
          <div className="status-grid">
            <div className="status-card total">
              <div className="status-icon">📊</div>
              <div className="status-info">
                <h3>Total Slots</h3>
                <p className="status-number">{parkingStats.totalSlots}</p>
                <span className="status-label">Available across all zones</span>
              </div>
            </div>

            <div className="status-card available">
              <div className="status-icon">✅</div>
              <div className="status-info">
                <h3>Available Slots</h3>
                <p className="status-number">{parkingStats.availableSlots}</p>
                <span className="status-label">Ready for booking</span>
              </div>
            </div>

            <div className="status-card occupancy">
              <div className="status-icon">📈</div>
              <div className="status-info">
                <h3>Occupancy Rate</h3>
                <p className="status-number">
                  {Math.round((parkingStats.occupiedSlots / parkingStats.totalSlots) * 100)}%
                </p>
                <span className="status-label">System utilization</span>
              </div>
            </div>
          </div>
        </div>
      </div>

       {/* Features Section */}
      <div className="features-section">
        <div className="container">
          <h2>Why Choose Us?</h2>
          <div className="steps-container">
            <div className="step" style={{background: 'transparent'}}>
              <div className="step-number" style={{background: 'transparent', border: 'none', fontSize: '2rem'}}>⚡</div>
              <h4>Quick Booking</h4>
              <p>Book in 2 minutes</p>
            </div>
            <div className="step" style={{background: 'transparent'}}>
              <div className="step-number" style={{background: 'transparent', border: 'none', fontSize: '2rem'}}>🔒</div>
              <h4>Safe & Secure</h4>
              <p>Vehicle safety assured</p>
            </div>
            <div className="step" style={{background: 'transparent'}}>
              <div className="step-number" style={{background: 'transparent', border: 'none', fontSize: '2rem'}}>💳</div>
              <h4>Easy Payment</h4>
              <p>Multiple options</p>
            </div>
            <div className="step" style={{background: 'transparent'}}>
              <div className="step-number" style={{background: 'transparent', border: 'none', fontSize: '2rem'}}>🌐</div>
              <h4>24/7 Access</h4>
              <p>Always available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="actions-section">
        <div className="container">
          <h2>Get Started Now</h2>
          <div className="actions-grid">
            <button className="action-button view-slots" onClick={() => onNavigate('view-slots')}>
              <div className="button-icon">👀</div>
              <h3>View Parking Slots</h3>
              <p>Browse available parking slots in real-time</p>
            </button>

            <button className="action-button book-slot" onClick={() => onNavigate('book-slot')}>
              <div className="button-icon">📅</div>
              <h3>Book Parking Slot</h3>
              <p>Reserve your parking slot instantly</p>
            </button>

            <button className="action-button charges" onClick={() => onNavigate('charges')}>
              <div className="button-icon">💰</div>
              <h3>Parking Charges</h3>
              <p>View our transparent pricing structure</p>
            </button>

            <button className="action-button contact" onClick={() => onNavigate('contact')}>
              <div className="button-icon">📞</div>
              <h3>Contact Us</h3>
              <p>Get help and support from our team</p>
            </button>
          </div>
        </div>
      </div>

      {/* Instructions Section */}
      <div className="instructions-section">
        <div className="container">
          <h2>How It Works</h2>
          <div 
            className="steps-container" 
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'nowrap',
              gap: '10px',
              flexDirection: 'row'
            }}
          >
            <div className="step">
              <div className="step-number">1</div>
              <h4>View Slots</h4>
              <p>Check available parking slots</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">2</div>
              <h4>Select Slot</h4>
              <p>Choose your preferred slot</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">3</div>
              <h4>Book & Pay</h4>
              <p>Complete booking and payment</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">4</div>
              <h4>Park Vehicle</h4>
              <p>Park your vehicle safely</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">5</div>
              <h4>Exit & Pay</h4>
              <p>Check out and receive receipt</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <div className="container">
          <h2>Ready to Park?</h2>
          <p>Start booking your parking slot now - no registration required!</p>
          <button className="cta-button" onClick={() => onNavigate('book-slot')}>
            Book Now
          </button>
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

export default Home;
