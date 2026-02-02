import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Dashboard from '../pages/user/Dashboard';
import Booking from '../pages/user/Booking';
import Profile from '../pages/user/Profile';
import ParkingZones from '../pages/user/ParkingZones';
import ViewSlots from '../pages/user/ViewSlots';
import Charges from '../pages/user/Charges';
import SlotBooking from '../pages/user/SlotBooking';
import BookingHistory from '../pages/user/BookingHistory';
import ExitCheckout from '../pages/user/ExitCheckout';
import './Layout.css';
import '../pages/user/UserPages.css';

const Layout = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [userType, setUserType] = useState('user');

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleUserTypeChange = (type) => {
    setUserType(type);
    setCurrentPage('dashboard');
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <div className="page-content">
            <Dashboard />
          </div>
        );
      case 'parking-zones':
        return (
          <div className="page-content">
            <ParkingZones />
          </div>
        );
      case 'view-slots':
        return (
          <div className="page-content">
            <ViewSlots />
          </div>
        );
      case 'charges':
        return (
          <div className="page-content">
            <Charges />
          </div>
        );
      case 'slot-booking':
        return (
          <div className="page-content">
            <SlotBooking />
          </div>
        );
      case 'booking-history':
        return (
          <div className="page-content">
            <BookingHistory />
          </div>
        );
      case 'exit-checkout':
        return (
          <div className="page-content">
            <ExitCheckout />
          </div>
        );
      case 'booking':
        return (
          <div className="page-content">
            <Booking />
          </div>
        );
      case 'profile':
        return (
          <div className="page-content">
            <Profile />
          </div>
        );
      default:
        return (
          <div className="page-content">
            <Dashboard />
          </div>
        );
    }
  };

  return (
    <div className="layout">
      <Sidebar
        currentPage={currentPage}
        onPageChange={handlePageChange}
        userType={userType}
        onUserTypeChange={handleUserTypeChange}
      />
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
};

export default Layout;