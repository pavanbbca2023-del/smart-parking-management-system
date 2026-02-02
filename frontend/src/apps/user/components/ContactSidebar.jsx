import React, { useState } from 'react';

const ContactSidebar = ({ isOpen, onClose }) => {
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
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="contact-sidebar-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'flex-end'
    }}>
      <div className="contact-sidebar" style={{
        width: '450px',
        height: '100vh',
        backgroundColor: 'white',
        boxShadow: '-4px 0 16px rgba(0, 0, 0, 0.1)',
        overflowY: 'auto',
        padding: '24px'
      }}>
        <div className="sidebar-header" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          paddingBottom: '16px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <h3 style={{margin: 0}}>📞 Contact Support</h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6b7280'
            }}
          >
            ×
          </button>
        </div>

        {/* Quick Contact Info */}
        <div className="quick-contact" style={{
          background: '#f8fafc',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px'
        }}>
          <div style={{marginBottom: '12px'}}>
            <strong>📞 Phone:</strong> +91 98765 43210
          </div>
          <div style={{marginBottom: '12px'}}>
            <strong>📧 Email:</strong> support@smartparking.com
          </div>
          <div>
            <strong>🕒 Hours:</strong> Mon-Fri 9AM-6PM
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{marginBottom: '16px'}}>
            <label style={{display: 'block', marginBottom: '6px', fontWeight: '600'}}>Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>

          <div className="form-group" style={{marginBottom: '16px'}}>
            <label style={{display: 'block', marginBottom: '6px', fontWeight: '600'}}>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>

          <div className="form-group" style={{marginBottom: '16px'}}>
            <label style={{display: 'block', marginBottom: '6px', fontWeight: '600'}}>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Your phone number"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>

          <div className="form-group" style={{marginBottom: '16px'}}>
            <label style={{display: 'block', marginBottom: '6px', fontWeight: '600'}}>Subject *</label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="">Select subject</option>
              <option value="booking-issue">Booking Issue</option>
              <option value="payment-problem">Payment Problem</option>
              <option value="technical-support">Technical Support</option>
              <option value="feedback">Feedback</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group" style={{marginBottom: '20px'}}>
            <label style={{display: 'block', marginBottom: '6px', fontWeight: '600'}}>Message *</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Describe your query..."
              rows="4"
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{display: 'flex', gap: '10px'}}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                background: 'white',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                flex: 2,
                padding: '10px',
                border: 'none',
                borderRadius: '6px',
                background: '#3b82f6',
                color: 'white',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactSidebar;