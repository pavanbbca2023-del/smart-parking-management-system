import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/core/users/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    role: 'admin'
                }),
            });

            const data = await response.json();

            if (response.ok) {
                navigate('/login');
            } else {
                const messages = Object.keys(data).map(key => {
                    const val = data[key];
                    return Array.isArray(val) ? `${key}: ${val[0]}` : val;
                }).join(', ');
                setError(messages || 'Registration failed');
            }
        } catch (err) {
            setError('Failed to connect to server');
        } finally {
            setLoading(false);
        }
    };

    // Styles matching AdminDashboard.jsx and Sidebar.css
    const styles = {
        container: {
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', // Matches App.css body gradient
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            padding: '24px',
        },
        card: {
            width: '100%',
            maxWidth: '440px',
            backgroundColor: 'white',
            borderRadius: '24px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.05)',
            padding: '40px',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            position: 'relative',
            zIndex: 1,
        },
        header: {
            textAlign: 'center',
            marginBottom: '32px',
        },
        logoContainer: {
            width: '64px',
            height: '64px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', // Green for signup
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: '0 8px 16px rgba(16, 185, 129, 0.2)',
            transform: 'rotate(3deg)',
        },
        title: {
            fontSize: '28px',
            fontWeight: '700',
            color: '#1e293b',
            margin: '0 0 8px 0',
            letterSpacing: '-0.025em',
        },
        subtitle: {
            fontSize: '15px',
            color: '#64748b',
            margin: 0,
        },
        formGroup: {
            marginBottom: '20px',
        },
        label: {
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            color: '#1e293b',
            marginBottom: '8px',
        },
        input: {
            width: '100%',
            padding: '12px 16px',
            fontSize: '15px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            backgroundColor: '#f8fafc',
            color: '#1e293b',
            outline: 'none',
            transition: 'all 0.2s ease',
            boxSizing: 'border-box',
        },
        inputFocus: {
            borderColor: '#10b981',
            backgroundColor: 'white',
            boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.1)'
        },
        button: {
            width: '100%',
            padding: '14px',
            borderRadius: '12px',
            border: 'none',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', // Green
            color: 'white',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            marginTop: '8px',
            boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)',
        },
        buttonDisabled: {
            opacity: 0.7,
            cursor: 'not-allowed',
        },
        footer: {
            marginTop: '24px',
            textAlign: 'center',
            fontSize: '14px',
            color: '#64748b',
        },
        link: {
            color: '#10b981',
            textDecoration: 'none',
            fontWeight: '600',
            marginLeft: '4px',
        },
        error: {
            backgroundColor: '#fef2f2',
            borderLeft: '4px solid #ef4444',
            color: '#b91c1c',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '14px',
            marginBottom: '24px',
        },
        // Decorative blob
        blob: {
            position: 'absolute',
            width: '300px',
            height: '300px',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
            zIndex: 0,
        }
    };

    return (
        <div style={styles.container}>
            {/* Decorative Background Blobs */}
            <div style={{ ...styles.blob, top: '-50px', left: '-50px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)' }} />
            <div style={{ ...styles.blob, bottom: '-50px', right: '-50px' }} />

            <div style={styles.card}>
                <div style={styles.header}>
                    <div style={styles.logoContainer}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M20 8V14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M23 11H17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <h2 style={styles.title}>Create Account</h2>
                    <p style={styles.subtitle}>Join the management team</p>
                </div>

                {error && (
                    <div style={styles.error}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={styles.formGroup}>
                        <label htmlFor="username" style={styles.label}>Username</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            style={styles.input}
                            placeholder="Choose a username"
                            value={formData.username}
                            onChange={handleChange}
                            onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                            onBlur={(e) => {
                                e.target.style.borderColor = '#e2e8f0';
                                e.target.style.backgroundColor = '#f8fafc';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label htmlFor="email" style={styles.label}>Email Address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            style={styles.input}
                            placeholder="name@company.com"
                            value={formData.email}
                            onChange={handleChange}
                            onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                            onBlur={(e) => {
                                e.target.style.borderColor = '#e2e8f0';
                                e.target.style.backgroundColor = '#f8fafc';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                        <div>
                            <label htmlFor="password" style={styles.label}>Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                style={styles.input}
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#e2e8f0';
                                    e.target.style.backgroundColor = '#f8fafc';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" style={styles.label}>Confirm</label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                style={styles.input}
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#e2e8f0';
                                    e.target.style.backgroundColor = '#f8fafc';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            ...styles.button,
                            ...(loading ? styles.buttonDisabled : {})
                        }}
                        onMouseOver={(e) => !loading && (e.target.style.transform = 'translateY(-1px)')}
                        onMouseOut={(e) => !loading && (e.target.style.transform = 'translateY(0)')}
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>

                    < div style={styles.footer}>
                        Already have an account?
                        <Link to="/login" style={styles.link}> Sign in</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;
