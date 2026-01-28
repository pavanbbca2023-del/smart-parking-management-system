import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import signupBg from '../assets/just.jpg';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirm_password: '',
        phone: '',
        staff_id: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation
        if (formData.password !== formData.confirm_password) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:8000/api/staff/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    email: formData.email,
                    password: formData.password,
                    phone: formData.phone,
                    staff_id: formData.staff_id
                })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Account created successfully! Redirecting to login...');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setError(data.error || 'Signup failed. Please try again.');
            }
        } catch (err) {
            setError('Connection error. Please try again.');
            console.error('Signup error:', err);
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '8px 10px',
        border: '1px solid #e0e0e0',
        borderRadius: '6px',
        fontSize: '12px',
        boxSizing: 'border-box',
        transition: 'all 0.3s',
        outline: 'none'
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            backgroundImage: `url(${signupBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            fontFamily: 'Arial, sans-serif',
            padding: '20px',
            paddingLeft: '80px',
            position: 'relative'
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '0',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                padding: '20px',
                width: '100%',
                maxWidth: '450px',
                position: 'relative',
                zIndex: 2
            }}>
                <h1 style={{
                    textAlign: 'center',
                    color: '#333',
                    marginBottom: '3px',
                    fontSize: '24px',
                    fontWeight: 'bold'
                }}>
                    Quick Park
                </h1>
                <h2 style={{
                    textAlign: 'center',
                    color: '#999',
                    marginBottom: '18px',
                    fontSize: '12px',
                    fontWeight: 'normal'
                }}>
                    Create Staff Account
                </h2>

                {error && (
                    <div style={{
                        backgroundColor: '#f8d7da',
                        color: '#721c24',
                        padding: '10px',
                        borderRadius: '5px',
                        marginBottom: '15px',
                        border: '1px solid #f5c6cb',
                        fontSize: '13px'
                    }}>
                        {error}
                    </div>
                )}

                {success && (
                    <div style={{
                        backgroundColor: '#d4edda',
                        color: '#155724',
                        padding: '10px',
                        borderRadius: '5px',
                        marginBottom: '15px',
                        border: '1px solid #c3e6cb',
                        fontSize: '13px'
                    }}>
                        {success}
                    </div>
                )}

                <form onSubmit={handleSignup}>
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '15px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                color: '#333',
                                fontWeight: 'bold',
                                fontSize: '14px'
                            }}>
                                First Name
                            </label>
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                required
                                placeholder="First Name"
                                style={inputStyle}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#667eea';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#e0e0e0';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                color: '#333',
                                fontWeight: 'bold',
                                fontSize: '14px'
                            }}>
                                Last Name
                            </label>
                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                required
                                placeholder="Last Name"
                                style={inputStyle}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#667eea';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#e0e0e0';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '6px',
                            color: '#333',
                            fontWeight: 'bold',
                            fontSize: '13px'
                        }}>
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email"
                            style={inputStyle}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#667eea';
                                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = '#e0e0e0';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '6px',
                            color: '#333',
                            fontWeight: 'bold',
                            fontSize: '13px'
                        }}>
                            Phone
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            placeholder="Enter phone number"
                            style={inputStyle}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#667eea';
                                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = '#e0e0e0';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '6px',
                            color: '#333',
                            fontWeight: 'bold',
                            fontSize: '13px'
                        }}>
                            Staff ID
                        </label>
                        <input
                            type="text"
                            name="staff_id"
                            value={formData.staff_id}
                            onChange={handleChange}
                            required
                            placeholder="Enter staff ID"
                            style={inputStyle}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#667eea';
                                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = '#e0e0e0';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '6px',
                            color: '#333',
                            fontWeight: 'bold',
                            fontSize: '13px'
                        }}>
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Enter password"
                            style={inputStyle}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#667eea';
                                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = '#e0e0e0';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '25px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '6px',
                            color: '#333',
                            fontWeight: 'bold',
                            fontSize: '13px'
                        }}>
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            name="confirm_password"
                            value={formData.confirm_password}
                            onChange={handleChange}
                            required
                            placeholder="Confirm password"
                            style={inputStyle}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#667eea';
                                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = '#e0e0e0';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '10px',
                            backgroundColor: loading ? '#ccc' : '#667eea',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s'
                        }}
                        onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#764ba2')}
                        onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#667eea')}
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <p style={{
                    textAlign: 'center',
                    marginTop: '20px',
                    color: '#666'
                }}>
                    Already have an account?{' '}
                    <button
                        onClick={() => navigate('/login')}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#667eea',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            textDecoration: 'underline'
                        }}
                    >
                        Login
                    </button>
                </p>

                <p style={{
                    textAlign: 'center',
                    marginTop: '20px',
                    color: '#999',
                    fontSize: '12px'
                }}>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#999',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                        }}
                    >
                        Back to Home
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Signup;
