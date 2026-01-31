import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import GuestLayout from './components/GuestLayout';

import Landing from './pages/auth/Landing';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

import { SpeedInsights } from "@vercel/speed-insights/react"

function App() {
  return (
    <Router>
      <SpeedInsights />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Guest Routes */}
        <Route path="/home" element={<GuestLayout />} />
        <Route path="/payment-success" element={<GuestLayout initialPage="payment-success" />} />
        <Route path="/payment-cancelled" element={<GuestLayout initialPage="payment-cancelled" />} />
        <Route path="/guest/*" element={<GuestLayout />} />

        {/* User/Staff Routes */}
        <Route path="/user/*" element={<Layout />} />
        <Route path="/dashboard" element={<Layout />} />
      </Routes>
    </Router>
  )
}

export default App
