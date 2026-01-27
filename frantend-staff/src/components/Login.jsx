import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import loginBg from '../assets/just.jpg';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:8000/api/staff/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('staff_id', data.staff_id);
                navigate('/dashboard');
            } else {
                setError(data.error || 'Login failed. Please try again.');
            }
        } catch (err) {
            setError('Connection error. Please try again.');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            backgroundImage: `url(${loginBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            fontFamily: 'Arial, sans-serif',
            position: 'relative',
            paddingLeft: '80px'
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '0',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                padding: '50px',
                width: '100%',
                maxWidth: '450px',
                position: 'relative',
                zIndex: 2
            }}>
                <h1 style={{
                    textAlign: 'center',
                    color: '#333',
                    marginBottom: '10px',
                    fontSize: '32px',
                    fontWeight: 'bold'
                }}>
                    Quick Park
                </h1>
                <h2 style={{
                    textAlign: 'center',
                    color: '#999',
                    marginBottom: '35px',
                    fontSize: '16px',
                    fontWeight: 'normal'
                }}>
                    Staff Login Portal
                </h2>

                {error && (
                    <div style={{
                        backgroundColor: '#f8d7da',
                        color: '#721c24',
                        padding: '12px',
                        borderRadius: '5px',
                        marginBottom: '20px',
                        border: '1px solid #f5c6cb'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            color: '#333',
                            fontWeight: 'bold',
                            fontSize: '14px'
                        }}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Enter your email"
                            style={{
                                width: '100%',
                                padding: '12px 15px',
                                border: '1px solid #e0e0e0',
                                borderRadius: '8px',
                                fontSize: '14px',
                                boxSizing: 'border-box',
                                transition: 'all 0.3s',
                                outline: 'none'
                            }}
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

                    <div style={{ marginBottom: '30px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            color: '#333',
                            fontWeight: 'bold',
                            fontSize: '14px'
                        }}>
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter your password"
                            style={{
                                width: '100%',
                                padding: '12px 15px',
                                border: '1px solid #e0e0e0',
                                borderRadius: '8px',
                                fontSize: '14px',
                                boxSizing: 'border-box',
                                transition: 'all 0.3s',
                                outline: 'none'
                            }}
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
                            padding: '13px',
                            backgroundColor: loading ? '#ccc' : '#667eea',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s'
                        }}
                        onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#764ba2')}
                        onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#667eea')}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p style={{
                    textAlign: 'center',
                    marginTop: '20px',
                    color: '#666'
                }}>
                    Don't have an account?{' '}
                    <button
                        onClick={() => navigate('/signup')}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#667eea',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            textDecoration: 'underline'
                        }}
                    >
                        Sign Up
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

export default Login;
