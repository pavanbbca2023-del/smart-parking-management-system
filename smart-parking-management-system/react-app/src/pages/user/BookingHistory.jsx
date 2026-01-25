import React, { useState } from 'react';

const BookingHistory = () => {
  const [filterStatus, setFilterStatus] = useState('all');

  const bookings = [
    {
      id: 'BK001',
      zone: 'Zone A',
      slotId: 'A-03',
      vehicle: 'DL 01 AB 1234',
      date: '2024-01-23',
      startTime: '09:00',
      endTime: '12:00',
      duration: '3 hours',
      amount: 225,
      status: 'completed',
      checkoutTime: '12:15'
    },
    {
      id: 'BK002',
      zone: 'Zone B',
      slotId: 'B-01',
      vehicle: 'DL 02 CD 5678',
      date: '2024-01-22',
      startTime: '14:30',
      endTime: '18:00',
      duration: '3.5 hours',
      amount: 140,
      status: 'completed',
      checkoutTime: '17:55'
    },
    {
      id: 'BK003',
      zone: 'Zone C',
      slotId: 'C-01',
      vehicle: 'DL 03 EF 9012',
      date: '2024-01-25',
      startTime: '10:00',
      endTime: '15:00',
      duration: '5 hours',
      amount: 150,
      status: 'upcoming'
    },
    {
      id: 'BK004',
      zone: 'Zone A',
      slotId: 'A-02',
      vehicle: 'DL 01 AB 1234',
      date: '2024-01-20',
      startTime: '11:00',
      endTime: '13:00',
      duration: '2 hours',
      amount: 150,
      status: 'completed',
      checkoutTime: '13:05'
    },
    {
      id: 'BK005',
      zone: 'Zone D',
      slotId: 'D-01',
      vehicle: 'DL 04 GH 3456',
      date: '2024-01-24',
      startTime: '08:00',
      endTime: '10:00',
      duration: '2 hours',
      amount: 150,
      status: 'active'
    }
  ];

  const filteredBookings = filterStatus === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === filterStatus);

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'green';
      case 'active': return 'blue';
      case 'upcoming': return 'orange';
      case 'cancelled': return 'red';
      default: return 'gray';
    }
  };

  const totalEarnings = bookings
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="page">
      <h1>Booking History</h1>
      <p>View all your parking bookings and transactions</p>

      <div className="stats-bar">
        <div className="stat-card">
          <span className="stat-label">Total Bookings</span>
          <strong className="stat-value">{bookings.length}</strong>
        </div>
        <div className="stat-card">
          <span className="stat-label">Completed</span>
          <strong className="stat-value">{bookings.filter(b => b.status === 'completed').length}</strong>
        </div>
        <div className="stat-card">
          <span className="stat-label">Active</span>
          <strong className="stat-value">{bookings.filter(b => b.status === 'active').length}</strong>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Paid</span>
          <strong className="stat-value">₹{totalEarnings}</strong>
        </div>
      </div>

      <div className="filter-section">
        <label>Filter by Status:</label>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">All Bookings</option>
          <option value="completed">Completed</option>
          <option value="active">Active</option>
          <option value="upcoming">Upcoming</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bookings-list">
        {filteredBookings.length > 0 ? (
          filteredBookings.map(booking => (
            <div key={booking.id} className="booking-card">
              <div className="booking-header">
                <h3>{booking.zone} - {booking.slotId}</h3>
                <span className={`status-badge status-${booking.status}`}>
                  {booking.status.toUpperCase()}
                </span>
              </div>
              <div className="booking-details">
                <p><strong>Booking ID:</strong> {booking.id}</p>
                <p><strong>Vehicle:</strong> {booking.vehicle}</p>
                <p><strong>Date:</strong> {booking.date}</p>
                <p><strong>Time:</strong> {booking.startTime} - {booking.endTime} ({booking.duration})</p>
                {booking.checkoutTime && <p><strong>Checked Out:</strong> {booking.checkoutTime}</p>}
              </div>
              <div className="booking-footer">
                <span className="amount">₹{booking.amount}</span>
                <button className="btn-small">View Details</button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-data">No bookings found</p>
        )}
      </div>
    </div>
  );
};

export default BookingHistory;
