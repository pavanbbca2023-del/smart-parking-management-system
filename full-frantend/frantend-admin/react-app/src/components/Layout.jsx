import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Dashboard from '../pages/user/Dashboard';
import Booking from '../pages/user/Booking';
import Profile from '../pages/user/Profile';
import UserManagement from '../pages/admin/UserManagement';
import ZoneManagement from '../pages/admin/ZoneManagement';
import Financial from '../pages/admin/Financial';
import ParkingOperations from '../pages/admin/ParkingOperations';
import StaffManagement from '../pages/admin/StaffManagement';
import StaffSalaries from '../pages/admin/StaffSalaries';
import AdminDashboard from '../pages/admin/AdminDashboard';
import StaffDashboard from '../pages/staff/StaffDashboard';
import QRScan from '../pages/staff/QRScan';
import VehicleEntry from '../pages/staff/VehicleEntry';
import ExitBilling from '../pages/staff/ExitBilling';
import Receipt from '../pages/staff/Receipt';
import './Layout.css';

const Layout = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [userType, setUserType] = useState('admin');

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleUserTypeChange = (type) => {
    setUserType(type);
    setCurrentPage('dashboard');
  };

  const renderContent = () => {
    // Role-based access control
    const hasAccess = (page) => {
      if (userType === 'admin') return true; // Admin has access to everything

      if (userType === 'staff') {
        const staffPages = ['dashboard', 'qr-scanner', 'vehicle-entry', 'exit-billing', 'receipt', 'active-sessions'];
        return staffPages.includes(page);
      }

      if (userType === 'user') {
        const userPages = ['dashboard', 'booking', 'profile'];
        return userPages.includes(page);
      }

      return false;
    };

    if (!hasAccess(currentPage)) {
      return (
        <div className="page-content">
          <div className="access-denied">
            <h1>🚫 Access Denied</h1>
            <p>You don't have permission to access this page.</p>
            <p>Current Role: <strong>{userType.toUpperCase()}</strong></p>
          </div>
        </div>
      );
    }

    switch (currentPage) {
      case 'dashboard':
        if (userType === 'staff') {
          return (
            <div className="page-content">
              <StaffDashboard />
            </div>
          );
        }
        return (
          <div className="page-content">
            <Dashboard onPageChange={handlePageChange} />
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
      case 'financial-report':
        return (
          <div className="page-content">
            <Financial />
          </div>
        );
      case 'parking-operations':
        return (
          <div className="page-content">
            <ParkingOperations />
          </div>
        );
      case 'financial':
        return (
          <div className="page-content">
            <Financial />
          </div>
        );
      case 'zone-management':
        return (
          <div className="page-content">
            <ZoneManagement />
          </div>
        );
      case 'user-management':
        return (
          <div className="page-content">
            <UserManagement />
          </div>
        );
      case 'zones':
        return (
          <div className="page-content">
            <h1>Zones Management</h1>
            <p>Zone management will be displayed here</p>
          </div>
        );
      case 'vehicle-entry':
        return (
          <div className="page-content">
            <VehicleEntry />
          </div>
        );
      case 'active-sessions':
        return (
          <div className="page-content">
            <h1>Active Sessions</h1>
            <p>Active parking sessions will be displayed here</p>
          </div>
        );
      case 'reports':
        return (
          <div className="page-content">
            <h1>Reports</h1>
            <p>Reports and analytics will be displayed here</p>
          </div>
        );
      case 'staff-management':
        return (
          <div className="page-content">
            <StaffManagement />
          </div>
        );
      case 'staff-salaries':
        return (
          <div className="page-content">
            <StaffSalaries />
          </div>
        );
      case 'settings':
        return (
          <div className="page-content">
            <h1>System Settings</h1>
            <p>System settings will be displayed here</p>
          </div>
        );
      case 'qr-scanner':
        return (
          <div className="page-content">
            <QRScan />
          </div>
        );
      case 'exit-billing':
        return (
          <div className="page-content">
            <ExitBilling />
          </div>
        );
      case 'receipt':
        return (
          <div className="page-content">
            <Receipt />
          </div>
        );
      case 'history':
        return (
          <div className="page-content">
            <h1>Booking History</h1>
            <p>View your past parking bookings</p>
          </div>
        );
      default:
        return <Dashboard />;
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