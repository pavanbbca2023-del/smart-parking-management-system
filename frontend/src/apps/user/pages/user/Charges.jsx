import React from 'react';

const Charges = () => {
  const pricingTable = [
    { slotType: 'Economy', hourlyRate: 30, dailyRate: 200, monthlyRate: 3000, description: 'Standard parking slots' },
    { slotType: 'Standard', hourlyRate: 40, dailyRate: 280, monthlyRate: 4200, description: 'Good location parking' },
    { slotType: 'Premium', hourlyRate: 75, dailyRate: 500, monthlyRate: 7500, description: 'Prime location slots' },
  ];

  const additionalCharges = [
    { description: 'Late checkout (per hour)', amount: 25 },
    { description: 'Monthly subscription discount', amount: -500 },
    { description: 'Visitor pass (24 hours)', amount: 100 },
    { description: 'Reserved slot premium', amount: 50 },
  ];

  return (
    <div className="page">
      <h1>Parking Charges</h1>
      <p>View our transparent pricing structure</p>

      <div className="pricing-section">
        <h2>Slot Type Pricing</h2>
        <div className="pricing-grid">
          {pricingTable.map((item, index) => (
            <div key={index} className="pricing-card">
              <h3>{item.slotType}</h3>
              <p className="description">{item.description}</p>
              <div className="price-list">
                <div className="price-item">
                  <span>Hourly Rate:</span>
                  <strong>₹{item.hourlyRate}</strong>
                </div>
                <div className="price-item">
                  <span>Daily Rate:</span>
                  <strong>₹{item.dailyRate}</strong>
                </div>
                <div className="price-item">
                  <span>Monthly Rate:</span>
                  <strong>₹{item.monthlyRate}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="additional-charges-section">
        <h2>Additional Charges</h2>
        <table className="charges-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {additionalCharges.map((charge, index) => (
              <tr key={index}>
                <td>{charge.description}</td>
                <td className={charge.amount > 0 ? 'text-danger' : 'text-success'}>
                  {charge.amount > 0 ? '+' : ''} ₹{Math.abs(charge.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="info-box">
        <h3>📋 Terms & Conditions</h3>
        <ul>
          <li>Minimum booking duration: 1 hour</li>
          <li>Rates are subject to change without prior notice</li>
          <li>GST 18% will be applied on all charges</li>
          <li>Cancellations within 30 minutes of booking will be charged 50% amount</li>
          <li>Monthly passes must be renewed before expiry</li>
        </ul>
      </div>
    </div>
  );
};

export default Charges;
