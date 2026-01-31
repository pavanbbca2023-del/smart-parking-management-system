import React, { useState, useEffect } from 'react';
import { parkingApi, reportApi } from '../api/api';
import './StaffPages.css';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [revenue, setRevenue] = useState({ total_revenue: 0, cash_revenue: 0, online_revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaymentData();
  }, []);

  const fetchPaymentData = async () => {
    try {
      setLoading(true);
      const [paymentsRes, revenueRes] = await Promise.all([
        parkingApi.getPayments(),
        reportApi.getRevenueSummary()
      ]);

      if (paymentsRes.data.success) {
        setPayments(paymentsRes.data.payments || []);
      }
      if (revenueRes.data.success) {
        setRevenue(revenueRes.data.data);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const viewPaymentHistory = async () => {
    try {
      const response = await parkingApi.getCompletedSessions();
      const sessions = response.data.sessions || [];

      const popup = window.open('', '_blank', 'width=900,height=600');
      let rows = '';
      sessions.forEach(s => {
        rows += `
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; color: #6b7280;">${new Date(s.exit_time).toLocaleTimeString()}</td>
            <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; color: #374151; font-weight: 500;">${s.vehicle_number}</td>
            <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; color: #374151; font-weight: 600;">₹${s.amount_paid}</td>
            <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; color: #6b7280;">${s.payment_method || 'Cash'}</td>
            <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;"><span style="background: #dcfce7; color: #166534; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500;">Completed</span></td>
          </tr>
        `;
      });

      popup.document.write(`
        <html>
          <head><title>Payment History</title></head>
          <body style="font-family: Arial, sans-serif; padding: 20px; background: #f1f5f9;">
            <div style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
              <h2 style="color: #1e293b; margin-bottom: 20px; font-size: 24px; font-weight: 600;">💳 Payment History</h2>
              <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                  <thead>
                    <tr style="background: #f8fafc;">
                      <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e2e8f0; color: #374151; font-weight: 600;">Time</th>
                      <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e2e8f0; color: #374151; font-weight: 600;">Vehicle</th>
                      <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e2e8f0; color: #374151; font-weight: 600;">Amount</th>
                      <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e2e8f0; color: #374151; font-weight: 600;">Method</th>
                      <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e2e8f0; color: #374151; font-weight: 600;">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${rows || '<tr><td colspan="5" style="text-align:center; padding:20px;">No history found</td></tr>'}
                  </tbody>
                </table>
              </div>
              <button onclick="window.close()" style="background: #3b82f6; color: white; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600;">Close History</button>
            </div>
          </body>
        </html>
      `);
    } catch (error) {
      console.error('Error showing history:', error);
      alert('Failed to load payment history');
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading payments...</div>;

  return (
    <div className="payments">
      <div className="payments-header">
        <h1>💰 Payments</h1>
      </div>

      <div className="payments-content">
        <div className="payment-stats">
          <div className="stat-card">
            <h3>Today's Collection</h3>
            <p className="stat-amount">₹{revenue.total_revenue}</p>
          </div>
          <div className="stat-card">
            <h3>Cash Payments</h3>
            <p className="stat-amount">₹{revenue.cash_revenue}</p>
          </div>
          <div className="stat-card">
            <h3>Online Payments</h3>
            <p className="stat-amount">₹{revenue.online_revenue}</p>
          </div>
        </div>

        <div className="payment-sections">
          <div className="payment-section" style={{ width: '100%' }}>
            <h3>Recent Transactions</h3>
            <div className="payment-list">
              {payments.length > 0 ? payments.slice(0, 5).map(payment => (
                <div key={payment.id} className="payment-item">
                  <div className="payment-info" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', width: '100%', alignItems: 'center' }}>
                    <span className="payment-id">#{payment.id}</span>
                    <span className="payment-vehicle">{payment.session_vehicle || 'Vehicle'}</span>
                    <span className="payment-amount" style={{ fontWeight: '700', color: '#10b981' }}>₹{payment.amount}</span>
                    <span className="payment-time" style={{ color: '#64748b', fontSize: '0.85rem' }}>{new Date(payment.payment_time).toLocaleTimeString()}</span>
                  </div>
                </div>
              )) : <p style={{ padding: '20px', textAlign: 'center' }}>No recent payments</p>}
            </div>
          </div>
        </div>

        <div className="payment-actions">
          <button className="action-btn" onClick={viewPaymentHistory} style={{ width: '100%', padding: '15px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
            📊 View Full Payment History
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payments;
