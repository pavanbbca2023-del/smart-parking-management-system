import React, { useState, useEffect } from 'react';
import apiService from '../../services/apiService';
import { ZoneRevenueChart, PaymentMethodsChart } from '../../components/Charts';

const Financial = () => {
  const [timeFilter, setTimeFilter] = useState('today');
  const [activeTab, setActiveTab] = useState('revenue');
  const [customDate, setCustomDate] = useState('');
  const [customMonth, setCustomMonth] = useState('');
  const [customYear, setCustomYear] = useState('');
  const [data, setData] = useState({
    revenue: { total: 0, transactions: 0, avgTransaction: 0 },
    expenses: { otherExpenses: 0, total: 0 },
    profit: { net: 0, margin: 100 },
    zones: [],
    sessions: [],
    loading: true
  });

  useEffect(() => {
    fetchFinancialData();
  }, [timeFilter, customDate, customMonth, customYear]);

  const fetchFinancialData = async () => {
    try {
      setData(prev => ({ ...prev, loading: true }));

      const [sessionsRes, zonesRes, analyticsRes] = await Promise.all([
        apiService.getSessions().catch(() => ({ sessions: [] })),
        apiService.getZones().catch(() => ({ zones: [] })),
        apiService.getAnalyticsDashboard().catch(() => ({ summary: {} }))
      ]);

      let sessions = sessionsRes.sessions || [];
      const zones = zonesRes.zones || [];


      // Don't filter sessions by date - show today's sessions only
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      if (timeFilter === 'today') {
        sessions = sessions.filter(session => {
          const sessionDate = new Date(session.booking_time || session.entry_time || session.created_at);
          return sessionDate >= startOfToday;
        });
      }
      
      // Sort sessions by booking_time descending to show latest first
      sessions = sessions.sort((a, b) => {
        const dateA = new Date(a.booking_time || a.entry_time || a.created_at);
        const dateB = new Date(b.booking_time || b.entry_time || b.created_at);
        return dateB - dateA;
      });

      // Calculate revenue from filtered sessions
      const paidSessions = sessions.filter(s => s.payment_status === 'paid');
      const totalRevenue = paidSessions.reduce((sum, s) => sum + (parseFloat(s.total_amount_paid) || parseFloat(s.initial_amount_paid) || 0), 0);
      const totalTransactions = paidSessions.length;
      const avgTransaction = totalTransactions > 0 ? Math.round(totalRevenue / totalTransactions) : 0;

      // Calculate zone-wise revenue using filtered sessions
      const zoneRevenue = zones.map(zone => {
        const zoneName = zone.name || `Zone ${zone.id}`;
        const zoneSessions = paidSessions.filter(s => {
          const sessionZoneName = s.zone_name || s.zone?.name || '';
          const sessionZoneId = s.zone_id || s.zone?.id;
          return sessionZoneName === zoneName || sessionZoneId === zone.id;
        });
        const revenue = zoneSessions.reduce((sum, s) => sum + (parseFloat(s.total_amount_paid) || parseFloat(s.initial_amount_paid) || 0), 0);
        return {
          zone: zoneName,
          revenue: Math.round(revenue),
          sessions: zoneSessions.length,
          percentage: totalRevenue > 0 ? Math.round((revenue / totalRevenue) * 100) : 0
        };
      }).filter(z => z.revenue > 0);

      // Calculate payment methods distribution
      const methods = paidSessions.reduce((acc, s) => {
        const amount = parseFloat(s.total_amount_paid) || parseFloat(s.initial_amount_paid) || 0;
        const method = s.payment_method || 'UPI';
        if (!acc[method]) acc[method] = { amount: 0, count: 0 };
        acc[method].amount += amount;
        acc[method].count += 1;
        return acc;
      }, {});

      const colors = { UPI: '#3b82f6', Card: '#10b981', Cash: '#f59e0b', Wallet: '#8b5cf6' };
      const formattedMethods = Object.keys(methods).map(key => ({
        method: key,
        amount: Math.round(methods[key].amount),
        transactions: methods[key].count,
        percentage: totalRevenue > 0 ? Math.round((methods[key].amount / totalRevenue) * 100) : 0,
        color: colors[key] || '#64748b'
      }));

      // Calculate staff salary expenses (dynamic from backend data)
      // const staffSalaries = 15000; // OLD: hardcoded value
      // const otherExpenses = 5000; // Utilities, maintenance, etc.
      // const totalExpenses = staffSalaries + otherExpenses;

      // Calculate net profit (Expenses are removed, so profit = revenue)
      const netProfit = totalRevenue;
      const profitMargin = 100;

      setData({
        revenue: {
          total: Math.round(totalRevenue),
          transactions: totalTransactions,
          avgTransaction: avgTransaction
        },
        expenses: {
          total: 0
        },
        profit: {
          net: Math.round(totalRevenue),
          margin: 100
        },
        zones: zoneRevenue,
        paymentMethods: formattedMethods,
        sessions: sessions.slice(0, 20), // Show more sessions, not just paid ones
        loading: false
      });

    } catch (error) {
      console.error('Financial data fetch error:', error);
      setData(prev => ({ ...prev, loading: false }));
    }
  };

  // Payment methods distribution (calculated from sessions)
  const paymentMethods = data.paymentMethods || [];

  // Export Financial Report as CSV
  const handleExportReport = () => {
    try {
      // Prepare CSV data
      const csvRows = [];

      // Header
      csvRows.push('Smart Parking Management System - Financial Report');
      csvRows.push(`Generated,${new Date().toLocaleString('en-GB')}`);
      csvRows.push(`Filter,${timeFilter}`);
      csvRows.push(''); // Empty line

      // Revenue Summary
      csvRows.push('REVENUE SUMMARY');
      csvRows.push('Metric,Value');
      csvRows.push(`Total Revenue,Rs ${data.revenue.total.toLocaleString()}`);
      csvRows.push(`Total Transactions,${data.revenue.transactions}`);
      csvRows.push(`Average Transaction,Rs ${data.revenue.avgTransaction}`);
      csvRows.push(''); // Empty line

      // Profit Summary

      // Profit Summary
      csvRows.push('PROFIT SUMMARY');
      csvRows.push('Metric,Value');
      csvRows.push(`Net Profit,Rs ${data.profit?.net?.toLocaleString() || 0}`);
      csvRows.push(''); // Empty line

      // Zone Revenue

      // Zone Revenue
      if (data.zones && data.zones.length > 0) {
        csvRows.push('ZONE-WISE REVENUE');
        csvRows.push('Zone,Revenue (Rs),Sessions,Percentage');
        data.zones.forEach(zone => {
          csvRows.push(`${zone.zone},${zone.revenue},${zone.sessions},${zone.percentage}%`);
        });
        csvRows.push(''); // Empty line
      }

      // Payment Methods
      if (data.paymentMethods && data.paymentMethods.length > 0) {
        csvRows.push('PAYMENT METHODS');
        csvRows.push('Method,Amount (Rs),Transactions,Percentage');
        data.paymentMethods.forEach(method => {
          csvRows.push(`${method.method},${method.amount},${method.transactions},${method.percentage}%`);
        });
        csvRows.push(''); // Empty line
      }

      // Recent Transactions
      if (data.sessions && data.sessions.length > 0) {
        csvRows.push('RECENT TRANSACTIONS');
        csvRows.push('Vehicle,Zone,Amount (Rs),Payment Method,Date');
        data.sessions.forEach(session => {
          const date = new Date(session.exit_time || session.entry_time || session.created_at).toLocaleDateString();
          csvRows.push(`${session.vehicle_number || 'N/A'},${session.zone_name || 'N/A'},${session.total_amount_paid || 0},${session.payment_method || 'N/A'},${date}`);
        });
      }

      // Create and download CSV
      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `financial-report-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert('✅ Financial Report exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      alert('❌ Failed to export report. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: { bg: '#dcfce7', text: '#166534' },
      pending: { bg: '#fef3c7', text: '#92400e' },
      failed: { bg: '#fee2e2', text: '#991b1b' }
    };
    return colors[status] || colors.completed;
  };

  if (data.loading) {
    return (
      <div style={{
        padding: '24px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        fontSize: '18px',
        color: '#64748b'
      }}>
        Loading financial data...
      </div>
    );
  }



  return (
    <div style={{
      padding: '32px',
      backgroundColor: '#f8fafc',
      minHeight: '100%',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px'
      }}>
        <div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#1e293b',
            margin: '0 0 8px 0'
          }}>
            💰 Financial Report
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#64748b',
            margin: '0'
          }}>
            Financial management and reporting dashboard
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Time Filter Dropdown */}
          <select
            value={timeFilter}
            onChange={(e) => {
              setTimeFilter(e.target.value);
              // Reset custom filters when switching to preset filters
              if (e.target.value !== 'custom') {
                setCustomDate('');
                setCustomMonth('');
                setCustomYear('');
              }
            }}
            style={{
              padding: '8px 16px',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '14px',
              backgroundColor: 'white'
            }}
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="custom">Custom Date</option>
          </select>

          {/* Custom Date Filters */}
          {timeFilter === 'custom' && (
            <>
              {/* Specific Date Picker */}
              <div style={{ position: 'relative' }}>
                <input
                  type="date"
                  value={customDate}
                  onChange={(e) => {
                    setCustomDate(e.target.value);
                    setCustomMonth('');
                    setCustomYear('');
                  }}
                  style={{
                    padding: '8px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '500',
                    backgroundColor: 'white',
                    color: '#1e293b',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    minWidth: '150px'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              {/* Month Picker */}
              <div style={{ position: 'relative' }}>
                <input
                  type="month"
                  value={customMonth}
                  onChange={(e) => {
                    setCustomMonth(e.target.value);
                    setCustomDate('');
                    setCustomYear('');
                  }}
                  style={{
                    padding: '8px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '500',
                    backgroundColor: 'white',
                    color: '#1e293b',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    minWidth: '150px'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#10b981'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              {/* Year Picker */}
              <select
                value={customYear}
                onChange={(e) => {
                  setCustomYear(e.target.value);
                  setCustomDate('');
                  setCustomMonth('');
                }}
                style={{
                  padding: '8px 16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '500',
                  backgroundColor: 'white',
                  color: customYear ? '#1e293b' : '#94a3b8',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  minWidth: '120px'
                }}
                onFocus={(e) => e.target.style.borderColor = '#f59e0b'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              >
                <option value="" style={{ color: '#94a3b8' }}>Select Year</option>
                {[2026, 2025, 2024, 2023, 2022].map(year => (
                  <option key={year} value={year} style={{ color: '#1e293b' }}>{year}</option>
                ))}
              </select>

              {/* Clear Filter Button */}
              <button
                onClick={() => {
                  setCustomDate('');
                  setCustomMonth('');
                  setCustomYear('');
                }}
                style={{
                  padding: '8px 16px',
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 12px -2px rgba(239, 68, 68, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(239, 68, 68, 0.2)';
                }}
              >
                <span style={{ fontSize: '12px' }}>✕</span> Clear
              </button>
            </>
          )}

          <button
            onClick={handleExportReport}
            style={{
              padding: '8px 16px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
          >
            📤 Export
          </button>
        </div>
      </div>

      {/* Revenue Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 8px 0' }}>Total Revenue</p>
              <p style={{ fontSize: '28px', fontWeight: '700', color: '#10b981', margin: '0' }}>
                ₹{data.revenue.total.toLocaleString()}
              </p>
              {data.revenue.total > 0 ? (
                <p style={{ fontSize: '12px', color: '#10b981', margin: '4px 0 0 0' }}>Processing live transactions</p>
              ) : (
                <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>No revenue yet today</p>
              )}
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#dcfce7',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>💰</div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 8px 0' }}>Transactions</p>
              <p style={{ fontSize: '28px', fontWeight: '700', color: '#3b82f6', margin: '0' }}>
                {data.revenue.transactions}
              </p>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>Total processed today</p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#dbeafe',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>💳</div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 8px 0' }}>Avg Transaction</p>
              <p style={{ fontSize: '28px', fontWeight: '700', color: '#f59e0b', margin: '0' }}>
                ₹{data.revenue.avgTransaction}
              </p>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>Per successful booking</p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#fef3c7',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>📈</div>
          </div>
        </div>




        {/* Net Profit Card */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 8px 0' }}>Net Profit</p>
              <p style={{
                fontSize: '28px',
                fontWeight: '700',
                color: (data.profit?.net || 0) >= 0 ? '#10b981' : '#ef4444',
                margin: '0'
              }}>
                ₹{data.profit?.net?.toLocaleString() || '0'}
              </p>
              <p style={{
                fontSize: '12px',
                color: (data.profit?.net || 0) >= 0 ? '#10b981' : '#ef4444',
                margin: '4px 0 0 0'
              }}>
                {data.profit?.margin || 100}% profit margin
              </p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: (data.profit?.net || 0) >= 0 ? '#dcfce7' : '#fee2e2',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>{(data.profit?.net || 0) >= 0 ? '💎' : '⚠️'}</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '6px',
        marginBottom: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e2e8f0',
        display: 'flex',
        gap: '4px'
      }}>
        {[
          { id: 'revenue', label: '💰 Revenue Reports', icon: '💰' },
          { id: 'transactions', label: '📊 Transaction History', icon: '📊' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 20px',
              backgroundColor: activeTab === tab.id ? '#3b82f6' : 'transparent',
              color: activeTab === tab.id ? 'white' : '#64748b',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Revenue Tab Content */}
      {activeTab === 'revenue' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* Zone Revenue Chart */}
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1e293b',
              margin: '0 0 20px 0'
            }}>🏢 Zone-wise Revenue</h3>

            {/* Interactive Bar Chart */}
            <div style={{ height: '300px', marginBottom: '24px' }}>
              <ZoneRevenueChart data={{
                labels: data.zones.map(z => z.zone),
                data: data.zones.map(z => z.revenue)
              }} />
            </div>

            {/* Zone Details List */}
            <div style={{ marginTop: '20px' }}>
              {data.zones.map((zone, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  borderBottom: index < data.zones.length - 1 ? '1px solid #f1f5f9' : 'none'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: ['#dc2626', '#f59e0b', '#059669', '#10b981'][index]
                    }}></div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b' }}>{zone.zone}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{zone.sessions} sessions</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
                      ₹{zone.revenue.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{zone.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1e293b',
              margin: '0 0 20px 0'
            }}>💳 Payment Methods</h3>

            {/* Interactive Doughnut Chart */}
            <div style={{ height: '250px', marginBottom: '24px' }}>
              <PaymentMethodsChart data={{
                labels: paymentMethods.map(m => m.method),
                data: paymentMethods.map(m => m.amount)
              }} />
            </div>

            {/* Payment Method Details */}
            {paymentMethods.map((method, index) => (
              <div key={index} style={{
                marginBottom: '16px',
                padding: '16px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #f1f5f9'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: method.color
                    }}></div>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b' }}>
                      {method.method}
                    </span>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
                    {method.percentage}%
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}>
                  <span style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
                    ₹{method.amount.toLocaleString()}
                  </span>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    {method.transactions} transactions
                  </span>
                </div>
                <div style={{
                  width: '100%',
                  height: '4px',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '2px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${method.percentage}%`,
                    height: '100%',
                    backgroundColor: method.color,
                    borderRadius: '2px',
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transaction History Tab */}
      {activeTab === 'transactions' && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '24px 24px 0 24px' }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1e293b',
              margin: '0 0 20px 0'
            }}>📊 Recent Transactions</h3>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc' }}>
                  <th style={{
                    padding: '16px 24px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#374151',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    Booking ID</th>
                  <th style={{
                    padding: '16px 24px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#374151',
                    borderBottom: '1px solid #e5e7eb'
                  }}>Booking Date</th>
                  <th style={{
                    padding: '16px 24px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#374151',
                    borderBottom: '1px solid #e5e7eb'
                  }}>Vehicle Number</th>
                  <th style={{
                    padding: '16px 24px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#374151',
                    borderBottom: '1px solid #e5e7eb'
                  }}>Amount Paid</th>
                  <th style={{
                    padding: '16px 24px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#374151',
                    borderBottom: '1px solid #e5e7eb'
                  }}>Method</th>
                  <th style={{
                    padding: '16px 24px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#374151',
                    borderBottom: '1px solid #e5e7eb'
                  }}>Zone</th>
                  <th style={{
                    padding: '16px 24px',
                    textAlign: 'center',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#374151',
                    borderBottom: '1px solid #e5e7eb'
                  }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.sessions.map((session, index) => {
                  const status = session.payment_status === 'paid' ? 'completed' : 'pending';
                  const statusColors = getStatusColor(status);
                  const sessionDate = new Date(session.booking_time || session.entry_time || Date.now());
                  return (
                    <tr key={session.id || index} style={{
                      borderBottom: index < data.sessions.length - 1 ? '1px solid #f3f4f6' : 'none'
                    }}>
                      <td style={{ padding: '16px 24px', fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>
                        #{session.id || (index + 1)}
                      </td>
                      <td style={{ padding: '16px 24px', fontSize: '14px', color: '#64748b', fontWeight: '500' }}>
                        {sessionDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                      </td>
                      <td style={{ padding: '16px 24px', fontSize: '14px', color: '#64748b' }}>
                        {session.vehicle_number || 'N/A'}
                      </td>
                      <td style={{ padding: '16px 24px', fontSize: '14px', color: '#1f2937', fontWeight: '600' }}>
                        ₹{parseFloat(session.total_amount_paid || session.initial_amount_paid || 0).toFixed(2)}
                      </td>
                      <td style={{ padding: '16px 24px', fontSize: '14px', color: '#64748b' }}>
                        {session.payment_method || '-'}
                      </td>
                      <td style={{ padding: '16px 24px', fontSize: '14px', color: '#64748b' }}>
                        {session.zone_name || 'Zone A'}
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '500',
                          backgroundColor: statusColors.bg,
                          color: statusColors.text,
                          textTransform: 'capitalize'
                        }}>
                          {session.status === 'pending_payment' ? 'Pending Payment' : status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}


    </div>
  );
};

export default Financial;