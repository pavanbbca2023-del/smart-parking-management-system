import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { parkingApi } from '../api/api';
import './StaffPages.css';

const GateControl = () => {
    const location = useLocation();
    const [gateMode, setGateMode] = useState(location.state?.mode || 'entry');
    const [entryMethod, setEntryMethod] = useState('manual');
    const [exitMethod, setExitMethod] = useState('manual');

    const [qrCodeInput, setQrCodeInput] = useState('');
    const [entryData, setEntryData] = useState({
        vehicleNumber: '',
        vehicleType: 'car',
        zoneId: '',
        initialAmount: 0
    });
    const [zones, setZones] = useState([]);

    const [exitVehicleNumber, setExitVehicleNumber] = useState('');
    const [exitQrInput, setExitQrInput] = useState('');
    const [sessionData, setSessionData] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('cash');

    const [loading, setLoading] = useState(true);

    // QR Scanner states
    const [scanningEntry, setScanningEntry] = useState(false);
    const [scanningExit, setScanningExit] = useState(false);
    const [recentScans, setRecentScans] = useState([]);
    const entryScannerRef = useRef(null);
    const exitScannerRef = useRef(null);

    const addToRecentScans = (scan) => {
        setRecentScans(prev => [
            { ...scan, time: new Date().toLocaleTimeString() },
            ...prev
        ].slice(0, 5));
    };

    useEffect(() => {
        fetchZones();
    }, []);

    const fetchZones = async () => {
        try {
            setLoading(true);
            const response = await parkingApi.getZones();
            if (response.data.success) {
                const fetchedZones = response.data.zones || [];
                setZones(fetchedZones);
                if (fetchedZones.length > 0 && !entryData.zoneId) {
                    setEntryData(prev => ({
                        ...prev,
                        zoneId: fetchedZones[0].id,
                        initialAmount: fetchedZones[0].base_price
                    }));
                }
            }
        } catch (error) {
            console.error('Error fetching zones:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEntrySubmit = async (e) => {
        e.preventDefault();
        if (!entryData.vehicleNumber || !entryData.zoneId) {
            alert('Please enter vehicle number and select a zone');
            return;
        }
        try {
            setLoading(true);
            const response = await parkingApi.processEntry({
                vehicleNumber: entryData.vehicleNumber,
                zoneId: entryData.zoneId,
                initial_amount: entryData.initialAmount
            });
            if (response.data.success) {
                alert(`✅ Entry Successful!\nFee Collected: ₹${response.data.initial_amount}\n\nGATE OPENING... 🚪`);
                setEntryData({ ...entryData, vehicleNumber: '' });
            }
        } catch (error) {
            alert(error.response?.data?.error || 'Server error');
        } finally {
            setLoading(false);
        }
    };

    const handleEntryQrScan = async (e) => {
        e.preventDefault();
        if (!qrCodeInput) return;
        try {
            setLoading(true);
            const response = await parkingApi.processEntry({ session_id: qrCodeInput });
            if (response.data.success) {
                alert(`✅ QR Verified!\n\nGATE OPENING... 🚪🚀`);
                setQrCodeInput('');
            }
        } catch (error) {
            alert('❌ Invalid QR');
        } finally {
            setLoading(false);
        }
    };

    const handleExitSearch = async (e) => {
        e.preventDefault();
        if (!exitVehicleNumber) return;
        try {
            setLoading(true);
            const response = await parkingApi.getActiveSessions();
            if (response.data.success) {
                const found = (response.data.sessions || []).find(s =>
                    s.vehicle_number.replace(/\s/g, '').toUpperCase() === exitVehicleNumber.replace(/\s/g, '').toUpperCase()
                );
                if (found) setSessionData(found);
                else alert('❌ Active session not found.');
            }
        } catch (error) {
            alert('Error searching vehicle.');
        } finally {
            setLoading(false);
        }
    };

    const handleExitProcess = async () => {
        if (!sessionData) return;
        try {
            setLoading(true);
            const response = await parkingApi.processExit({ vehicle_number: sessionData.vehicle_number });
            if (response.data.success) {
                alert(`✅ Exit Processed!\nTotal: ₹${response.data.total_amount}\nBalance Collected: ₹${response.data.final_balance}\n\nOPENING GATE... 🚪🏁`);
                setExitVehicleNumber('');
                setSessionData(null);
            }
        } catch (error) {
            alert('Error processing exit.');
        } finally {
            setLoading(false);
        }
    };

    const handleExitQr = async (e) => {
        e.preventDefault();
        if (!exitQrInput) return;
        try {
            setLoading(true);
            const response = await parkingApi.processExit({ session_id: exitQrInput });
            if (response.data.success) {
                alert(`✅ Exit QR Verified!\nCollect balance if any.\n\nGATE OPENING... 🚪🚀`);
                setExitQrInput('');
            }
        } catch (error) {
            alert('❌ Invalid Token');
        } finally {
            setLoading(false);
        }
    };

    // Camera QR Scanner Functions
    const startEntryScanner = () => {
        setScanningEntry(true);
    };

    const stopEntryScanner = async () => {
        if (entryScannerRef.current) {
            try {
                if (entryScannerRef.current.isScanning) {
                    await entryScannerRef.current.stop();
                }
                entryScannerRef.current.clear();
                entryScannerRef.current = null;
            } catch (err) {
                console.error('Error stopping scanner:', err);
            }
        }
        setScanningEntry(false);
    };

    useEffect(() => {
        let scanner = null;
        if (scanningEntry) {
            const startCamera = async () => {
                // Small delay to ensure DOM element is rendered
                await new Promise(resolve => setTimeout(resolve, 100));
                const element = document.getElementById("entry-qr-reader");
                if (!element) {
                    console.error("Entry QR reader element not found");
                    setScanningEntry(false);
                    return;
                }

                try {
                    scanner = new Html5Qrcode("entry-qr-reader");
                    entryScannerRef.current = scanner;
                    const config = { fps: 10, qrbox: { width: 250, height: 250 } };
                    await scanner.start({ facingMode: "environment" }, config, onEntryScanSuccess);
                } catch (err) {
                    console.error("Failed to start entry scanner:", err);
                    setScanningEntry(false);
                }
            };
            startCamera();
        }
        return () => {
            if (scanner && scanner.isScanning) {
                scanner.stop().catch(console.error);
            }
        };
    }, [scanningEntry]);

    const onEntryScanSuccess = async (decodedText) => {
        try {
            const qrData = JSON.parse(decodedText);
            const response = await parkingApi.processEntry({
                session_id: qrData.session_id,
                vehicle_number: qrData.vehicle_number,
                zone_id: entryData.zoneId
            });

            if (response.data.success) {
                alert(`✅ QR Entry Successful!\nVehicle: ${qrData.vehicle_number}\n\nGATE OPENING... 🚪`);
                addToRecentScans({ vehicle: qrData.vehicle_number, mode: 'entry' });
                stopEntryScanner();
            }
        } catch (err) {
            console.error('QR Parse Error:', err);
            alert('Invalid QR code format');
        }
    };

    const startExitScanner = () => {
        setScanningExit(true);
    };

    const stopExitScanner = async () => {
        if (exitScannerRef.current) {
            try {
                if (exitScannerRef.current.isScanning) {
                    await exitScannerRef.current.stop();
                }
                exitScannerRef.current.clear();
                exitScannerRef.current = null;
            } catch (err) {
                console.error('Error stopping scanner:', err);
            }
        }
        setScanningExit(false);
    };

    useEffect(() => {
        let scanner = null;
        if (scanningExit) {
            const startCamera = async () => {
                // Small delay to ensure DOM element is rendered
                await new Promise(resolve => setTimeout(resolve, 100));
                const element = document.getElementById("exit-qr-reader");
                if (!element) {
                    console.error("Exit QR reader element not found");
                    setScanningExit(false);
                    return;
                }

                try {
                    scanner = new Html5Qrcode("exit-qr-reader");
                    exitScannerRef.current = scanner;
                    const config = { fps: 10, qrbox: { width: 250, height: 250 } };
                    await scanner.start({ facingMode: "environment" }, config, onExitScanSuccess);
                } catch (err) {
                    console.error("Failed to start exit scanner:", err);
                    setScanningExit(false);
                }
            };
            startCamera();
        }
        return () => {
            if (scanner && scanner.isScanning) {
                scanner.stop().catch(console.error);
            }
        };
    }, [scanningExit]);

    const onExitScanSuccess = async (decodedText) => {
        try {
            const qrData = JSON.parse(decodedText);
            const response = await parkingApi.processExit({
                session_id: qrData.session_id,
                vehicle_number: qrData.vehicle_number
            });

            if (response.data.success) {
                alert(`✅ Exit Processed!\nTotal: ₹${response.data.total_amount}\nBalance: ₹${response.data.final_balance}\n\nGATE OPENING... 🚪`);
                addToRecentScans({ vehicle: qrData.vehicle_number || 'Unknown', mode: 'exit' });
                stopExitScanner();
            }
        } catch (err) {
            console.error('QR Parse Error:', err);
            alert('Invalid QR code or session not found');
        }
    };

    const onScanError = (errorMessage) => {
        // Ignore continuous scan errors
    };

    // Cleanup on unmount or method change
    useEffect(() => {
        return () => {
            stopEntryScanner();
            stopExitScanner();
        };
    }, []);

    useEffect(() => {
        if (entryMethod !== 'qr') {
            stopEntryScanner();
        }
        if (exitMethod !== 'qr') {
            stopExitScanner();
        }
    }, [entryMethod, exitMethod]);

    if (loading && zones.length === 0) return <div style={{ padding: '20px', color: 'white' }}>Establishing Gate Sync...</div>;

    return (
        <div className="vehicle-entry">
            <div className="vehicle-entry-header">
                <div className="header-info">
                    <h1>🔐 Unified Gate Control</h1>
                    <p>Authorized access point for entry and exit management</p>
                </div>
                <div className="gate-mode-tabs" style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', padding: '5px', borderRadius: '12px' }}>
                    <button
                        onClick={() => { setGateMode('entry'); setSessionData(null); }}
                        className={`tab-btn ${gateMode === 'entry' ? 'active' : ''}`}
                        style={{ borderBottom: 'none', color: gateMode === 'entry' ? 'white' : '#94a3b8', background: gateMode === 'entry' ? '#10b981' : 'transparent', borderRadius: '8px', padding: '10px 20px', fontSize: '0.9rem', cursor: 'pointer' }}
                    >
                        ENTRY
                    </button>
                    <button
                        onClick={() => { setGateMode('exit'); setSessionData(null); }}
                        className={`tab-btn ${gateMode === 'exit' ? 'active' : ''}`}
                        style={{ borderBottom: 'none', color: gateMode === 'exit' ? 'white' : '#94a3b8', background: gateMode === 'exit' ? '#ef4444' : 'transparent', borderRadius: '8px', padding: '10px 20px', fontSize: '0.9rem', cursor: 'pointer' }}
                    >
                        EXIT
                    </button>
                </div>
            </div>

            <div className={gateMode === 'entry' ? "vehicle-entry-content" : "exit-billing-content-themed"}>

                {/* INNER TABS (Manual vs QR) */}
                <div className="control-tabs" style={{ marginBottom: '25px' }}>
                    <button
                        onClick={() => gateMode === 'entry' ? setEntryMethod('manual') : setExitMethod('manual')}
                        className={`tab-btn ${(gateMode === 'entry' ? entryMethod : exitMethod) === 'manual' ? 'active' : ''}`}
                    >
                        {gateMode === 'entry' ? '✍️ Walk-in Entry' : '🔍 Manual Checkout'}
                    </button>
                    <button
                        onClick={() => gateMode === 'entry' ? setEntryMethod('qr') : setExitMethod('qr')}
                        className={`tab-btn ${(gateMode === 'entry' ? entryMethod : exitMethod) === 'qr' ? 'active' : ''}`}
                    >
                        {gateMode === 'entry' ? '📱 Online QR Scan' : '📇 Scan Exit QR'}
                    </button>
                </div>

                <div className="workflow-body">
                    {gateMode === 'entry' ? (
                        // ENTRY SECTION
                        entryMethod === 'manual' ? (
                            <form onSubmit={handleEntrySubmit} className="manual-form">
                                <div className="themed-form-section">
                                    <h3>🚙 Vehicle Registry</h3>
                                    <div className="themed-form-grid">
                                        <div className="form-group-themed">
                                            <label>Vehicle Plate Number</label>
                                            <input value={entryData.vehicleNumber} onChange={(e) => setEntryData({ ...entryData, vehicleNumber: e.target.value.toUpperCase() })} placeholder="MH-01-AB-1234" required />
                                        </div>
                                        <div className="form-group-themed">
                                            <label>Classification</label>
                                            <select value={entryData.vehicleType} onChange={(e) => setEntryData({ ...entryData, vehicleType: e.target.value })}>
                                                <option value="car">Passenger Car</option>
                                                <option value="bike">Two Wheeler</option>
                                                <option value="suv">Heavy / SUV</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="themed-form-section">
                                    <h3>🅿️ Allocation & Payment</h3>
                                    <div className="zones-selection-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px', marginBottom: '20px' }}>
                                        {zones.map(z => (
                                            <button type="button" key={z.id} className={`slot-btn-themed ${entryData.zoneId === z.id ? 'selected' : ''}`}
                                                onClick={() => setEntryData({ ...entryData, zoneId: z.id, initialAmount: z.base_price })}>
                                                <strong>{z.name}</strong><br /><span style={{ fontSize: '0.75rem' }}>Min: ₹{z.base_price}</span>
                                            </button>
                                        ))}
                                    </div>
                                    <div className="form-group-themed">
                                        <label>🎟️ Booking Fee Collected (₹)</label>
                                        <input type="number" value={entryData.initialAmount} onChange={(e) => setEntryData({ ...entryData, initialAmount: e.target.value })} style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#10b981' }} />
                                    </div>
                                    <div className="form-group-themed">
                                        <label>Payment Method</label>
                                        <select value={entryData.paymentMethod || 'cash'} onChange={(e) => setEntryData({ ...entryData, paymentMethod: e.target.value })} style={{ background: '#fff', color: '#1e293b' }}>
                                            <option value="cash">💵 Cash</option>
                                            <option value="upi">📱 UPI / QR</option>
                                            <option value="card">💳 Card</option>
                                        </select>
                                    </div>
                                </div>

                                <button type="submit" className="submit-btn-themed" disabled={loading}>
                                    {loading ? 'PROCESSING...' : '✅ AUTHORIZE ENTRY & OPEN GATE'}
                                </button>
                            </form>
                        ) : (
                            <div className="qr-scan-section">
                                {!scanningEntry ? (
                                    <div style={{ textAlign: 'center' }}>
                                        <div className="scanner-frame">
                                            <div className="scanner-overlay"><div className="scan-line"></div></div>
                                            <span style={{ fontSize: '4rem', opacity: 0.5 }}>📲</span>
                                            <p>Camera Ready for QR Scanning</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={startEntryScanner}
                                            className="submit-btn-themed"
                                            style={{ background: '#3b82f6', marginTop: '20px' }}
                                        >
                                            📱 Start Camera Scanner
                                        </button>
                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'center' }}>
                                        <div id="entry-qr-reader" style={{
                                            width: '100%',
                                            maxWidth: '500px',
                                            margin: '0 auto 20px',
                                            border: '4px solid #10b981',
                                            borderRadius: '16px',
                                            overflow: 'hidden',
                                            boxShadow: '0 0 30px rgba(16, 185, 129, 0.4)',
                                            background: '#000'
                                        }}></div>
                                        <button
                                            type="button"
                                            onClick={stopEntryScanner}
                                            className="submit-btn-themed"
                                            style={{ background: '#ef4444', width: 'auto', padding: '12px 30px' }}
                                        >
                                            ⏹️ Stop Camera
                                        </button>
                                    </div>
                                )}

                                {/* Manual Input Fallback */}
                                <div style={{
                                    marginTop: '30px',
                                    paddingTop: '30px',
                                    borderTop: '2px solid rgba(255,255,255,0.1)'
                                }}>
                                    <h4 style={{
                                        textAlign: 'center',
                                        marginBottom: '15px',
                                        opacity: 0.7,
                                        fontSize: '0.9rem',
                                        fontWeight: '600'
                                    }}>Or Enter Manually</h4>
                                    <form onSubmit={handleEntryQrScan} style={{ maxWidth: '400px', margin: '0 auto' }}>
                                        <div className="form-group-themed">
                                            <label>Reference Code / ID</label>
                                            <input
                                                value={qrCodeInput}
                                                onChange={(e) => setQrCodeInput(e.target.value)}
                                                placeholder="SCAN OR TYPE BOOKING ID"
                                                style={{ textAlign: 'center' }}
                                            />
                                        </div>
                                        <button type="submit" className="submit-btn-themed" style={{ background: '#3b82f6' }}>
                                            VERIFY REFERENCE
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )
                    ) : (
                        // EXIT SECTION
                        exitMethod === 'manual' ? (
                            <div className="exit-workflow">
                                {!sessionData ? (
                                    <div className="themed-form-section">
                                        <h3>🔍 Locate Session</h3>
                                        <form onSubmit={handleExitSearch} className="manual-form">
                                            <div className="form-group-themed">
                                                <label>Vehicle Plate Number</label>
                                                <input value={exitVehicleNumber} onChange={(e) => setExitVehicleNumber(e.target.value.toUpperCase())} placeholder="ENTER VEHICLE NUMBER" required />
                                            </div>
                                            <button type="submit" className="submit-btn-themed" style={{ background: '#3b82f6' }}>FIND ACTIVE RECORD</button>
                                        </form>
                                    </div>
                                ) : (
                                    <div className="themed-form-section" style={{ animation: 'fadeIn 0.3s ease' }}>
                                        <h3>📋 Settlement Details</h3>
                                        <div className="detail-card-themed">
                                            <div className="detail-row"><span className="detail-label">Vehicle</span><span className="detail-value">{sessionData.vehicle_number}</span></div>
                                            <div className="detail-row"><span className="detail-label">Total Duration</span><span className="detail-value">{sessionData.duration}</span></div>
                                            <div className="detail-row"><span className="detail-label">Pre-paid Amount</span><span className="detail-value" style={{ color: '#3b82f6' }}>₹{sessionData.initial_amount_paid}</span></div>
                                            <div className="detail-row" style={{ borderTop: '2px solid #e2e8f0', marginTop: '10px', paddingTop: '10px', borderBottom: 'none' }}>
                                                <span className="detail-label" style={{ fontSize: '1.1rem' }}>BALANCE DUE</span>
                                                <span className="detail-value" style={{ color: '#ef4444', fontSize: '1.4rem' }}>₹{(sessionData.total_amount_paid - sessionData.initial_amount_paid).toFixed(2)}</span>
                                            </div>
                                        </div>
                                        <div className="form-group-themed">
                                            <label>Settlement Method</label>
                                            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                                                <option value="cash">Cash Payment</option>
                                                <option value="upi">UPI / Scanner</option>
                                                <option value="card">Debit/Credit Card</option>
                                            </select>
                                        </div>
                                        <button onClick={handleExitProcess} className="submit-btn-themed" style={{ background: '#ef4444' }}>
                                            ✅ SETTLE & FINALIZE EXIT
                                        </button>
                                        <button onClick={() => setSessionData(null)} style={{ width: '100%', marginTop: '10px', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontWeight: '600' }}>CANCEL</button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="qr-scan-section">
                                {!scanningExit ? (
                                    <div style={{ textAlign: 'center' }}>
                                        <div className="scanner-frame" style={{ borderColor: '#ef4444' }}>
                                            <div className="scanner-overlay"><div className="scan-line" style={{ background: '#ef4444' }}></div></div>
                                            <span style={{ fontSize: '4rem', opacity: 0.5 }}>📇</span>
                                            <p>Camera Ready for Exit QR</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={startExitScanner}
                                            className="submit-btn-themed"
                                            style={{ background: '#ef4444', marginTop: '20px' }}
                                        >
                                            📱 Start Camera Scanner
                                        </button>
                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'center' }}>
                                        <div id="exit-qr-reader" style={{
                                            width: '100%',
                                            maxWidth: '500px',
                                            margin: '0 auto 20px',
                                            border: '4px solid #ef4444',
                                            borderRadius: '16px',
                                            overflow: 'hidden',
                                            boxShadow: '0 0 30px rgba(239, 68, 68, 0.4)',
                                            background: '#000'
                                        }}></div>
                                        <button
                                            type="button"
                                            onClick={stopExitScanner}
                                            className="submit-btn-themed"
                                            style={{ background: '#64748b', width: 'auto', padding: '12px 30px' }}
                                        >
                                            ⏹️ Stop Camera
                                        </button>
                                    </div>
                                )}

                                {/* Manual Input Fallback */}
                                <div style={{
                                    marginTop: '30px',
                                    paddingTop: '30px',
                                    borderTop: '2px solid rgba(255,255,255,0.1)'
                                }}>
                                    <h4 style={{
                                        textAlign: 'center',
                                        marginBottom: '15px',
                                        opacity: 0.7,
                                        fontSize: '0.9rem',
                                        fontWeight: '600'
                                    }}>Or Enter Manually</h4>
                                    <form onSubmit={handleExitQr} style={{ maxWidth: '400px', margin: '0 auto' }}>
                                        <div className="form-group-themed">
                                            <label>Exit Token ID</label>
                                            <input
                                                value={exitQrInput}
                                                onChange={(e) => setExitQrInput(e.target.value)}
                                                placeholder="SCAN TOKEN FOR CHECKOUT"
                                                style={{ textAlign: 'center' }}
                                            />
                                        </div>
                                        <button type="submit" className="submit-btn-themed" style={{ background: '#ef4444' }}>
                                            AUTHORIZE EXIT
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )
                    )}
                </div>

                {/* RECENT SCANS SECTION */}
                {recentScans.length > 0 && (
                    <div className="recent-scans-themed" style={{
                        marginTop: '40px',
                        padding: '24px',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '16px',
                        border: '1px solid rgba(255,255,255,0.05)'
                    }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            📋 Recent Gate Activity
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {recentScans.map((scan, idx) => (
                                <div key={idx} style={{
                                    padding: '12px 20px',
                                    background: 'rgba(255,255,255,0.05)',
                                    borderRadius: '10px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    animation: 'fadeIn 0.3s ease'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <span style={{
                                            padding: '4px 10px',
                                            borderRadius: '6px',
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold',
                                            background: scan.mode === 'entry' ? '#10b981' : '#ef4444'
                                        }}>
                                            {scan.mode === 'entry' ? 'ENTRY' : 'EXIT'}
                                        </span>
                                        <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>{scan.vehicle}</span>
                                    </div>
                                    <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{scan.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .workflow-body { animation: fadeIn 0.4s ease; }
      `}</style>
        </div>
    );
};

export default GateControl;
