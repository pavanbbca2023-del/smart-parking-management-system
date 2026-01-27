import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div>
            <style>
                {`
                    @keyframes slideInRight {
                        from {
                            opacity: 0;
                            transform: translateX(100px);
                        }
                        to {
                            opacity: 1;
                            transform: translateX(0);
                        }
                    }
                    @keyframes fadeInUp {
                        from {
                            opacity: 0;
                            transform: translateY(30px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    @keyframes slideInFromLeft {
                        from {
                            opacity: 0;
                            transform: translateX(-150px);
                        }
                        to {
                            opacity: 1;
                            transform: translateX(0);
                        }
                    }
                `}
            </style>
            <div style={{ margin: 0, padding: 0, width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
                <img 
                    src="./src/car.webp" 
                    alt="Staff Landing" 
                    style={{
                        width: '100vw',
                        height: '100vh',
                        objectFit: 'cover',
                        margin: 0,
                        padding: 0,
                        display: 'block'
                    }}
                />
                <div style={{
                    position: 'absolute',
                    top: '20px',
                    right: '50px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '15px',
                    animation: 'slideInRight 1s ease-out'
                }}>
                    <h1 style={{
                        color: 'white',
                        fontSize: '80px',
                        fontWeight: 'bold',
                        margin: '0',
                        textAlign: 'center',
                        width: '100%',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                        animation: 'slideInFromLeft 1.2s ease-out'
                    }}>
                        Quick Park
                    </h1>
                    <p style={{
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold',
                        margin: '0',
                        maxWidth: '500px',
                        textAlign: 'left',
                        lineHeight: '1.5',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                    }}>
                        Our comprehensive parking management solution provides efficient vehicle tracking, automated payment processing, and real-time space monitoring for modern urban infrastructure.
                    </p>
                    <div style={{
                        display: 'flex',
                        gap: '15px'
                    }}>
                        <button 
                            onClick={() => navigate('/login')}
                            style={{
                                padding: '12px 24px',
                                backgroundColor: 'rgba(30, 144, 255, 0.9)',
                                color: 'white',
                                border: '2px solid rgba(30, 144, 255, 1)',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '16px'
                            }}
                        >
                            Login
                        </button>
                        <button 
                            onClick={() => navigate('/signup')}
                            style={{
                                padding: '12px 24px',
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                color: '#333',
                                border: '2px solid rgba(255, 255, 255, 1)',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '16px'
                            }}
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>
            
            {/* About Section */}
            <div style={{
                backgroundColor: 'white',
                padding: '40px 20px',
                textAlign: 'center'
            }}>
                <h2 style={{
                    fontSize: '28px',
                    fontWeight: 'bold',
                    color: '#333',
                    marginBottom: '15px'
                }}>
                    About Quick Park
                </h2>
                <p style={{
                    fontSize: '16px',
                    color: '#666',
                    maxWidth: '600px',
                    margin: '0 auto 30px auto',
                    lineHeight: '1.5'
                }}>
                    Modern parking solution for smart cities. Easy booking, automatic payments, and real-time availability.
                </p>
                
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '20px',
                    maxWidth: '1300px',
                    margin: '0 auto'
                }}>
                    <div style={{
                        backgroundColor: '#2563eb',
                        padding: '40px 25px',
                        borderRadius: '0px',
                        width: '250px',
                        boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
                        color: 'white'
                    }}>
                        <div style={{ fontSize: '45px', marginBottom: '20px' }}>🚗</div>
                        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', marginBottom: '12px' }}>Easy Booking</h3>
                        <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.9)' }}>Book parking spots instantly</p>
                    </div>
                    
                    <div style={{
                        backgroundColor: '#2563eb',
                        padding: '40px 25px',
                        borderRadius: '0px',
                        width: '250px',
                        boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
                        color: 'white'
                    }}>
                        <div style={{ fontSize: '45px', marginBottom: '20px' }}>💳</div>
                        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', marginBottom: '12px' }}>Auto Payment</h3>
                        <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.9)' }}>Automatic payment processing</p>
                    </div>
                    
                    <div style={{
                        backgroundColor: '#2563eb',
                        padding: '40px 25px',
                        borderRadius: '0px',
                        width: '250px',
                        boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
                        color: 'white'
                    }}>
                        <div style={{ fontSize: '45px', marginBottom: '20px' }}>📍</div>
                        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', marginBottom: '12px' }}>Real-time Tracking</h3>
                        <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.9)' }}>Live parking availability</p>
                    </div>
                    
                    <div style={{
                        backgroundColor: '#2563eb',
                        padding: '40px 25px',
                        borderRadius: '0px',
                        width: '250px',
                        boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
                        color: 'white'
                    }}>
                        <div style={{ fontSize: '45px', marginBottom: '20px' }}>🔒</div>
                        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', marginBottom: '12px' }}>Secure Access</h3>
                        <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.9)' }}>QR code based entry</p>
                    </div>
                    
                    <div style={{
                        backgroundColor: '#2563eb',
                        padding: '40px 25px',
                        borderRadius: '0px',
                        width: '250px',
                        boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
                        color: 'white'
                    }}>
                        <div style={{ fontSize: '45px', marginBottom: '20px' }}>📊</div>
                        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', marginBottom: '12px' }}>Smart Analytics</h3>
                        <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.9)' }}>Data-driven insights</p>
                    </div>
                </div>
            </div>
            
            {/* Footer */}
            <div style={{
                backgroundColor: '#1a365d',
                color: 'white',
                padding: '50px 20px 30px 20px'
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 1fr 1fr 1fr',
                        gap: '40px',
                        marginBottom: '40px'
                    }}>
                        {/* Company Info */}
                        <div>
                            <h3 style={{ 
                                fontSize: '28px', 
                                fontWeight: 'bold', 
                                marginBottom: '15px',
                                color: '#ffffff'
                            }}>
                                Quick Park
                            </h3>
                            <p style={{ 
                                fontSize: '16px', 
                                color: 'rgba(255,255,255,0.8)', 
                                lineHeight: '1.6',
                                marginBottom: '20px'
                            }}>
                                Leading smart parking management solution for modern cities. Efficient, secure, and user-friendly parking experience.
                            </p>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div style={{ 
                                    width: '40px', 
                                    height: '40px', 
                                    backgroundColor: 'rgba(255,255,255,0.1)', 
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer'
                                }}>📧</div>
                                <div style={{ 
                                    width: '40px', 
                                    height: '40px', 
                                    backgroundColor: 'rgba(255,255,255,0.1)', 
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer'
                                }}>📱</div>
                                <div style={{ 
                                    width: '40px', 
                                    height: '40px', 
                                    backgroundColor: 'rgba(255,255,255,0.1)', 
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer'
                                }}>🌐</div>
                            </div>
                        </div>
                        
                        {/* Services */}
                        <div>
                            <h4 style={{ 
                                fontSize: '18px', 
                                fontWeight: 'bold', 
                                marginBottom: '20px',
                                color: '#ffffff'
                            }}>
                                Services
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <a href="#" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '14px' }}>Parking Booking</a>
                                <a href="#" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '14px' }}>Payment Processing</a>
                                <a href="#" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '14px' }}>Real-time Tracking</a>
                                <a href="#" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '14px' }}>Zone Management</a>
                                <a href="#" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '14px' }}>Analytics</a>
                            </div>
                        </div>
                        
                        {/* Support */}
                        <div>
                            <h4 style={{ 
                                fontSize: '18px', 
                                fontWeight: 'bold', 
                                marginBottom: '20px',
                                color: '#ffffff'
                            }}>
                                Support
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <a href="#" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '14px' }}>Help Center</a>
                                <a href="#" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '14px' }}>Contact Us</a>
                                <a href="#" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '14px' }}>Documentation</a>
                                <a href="#" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '14px' }}>FAQ</a>
                                <a href="#" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '14px' }}>24/7 Support</a>
                            </div>
                        </div>
                        
                        {/* Contact */}
                        <div>
                            <h4 style={{ 
                                fontSize: '18px', 
                                fontWeight: 'bold', 
                                marginBottom: '20px',
                                color: '#ffffff'
                            }}>
                                Contact
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>📧 support@quickpark.com</div>
                                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>📞 +1 (555) 123-4567</div>
                                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>📍 123 Smart City Ave</div>
                                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>🕒 24/7 Available</div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Bottom Bar */}
                    <div style={{
                        borderTop: '1px solid rgba(255,255,255,0.2)',
                        paddingTop: '25px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '20px'
                    }}>
                        <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
                            © 2024 Quick Park. All rights reserved.
                        </div>
                        <div style={{ display: 'flex', gap: '25px' }}>
                            <a href="#" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Privacy Policy</a>
                            <a href="#" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Terms of Service</a>
                            <a href="#" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Cookie Policy</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Landing;