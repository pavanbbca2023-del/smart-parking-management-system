import React from 'react';
import PageHeader from '../../components/PageHeader';

const PaymentSuccess = ({ onNavigate }) => {
    return (
        <div className="guest-page payment-status">
            <PageHeader
                title="Payment Successful"
                description="Your transaction was completed successfully."
                icon="✅"
            />

            <div className="status-container" style={{ textAlign: 'center', padding: '50px' }}>
                <div className="success">
                    <h2 style={{ color: '#059669' }}>🅿️ Thank You!</h2>
                    <p>Your parking slot has been reserved. You will receive a confirmation SMS soon.</p>
                    <div style={{ marginTop: '24px' }}>
                        <button className="btn-primary" onClick={() => onNavigate('track-booking')}>
                            View Booking History
                        </button>
                        <button className="btn-secondary" style={{ marginLeft: '10px' }} onClick={() => onNavigate('home')}>
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
