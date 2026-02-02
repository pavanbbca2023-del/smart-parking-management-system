import React, { useState } from 'react';

const Financial = () => {
  const [timeFilter, setTimeFilter] = useState('today');
  const [activeTab, setActiveTab] = useState('revenue');
  
  const revenueData = {
    today: { total: 18450, transactions: 127, avgTransaction: 145 },
    week: { total: 125600, transactions: 892, avgTransaction: 141 },
    month: { total: 485200, transactions: 3456, avgTransaction: 140 },
    year: { total: 5823400, transactions: 41628, avgTransaction: 140 }
  };

  const transactions = [
    { id: 'TXN001', time: '14:30', amount: 150, method: 'UPI', zone: 'Zone A', status: 'completed' },
    { id: 'TXN002', time: '14:25', amount: 120, method: 'Card', zone: 'Zone B', status: 'completed' },
    { id: 'TXN003', time: '14:20', amount: 80, method: 'Cash', zone: 'Zone C', status: 'pending' },
    { id: 'TXN004', time: '14:15', amount: 200, method: 'UPI', zone: 'Zone A', status: 'completed' },
    { id: 'TXN005', time: '14:10', amount: 90, method: 'Wallet', zone: 'Zone D', status: 'completed' }
  ];

  const paymentMethods = [
    { method: 'UPI', amount: 12500, percentage: 68, transactions: 86, color: '#3b82f6' },
    { method: 'Card', amount: 4200, percentage: 23, transactions: 29, color: '#10b981' },
    { method: 'Cash', amount: 1200, percentage: 6, transactions: 8, color: '#f59e0b' },
    { method: 'Wallet', amount: 550, percentage: 3, transactions: 4, color: '#8b5cf6' }
  ];

  const zoneRevenue = [
    { zone: 'Zone A', revenue: 6800, percentage: 37, sessions: 45 },
    { zone: 'Zone B', revenue: 5200, percentage: 28, sessions: 38 },
    { zone: 'Zone C', revenue: 3900, percentage: 21, sessions: 28 },
    { zone: 'Zone D', revenue: 2550, percentage: 14, sessions: 16 }
  ];

  const currentData = revenueData[timeFilter];

  const getStatusColor = (status) => {
    const colors = {
      completed: { bg: '#dcfce7', text: '#166534' },
      pending: { bg: '#fef3c7', text: '#92400e' },
      failed: { bg: '#fee2e2', text: '#991b1b' }
    };
    return colors[status] || colors.completed;
  };

  return (
    <div style={{
      padding: '24px',
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
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
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <select 
            value={timeFilter} 
            onChange={(e) => setTimeFilter(e.target.value)}
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
          </select>
          <button style={{
            padding: '8px 16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer'
          }}>
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
                ₹{currentData.total.toLocaleString()}
              </p>
              <p style={{ fontSize: '12px', color: '#10b981', margin: '4px 0 0 0' }}>+18% from last period</p>
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
                {currentData.transactions}
              </p>
              <p style={{ fontSize: '12px', color: '#10b981', margin: '4px 0 0 0' }}>+12% from last period</p>
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
                ₹{currentData.avgTransaction}
              </p>
              <p style={{ fontSize: '12px', color: '#10b981', margin: '4px 0 0 0' }}>+5% from last period</p>
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
          { id: 'transactions', label: '📊 Transaction History', icon: '📊' },
          { id: 'payment', label: '💳 Payment Gateway', icon: '💳' },
          { id: 'invoices', label: '📄 Invoices', icon: '📄' }
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
            
            <div style={{ marginBottom: '20px' }}>
              {zoneRevenue.map((zone, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  borderBottom: index < zoneRevenue.length - 1 ? '1px solid #f1f5f9' : 'none'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'][index]
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

            {/* Revenue Progress Bars */}
            <div>
              {zoneRevenue.map((zone, index) => (
                <div key={index} style={{ marginBottom: '12px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '4px'
                  }}>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>{zone.zone}</span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>{zone.percentage}%</span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '6px',
                    backgroundColor: '#f1f5f9',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${zone.percentage}%`,
                      height: '100%',
                      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'][index],
                      borderRadius: '3px',
                      transition: 'width 0.3s ease'
                    }}></div>
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
                  }}>Transaction ID</th>
                  <th style={{
                    padding: '16px 24px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#374151',
                    borderBottom: '1px solid #e5e7eb'
                  }}>Time</th>
                  <th style={{
                    padding: '16px 24px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#374151',
                    borderBottom: '1px solid #e5e7eb'
                  }}>Amount</th>
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
                {transactions.map((txn, index) => {
                  const statusColors = getStatusColor(txn.status);
                  return (
                    <tr key={txn.id} style={{
                      borderBottom: index < transactions.length - 1 ? '1px solid #f3f4f6' : 'none'
                    }}>
                      <td style={{ padding: '16px 24px', fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>
                        {txn.id}
                      </td>
                      <td style={{ padding: '16px 24px', fontSize: '14px', color: '#64748b' }}>
                        {txn.time}
                      </td>
                      <td style={{ padding: '16px 24px', fontSize: '14px', color: '#1f2937', fontWeight: '600' }}>
                        ₹{txn.amount}
                      </td>
                      <td style={{ padding: '16px 24px', fontSize: '14px', color: '#64748b' }}>
                        {txn.method}
                      </td>
                      <td style={{ padding: '16px 24px', fontSize: '14px', color: '#64748b' }}>
                        {txn.zone}
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
                          {txn.status}
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

      {/* Other Tabs Content */}
      {(activeTab === 'payment' || activeTab === 'invoices') && (
        <div style={{
          backgroundColor: 'white',
          padding: '48px 24px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛠️</div>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1e293b',
            margin: '0 0 8px 0'
          }}>Coming Soon</h3>
          <p style={{
            fontSize: '16px',
            color: '#64748b',
            margin: '0'
          }}>This feature is under development</p>
        </div>
      )}
    </div>
  );
};

export default Financial;