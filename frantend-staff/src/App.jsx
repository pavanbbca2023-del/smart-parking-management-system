import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Landing from './components/Landing';
import Login from './components/Login';
import Signup from './components/Signup';
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
    // Add global styles to remove default margins/padding
    React.useEffect(() => {
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.documentElement.style.margin = '0';
        document.documentElement.style.padding = '0';
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/*" element={
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
                                <Route path="/dashboard" element={<StaffDashboard />} />
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
                } />
            </Routes>
        </Router>
    );
}

export default App;
