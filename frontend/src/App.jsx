import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserApp from './apps/user/App';
import StaffApp from './apps/staff/App';
import AdminApp from './apps/admin/App';
import { SpeedInsights } from "@vercel/speed-insights/react";

function App() {
    return (
        <Router>
            <SpeedInsights />
            <Routes>
                {/* Staff Portal - Routes starting with /staff */}
                <Route path="/staff/*" element={<StaffApp />} />

                {/* Admin Portal - Routes starting with /admin */}
                <Route path="/admin/*" element={<AdminApp />} />

                {/* User Portal - Default route */}
                <Route path="/*" element={<UserApp />} />
            </Routes>
        </Router>
    );
}

export default App;
