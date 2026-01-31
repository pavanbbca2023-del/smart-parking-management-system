import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import StaffDashboard from './components/StaffDashboard';
import VehicleEntry from './components/VehicleEntry';
import Payment from './components/Payment';
import Reports from './components/Reports';
import ZoneStatus from './components/ZoneStatus';
import ActiveSessions from './components/ActiveSessions';
import Alerts from './components/Alerts';
import GateControl from './components/GateControl';
import Payments from './components/Payments';
import Login from './components/Login';

import StaffLanding from './components/StaffLanding';

// Layout component to handle conditional sidebar
const Layout = ({ children }) => {
    const location = useLocation();
    // Sidebar should be hidden on Landing, Login, and Signup pages
    const isPublicPage = location.pathname === '/' || location.pathname === '/login';

    if (isPublicPage) {
        // Public pages get a simple container or full width
        return <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>{children}</div>;
    }

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <main style={{
                flex: 1,
                marginLeft: '260px',
                backgroundColor: '#f1f5f9',
                minHeight: '100vh',
                padding: '0'
            }}>
                {children}
            </main>
        </div>
    );
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('access_token');
    const userRole = localStorage.getItem('user_role');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Optional: Check role if needed
    // if (userRole !== 'STAFF') return <Navigate to="/login" replace />;

    return children;
};

import { SpeedInsights } from "@vercel/speed-insights/react";

function App() {
    return (
        <Router>
            <SpeedInsights />
            <Layout>
                <Routes>
                    <Route path="/" element={<StaffLanding />} />
                    <Route path="/login" element={<Login />} />

                    {/* Protected Routes */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <StaffDashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/payment" element={
                        <ProtectedRoute>
                            <Payment />
                        </ProtectedRoute>
                    } />
                    <Route path="/gate-control" element={
                        <ProtectedRoute>
                            <GateControl />
                        </ProtectedRoute>
                    } />
                    <Route path="/reports" element={
                        <ProtectedRoute>
                            <Reports />
                        </ProtectedRoute>
                    } />
                    <Route path="/zones" element={
                        <ProtectedRoute>
                            <ZoneStatus />
                        </ProtectedRoute>
                    } />
                    <Route path="/active-sessions" element={
                        <ProtectedRoute>
                            <ActiveSessions />
                        </ProtectedRoute>
                    } />
                    <Route path="/alerts" element={
                        <ProtectedRoute>
                            <Alerts />
                        </ProtectedRoute>
                    } />
                    <Route path="/payments-mgmt" element={
                        <ProtectedRoute>
                            <Payments />
                        </ProtectedRoute>
                    } />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
