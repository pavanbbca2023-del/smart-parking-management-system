import React, { useState, useEffect } from 'react';
import apiService from '../../services/apiService';

const UserManagement = () => {
  const [users, setUsers] = useState({
    all: [],
    staff: [],
    customers: [],
    loading: true,
    error: null
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    role: 'USER',
    phone: '',
    password: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setUsers(prev => ({ ...prev, loading: true, error: null }));
      const allUsers = await apiService.adminGetAllUsers();

      // Ensure allUsers is an array
      const usersArray = Array.isArray(allUsers) ? allUsers : [];

      setUsers({
        all: usersArray,
        staff: usersArray.filter(u => u.role === 'STAFF'),
        customers: usersArray.filter(u => u.role === 'USER'),
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers(prev => ({
        ...prev,
        loading: false,
        error: `Failed to load users: ${error.response?.data?.message || error.message || 'Server error'}`
      }));
    }
  };

  const handleAddUser = async () => {
    if (newUser.username && newUser.email) {
      try {
        await apiService.adminCreateUser(newUser);
        await fetchUsers();

        setNewUser({ username: '', email: '', role: 'USER', phone: '', password: '' });
        setShowAddForm(false);
        alert('✅ User added successfully!');
      } catch (error) {
        console.error('Error adding user:', error);
        alert('❌ Failed to add user: ' + (error.response?.data?.message || 'Unknown error'));
      }
    } else {
      alert('⚠️ Please fill in username and email');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await apiService.adminDeleteUser(userId);
        // Optimistic update
        setUsers(prev => ({
          all: prev.all.filter(u => u.id !== userId),
          staff: prev.staff.filter(u => u.id !== userId),
          customers: prev.customers.filter(u => u.id !== userId),
          loading: false
        }));
        alert('✅ User deleted successfully!');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('❌ Failed to delete user');
      }
    }
  };

  const handleResetPassword = async (userId, username) => {
    const newPassword = prompt(`Enter new password for ${username}:`);
    if (newPassword) {
      try {
        await apiService.adminUpdateUser(userId, { password: newPassword });
        alert(`✅ Password updated successfully!\n\nNew Password: ${newPassword}\n\nPlease share this with the user.`);
      } catch (error) {
        console.error('Error resetting password:', error);
        alert('❌ Failed to update password');
      }
    }
  };

  const UserTable = ({ userList, title }) => (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #e2e8f0',
      overflow: 'hidden'
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8fafc' }}>
            <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Username</th>
            <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Email</th>
            <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Role</th>
            <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Phone</th>
            <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Created</th>
            <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Password</th>
            <th style={{ padding: '16px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {userList.map(user => (
            <tr key={user.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
              <td style={{ padding: '16px', fontSize: '14px', color: '#1f2937' }}>{user.username}</td>
              <td style={{ padding: '16px', fontSize: '14px', color: '#1f2937' }}>{user.email}</td>
              <td style={{ padding: '16px' }}>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '500',
                  backgroundColor: user.role === 'ADMIN' ? '#fee2e2' : user.role === 'STAFF' ? '#fef3c7' : '#dcfce7',
                  color: user.role === 'ADMIN' ? '#991b1b' : user.role === 'STAFF' ? '#92400e' : '#166534'
                }}>
                  {user.role}
                </span>
              </td>
              <td style={{ padding: '16px', fontSize: '14px', color: '#1f2937' }}>{user.phone}</td>
              <td style={{ padding: '16px', fontSize: '14px', color: '#1f2937' }}>{user.created_at}</td>
              <td style={{ padding: '16px', fontSize: '14px', color: '#64748b' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontFamily: 'monospace' }}>••••••••</span>
                  <button
                    onClick={() => alert("🔒 Security Notice:\n\nPasswords are encrypted (hashed) in the database and CANNOT be viewed.\n\nUse the 'Reset' button to set a new password.")}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px'
                    }}
                    title="Show Password"
                  >
                    👁️
                  </button>
                  <button
                    onClick={() => handleResetPassword(user.id, user.username)}
                    title="Reset Password"
                    style={{
                      padding: '4px 8px',
                      backgroundColor: '#f59e0b',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '10px',
                      cursor: 'pointer'
                    }}>
                    Reset
                  </button>
                </div>
              </td>
              <td style={{ padding: '16px', textAlign: 'center' }}>
                <button style={{
                  padding: '6px 12px',
                  marginRight: '8px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}>Edit</button>
                {user.role !== 'ADMIN' && (
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}>Delete</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div >
  );
  return (
    <div style={{
      padding: '24px',
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '700',
          color: '#1e293b',
          margin: '0 0 8px 0'
        }}>
          👥 USER MANAGEMENT
        </h1>
        <p style={{
          fontSize: '16px',
          color: '#64748b',
          margin: '0'
        }}>
          Manage all system users and roles
        </p>
      </div>

      {/* All Users Section */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#1e293b',
            margin: '0'
          }}>
            👑 All Users ({users.all.length})
          </h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            style={{
              padding: '12px 20px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            ➕ Add New User
          </button>
        </div>

        {users.loading ? (
          <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '12px' }}>
            🔄 Loading users...
          </div>
        ) : users.error ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            backgroundColor: '#fee2e2',
            borderRadius: '12px',
            border: '1px solid #fecaca',
            color: '#dc2626'
          }}>
            <p style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>❌ Error Loading Users</p>
            <p style={{ fontSize: '14px', marginBottom: '16px' }}>{users.error}</p>
            <button
              onClick={fetchUsers}
              style={{
                padding: '10px 20px',
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              🔄 Retry
            </button>
          </div>
        ) : (
          <UserTable userList={users.all} title="All Users" />
        )}
      </div>

      {/* Add User Form */}
      {showAddForm && (
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '16px' }}>
              ➕ Add New User
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' }}>
              <input
                type="text"
                placeholder="Username"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                style={{
                  padding: '12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                style={{
                  padding: '12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                style={{
                  padding: '12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              >
                <option value="USER">Customer</option>
                <option value="STAFF">Staff</option>
                <option value="ADMIN">Admin</option>
              </select>
              <input
                type="tel"
                placeholder="Phone Number"
                value={newUser.phone}
                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                style={{
                  padding: '12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
              <input
                type="password"
                placeholder="Password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                style={{
                  padding: '12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  gridColumn: '1 / -1'
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleAddUser}
                style={{
                  padding: '12px 20px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                ✅ Add User
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                style={{
                  padding: '12px 20px',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Staff Members Section */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#1e293b',
          margin: '0 0 24px 0'
        }}>
          👮 Staff Members ({users.staff.length})
        </h2>

        {users.loading ? (
          <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '12px' }}>
            🔄 Loading staff...
          </div>
        ) : (
          <UserTable userList={users.staff} title="Staff Members" />
        )}
      </div>

      {/* Customers Section */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#1e293b',
          margin: '0 0 24px 0'
        }}>
          👤 Customers ({users.customers.length})
        </h2>

        {users.loading ? (
          <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '12px' }}>
            🔄 Loading customers...
          </div>
        ) : (
          <UserTable userList={users.customers} title="Customers" />
        )}
      </div>

      {/* User Roles Section */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#1e293b',
          margin: '0 0 24px 0'
        }}>
          📋 User Roles & Permissions
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '3px solid #dc2626'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#dc2626', marginBottom: '12px' }}>
              👑 ADMIN
            </h3>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>
              Full system control and management
            </p>
            <ul style={{ fontSize: '12px', color: '#374151', listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '8px' }}>✅ Manage all users</li>
              <li style={{ marginBottom: '8px' }}>✅ Create/delete zones</li>
              <li style={{ marginBottom: '8px' }}>✅ View all reports</li>
              <li style={{ marginBottom: '8px' }}>✅ System settings</li>
              <li style={{ marginBottom: '8px' }}>✅ Financial management</li>
            </ul>
            <div style={{ marginTop: '16px', padding: '8px 12px', backgroundColor: '#fee2e2', borderRadius: '6px' }}>
              <span style={{ fontSize: '12px', color: '#991b1b', fontWeight: '500' }}>
                Count: {users.all.filter(u => u.role === 'ADMIN').length} users
              </span>
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '3px solid #f59e0b'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#f59e0b', marginBottom: '12px' }}>
              👮 STAFF
            </h3>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>
              Daily parking operations management
            </p>
            <ul style={{ fontSize: '12px', color: '#374151', listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '8px' }}>✅ QR code scanning</li>
              <li style={{ marginBottom: '8px' }}>✅ Vehicle entry/exit</li>
              <li style={{ marginBottom: '8px' }}>✅ Payment processing</li>
              <li style={{ marginBottom: '8px' }}>✅ Session management</li>
              <li style={{ marginBottom: '8px' }}>❌ Zone creation</li>
            </ul>
            <div style={{ marginTop: '16px', padding: '8px 12px', backgroundColor: '#fef3c7', borderRadius: '6px' }}>
              <span style={{ fontSize: '12px', color: '#92400e', fontWeight: '500' }}>
                Count: {users.staff.length} users
              </span>
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '3px solid #059669'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#059669', marginBottom: '12px' }}>
              👤 CUSTOMER
            </h3>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>
              Mobile app and website access
            </p>
            <ul style={{ fontSize: '12px', color: '#374151', listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '8px' }}>✅ Book parking slots</li>
              <li style={{ marginBottom: '8px' }}>✅ View zones</li>
              <li style={{ marginBottom: '8px' }}>✅ Generate QR codes</li>
              <li style={{ marginBottom: '8px' }}>✅ Online payments</li>
              <li style={{ marginBottom: '8px' }}>✅ Booking history</li>
            </ul>
            <div style={{ marginTop: '16px', padding: '8px 12px', backgroundColor: '#dcfce7', borderRadius: '6px' }}>
              <span style={{ fontSize: '12px', color: '#166534', fontWeight: '500' }}>
                Count: {users.customers.length} users
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default UserManagement;