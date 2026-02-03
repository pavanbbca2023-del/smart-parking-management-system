import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Booking from '../pages/user/Booking';
import Profile from '../pages/user/Profile';
import UserManagement from '../pages/admin/UserManagement';
import ZoneManagement from '../pages/admin/ZoneManagement';
import Financial from '../pages/admin/Financial';
import ParkingOperations from '../pages/admin/ParkingOperations';
import StaffManagement from '../pages/admin/StaffManagement';
import AdminDashboard from '../pages/admin/AdminDashboard';
import Reviews from '../pages/admin/Reviews';
import StaffDashboard from '../../staff/components/StaffDashboard';
import VehicleEntry from '../../staff/components/VehicleEntry';
import ExitBilling from '../../staff/components/ExitBilling';
import Receipt from '../../staff/components/Receipt';
import './Layout.css';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [userType, setUserType] = useState('admin');

  useEffect(() => {
    const path = location.pathname.split('/').pop();
    if (path && path !== 'admin') {
      setCurrentPage(path);
    }
  }, [location]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Sync URL with page change
    if (page === 'dashboard') {
      navigate('/admin/dashboard');
    } else {
      navigate(`/admin/${page}`);
    }
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
            <AdminDashboard onPageChange={handlePageChange} />
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
      case 'financial-report':
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
            <div style={{ padding: '20px' }}>
              <h2>QR Scanner</h2>
              <p>Scanner integration for Admin view is handled via Staff modules.</p>
            </div>
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
            <h1>Activity History</h1>
            <p>View your past administrative actions and system history</p>
          </div>
        );
      case 'reviews':
        return (
          <div className="page-content">
            <Reviews />
          </div>
        );
      case 'overview':
      case 'analytics':
      case 'quick-stats':
        return (
          <div className="page-content">
            <AdminDashboard onPageChange={handlePageChange} />
          </div>
        );
      default:
        return (
          <div className="page-content">
            <AdminDashboard onPageChange={handlePageChange} />
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