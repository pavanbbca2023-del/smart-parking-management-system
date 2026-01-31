import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
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

        try {
            // Use environment variable for API URL (supports both local and production)
            const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
            const response = await fetch(`${API_BASE_URL}/api/auth/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('access_token', data.access);
                localStorage.setItem('refresh_token', data.refresh);
                navigate('/admin/dashboard');
            } else {
                setError(data.detail || 'Invalid credentials');
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
            background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: '0 8px 16px rgba(59, 130, 246, 0.2)',
            transform: 'rotate(-3deg)',
        },
        logoText: {
            color: 'white'
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
            borderColor: '#3b82f6',
            backgroundColor: 'white',
            boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
        },
        button: {
            width: '100%',
            padding: '14px',
            borderRadius: '12px',
            border: 'none',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: 'white',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            marginTop: '8px',
            boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.2)',
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
            color: '#3b82f6',
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
            <div style={{ ...styles.blob, top: '-50px', left: '-50px' }} />
            <div style={{ ...styles.blob, bottom: '-50px', right: '-50px', background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)' }} />

            <div style={styles.card}>
                <div style={styles.header}>
                    <div style={styles.logoContainer}>
                        <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 14h20v12H10V14z" stroke="white" strokeWidth="2.5" fill="none" />
                            <path d="M13 17h3v6h-3v-6zM16.5 17h3v6h-3v-6zM20 17h3v6h-3v-6zM23.5 17h3v6h-3v-6z" fill="white" />
                            <circle cx="20" cy="30" r="3" fill="#10b981" />
                        </svg>
                    </div>
                    <h2 style={styles.title}>Welcome Back</h2>
                    <p style={styles.subtitle}>Smart Parking Management System</p>
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
                            placeholder="Enter your username"
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
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>

                    < div style={styles.footer}>
                        Don't have an account?
                        <Link to="/signup" style={styles.link}> Create Account</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
