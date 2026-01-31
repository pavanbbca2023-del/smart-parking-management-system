import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, User, Lock, ArrowRight } from 'lucide-react';

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
            const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
            const response = await fetch(`${API_BASE_URL}/api/core/staff/login/`, {
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
                navigate('/dashboard');
            } else {
                setError(data.detail || 'Invalid credentials');
            }
        } catch (err) {
            setError('Failed to connect to server');
        } finally {
            setLoading(false);
        }
    };

    const styles = {
        container: {
            minHeight: '100vh',
            display: 'flex',
            backgroundColor: '#f8fafc',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        },
        // Left side - Branding (Blue)
        brandSection: {
            flex: 1,
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', // Bright Blue Gradient
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px',
            position: 'relative',
            overflow: 'hidden',
        },
        brandContent: {
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
        },
        brandIcon: {
            width: '80px',
            height: '80px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent white
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '32px',
            backdropFilter: 'blur(10px)',
        },
        brandTitle: {
            fontSize: '48px',
            fontWeight: '800',
            marginBottom: '16px',
            letterSpacing: '-0.025em',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
        brandSubtitle: {
            fontSize: '20px',
            color: 'rgba(255, 255, 255, 0.9)',
            maxWidth: '400px',
            lineHeight: '1.6',
        },
        // Right side - Form (White)
        formSection: {
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            backgroundColor: 'white',
        },
        formContainer: {
            width: '100%',
            maxWidth: '420px',
        },
        header: {
            marginBottom: '32px',
        },
        title: {
            fontSize: '32px',
            fontWeight: '700',
            color: '#0f172a',
            marginBottom: '8px',
            letterSpacing: '-0.025em',
        },
        subtitle: {
            fontSize: '16px',
            color: '#64748b',
        },
        inputGroup: {
            marginBottom: '20px',
        },
        label: {
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            color: '#334155',
            marginBottom: '8px',
        },
        inputWrapper: {
            position: 'relative',
        },
        inputIcon: {
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#94a3b8',
        },
        input: {
            width: '100%',
            padding: '12px 16px 12px 40px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            fontSize: '16px',
            color: '#1e293b',
            outline: 'none',
            transition: 'all 0.2s',
            backgroundColor: '#f8fafc',
        },
        button: {
            width: '100%',
            background: 'linear-gradient(to right, #3b82f6, #2563eb)', // Blue gradient button
            color: 'white',
            padding: '14px',
            borderRadius: '12px',
            border: 'none',
            fontWeight: '600',
            fontSize: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s',
            marginTop: '12px',
            boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)',
        },
        link: {
            color: '#3b82f6',
            textDecoration: 'none',
            fontWeight: '600',
        },
        error: {
            backgroundColor: '#fef2f2',
            color: '#dc2626',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '14px',
            marginBottom: '24px',
            borderLeft: '4px solid #dc2626',
        },
        // Decorative circles
        circle1: {
            position: 'absolute',
            top: '-10%',
            left: '-10%',
            width: '400px',
            height: '400px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
        },
        circle2: {
            position: 'absolute',
            bottom: '-10%',
            right: '-10%',
            width: '300px',
            height: '300px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
        }
    };

    return (
        <div style={styles.container}>
            {/* Brand Section - Visible on desktop */}
            <div style={styles.brandSection} className="hidden md:flex">
                <div style={styles.circle1} />
                <div style={styles.circle2} />

                <div style={styles.brandContent}>
                    <div style={styles.brandIcon}>
                        <Building2 size={40} color="white" />
                    </div>
                    <h1 style={styles.brandTitle}>PARK-PRO</h1>
                    <p style={styles.brandSubtitle}>
                        Staff Portal
                    </p>
                </div>
            </div>

            {/* Form Section */}
            <div style={styles.formSection}>
                <div style={styles.formContainer}>
                    <div style={styles.header}>
                        <h2 style={styles.title}>Staff Login</h2>
                        <p style={styles.subtitle}>Welcome back! Please enter your details.</p>
                    </div>

                    {error && <div style={styles.error}>{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div style={styles.inputGroup}>
                            <label htmlFor="username" style={styles.label}>Username</label>
                            <div style={styles.inputWrapper}>
                                <User size={20} style={styles.inputIcon} />
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    style={styles.input}
                                    placeholder="Enter your staff ID"
                                    required
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#3b82f6';
                                        e.target.style.backgroundColor = 'white';
                                        e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#e2e8f0';
                                        e.target.style.backgroundColor = '#f8fafc';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>
                        </div>

                        <div style={styles.inputGroup}>
                            <label htmlFor="password" style={styles.label}>Password</label>
                            <div style={styles.inputWrapper}>
                                <Lock size={20} style={styles.inputIcon} />
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    style={styles.input}
                                    placeholder="••••••••"
                                    required
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#3b82f6';
                                        e.target.style.backgroundColor = 'white';
                                        e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
                                    }}
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
                            style={styles.button}
                            disabled={loading}
                            onMouseOver={(e) => !loading && (e.target.style.transform = 'translateY(-1px)')}
                            onMouseOut={(e) => !loading && (e.target.style.transform = 'translateY(0)')}
                        >
                            {loading ? 'Logging in...' : (
                                <>
                                    Access Dashboard
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>

                        <div style={{ textAlign: 'center', marginTop: '24px' }}>
                            <p style={{ color: '#64748b', fontSize: '14px' }}>
                                Staff access is managed by Administrator.
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
