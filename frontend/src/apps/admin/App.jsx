import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './components/Layout.css';
import './components/Sidebar.css';
import Layout from './components/Layout';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

import AdminLanding from './pages/auth/AdminLanding';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminLanding />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Dashboard Routes - everything under /admin/ */}
      <Route path="/dashboard/*" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      } />
      <Route path="/*" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      } />
    </Routes>
  )
}

export default App
