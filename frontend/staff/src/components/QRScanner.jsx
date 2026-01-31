import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { parkingApi } from '../api/api';
import './StaffPages.css';

const QRScanner = () => {
    const [mode, setMode] = useState('entry'); // 'entry' or 'exit'
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [manualInput, setManualInput] = useState('');
    const [zones, setZones] = useState([]);
    const [selectedZone, setSelectedZone] = useState('');
    const [recentScans, setRecentScans] = useState([]);
    const scannerRef = useRef(null);
    const html5QrcodeScannerRef = useRef(null);

    useEffect(() => {
        fetchZones();
    }, []);

    useEffect(() => {
        if (scanning) {
            startScanner();
        }
        return () => {
            stopScanner();
        };
    }, [scanning]);

    const fetchZones = async () => {
        try {
            const response = await parkingApi.getZones();
            if (response.data.success) {
                setZones(response.data.zones || []);
                if (response.data.zones?.length > 0) {
                    setSelectedZone(response.data.zones[0].id);
                }
            }
        } catch (err) {
            console.error('Error fetching zones:', err);
        }
    };

    const startScanner = () => {
        if (html5QrcodeScannerRef.current) return;

        const config = {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0
        };

        html5QrcodeScannerRef.current = new Html5QrcodeScanner(
            "qr-reader",
            config,
            false
        );

        html5QrcodeScannerRef.current.render(onScanSuccess, onScanError);
    };

    const stopScanner = () => {
        if (html5QrcodeScannerRef.current) {
            html5QrcodeScannerRef.current.clear().catch(err => {
                console.error('Error stopping scanner:', err);
            });
            html5QrcodeScannerRef.current = null;
        }
    };

    const onScanSuccess = async (decodedText) => {
        try {
            setError(null);
            const qrData = JSON.parse(decodedText);

            if (mode === 'entry') {
                await handleEntry(qrData);
            } else {
                await handleExit(qrData);
            }

            stopScanner();
            setScanning(false);
        } catch (err) {
            console.error('QR Parse Error:', err);
            setError('Invalid QR code format');
        }
    };

    const onScanError = (errorMessage) => {
        // Ignore continuous scan errors
    };

    const handleEntry = async (data) => {
        try {
            const payload = {
                session_id: data.session_id,
                vehicle_number: data.vehicle_number,
                zone_id: selectedZone
            };

            const response = await parkingApi.processEntry(payload);

            if (response.data.success) {
                setResult({
                    type: 'success',
                    mode: 'entry',
                    message: 'Vehicle entry recorded successfully!',
                    data: {
                        vehicleNumber: data.vehicle_number,
                        sessionId: response.data.session_id,
                        zone: data.zone || 'N/A'
                    }
                });
                addToRecentScans({
                    vehicle: data.vehicle_number,
                    mode: 'entry',
                    time: new Date().toLocaleTimeString()
                });
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to process entry');
        }
    };

    const handleExit = async (data) => {
        try {
            const payload = {
                session_id: data.session_id,
                vehicle_number: data.vehicle_number
            };

            const response = await parkingApi.processExit(payload);

            if (response.data.success) {
                setResult({
                    type: 'success',
                    mode: 'exit',
                    message: 'Vehicle exit processed successfully!',
                    data: {
                        vehicleNumber: data.vehicle_number,
                        totalAmount: response.data.total_amount,
                        duration: response.data.duration_hours
                    }
                });
                addToRecentScans({
                    vehicle: data.vehicle_number,
                    mode: 'exit',
                    time: new Date().toLocaleTimeString()
                });
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to process exit');
        }
    };

    const handleManualSubmit = async () => {
        if (!manualInput.trim()) {
            setError('Please enter vehicle number');
            return;
        }

        const data = {
            vehicle_number: manualInput.toUpperCase(),
            zone_id: mode === 'entry' ? selectedZone : undefined
        };

        if (mode === 'entry') {
            await handleEntry(data);
        } else {
            await handleExit(data);
        }
    };

    const addToRecentScans = (scan) => {
        setRecentScans(prev => [scan, ...prev].slice(0, 5));
    };

    const toggleScanning = () => {
        setScanning(!scanning);
        setError(null);
        setResult(null);
    };

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div className="header-content">
                    <div className="logo-section">
                        <div className="system-logo">🅿️</div>
                        <div className="system-info">
                            <h2>Quick Park</h2>
                            <p>Management System</p>
                        </div>
                    </div>
                    <h1>📱 QR Scanner</h1>
                </div>
            </div>

            <div className="reports-content">
                {/* Mode Toggle */}
                <div style={{
                    display: 'flex',
                    gap: '12px',
                    marginBottom: '24px',
                    justifyContent: 'center'
                }}>
                    <button
                        onClick={() => setMode('entry')}
                        style={{
                            padding: '12px 32px',
                            fontSize: '16px',
                            fontWeight: '600',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            backgroundColor: mode === 'entry' ? '#10b981' : '#e5e7eb',
                            color: mode === 'entry' ? 'white' : '#6b7280',
                            transition: 'all 0.2s'
                        }}
                    >
                        🚗 Entry Mode
                    </button>
                    <button
                        onClick={() => setMode('exit')}
                        style={{
                            padding: '12px 32px',
                            fontSize: '16px',
                            fontWeight: '600',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            backgroundColor: mode === 'exit' ? '#ef4444' : '#e5e7eb',
                            color: mode === 'exit' ? 'white' : '#6b7280',
                            transition: 'all 0.2s'
                        }}
                    >
                        🏁 Exit Mode
                    </button>
                </div>

                {/* Scanner Section */}
                <div style={{
                    backgroundColor: 'white',
                    padding: '32px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    marginBottom: '24px'
                }}>
                    <h3 style={{
                        fontSize: '20px',
                        fontWeight: '600',
                        color: '#1e293b',
                        marginBottom: '20px',
                        textAlign: 'center'
                    }}>
                        {mode === 'entry' ? '📷 Scan QR for Entry' : '📷 Scan QR for Exit'}
                    </h3>

                    {!scanning ? (
                        <div style={{ textAlign: 'center' }}>
                            <button
                                onClick={toggleScanning}
                                style={{
                                    padding: '16px 48px',
                                    fontSize: '18px',
                                    fontWeight: '600',
                                    border: 'none',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    backgroundColor: '#3b82f6',
                                    color: 'white',
                                    boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)'
                                }}
                            >
                                📱 Start Scanning
                            </button>
                        </div>
                    ) : (
                        <div>
                            <div id="qr-reader" style={{
                                width: '100%',
                                maxWidth: '500px',
                                margin: '0 auto'
                            }}></div>
                            <div style={{ textAlign: 'center', marginTop: '16px' }}>
                                <button
                                    onClick={toggleScanning}
                                    style={{
                                        padding: '12px 32px',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        border: '2px solid #ef4444',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        backgroundColor: 'white',
                                        color: '#ef4444'
                                    }}
                                >
                                    ⏹️ Stop Scanning
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Manual Input Section */}
                <div style={{
                    backgroundColor: 'white',
                    padding: '32px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    marginBottom: '24px'
                }}>
                    <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1e293b',
                        marginBottom: '20px'
                    }}>
                        ⌨️ Manual Entry (Fallback)
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontWeight: '600',
                                color: '#475569'
                            }}>
                                Vehicle Number
                            </label>
                            <input
                                type="text"
                                value={manualInput}
                                onChange={(e) => setManualInput(e.target.value.toUpperCase())}
                                placeholder="e.g., MH12AB1234"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    fontSize: '16px',
                                    border: '2px solid #e2e8f0',
                                    borderRadius: '8px',
                                    outline: 'none'
                                }}
                            />
                        </div>

                        {mode === 'entry' && (
                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontWeight: '600',
                                    color: '#475569'
                                }}>
                                    Select Zone
                                </label>
                                <select
                                    value={selectedZone}
                                    onChange={(e) => setSelectedZone(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        fontSize: '16px',
                                        border: '2px solid #e2e8f0',
                                        borderRadius: '8px',
                                        outline: 'none'
                                    }}
                                >
                                    {zones.map(zone => (
                                        <option key={zone.id} value={zone.id}>
                                            {zone.name} - ₹{zone.base_price}/hr
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <button
                            onClick={handleManualSubmit}
                            style={{
                                padding: '14px',
                                fontSize: '16px',
                                fontWeight: '600',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                backgroundColor: mode === 'entry' ? '#10b981' : '#ef4444',
                                color: 'white'
                            }}
                        >
                            {mode === 'entry' ? '✅ Process Entry' : '✅ Process Exit'}
                        </button>
                    </div>
                </div>

                {/* Result Display */}
                {result && (
                    <div style={{
                        backgroundColor: '#f0fdf4',
                        border: '2px solid #10b981',
                        padding: '24px',
                        borderRadius: '12px',
                        marginBottom: '24px'
                    }}>
                        <h3 style={{
                            fontSize: '18px',
                            fontWeight: '600',
                            color: '#15803d',
                            marginBottom: '12px'
                        }}>
                            ✅ {result.message}
                        </h3>
                        <div style={{ color: '#166534' }}>
                            <p><strong>Vehicle:</strong> {result.data.vehicleNumber}</p>
                            {result.mode === 'entry' && (
                                <>
                                    <p><strong>Session ID:</strong> {result.data.sessionId}</p>
                                    <p><strong>Zone:</strong> {result.data.zone}</p>
                                </>
                            )}
                            {result.mode === 'exit' && (
                                <>
                                    <p><strong>Total Amount:</strong> ₹{result.data.totalAmount}</p>
                                    <p><strong>Duration:</strong> {result.data.duration} hours</p>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Error Display */}
                {error && (
                    <div style={{
                        backgroundColor: '#fef2f2',
                        border: '2px solid #ef4444',
                        padding: '16px',
                        borderRadius: '8px',
                        marginBottom: '24px',
                        color: '#991b1b'
                    }}>
                        ❌ {error}
                    </div>
                )}

                {/* Recent Scans */}
                {recentScans.length > 0 && (
                    <div style={{
                        backgroundColor: 'white',
                        padding: '24px',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}>
                        <h3 style={{
                            fontSize: '18px',
                            fontWeight: '600',
                            color: '#1e293b',
                            marginBottom: '16px'
                        }}>
                            📋 Recent Scans
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {recentScans.map((scan, idx) => (
                                <div key={idx} style={{
                                    padding: '12px',
                                    backgroundColor: '#f8fafc',
                                    borderRadius: '6px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <span style={{ fontWeight: '600' }}>{scan.vehicle}</span>
                                    <span style={{
                                        padding: '4px 12px',
                                        borderRadius: '4px',
                                        fontSize: '14px',
                                        backgroundColor: scan.mode === 'entry' ? '#d1fae5' : '#fee2e2',
                                        color: scan.mode === 'entry' ? '#065f46' : '#991b1b'
                                    }}>
                                        {scan.mode === 'entry' ? '🚗 Entry' : '🏁 Exit'}
                                    </span>
                                    <span style={{ color: '#64748b', fontSize: '14px' }}>{scan.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QRScanner;
