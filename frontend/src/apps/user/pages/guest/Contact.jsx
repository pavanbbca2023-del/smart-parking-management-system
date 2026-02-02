import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader';

const Contact = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message sent successfully! We will get back to you soon.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div className="guest-page contact-page">
      <PageHeader 
        title="Contact Us"
        description="Get in touch with our support team"
        icon="📞"
      />

      <div className="contact-container" style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '32px 24px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '48px'
      }}>
        {/* Contact Information */}
        <div className="contact-info">
          <div className="info-card" style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{marginBottom: '24px', color: '#1f2937'}}>📍 Get in Touch</h3>
            
            <div className="contact-item" style={{marginBottom: '24px'}}>
              <div style={{display: 'flex', alignItems: 'center', marginBottom: '8px'}}>
                <span style={{fontSize: '20px', marginRight: '12px'}}>📞</span>
                <h4 style={{margin: 0, color: '#374151'}}>Phone</h4>
              </div>
              <p style={{margin: 0, paddingLeft: '32px', color: '#6b7280'}}>+91 98765 43210</p>
              <p style={{margin: 0, paddingLeft: '32px', color: '#6b7280'}}>+91 87654 32109</p>
            </div>

            <div className="contact-item" style={{marginBottom: '24px'}}>
              <div style={{display: 'flex', alignItems: 'center', marginBottom: '8px'}}>
                <span style={{fontSize: '20px', marginRight: '12px'}}>📧</span>
                <h4 style={{margin: 0, color: '#374151'}}>Email</h4>
              </div>
              <p style={{margin: 0, paddingLeft: '32px', color: '#6b7280'}}>support@smartparking.com</p>
              <p style={{margin: 0, paddingLeft: '32px', color: '#6b7280'}}>info@smartparking.com</p>
            </div>

            <div className="contact-item" style={{marginBottom: '24px'}}>
              <div style={{display: 'flex', alignItems: 'center', marginBottom: '8px'}}>
                <span style={{fontSize: '20px', marginRight: '12px'}}>📍</span>
                <h4 style={{margin: 0, color: '#374151'}}>Address</h4>
              </div>
              <p style={{margin: 0, paddingLeft: '32px', color: '#6b7280'}}>
                Smart Parking Management System<br/>
                123 Parking Street, Sector 15<br/>
                New Delhi - 110001, India
              </p>
            </div>

            <div className="contact-item">
              <div style={{display: 'flex', alignItems: 'center', marginBottom: '8px'}}>
                <span style={{fontSize: '20px', marginRight: '12px'}}>🕒</span>
                <h4 style={{margin: 0, color: '#374151'}}>Working Hours</h4>
              </div>
              <p style={{margin: 0, paddingLeft: '32px', color: '#6b7280'}}>
                24/7 Available - Round the Clock Support
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-form">
          <div className="form-card" style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{marginBottom: '24px', color: '#1f2937'}}>💬 Send us a Message</h3>
            
            <form onSubmit={handleSubmit}>
              <div className="form-row" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px'}}>
                <div className="form-group">
                  <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151'}}>Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>
                
                <div className="form-group">
                  <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151'}}>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Your phone number"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>
              </div>
              
              <div className="form-group" style={{marginBottom: '20px'}}>
                <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151'}}>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
              </div>
              
              <div className="form-group" style={{marginBottom: '20px'}}>
                <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151'}}>Subject *</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                >
                  <option value="">Select a subject</option>
                  <option value="booking-issue">Booking Issue</option>
                  <option value="payment-problem">Payment Problem</option>
                  <option value="technical-support">Technical Support</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="form-group" style={{marginBottom: '24px'}}>
                <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151'}}>Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Please describe your query or feedback..."
                  rows="5"
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                    resize: 'vertical'
                  }}
                />
              </div>
              
              <div className="form-actions" style={{display: 'flex', gap: '12px'}}>
                <button 
                  type="button" 
                  onClick={() => onNavigate('home')}
                  className="btn-secondary"
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    background: 'white',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  ← Back to Home
                </button>
                <button 
                  type="submit"
                  className="btn-primary"
                  style={{
                    flex: 2,
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '8px',
                    background: '#3b82f6',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}
                >
                  Send Message 📤
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;