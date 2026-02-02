import React, { useState, useEffect } from 'react';
import { parkingApi } from '../../api/api';

const ViewSlots = () => {
  const [selectedZone, setSelectedZone] = useState('all');
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [zones, setZones] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await parkingApi.getZones();
        if (response.data && response.data.zones) {
          const fetchedZones = response.data.zones;
          setZones(fetchedZones);

          // Flatten slots from all zones
          const allSlots = fetchedZones.flatMap(zone =>
            zone.slots.map(slot => ({
              id: slot.slot_number,
              zone: zone.name,
              floor: 'G', // Default or from zone description if parsed
              type: 'Regular', // Default
              status: slot.is_occupied ? 'occupied' : 'available',
              price: zone.base_price,
              is_active: slot.is_active
            }))
          );
          setSlots(allSlots);
        }
      } catch (error) {
        console.error("Failed to fetch slots:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredSlots = selectedZone === 'all'
    ? slots
    : slots.filter(slot => slot.zone === selectedZone);

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'green';
      case 'occupied': return 'red';
      case 'reserved': return 'orange';
      default: return 'gray';
    }
  };

  return (
    <div className="page">
      <h1>View Slots</h1>
      <p>Check parking slot availability</p>

      <div className="filter-section">
        <label>Filter by Zone:</label>
        <select value={selectedZone} onChange={(e) => setSelectedZone(e.target.value)}>
          <option value="all">All Zones</option>
          {zones.map(zone => (
            <option key={zone.id} value={zone.name}>{zone.name}</option>
          ))}
        </select>
      </div>

      <div className="slots-container">
        {loading ? (
          <p>Loading slots...</p>
        ) : (
          <table className="slots-table">
            <thead>
              <tr>
                <th>Slot ID</th>
                <th>Zone</th>
                <th>Status</th>
                <th>Price/Hour</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSlots.map(slot => (
                <tr key={slot.id}>
                  <td><strong>{slot.id}</strong></td>
                  <td>{slot.zone}</td>
                  <td>
                    <span className={`status-badge status-${slot.status}`}>
                      {slot.status.charAt(0).toUpperCase() + slot.status.slice(1)}
                    </span>
                  </td>
                  <td>₹{slot.price}</td>
                  <td>
                    <button
                      className={`btn-small ${slot.status === 'available' ? 'btn-primary' : 'btn-disabled'}`}
                      disabled={slot.status !== 'available'}
                    >
                      {slot.status === 'available' ? 'Book' : 'Unavailable'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="legend">
        <p><span className="status-dot available"></span> Available</p>
        <p><span className="status-dot occupied"></span> Occupied</p>
        <p><span className="status-dot reserved"></span> Reserved</p>
      </div>
    </div>
  );
};

export default ViewSlots;
