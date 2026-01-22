import React, { useState } from 'react';
import apiService from '../../../services/apiService';
import { UserPlus, Save, X } from 'lucide-react';

const AddStaffForm = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'attendant',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Sanitize username: remove invalid characters and ensure Django compatibility
            const sanitizeUsername = (str) => {
                return str
                    .normalize('NFD') // Normalize unicode characters
                    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
                    .replace(/[^a-zA-Z0-9@.+\-_]/g, '') // Keep only valid chars
                    .toLowerCase();
            };

            const cleanFirstName = sanitizeUsername(formData.firstName);
            const cleanLastName = sanitizeUsername(formData.lastName);

            // Generate username with underscore separator
            const generatedUsername = `${cleanFirstName}_${cleanLastName}`.trim();

            // Validate username is not empty after sanitization
            if (!generatedUsername || generatedUsername === '_') {
                alert('❌ Invalid name format. Please use English letters only.');
                return;
            }

            const userData = {
                username: generatedUsername,
                email: formData.email,
                phone: formData.phone,
                role: 'STAFF',
                password: formData.password
            };

            await apiService.adminCreateUser(userData);
            alert('✅ Personnel registered in central database.');

            setFormData({
                firstName: '', lastName: '', email: '', phone: '', role: 'attendant', password: ''
            });
        } catch (error) {
            console.error('Error adding staff:', error);
            alert('❌ Registration failure: ' + (error.response?.data?.username?.[0] || error.message));
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', animation: 'fadeIn 0.5s ease-out' }}>
            <div style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(30px)',
                borderRadius: '32px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.7)',
                overflow: 'hidden'
            }}>
                <div style={{
                    padding: '32px 40px', borderBottom: '1px solid rgba(0, 0, 0, 0.04)',
                    background: 'rgba(248, 250, 252, 0.4)'
                }}>
                    <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '14px', margin: 0 }}>
                        <UserPlus style={{ width: '28px', height: '28px', color: '#10b981' }} />
                        Personnel Onboarding
                    </h2>
                    <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px', fontWeight: '500' }}>Initialize credentials for new administrative or operational staff</p>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: '40px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '13px', fontWeight: '700', color: '#475569', marginLeft: '4px' }}>First Designation</label>
                            <input
                                type="text"
                                required
                                style={{
                                    padding: '14px 20px', borderRadius: '14px', border: '1px solid #e2e8f0',
                                    background: '#f8fafc', fontSize: '14px', transition: 'all 0.2s', outline: 'none'
                                }}
                                placeholder="e.g. Vikram"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '13px', fontWeight: '700', color: '#475569', marginLeft: '4px' }}>Last Designation</label>
                            <input
                                type="text"
                                required
                                style={{
                                    padding: '14px 20px', borderRadius: '14px', border: '1px solid #e2e8f0',
                                    background: '#f8fafc', fontSize: '14px', transition: 'all 0.2s', outline: 'none'
                                }}
                                placeholder="e.g. Singh"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '13px', fontWeight: '700', color: '#475569', marginLeft: '4px' }}>Official Email</label>
                            <input
                                type="email"
                                required
                                style={{
                                    padding: '14px 20px', borderRadius: '14px', border: '1px solid #e2e8f0',
                                    background: '#f8fafc', fontSize: '14px', transition: 'all 0.2s', outline: 'none'
                                }}
                                placeholder="name@parking.io"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '13px', fontWeight: '700', color: '#475569', marginLeft: '4px' }}>Contact Frequency</label>
                            <input
                                type="tel"
                                required
                                style={{
                                    padding: '14px 20px', borderRadius: '14px', border: '1px solid #e2e8f0',
                                    background: '#f8fafc', fontSize: '14px', transition: 'all 0.2s', outline: 'none'
                                }}
                                placeholder="+91"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '13px', fontWeight: '700', color: '#475569', marginLeft: '4px' }}>Operational Role</label>
                            <select
                                style={{
                                    padding: '14px 20px', borderRadius: '14px', border: '1px solid #e2e8f0',
                                    background: '#f8fafc', fontSize: '14px', transition: 'all 0.2s', outline: 'none',
                                    appearance: 'none', cursor: 'pointer'
                                }}
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            >
                                <option value="attendant">Field Attendant</option>
                                <option value="manager">Operations Manager</option>
                                <option value="security">Security Specialist</option>
                                <option value="admin">System Administrator</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '13px', fontWeight: '700', color: '#475569', marginLeft: '4px' }}>Security Cipher</label>
                            <input
                                type="password"
                                required
                                style={{
                                    padding: '14px 20px', borderRadius: '14px', border: '1px solid #e2e8f0',
                                    background: '#f8fafc', fontSize: '14px', transition: 'all 0.2s', outline: 'none'
                                }}
                                placeholder="Secure password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>
                    </div>

                    <div style={{
                        marginTop: '40px', paddingTop: '32px', borderTop: '1px solid #f1f5f9',
                        display: 'flex', justifyContent: 'flex-end', gap: '16px'
                    }}>
                        <button
                            type="button"
                            style={{
                                padding: '12px 28px', background: 'white', border: '1px solid #e2e8f0',
                                borderRadius: '14px', color: '#64748b', fontSize: '14px', fontWeight: '700',
                                cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '10px'
                            }}
                            onClick={() => setFormData({ firstName: '', lastName: '', email: '', phone: '', role: 'attendant', password: '' })}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                        >
                            <X size={18} /> Rescind
                        </button>
                        <button
                            type="submit"
                            style={{
                                padding: '12px 32px', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                color: 'white', border: 'none', borderRadius: '14px', fontSize: '14px',
                                fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s',
                                display: 'flex', alignItems: 'center', gap: '10px',
                                boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.2)'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
                        >
                            <Save size={18} /> Authorize Personnel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddStaffForm;
