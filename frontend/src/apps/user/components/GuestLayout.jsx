import React, { useState } from 'react';
import Home from '../pages/guest/Home';
import ViewSlots from '../pages/guest/ViewSlots';
import BookSlot from '../pages/guest/BookSlot';
import ParkingZones from '../pages/guest/ParkingZones';

import Payment from '../pages/guest/Payment';
import BookingConfirmation from '../pages/guest/BookingConfirmation';

import Receipt from '../pages/guest/Receipt';
import Contact from '../pages/guest/Contact';
import TrackBooking from '../pages/guest/TrackBooking';
import PaymentSuccess from '../pages/guest/PaymentSuccess';
import PaymentCancelled from '../pages/guest/PaymentCancelled';
import '../pages/guest/GuestPages.css';
import './GuestLayout.css';

const GuestLayout = ({ initialPage = 'home' }) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [bookingData, setBookingData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleNavigation = (page, data = null) => {
    if (data) {
      setBookingData(data);
    }
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };
  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigation} />;
      case 'parking-zones':
        return <ParkingZones onNavigate={handleNavigation} />;
      case 'view-slots':
        return <ViewSlots onNavigate={handleNavigation} />;
      case 'book-slot':
        return <BookSlot bookingData={bookingData} onNavigate={handleNavigation} />;

      case 'payment':
        return <Payment bookingData={bookingData} onNavigate={handleNavigation} />;
      case 'booking-confirmation':
        return <BookingConfirmation bookingData={bookingData} onNavigate={handleNavigation} />;

      case 'receipt':
        return <Receipt bookingData={bookingData} onNavigate={handleNavigation} />;
      case 'contact':
        return <Contact onNavigate={handleNavigation} />;
      case 'track-booking':
        return <TrackBooking onNavigate={handleNavigation} />;
      case 'payment-success':
        return <PaymentSuccess onNavigate={handleNavigation} />;
      case 'payment-cancelled':
        return <PaymentCancelled onNavigate={handleNavigation} />;
      default:
        return <Home onNavigate={handleNavigation} />;
    }
  };

  return (
    <div className="guest-layout">
      {/* Sidebar */}
      <aside className={`guest-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-logo" onClick={() => handleNavigation('home')} style={{ padding: '4px' }}>
            🅿️ QuickPark
          </h2>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${currentPage === 'home' ? 'active' : ''}`}
            onClick={() => handleNavigation('home')}
          >
            📊Dashboard
          </button>
          <button
            className={`nav-item ${currentPage === 'parking-zones' ? 'active' : ''}`}
            onClick={() => handleNavigation('parking-zones')}
          >
            🗺️Parking Zones
          </button>
          <button
            className={`nav-item ${currentPage === 'view-slots' ? 'active' : ''}`}
            onClick={() => handleNavigation('view-slots')}
          >
            🔍View Slots
          </button>

          <button
            className={`nav-item ${currentPage === 'book-slot' ? 'active' : ''}`}
            onClick={() => handleNavigation('book-slot')}
          >
            📝Book Slots
          </button>



          <button
            className={`nav-item ${currentPage === 'track-booking' ? 'active' : ''}`}
            onClick={() => handleNavigation('track-booking')}
          >
            🔍My Booking
          </button>
          <button
            className={`nav-item ${currentPage === 'contact' ? 'active' : ''}`}
            onClick={() => handleNavigation('contact')}
          >
            📞Contact
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-info">
            <h4>Support</h4>
            <p>📞+91 98765 43210</p>
            <p>📧support@smartparking.com</p>
            <p>🕒24/7 Available</p>
          </div>
        </div>
      </aside>

      <div className="guest-content-wrapper">
        {/* Main Content */}
        <main className="guest-main">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default GuestLayout;
