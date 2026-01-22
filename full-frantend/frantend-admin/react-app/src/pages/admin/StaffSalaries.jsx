import React, { useState, useEffect } from 'react';
import apiService from '../../services/apiService';

const StaffSalaries = () => {
  const [staffData, setStaffData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(0); // January (0-indexed)
  const [selectedYear, setSelectedYear] = useState(2026); // Default to 2026
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [editValues, setEditValues] = useState({
    overtime_amount: 0,
    bonus: 0,
    deductions: 0
  });

  // Fetch staff salary data from API
  useEffect(() => {
    fetchStaffSalaries();
  }, [selectedMonth, selectedYear]);

  const fetchStaffSalaries = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/staff/salaries/?month=${selectedMonth + 1}&year=${selectedYear}`);
      const data = await response.json();
      
      console.log('API Response:', data); // Debug log
      
      if (data.success && data.staff_salaries) {
        // Transform API data to match frontend expectations
        const transformedData = data.staff_salaries.map(staff => ({
          id: staff.id,
          name: staff.name,
          position: staff.position,
          base_salary: staff.base_salary,
          overtime_amount: staff.overtime_amount,
          bonus: staff.bonus,
          deductions: staff.deductions,
          net_salary: staff.net_salary,
          status: staff.status, // 'pending' or 'paid'
          pay_date: staff.pay_date,
          joining_date: staff.joining_date
        }));
        setStaffData(transformedData);
      } else {
        console.error('Failed to fetch staff salaries:', data.message);
        setStaffData([]);
      }
    } catch (error) {
      console.error('Error fetching staff salaries:', error);
      setStaffData([]);
    } finally {
      setLoading(false);
    }
  };

  const getMockData = () => {
    return [
      {
        id: 1,
        name: 'Rajesh Kumar',
        position: 'Parking Attendant',
        base_salary: 25000,
        overtime_amount: 3500,
        bonus: 2000,
        deductions: 1200,
        net_salary: 29300,
        status: 'pending',
        pay_date: null,
        joining_date: '2023-06-15'
      },
      {
        id: 2,
        name: 'Priya Sharma',
        position: 'Security Guard',
        base_salary: 22000,
        overtime_amount: 2800,
        bonus: 1500,
        deductions: 800,
        net_salary: 25500,
        status: 'pending',
        pay_date: null,
        joining_date: '2024-01-10'
      },
      {
        id: 3,
        name: 'Amit Singh',
        position: 'Supervisor',
        base_salary: 35000,
        overtime_amount: 4200,
        bonus: 3000,
        deductions: 1500,
        net_salary: 40700,
        status: 'pending',
        pay_date: null,
        joining_date: '2023-03-10'
      },
      {
        id: 4,
        name: 'Sunita Devi',
        position: 'Cleaner',
        base_salary: 18000,
        overtime_amount: 1500,
        bonus: 1000,
        deductions: 600,
        net_salary: 19900,
        status: 'pending',
        pay_date: null,
        joining_date: '2024-01-20'
      }
    ];
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const totalSalaries = staffData.reduce((sum, staff) => sum + staff.net_salary, 0);
  const paidSalaries = staffData.filter(s => s.status === 'paid').reduce((sum, staff) => sum + staff.net_salary, 0);
  const pendingSalaries = staffData.filter(s => s.status === 'pending').reduce((sum, staff) => sum + staff.net_salary, 0);

  const handlePaySalary = (staff) => {
    setSelectedStaff(staff);
    setShowPayModal(true);
  };

  const handleEditSalary = (staff) => {
    setEditingStaff(staff);
    setEditValues({
      overtime_amount: staff.overtime_amount,
      bonus: staff.bonus,
      deductions: staff.deductions
    });
    setShowEditModal(true);
  };

  const updateSalaryDetails = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/staff/salaries/${editingStaff.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          overtime_amount: parseFloat(editValues.overtime_amount),
          bonus: parseFloat(editValues.bonus),
          deductions: parseFloat(editValues.deductions)
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchStaffSalaries();
        setShowEditModal(false);
        setEditingStaff(null);
        alert('✅ Salary details updated successfully!');
      } else {
        alert('❌ Failed to update salary details');
      }
    } catch (error) {
      console.error('Error updating salary:', error);
      alert('❌ Error updating salary details');
    }
  };

  const confirmPayment = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/staff/salaries/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          salary_id: selectedStaff.id
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Refresh the data
        await fetchStaffSalaries();
        setShowPayModal(false);
        setSelectedStaff(null);
      } else {
        console.error('Payment failed:', data.message);
        alert('Payment failed: ' + data.message);
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Error processing payment');
    }
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px 0' }}>
          💰 Staff Salaries
        </h1>
        <p style={{ fontSize: '16px', color: '#64748b', margin: '0' }}>
          Manage staff salary payments and records
        </p>
      </div>

      {/* Month/Year Selector */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: '1px solid #e2e8f0',
        marginBottom: '24px',
        display: 'flex',
        gap: '16px',
        alignItems: 'center'
      }}>
        <div>
          <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>
            Month
          </label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            style={{
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          >
            {months.map((month, index) => (
              <option key={index} value={index}>{month}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>
            Year
          </label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            style={{
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          >
            <option value={2026}>2026</option>
            <option value={2025}>2025</option>
            <option value={2024}>2024</option>
            <option value={2023}>2023</option>
            <option value={2022}>2022</option>
            <option value={2021}>2021</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ fontSize: '24px' }}>💼</div>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', margin: '0' }}>Total Staff</h3>
          </div>
          <p style={{ fontSize: '32px', fontWeight: '700', color: '#1e293b', margin: '0' }}>{staffData.length}</p>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ fontSize: '24px' }}>💰</div>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', margin: '0' }}>Total Salaries</h3>
          </div>
          <p style={{ fontSize: '32px', fontWeight: '700', color: '#1e293b', margin: '0' }}>₹{totalSalaries.toLocaleString()}</p>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ fontSize: '24px' }}>✅</div>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', margin: '0' }}>Paid</h3>
          </div>
          <p style={{ fontSize: '32px', fontWeight: '700', color: '#10b981', margin: '0' }}>₹{paidSalaries.toLocaleString()}</p>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ fontSize: '24px' }}>⏳</div>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', margin: '0' }}>Pending</h3>
          </div>
          <p style={{ fontSize: '32px', fontWeight: '700', color: '#f59e0b', margin: '0' }}>₹{pendingSalaries.toLocaleString()}</p>
        </div>
      </div>

      {loading ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '200px',
          fontSize: '16px',
          color: '#64748b'
        }}>
          Loading staff salary data...
        </div>
      ) : (
        /* Staff Salary Table */
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '24px 24px 0 24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', margin: '0 0 20px 0' }}>
              Staff Salary Details - {months[selectedMonth]} {selectedYear}
            </h3>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc' }}>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Staff Details</th>
                  <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Base Salary</th>
                  <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Overtime</th>
                  <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Bonus</th>
                  <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Deductions</th>
                  <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Net Salary</th>
                  <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Status</th>
                  <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {staffData.map((staff, index) => (
                  <tr key={staff.id} style={{ borderBottom: index < staffData.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                    <td style={{ padding: '16px 24px' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>
                          {staff.name}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>
                          {staff.position}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right', fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>
                      ₹{staff.base_salary.toLocaleString()}
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right', fontSize: '14px', color: '#10b981', fontWeight: '500' }}>
                      ₹{staff.overtime_amount.toLocaleString()}
                      <button
                        onClick={() => handleEditSalary(staff)}
                        style={{
                          marginLeft: '8px',
                          padding: '2px 6px',
                          backgroundColor: '#f59e0b',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '10px',
                          cursor: 'pointer'
                        }}
                      >
                        ✏️
                      </button>
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right', fontSize: '14px', color: '#10b981', fontWeight: '500' }}>
                      ₹{staff.bonus.toLocaleString()}
                      <button
                        onClick={() => handleEditSalary(staff)}
                        style={{
                          marginLeft: '8px',
                          padding: '2px 6px',
                          backgroundColor: '#f59e0b',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '10px',
                          cursor: 'pointer'
                        }}
                      >
                        ✏️
                      </button>
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right', fontSize: '14px', color: '#ef4444', fontWeight: '500' }}>
                      ₹{staff.deductions.toLocaleString()}
                      <button
                        onClick={() => handleEditSalary(staff)}
                        style={{
                          marginLeft: '8px',
                          padding: '2px 6px',
                          backgroundColor: '#f59e0b',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '10px',
                          cursor: 'pointer'
                        }}
                      >
                        ✏️
                      </button>
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right', fontSize: '16px', color: '#1f2937', fontWeight: '700' }}>
                      ₹{staff.net_salary.toLocaleString()}
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500',
                        backgroundColor: staff.status === 'paid' ? '#dcfce7' : '#fef3c7',
                        color: staff.status === 'paid' ? '#166534' : '#92400e'
                      }}>
                        {staff.status === 'paid' ? 'Paid' : 'Pending'}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                      {staff.status === 'pending' ? (
                        <button
                          onClick={() => handlePaySalary(staff)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '500',
                            cursor: 'pointer'
                          }}
                        >
                          Pay Now
                        </button>
                      ) : (
                        <span style={{ fontSize: '12px', color: '#64748b' }}>
                          Paid on {staff.pay_date ? new Date(staff.pay_date).toLocaleDateString() : 'N/A'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payment Confirmation Modal */}
      {showPayModal && selectedStaff && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '32px',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            maxWidth: '400px',
            width: '90%'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', margin: '0 0 16px 0' }}>
              Confirm Payment
            </h3>
            <p style={{ fontSize: '16px', color: '#64748b', margin: '0 0 24px 0' }}>
              Are you sure you want to pay salary to <strong>{selectedStaff.name}</strong>?
            </p>
            <div style={{
              backgroundColor: '#f8fafc',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', color: '#64748b' }}>Net Salary:</span>
                <span style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
                  ₹{selectedStaff.net_salary.toLocaleString()}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', color: '#64748b' }}>Position:</span>
                <span style={{ fontSize: '14px', color: '#1e293b' }}>{selectedStaff.position}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowPayModal(false)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#f1f5f9',
                  color: '#64748b',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmPayment}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Salary Modal */}
      {showEditModal && editingStaff && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '32px',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', margin: '0 0 16px 0' }}>
              ✏️ Edit Salary Details - {editingStaff.name}
            </h3>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>
                🕰️ Overtime Amount (₹)
              </label>
              <input
                type="number"
                value={editValues.overtime_amount}
                onChange={(e) => setEditValues({ ...editValues, overtime_amount: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
                placeholder="Enter overtime amount"
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>
                🎁 Bonus Amount (₹)
              </label>
              <input
                type="number"
                value={editValues.bonus}
                onChange={(e) => setEditValues({ ...editValues, bonus: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
                placeholder="Enter bonus amount"
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>
                💸 Deductions (₹)
              </label>
              <input
                type="number"
                value={editValues.deductions}
                onChange={(e) => setEditValues({ ...editValues, deductions: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
                placeholder="Enter deduction amount"
              />
            </div>

            <div style={{
              backgroundColor: '#f8fafc',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', color: '#64748b' }}>Base Salary:</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
                  ₹{editingStaff.base_salary.toLocaleString()}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', color: '#64748b' }}>New Net Salary:</span>
                <span style={{ fontSize: '16px', fontWeight: '700', color: '#10b981' }}>
                  ₹{(editingStaff.base_salary + parseFloat(editValues.overtime_amount || 0) + parseFloat(editValues.bonus || 0) - parseFloat(editValues.deductions || 0)).toLocaleString()}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowEditModal(false)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#f1f5f9',
                  color: '#64748b',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={updateSalaryDetails}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                ✅ Update Salary
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffSalaries;