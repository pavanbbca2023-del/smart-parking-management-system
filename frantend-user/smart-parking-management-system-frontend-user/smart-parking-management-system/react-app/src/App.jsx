import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import GuestLayout from './components/GuestLayout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GuestLayout />} />
        <Route path="/guest/*" element={<GuestLayout />} />
        <Route path="/user/*" element={<Layout />} />
        <Route path="/dashboard" element={<Layout />} />
      </Routes>
    </Router>
  )
}

export default App
