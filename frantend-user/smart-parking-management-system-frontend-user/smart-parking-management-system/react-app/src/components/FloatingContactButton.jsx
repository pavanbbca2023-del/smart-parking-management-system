import React, { useState } from 'react';
import ContactSidebar from './ContactSidebar';

const FloatingContactButton = () => {
  const [showContactSidebar, setShowContactSidebar] = useState(false);

  return (
    <>
      {/* Floating Contact Button */}
      <button
        onClick={() => setShowContactSidebar(true)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: '#3b82f6',
          color: 'white',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease'
        }}
        onMouseOver={(e) => {
          e.target.style.transform = 'scale(1.1)';
          e.target.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)';
        }}
        onMouseOut={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 4px 16px rgba(59, 130, 246, 0.3)';
        }}
        title="Contact Support"
      >
        📞
      </button>

      {/* Contact Sidebar */}
      <ContactSidebar 
        isOpen={showContactSidebar}
        onClose={() => setShowContactSidebar(false)}
      />
    </>
  );
};

export default FloatingContactButton;