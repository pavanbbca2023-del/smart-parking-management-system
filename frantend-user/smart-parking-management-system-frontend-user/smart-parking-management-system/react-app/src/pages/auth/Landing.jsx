import carBg from '../../assets/car.webp';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div>
            <div className="landing-hero">
                <img
                    src={carBg}
                    alt="Staff Landing"
                    className="hero-image"
                />
                <div className="hero-content">
                    <h1 className="hero-title">
                        Quick Park
                    </h1>
                    <p className="hero-description">
                        Our comprehensive parking management solution provides efficient vehicle tracking, automated payment processing, and real-time space monitoring for modern urban infrastructure.
                    </p>
                    <div className="hero-buttons">
                        <button
                            onClick={() => navigate('/home')}
                            className="hero-btn"
                            style={{
                                backgroundColor: '#ffd700',
                                color: '#333',
                                borderColor: '#ffd700',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <span>🚗</span> Book Parking
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="hero-btn hero-btn-primary"
                        >
                            Staff Login
                        </button>
                        <button
                            onClick={() => navigate('/signup')}
                            className="hero-btn hero-btn-secondary"
                        >
                            Staff Sign Up
                        </button>
                    </div>
                </div>
            </div>

            {/* About Section */}
            <div className="about-section">
                <h2 className="about-title">
                    About Quick Park
                </h2>
                <p className="about-description">
                    Modern parking solution for smart cities. Easy booking, automatic payments, and real-time availability.
                </p>

                <div className="features-container">
                    <div className="feature-card">
                        <div className="feature-icon">🚗</div>
                        <h3 className="feature-title">Easy Booking</h3>
                        <p className="feature-text">Book parking spots instantly</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">💳</div>
                        <h3 className="feature-title">Auto Payment</h3>
                        <p className="feature-text">Automatic payment processing</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">📍</div>
                        <h3 className="feature-title">Real-time Tracking</h3>
                        <p className="feature-text">Live parking availability</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">🔒</div>
                        <h3 className="feature-title">Secure Access</h3>
                        <p className="feature-text">QR code based entry</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">📊</div>
                        <h3 className="feature-title">Smart Analytics</h3>
                        <p className="feature-text">Data-driven insights</p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="footer">
                <div className="footer-content">
                    <div className="footer-grid">
                        {/* Company Info */}
                        <div className="footer-section">
                            <h3>
                                Quick Park
                            </h3>
                            <p className="footer-description">
                                Leading smart parking management solution for modern cities. Efficient, secure, and user-friendly parking experience.
                            </p>
                            <div className="social-icons">
                                <div className="social-icon">📧</div>
                                <div className="social-icon">📱</div>
                                <div className="social-icon">🌐</div>
                            </div>
                        </div>

                        {/* Services */}
                        <div className="footer-section">
                            <h4>
                                Services
                            </h4>
                            <div className="footer-links">
                                <a href="#">Parking Booking</a>
                                <a href="#">Payment Processing</a>
                                <a href="#">Real-time Tracking</a>
                                <a href="#">Zone Management</a>
                                <a href="#">Analytics</a>
                            </div>
                        </div>

                        {/* Support */}
                        <div className="footer-section">
                            <h4>
                                Support
                            </h4>
                            <div className="footer-links">
                                <a href="#">Help Center</a>
                                <a href="#">Contact Us</a>
                                <a href="#">Documentation</a>
                                <a href="#">FAQ</a>
                                <a href="#">24/7 Support</a>
                            </div>
                        </div>

                        {/* Contact */}
                        <div className="footer-section">
                            <h4>
                                Contact
                            </h4>
                            <div className="footer-contact">
                                <div className="footer-contact-item">📧 support@quickpark.com</div>
                                <div className="footer-contact-item">📞 +1 (555) 123-4567</div>
                                <div className="footer-contact-item">📍 123 Smart City Ave</div>
                                <div className="footer-contact-item">🕒 24/7 Available</div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="footer-bottom">
                        <div className="footer-copyright">
                            © 2024 Quick Park. All rights reserved.
                        </div>
                        <div className="footer-policies">
                            <a href="#">Privacy Policy</a>
                            <a href="#">Terms of Service</a>
                            <a href="#">Cookie Policy</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Landing;
