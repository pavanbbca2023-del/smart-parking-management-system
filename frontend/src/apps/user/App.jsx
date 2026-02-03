import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import './components/Layout.css';
import './components/Navbar.css';
import Layout from './components/Layout';
import GuestLayout from './components/GuestLayout';

import Landing from './pages/auth/Landing';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

import { SpeedInsights } from "@vercel/speed-insights/react"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Guest Routes */}
      <Route path="/home" element={<GuestLayout />} />
      <Route path="/booking" element={<GuestLayout initialPage="book-slot" />} />
      <Route path="/payment-success" element={<GuestLayout initialPage="payment-success" />} />
      <Route path="/payment-cancelled" element={<GuestLayout initialPage="payment-cancelled" />} />
      <Route path="/guest/*" element={<GuestLayout />} />

      {/* User/Staff Routes */}
      <Route path="/user/*" element={<Layout />} />
      <Route path="/dashboard" element={<Layout />} />
    </Routes>
  )
}

export default App
