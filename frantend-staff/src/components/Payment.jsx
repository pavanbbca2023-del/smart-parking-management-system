import React, { useState, useEffect } from 'react';
import { parkingApi } from '../api/api';

const Payment = () => {
  const [payments, setPayments] = useState([]);
  const [pendingSessions, setPendingSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const [paymentsRes, pendingRes] = await Promise.all([
        parkingApi.getPayments(),
        parkingApi.getPendingSessions()
      ]);

      if (paymentsRes.data.success) {
        setPayments(paymentsRes.data.payments || []);
      }
      if (pendingRes.data.success) {
        setPendingSessions(pendingRes.data.sessions || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Derived stats
  const cashPayments = payments.filter(p => p.payment_method.toLowerCase() === 'cash' && p.status.toLowerCase() === 'success');
  const onlinePayments = payments.filter(p => p.payment_method.toLowerCase() !== 'cash' && p.status.toLowerCase() === 'success');

  const cashTotal = cashPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
  const onlineTotal = onlinePayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);

  const cashStats = {
    totalCash: cashTotal,
    cashInHand: cashTotal * 0.4,
    deposited: cashTotal * 0.6
  };

  const onlineStats = {
    upiPayments: onlinePayments.filter(p => p.payment_method.toLowerCase() === 'upi').length,
    cardPayments: onlinePayments.filter(p => p.payment_method.toLowerCase() === 'card').length,
    totalOnline: onlineTotal
  };

  const handleTodaysPayments = () => {
    const popup = window.open('', '_blank', 'width=900,height=600');
    let tableRows = '';
    payments.slice(0, 20).forEach(payment => {
      tableRows += `
        <div style="display: grid; grid-template-columns: 1.5fr 1fr 1fr 1.5fr 1fr; gap: 10px; padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px;">
          <div style="font-weight: 600; color: #1e293b;">${payment.session_vehicle || 'Vehicle'}</div>
          <div style="color: #10b981; font-weight: 600;">₹${payment.amount}</div>
          <div style="color: #6b7280;">${payment.payment_method}</div>
          <div style="color: #6b7280;">${new Date(payment.payment_time).toLocaleString()}</div>
          <div style="color: #10b981; font-weight: 600;">${payment.status}</div>
        </div>
      `;
    });

    popup.document.write(`<html><body style="font-family:Arial;padding:20px;background:#f1f5f9;">
            <div style="background:white;border-radius:12px;padding:30px;box-shadow:0 4px 12px rgba(0,0,0,0.1);">
                <h2>💳 Live Payment Records</h2>
                <div style="display:grid;grid-template-columns:1.5fr 1fr 1fr 1.5fr 1fr;gap:10px;padding:12px;background:#f8fafc;font-weight:600;">
                    <div>Vehicle</div><div>Amount</div><div>Method</div><div>Time</div><div>Status</div>
                </div>
                ${tableRows || '<div style="padding:20px;text-align:center;">No payments found</div>'}
                <button onclick="window.close()" style="margin-top:20px;padding:10px 20px;background:#3b82f6;color:white;border:none;border-radius:6px;cursor:pointer;">Close</button>
            </div>
        </body></html>`);
  };

  const handleCashManagement = () => {
    const popup = window.open('', '_blank', 'width=800,height=600');
    let cashRows = '';
    cashPayments.forEach(p => {
      cashRows += `
            <div style="display: grid; grid-template-columns: 1.5fr 1fr 1.5fr; gap: 10px; padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px;">
                <div style="font-weight: 600; color: #1e293b;">🚙 ${p.session_vehicle || 'Vehicle'}</div>
                <div style="color: #166534; font-weight: 700;">₹${parseFloat(p.amount).toFixed(2)}</div>
                <div style="color: #64748b; font-size: 12px;">${new Date(p.payment_time).toLocaleString()}</div>
            </div>
        `;
    });

    popup.document.write(`<html><body style="font-family:Arial;padding:20px;background:#f1f5f9;">
            <div style="background:white;border-radius:12px;padding:30px;box-shadow:0 10px 25px rgba(0,0,0,0.1);">
                <div style="display:flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                    <h2 style="margin:0; color:#1e293b;">💰 Cash Management Portal</h2>
                    <span style="background:#f0fdf4; color:#166534; padding:5px 12px; border-radius:20px; font-weight:700; font-size:14px;">LIVE SESSION</span>
                </div>

                <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:30px;">
                    <div style="background:linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);padding:25px;border-radius:12px;text-align:center; border: 1px solid #bbf7d0;">
                        <div style="font-size:28px;font-weight:800;color:#166534;margin-bottom:5px;">₹${cashStats.totalCash.toFixed(2)}</div>
                        <div style="color:#166534; font-weight:600; text-transform:uppercase; font-size:12px; letter-spacing:1px;">Total Cash Revenue</div>
                    </div>
                    <div style="background:linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);padding:25px;border-radius:12px;text-align:center; border: 1px solid #fde68a;">
                        <div style="font-size:28px;font-weight:800;color:#92400e;margin-bottom:5px;">₹${cashStats.cashInHand.toFixed(2)}</div>
                        <div style="color:#92400e; font-weight:600; text-transform:uppercase; font-size:12px; letter-spacing:1px;">Current in Drawer</div>
                    </div>
                </div>

                <h3 style="color:#475569; font-size:16px; margin-bottom:15px; border-bottom: 2px solid #f1f5f9; padding-bottom:10px;">📉 Cash Transaction Log</h3>
                <div style="max-height: 250px; overflow-y: auto; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
                    <div style="display: grid; grid-template-columns: 1.5fr 1fr 1.5fr; gap: 10px; padding: 12px; background: #eff6ff; font-weight: 700; font-size: 13px; color: #1e40af;">
                        <div>Vehicle Number</div><div>Cash Amount</div><div>Time Stamp</div>
                    </div>
                    ${cashRows || '<div style="padding:40px; text-align:center; color:#94a3b8;">No cash transactions recorded for this session</div>'}
                </div>

                <button onclick="window.close()" style="margin-top:25px; width:100%; padding:15px; background:#3b82f6; color:white; border:none; border-radius:8px; cursor:pointer; font-weight:700; transition: background 0.2s;">CLOSE REPORT</button>
            </div>
        </body></html>`);
  };

  const handleOnlinePayments = () => {
    const popup = window.open('', '_blank', 'width=800,height=600');
    let onlineRows = '';
    onlinePayments.forEach(p => {
      onlineRows += `
            <div style="display: grid; grid-template-columns: 1.2fr 1fr 1fr 1.5fr; gap: 10px; padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px;">
                <div style="font-weight: 600; color: #1e293b;">⚡ ${p.session_vehicle || 'Vehicle'}</div>
                <div style="color: #0369a1; font-weight: 700;">₹${parseFloat(p.amount).toFixed(2)}</div>
                <div style="color: #6366f1; text-transform: uppercase; font-size: 11px; font-weight: 700;">${p.payment_method}</div>
                <div style="color: #64748b; font-size: 12px;">${new Date(p.payment_time).toLocaleString()}</div>
            </div>
        `;
    });

    popup.document.write(`<html><body style="font-family:Arial;padding:20px;background:#f1f5f9;">
            <div style="background:white;border-radius:12px;padding:30px;box-shadow:0 10px 25px rgba(0,0,0,0.1);">
                <div style="display:flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                    <h2 style="margin:0; color:#1e293b;">💻 Digital Collection Portal</h2>
                    <span style="background:#f0f9ff; color:#0369a1; padding:5px 12px; border-radius:20px; font-weight:700; font-size:14px;">SECURE GATEWAY</span>
                </div>

                <div style="background:linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);padding:30px;border-radius:12px;text-align:center; border: 1px solid #bae6fd; margin-bottom:30px;">
                    <div style="font-size:32px;font-weight:800;color:#0369a1;margin-bottom:5px;">₹${onlineStats.totalOnline.toFixed(2)}</div>
                    <div style="color:#0369a1; font-weight:600; text-transform:uppercase; font-size:13px; letter-spacing:1px;">Cumulative Digital Revenue</div>
                    <div style="display:flex; justify-content:center; gap:20px; margin-top:15px; font-size:12px; color:#0369a1;">
                        <span>UPI: ${onlineStats.upiPayments} txns</span>
                        <span>CARD: ${onlineStats.cardPayments} txns</span>
                    </div>
                </div>

                <h3 style="color:#475569; font-size:16px; margin-bottom:15px; border-bottom: 2px solid #f1f5f9; padding-bottom:10px;">📉 Online Transaction History</h3>
                <div style="max-height: 250px; overflow-y: auto; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
                    <div style="display: grid; grid-template-columns: 1.2fr 1fr 1fr 1.5fr; gap: 10px; padding: 12px; background: #eff6ff; font-weight: 700; font-size: 13px; color: #1e40af;">
                        <div>Vehicle</div><div>Amount</div><div>Method</div><div>Time</div>
                    </div>
                    ${onlineRows || '<div style="padding:40px; text-align:center; color:#94a3b8;">No digital transactions found for this shift</div>'}
                </div>

                <button onclick="window.close()" style="margin-top:25px; width:100%; padding:15px; background:#3b82f6; color:white; border:none; border-radius:8px; cursor:pointer; font-weight:700;">CLOSE REPORT</button>
            </div>
        </body></html>`);
  };

  const handlePendingReceipts = () => {
    const popup = window.open('', '_blank', 'width=1000,height=600');
    let rows = '';
    pendingSessions.forEach(s => {
      const duration = s.duration || '0h 0m';
      // Fallback if backend doesn't send estimated_balance yet (though it should)
      const pendingAmount = s.estimated_balance !== undefined ? parseFloat(s.estimated_balance).toFixed(2) : '0.00';

      rows += `
                <div style="display:grid;grid-template-columns: 1.2fr 1fr 1fr 1fr 1fr 1fr;gap:10px;padding:15px;border-bottom:1px solid #e2e8f0;align-items:center; font-size:14px;">
                    <div style="font-weight:700; color:#1e293b;">🚘 ${s.vehicle_number}</div>
                    <div style="color:#64748b; font-weight:600;">📍 ${s.zone_name}</div>
                    <div style="color:#10b981; font-weight:600;">₹${parseFloat(s.initial_amount_paid).toFixed(2)} Paid</div>
                    <div style="color:#3b82f6; font-size:12px;">🕒 ${new Date(s.entry_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    <div style="font-weight:700; color:#ef4444;">₹${pendingAmount} Due</div>
                    <div style="text-align:right;"><span style="background:#eff6ff;color:#1d4ed8;padding:5px 10px;border-radius:15px;font-size:11px;font-weight:700;">⏱️ ${duration}</span></div>
                </div>
            `;
    });

    popup.document.write(`<html><body style="font-family:Arial;padding:20px;background:#f1f5f9;">
            <div style="background:white;border-radius:12px;padding:30px;box-shadow:0 10px 25px rgba(0,0,0,0.1);">
                <div style="display:flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="margin:0; color:#1e293b;">⏳ Pending Balance Inventory</h2>
                    <span style="background:#fef3c7; color:#92400e; padding:5px 12px; border-radius:20px; font-weight:700; font-size:14px;">GATE RECONCILIATION</span>
                </div>
                <p style="color:#64748b; margin-bottom:25px;">Detailed list of vehicles currently in the lot. Final balance will be computed at the exit gate based on total duration.</p>
                
                <div style="border:1px solid #e2e8f0;border-radius:12px;overflow:hidden; background: #fff;">
                    <div style="display:grid;grid-template-columns: 1.2fr 1fr 1fr 1fr 1fr 1fr;gap:10px;padding:15px;background:#f8fafc;font-weight:700; color:#475569; font-size:13px; border-bottom: 2px solid #e2e8f0;">
                        <div>Vehicle Plate</div><div>Zone</div><div>Initial Paid</div><div>Entry Time</div><div>Est. Due</div><div style="text-align:right;">Lot Duration</div>
                    </div>
                    ${rows || '<div style="padding:60px;text-align:center;color:#94a3b8; font-style:italic;">No active parking sessions with pending balances</div>'}
                </div>
                
                <div style="margin-top:25px; display:flex; justify-content: space-between; align-items: center;">
                    <div style="color:#94a3b8; font-size:12px;">Total Vehicles Tracked: ${pendingSessions.length}</div>
                    <button onclick="window.close()" style="padding:12px 30px;background:#1e293b;color:white;border:none;border-radius:8px;cursor:pointer; font-weight:600;">CLOSE INVENTORY</button>
                </div>
            </div>
        </body></html>`);
  };

  if (loading) return <div style={{ padding: '20px', color: '#64748b' }}>Refreshing financial data...</div>;

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0', marginBottom: '32px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', margin: '0 0 20px 0' }}>💳 Payment Processing</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <button onClick={handleTodaysPayments} style={{ backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', padding: '16px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>📊 Live Records</button>
        <button onClick={handleCashManagement} style={{ backgroundColor: '#f59e0b', color: 'white', border: 'none', borderRadius: '8px', padding: '16px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>💰 Cash Status</button>
        <button onClick={handleOnlinePayments} style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', padding: '16px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>💻 Digital Totals</button>
        <button onClick={handlePendingReceipts} style={{ backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '8px', padding: '16px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>⏳ Pending Balance</button>
      </div>
    </div>
  );
};

export default Payment;
