import React, { useState } from 'react';
import { parkingApi } from '../../api/api';

const BookingHistory = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [vehicleSearch, setVehicleSearch] = useState(''); // New state for search
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Function to fetch bookings
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!vehicleSearch.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const response = await parkingApi.getBookingHistory(vehicleSearch);
      if (response.data && response.data.sessions) {
        // Transform backend data to frontend format
        const formattedBookings = response.data.sessions.map(session => ({
          id: session.id,
          zone: session.zone_name,
          slotId: session.slot_number || 'N/A', // Assuming backend provides slot_number
          vehicle: session.vehicle_number,
          date: new Date(session.entry_time).toLocaleDateString(),
          startTime: new Date(session.entry_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          endTime: session.exit_time ? new Date(session.exit_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-',
          duration: session.duration || '-',
          amount: parseFloat(session.total_amount_paid),
          status: session.status,
          checkoutTime: session.exit_time ? new Date(session.exit_time).toLocaleTimeString() : null
        }));
        setBookings(formattedBookings);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
      alert("Failed to fetch booking history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = filterStatus === 'all'
    ? bookings
    : bookings.filter(booking => booking.status === filterStatus);

  const getStatusColor = (status) => {
    switch (status) {
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
          <strong className="stat-value">₹{totalEarnings.toFixed(2)}</strong>
        </div>
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="Enter Vehicle Number (e.g. DL 01 AB 1234)"
            value={vehicleSearch}
            onChange={(e) => setVehicleSearch(e.target.value)}
            style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '10px 20px', backgroundColor: '#0284c7', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            {loading ? 'Searching...' : 'Search History'}
          </button>
        </form>
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
          <p className="no-data">
            {loading ? 'Loading...' : searched ? 'No bookings found for this vehicle.' : 'Enter your vehicle number above to view booking history.'}
          </p>
        )}
      </div>
    </div>
  );
};

export default BookingHistory;
