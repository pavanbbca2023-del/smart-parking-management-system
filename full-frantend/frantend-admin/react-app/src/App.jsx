import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route path="/admin/*" element={<Layout />} />
        <Route path="/user/dashboard" element={<Layout />} />
        <Route path="/staff/*" element={<Layout />} />
      </Routes>
    </Router>
  )
}

export default App
