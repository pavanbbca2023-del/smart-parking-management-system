import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { parkingApi } from '../../api/api';

const TrackBooking = ({ onNavigate }) => {
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!vehicleNumber.trim()) return;

        setLoading(true);
        setError('');

        try {
            const response = await parkingApi.getBookingHistory(vehicleNumber.toUpperCase());
            // Backend returns { success: true, sessions: [...] }
            const sessions = response.data.sessions || [];

            if (sessions.length === 0) {
                setError('No history found for this vehicle number.');
                return;
            }

            // Get the latest session
            const latestSession = sessions[0];

            if (['active', 'reserved'].includes(latestSession.status.toLowerCase())) {
                const bookingData = {
                    bookingId: latestSession.id,
                    vehicleNumber: latestSession.vehicle_number,
                    vehicleType: latestSession.vehicle_type || 'Vehicle',
                    selectedZone: latestSession.zone_name,
                    selectedSlot: latestSession.slot_number,
                    entryTime: new Date(latestSession.entry_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    exitTime: latestSession.exit_time
                        ? new Date(latestSession.exit_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : (latestSession.booking_expiry_time
                            ? new Date(latestSession.booking_expiry_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : 'N/A'),
                    totalAmount: latestSession.estimated_total,
                    amountPaid: latestSession.initial_amount_paid,
                    remainingBalance: latestSession.estimated_balance,
                    qrCode: latestSession.qr_code_data,
                    backendSessionId: latestSession.id,
                    status: latestSession.status.toUpperCase(),
                    isReserved: latestSession.status.toLowerCase() === 'reserved',
                    fullExpiryTime: latestSession.booking_expiry_time
                };
                localStorage.setItem('activeBooking', JSON.stringify(bookingData));
                onNavigate('booking-confirmation', bookingData);
            } else if (latestSession.status.toLowerCase() === 'completed') {
                const receiptData = {
                    receiptId: `RCP-${latestSession.id}`,
                    bookingId: latestSession.id,
                    vehicleNumber: latestSession.vehicle_number,
                    vehicleType: latestSession.vehicle_type || 'Vehicle',
                    slotNumber: `${latestSession.zone_name} / ${latestSession.slot_number}`,
                    entryTime: new Date(latestSession.entry_time).toLocaleString(),
                    exitTime: new Date(latestSession.exit_time).toLocaleString(),
                    duration: latestSession.duration || 'N/A',
                    baseAmount: latestSession.total_amount_paid - latestSession.initial_amount_paid,
                    gstAmount: 0,
                    totalAmount: latestSession.total_amount_paid,
                    paymentMethod: latestSession.payment_method || 'UPI',
                    transactionId: `TXN-${latestSession.id}`
                };
                onNavigate('receipt', receiptData);
            } else if (latestSession.status.toLowerCase() === 'cancelled') {
                setError('This booking was cancelled.');
            } else {
                setError('Found a record, but its status is unknown.');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to fetch booking. Please check your vehicle number.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="guest-page track-booking-page">
            <PageHeader
                title="Track My Booking"
                description="Retrieve your parking QR code using vehicle number"
                icon="🔍"
            />

            <div className="container" style={{ maxWidth: '600px', margin: '40px auto' }}>
                <div style={{
                    background: 'white',
                    padding: '40px',
                    borderRadius: '20px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '50px', marginBottom: '20px' }}>🚗</div>
                    <h3>Find Your Booking</h3>
                    <p style={{ color: '#64748b', marginBottom: '30px' }}>
                        Lost your QR code? Enter your vehicle number below to retrieve it.
                    </p>

                    <form onSubmit={handleSearch}>
                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <input
                                type="text"
                                value={vehicleNumber}
                                onChange={(e) => setVehicleNumber(e.target.value)}
                                placeholder="Enter Vehicle Number (e.g. MP04NG1234)"
                                style={{
                                    width: '100%',
                                    padding: '15px',
                                    fontSize: '18px',
                                    borderRadius: '10px',
                                    border: '2px solid #e2e8f0',
                                    textAlign: 'center',
                                    textTransform: 'uppercase'
                                }}
                                required
                            />
                        </div>

                        {error && (
                            <div style={{
                                padding: '10px',
                                background: '#fee2e2',
                                color: '#dc2626',
                                borderRadius: '8px',
                                marginBottom: '20px',
                                fontSize: '14px'
                            }}>
                                ⚠️ {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                            style={{ width: '100%', padding: '15px', fontSize: '18px' }}
                        >
                            {loading ? 'Searching...' : 'Retrieve QR Code →'}
                        </button>
                    </form>
                </div>

                <div style={{ marginTop: '30px', textAlign: 'center' }}>
                    <button className="btn-secondary" onClick={() => onNavigate('home')}>
                        ← Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TrackBooking;
