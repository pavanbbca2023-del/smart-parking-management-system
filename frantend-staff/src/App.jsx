import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
    return (
        <Router>
            <div style={{ display: 'flex' }}>
                <Sidebar />
                <main style={{
                    flex: 1,
                    marginLeft: '260px',
                    backgroundColor: '#f1f5f9',
                    minHeight: '100vh',
                    padding: '0'
                }}>
                    <Routes>
                        <Route path="/" element={<StaffDashboard />} />
                        <Route path="/payment" element={<Payment />} />
                        <Route path="/gate-control" element={<GateControl />} />
                        <Route path="/reports" element={<Reports />} />
                        <Route path="/zones" element={<ZoneStatus />} />
                        <Route path="/active-sessions" element={<ActiveSessions />} />
                        <Route path="/alerts" element={<Alerts />} />
                        <Route path="/payments-mgmt" element={<Payments />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
