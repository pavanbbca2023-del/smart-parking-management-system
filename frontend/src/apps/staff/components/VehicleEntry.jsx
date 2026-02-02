import React, { useState, useEffect } from 'react';
import { parkingApi } from '../api/api';
import './StaffPages.css';

const VehicleEntry = () => {
  const [entryMethod, setEntryMethod] = useState('manual'); // 'manual' or 'qr'
  const [qrCodeInput, setQrCodeInput] = useState('');
  const [entryData, setEntryData] = useState({
    vehicleNumber: '',
    vehicleType: 'car',
    customerName: '',
    zoneId: '',
    initialAmount: 0
  });

  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchZones();
  }, []);

  const fetchZones = async () => {
    try {
      const response = await parkingApi.getZones();
      if (response.data.success) {
        const fetchZones = response.data.zones || [];
        setZones(fetchZones);
        if (fetchZones.length > 0) {
          setEntryData(prev => ({
            ...prev,
            zoneId: fetchZones[0].id,
            initialAmount: fetchZones[0].base_price
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching zones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleZoneSelect = (zone) => {
    setEntryData({
      ...entryData,
      zoneId: zone.id,
      initialAmount: zone.base_price
    });
  };

  const handleQrScan = async (e) => {
    e.preventDefault();
    if (!qrCodeInput) return;

    try {
      const response = await parkingApi.processEntry({
        session_id: qrCodeInput // Sending the scanned ID
      });
      if (response.data.success) {
        alert(`✅ QR Validation Successful!\nBooking ID: ${qrCodeInput}\n\nGATE OPENING... 🚪🚀`);
        setQrCodeInput('');
      }
    } catch (error) {
      alert('❌ Invalid or Expired QR Code');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!entryData.vehicleNumber || !entryData.zoneId) {
      alert('Please enter vehicle number and select a zone');
      return;
    }

    try {
      const response = await parkingApi.processEntry({
        vehicleNumber: entryData.vehicleNumber,
        zoneId: entryData.zoneId,
        initial_amount: entryData.initialAmount
      });

      if (response.data.success) {
        alert(`✅ Vehicle Entry Successful!\n\nBooking Fee Paid: ₹${response.data.initial_amount}\nSession ID: ${response.data.session_id}\n\nPrinting Entry Ticket... 📄`);
        setEntryData({ ...entryData, vehicleNumber: '', customerName: '' });
      } else {
        alert(`Error: ${response.data.error || 'Failed to process entry'}`);
      }
    } catch (error) {
      console.error('Error processing entry:', error);
      alert(error.response?.data?.error || 'Server error processing entry');
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading entry configuration...</div>;

  return (
    <div className="vehicle-entry">
      <div className="vehicle-entry-header" style={{ marginBottom: '20px' }}>
        <div className="header-info">
          <h1>🚗 Gate Entrance control</h1>
          <p>Choose entry method for the incoming vehicle</p>
        </div>
      </div>

      <div className="method-tabs" style={{ display: 'flex', gap: '10px', padding: '0 0 20px', borderBottom: '1px solid #e5e7eb', marginBottom: '20px' }}>
        <button
          onClick={() => setEntryMethod('manual')}
          style={{
            flex: 1, padding: '15px', borderRadius: '12px', border: 'none', fontWeight: '700', fontSize: '1rem',
            background: entryMethod === 'manual' ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : '#f3f4f6',
            color: entryMethod === 'manual' ? 'white' : '#64748b',
            cursor: 'pointer', transition: 'all 0.3s ease',
            boxShadow: entryMethod === 'manual' ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none'
          }}
        >
          ✍️ Manual Entry (Walk-in)
        </button>
        <button
          onClick={() => setEntryMethod('qr')}
          style={{
            flex: 1, padding: '15px', borderRadius: '12px', border: 'none', fontWeight: '700', fontSize: '1rem',
            background: entryMethod === 'qr' ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : '#f3f4f6',
            color: entryMethod === 'qr' ? 'white' : '#64748b',
            cursor: 'pointer', transition: 'all 0.3s ease',
            boxShadow: entryMethod === 'qr' ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none'
          }}
        >
          📱 Scan QR (Online Booking)
        </button>
      </div>

      <div className="entry-flow-container">
        {entryMethod === 'manual' ? (
          <form onSubmit={handleSubmit} style={{ animation: 'fadeIn 0.4s ease' }}>
            <div className="themed-form-section">
              <h3>🚙 Vehicle Information</h3>
              <div className="themed-form-grid">
                <div className="form-group-themed">
                  <label>Vehicle Number *</label>
                  <input
                    type="text"
                    placeholder="ENTER VEHICLE NUMBER"
                    value={entryData.vehicleNumber}
                    onChange={(e) => setEntryData({ ...entryData, vehicleNumber: e.target.value.toUpperCase() })}
                    required
                    style={{ fontSize: '1.2rem', fontWeight: '600', letterSpacing: '1px' }}
                  />
                </div>
                <div className="form-group-themed">
                  <label>Vehicle Type</label>
                  <select
                    value={entryData.vehicleType}
                    onChange={(e) => setEntryData({ ...entryData, vehicleType: e.target.value })}
                  >
                    <option value="car">🚗 Car / Sedan</option>
                    <option value="bike">🏍️ Motorcycle</option>
                    <option value="suv">🚙 SUV / Large</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="themed-form-section">
              <h3>🅿️ Select Zone & Collect Fee</h3>
              <div className="zones-selection-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                {zones.map(zone => (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => handleZoneSelect(zone)}
                    style={{
                      padding: '12px', borderRadius: '10px', border: '2px solid', cursor: 'pointer', textAlign: 'center',
                      borderColor: entryData.zoneId === zone.id ? '#3b82f6' : '#e5e7eb',
                      background: entryData.zoneId === zone.id ? '#eff6ff' : 'white',
                      color: '#1e293b'
                    }}
                  >
                    <div style={{ fontWeight: '700' }}>{zone.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#3b82f6' }}>Base: ₹{zone.base_price}</div>
                  </button>
                ))}
              </div>

              <div className="form-group-themed">
                <label>🎟️ Initial Payment Collected (₹)</label>
                <input
                  type="number"
                  value={entryData.initialAmount}
                  onChange={(e) => setEntryData({ ...entryData, initialAmount: parseFloat(e.target.value) })}
                  required
                  style={{ fontSize: '1.4rem', color: '#10b981', fontWeight: '800' }}
                />
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '8px' }}>
                  User will pay the remaining balance during exit based on duration.
                </p>
              </div>
            </div>

            <button type="submit" className="submit-btn-themed" style={{ background: '#10b981', height: '60px', fontSize: '1.1rem' }}>
              ✅ AUTHORIZE ENTRY & OPEN GATE
            </button>
          </form>
        ) : (
          <div className="qr-scan-simulator" style={{ textAlign: 'center', padding: '20px 0', animation: 'fadeIn 0.4s ease' }}>
            <div style={{
              width: '320px', height: '320px', border: '4px solid #3b82f6', borderRadius: '32px',
              margin: '0 auto 30px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              background: '#000', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.2)'
            }}>
              <div style={{
                position: 'absolute', top: '0', left: '0', width: '100%', height: '4px',
                background: '#10b981', animation: 'qrscanline 2.5s ease-in-out infinite', boxShadow: '0 0 20px #10b981', zIndex: 2
              }} />
              <div style={{ opacity: 0.8, fontSize: '6rem' }}>📱</div>
              <p style={{ color: '#fff', marginTop: '20px', fontWeight: '500' }}>READY TO SCAN...</p>
              <div style={{ border: '2px solid rgba(255,255,255,0.2)', width: '200px', height: '200px', position: 'absolute', borderRadius: '10px' }}></div>
              <style>{`
                    @keyframes qrscanline {
                        0% { top: 10% }
                        50% { top: 90% }
                        100% { top: 10% }
                    }
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `}</style>
            </div>

            <form onSubmit={handleQrScan} style={{ maxWidth: '400px', margin: '0 auto', background: '#f8fafc', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div className="form-group-themed">
                <label style={{ color: '#64748b' }}>Enter Scanned Booking ID</label>
                <input
                  type="text"
                  placeholder="REF-XXXX-XXXX"
                  value={qrCodeInput}
                  onChange={(e) => setQrCodeInput(e.target.value)}
                  style={{ textAlign: 'center', fontSize: '1.2rem', letterSpacing: '2px', recommendation: 'none', border: '2px solid #3b82f6' }}
                />
              </div>
              <button type="submit" className="submit-btn-themed" style={{ marginTop: '15px' }}>
                Verify & Open Gate
              </button>
              <p style={{ marginTop: '15px', fontSize: '0.85rem', color: '#94a3b8' }}>
                QR codes are provided to users who booked online via the Mobile App.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleEntry;
