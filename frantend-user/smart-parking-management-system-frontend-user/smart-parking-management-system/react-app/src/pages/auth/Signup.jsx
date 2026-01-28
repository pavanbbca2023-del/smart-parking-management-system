import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import signupBg from '../../assets/just.jpg';
import './Signup.css';

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
            const response = await fetch('http://localhost:8000/api/core/staff/register/', {
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

    return (
        <div className="signup-container" style={{ backgroundImage: `url(${signupBg})` }}>
            <div className="signup-box">
                <h1>Quick Park</h1>
                <h2>Create Staff Account</h2>

                {error && (
                    <div className="signup-error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="signup-success">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSignup}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>First Name</label>
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                required
                                placeholder="First Name"
                            />
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                required
                                placeholder="Last Name"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="form-group">
                        <label>Phone</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            placeholder="Enter phone number"
                        />
                    </div>

                    <div className="form-group">
                        <label>Staff ID</label>
                        <input
                            type="text"
                            name="staff_id"
                            value={formData.staff_id}
                            onChange={handleChange}
                            required
                            placeholder="Enter staff ID"
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Enter password"
                        />
                    </div>

                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            name="confirm_password"
                            value={formData.confirm_password}
                            onChange={handleChange}
                            required
                            placeholder="Confirm password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="signup-btn"
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <p className="signup-link">
                    Already have an account?{' '}
                    <button onClick={() => navigate('/login')}>
                        Login
                    </button>
                </p>

                <p className="home-link">
                    <button onClick={() => navigate('/')}>
                        Back to Home
                    </button>
                </p>
            </div>
        </div>
    );
};
export default Signup;
