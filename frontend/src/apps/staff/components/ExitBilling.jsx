import React, { useState } from 'react';
import { parkingApi } from '../api/api';
import './StaffPages.css';

const ExitBilling = () => {
  const [exitMethod, setExitMethod] = useState('manual'); // 'manual' or 'qr'
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [qrCodeInput, setQrCodeInput] = useState('');
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!vehicleNumber) return;

    try {
      setLoading(true);
      const response = await parkingApi.getActiveSessions();
      if (response.data.success) {
        const sessions = response.data.sessions || [];
        const found = sessions.find(s =>
          s.vehicle_number.replace(/\s/g, '').toUpperCase() ===
          vehicleNumber.replace(/\s/g, '').toUpperCase()
        );

        if (found) {
          setSessionData(found);
        } else {
          alert('❌ No active session found for this vehicle.');
          setSessionData(null);
        }
      }
    } catch (error) {
      console.error('Error searching session:', error);
      alert('Error searching for vehicle session.');
    } finally {
      setLoading(false);
    }
  };

  const handleQrExit = async (e) => {
    e.preventDefault();
    if (!qrCodeInput) return;

    try {
      setLoading(true);
      // Scanned QR usually contains session ID or reference
      const response = await parkingApi.processExit({
        session_id: qrCodeInput
      });

      if (response.data.success) {
        alert(`✅ Exit Authorized via QR!\n\nTotal Bill: ₹${response.data.total_amount}\nBalance Collected: ₹${response.data.final_balance}\nDuration: ${response.data.duration_hours}h`);
        setQrCodeInput('');
        setSessionData(null);
      }
    } catch (error) {
      alert('❌ Invalid or Expired Exit Token');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessExit = async () => {
    if (!sessionData) return;

    try {
      setLoading(true);
      const response = await parkingApi.processExit({
        vehicle_number: sessionData.vehicle_number
      });

      if (response.data.success) {
        alert(`✅ Manual Exit Processed!\n\nTotal Bill: ₹${response.data.total_amount}\nInitial Paid: ₹${response.data.initial_paid}\nFinal Balance: ₹${response.data.final_balance}\nPayment: ${paymentMethod.toUpperCase()}`);
        setVehicleNumber('');
        setSessionData(null);
      } else {
        alert(`Error: ${response.data.error || 'Failed to process exit'}`);
      }
    } catch (error) {
      console.error('Error processing exit:', error);
      alert(error.response?.data?.error || 'Server error processing exit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="exit-billing-themed">
      <div className="exit-billing-header-themed" style={{ marginBottom: '20px' }}>
        <div className="header-info">
          <h1>🧾 Exit Gate Control</h1>
          <p>Process vehicle checkout and collect final balance</p>
        </div>
      </div>

      <div className="method-tabs" style={{ display: 'flex', gap: '10px', padding: '0 0 20px', borderBottom: '1px solid #e5e7eb', marginBottom: '20px' }}>
        <button
          onClick={() => { setExitMethod('manual'); setSessionData(null); }}
          style={{
            flex: 1, padding: '15px', borderRadius: '12px', border: 'none', fontWeight: '700',
            background: exitMethod === 'manual' ? 'linear-gradient(135deg, #ef4444, #dc2626)' : '#f3f4f6',
            color: exitMethod === 'manual' ? 'white' : '#64748b',
            cursor: 'pointer', transition: 'all 0.3s ease'
          }}
        >
          ✍️ Manual Search (Direct)
        </button>
        <button
          onClick={() => { setExitMethod('qr'); setSessionData(null); }}
          style={{
            flex: 1, padding: '15px', borderRadius: '12px', border: 'none', fontWeight: '700',
            background: exitMethod === 'qr' ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : '#f3f4f6',
            color: exitMethod === 'qr' ? 'white' : '#64748b',
            cursor: 'pointer', transition: 'all 0.3s ease'
          }}
        >
          📱 Scan QR (Mobile/Online)
        </button>
      </div>

      <div className="exit-billing-content-themed">
        {exitMethod === 'manual' ? (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <div className="themed-form-section">
              <h3>🔍 Search Active Vehicle</h3>
              <form onSubmit={handleSearch}>
                <div className="form-group-themed">
                  <label>Vehicle Plate Number</label>
                  <input
                    type="text"
                    placeholder="ENTER VEHICLE NUMBER"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                    required
                    style={{ fontSize: '1.2rem', fontWeight: '600' }}
                  />
                </div>
                <button type="submit" className="submit-btn-themed" style={{ background: '#3b82f6' }} disabled={loading}>
                  {loading ? 'Searching...' : '🔍 Search & Load Details'}
                </button>
              </form>
            </div>

            {sessionData && (
              <div className="themed-form-section" style={{ animation: 'fadeIn 0.3s ease' }}>
                <h3>📋 Billing Details</h3>
                <div className="detail-card-themed" style={{ borderLeft: '5px solid #ef4444' }}>
                  <div className="detail-row">
                    <span className="detail-label">Vehicle:</span>
                    <span className="detail-value">{sessionData.vehicle_number}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">In-Time:</span>
                    <span className="detail-value">{new Date(sessionData.entry_time).toLocaleTimeString()}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Duration:</span>
                    <span className="detail-value">{sessionData.duration}</span>
                  </div>
                  <div className="detail-row" style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
                    <span className="detail-label">Initial Paid:</span>
                    <span className="detail-value" style={{ color: '#3b82f6' }}>₹{sessionData.initial_amount_paid}</span>
                  </div>
                  <div className="detail-row" style={{ borderBottom: 'none', borderTop: '2px solid #e2e8f0', marginTop: '5px' }}>
                    <span className="detail-label" style={{ fontSize: '1.1rem', fontWeight: '700' }}>BALANCE DUE:</span>
                    <span className="detail-value" style={{ fontSize: '1.3rem', color: '#ef4444', fontWeight: '800' }}>
                      ₹{sessionData.total_amount_paid > 0
                        ? (sessionData.total_amount_paid - sessionData.initial_amount_paid).toFixed(2)
                        : 'Calc at Exit'}
                    </span>
                  </div>
                </div>

                <div className="form-group-themed">
                  <label>💳 Collection Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="cash">💵 Cash / Physical</option>
                    <option value="card">💳 Card / Swipe</option>
                    <option value="upi">📱 UPI / Scan</option>
                  </select>
                </div>

                <button className="submit-btn-themed" onClick={handleProcessExit} disabled={loading} style={{ background: '#10b981', height: '60px' }}>
                  {loading ? 'Processing...' : '✅ COLLECT BALANCE & AUTHORIZE EXIT'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="qr-checkout-view" style={{ textAlign: 'center', padding: '20px 0', animation: 'fadeIn 0.4s ease' }}>
            <div style={{
              width: '300px', height: '300px', border: '4px solid #ef4444', borderRadius: '32px',
              margin: '0 auto 30px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              background: '#111', position: 'relative', overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute', top: '0', left: '0', width: '100%', height: '4px',
                background: '#ef4444', animation: 'exitscanline 2s ease-in-out infinite', boxShadow: '0 0 20px #ef4444'
              }} />
              <span style={{ fontSize: '5rem' }}>📇</span>
              <p style={{ color: '#fff', marginTop: '20px' }}>SCAN EXIT QR</p>
              <style>{`
                        @keyframes exitscanline {
                            0% { top: 5% }
                            100% { top: 95% }
                        }
                    `}</style>
            </div>

            <form onSubmit={handleQrExit} style={{ maxWidth: '400px', margin: '0 auto', background: '#fff', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div className="form-group-themed">
                <label>Exit Token / Reference ID</label>
                <input
                  type="text"
                  placeholder="SCAN OR TYPE ID"
                  value={qrCodeInput}
                  onChange={(e) => setQrCodeInput(e.target.value)}
                  style={{ textAlign: 'center', fontSize: '1.2rem' }}
                />
              </div>
              <button type="submit" className="submit-btn-themed" style={{ background: '#ef4444' }}>
                Authorize QR Exit
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExitBilling;
