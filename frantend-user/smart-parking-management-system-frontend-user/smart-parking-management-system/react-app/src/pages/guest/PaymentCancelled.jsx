import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';

const PaymentCancelled = () => {
    const navigate = useNavigate();

    return (
        <div className="guest-page payment-status">
            <PageHeader
                title="Payment Cancelled"
                description="Your transaction was cancelled."
                icon="💳"
            />

            <div className="status-container" style={{ textAlign: 'center', padding: '50px' }}>
                <div className="cancelled">
                    <h2 style={{ color: '#6b7280' }}>Transaction Cancelled</h2>
                    <p>No charges were made. You can try booking again when you're ready.</p>
                    <button className="btn-primary" onClick={() => navigate('/guest/book-slot')}>
                        Back to Booking
                    </button>
                    <button className="btn-secondary" style={{ marginLeft: '10px' }} onClick={() => navigate('/')}>
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentCancelled;
