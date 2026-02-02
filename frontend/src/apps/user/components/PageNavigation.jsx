import React from 'react';

const PageNavigation = ({ onNavigate, currentPage, showBooking = true, showBack = true }) => {
  const getBackPage = () => {
    const pageFlow = {
      'parking-zones': 'home',
      'view-slots': 'parking-zones',
      'book-slot': 'view-slots',
      'charges': 'home',
      'payment': 'book-slot',
      'booking-confirmation': 'payment',
      'exit-checkout': 'home',
      'receipt': 'exit-checkout',
      'contact': 'home'
    };
    return pageFlow[currentPage] || 'home';
  };

  return (
    <div className="page-navigation">
      {showBack && (
        <button 
          className="btn-secondary nav-btn back-btn"
          onClick={() => onNavigate(getBackPage())}
        >
          ← Back
        </button>
      )}
      {showBooking && currentPage !== 'book-slot' && currentPage !== 'payment' && (
        <button 
          className="btn-primary nav-btn booking-btn"
          onClick={() => onNavigate('book-slot')}
        >
          📝 Book Now →
        </button>
      )}
    </div>
  );
};

export default PageNavigation;