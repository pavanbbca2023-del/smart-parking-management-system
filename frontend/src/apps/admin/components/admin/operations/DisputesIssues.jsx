import React, { useState, useEffect } from 'react';
import apiService from '../../../services/apiService';
import { AlertTriangle, MessageSquare, Check, X, Filter } from 'lucide-react';

const DisputesIssues = () => {
    const [disputes, setDisputes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDisputes();
    }, []);

    const fetchDisputes = async () => {
        try {
            setLoading(true);
            const data = await apiService.adminGetAllDisputes();
            setDisputes(data.disputes || []);
        } catch (err) {
            console.error('Error fetching disputes:', err);
            setError('System failed to retrieve active disputes');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
            <div className="spinner">⌛</div>
            <p style={{ fontWeight: '500', marginTop: '16px' }}>Decrypting dispute database...</p>
        </div>
    );

    if (error) return (
        <div style={{ padding: '40px', textAlign: 'center', color: '#ef4444', background: '#fef2f2', borderRadius: '16px', border: '1px solid #fee2e2' }}>
            <AlertTriangle style={{ margin: '0 auto 12px auto' }} />
            <p style={{ fontWeight: '600' }}>{error}</p>
        </div>
    );

    return (
        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '12px', margin: 0 }}>
                    <MessageSquare style={{ width: '24px', height: '24px', color: '#f59e0b' }} />
                    Active Dispute Feed
                </h2>
                <button style={{
                    display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
                    background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px',
                    color: '#475569', fontWeight: '600', fontSize: '13px', cursor: 'pointer'
                }}>
                    <Filter size={14} /> Refine View
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {disputes.length === 0 ? (
                    <div style={{ padding: '100px 32px', textAlign: 'center', background: 'rgba(255, 255, 255, 0.5)', borderRadius: '24px', border: '2px dashed #cbd5e1' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}>✅</div>
                        <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#64748b' }}>Zero active disputes</h3>
                        <p style={{ color: '#94a3b8' }}>Great job! The operations are running vertically smooth.</p>
                    </div>
                ) : disputes.map((dispute) => (
                    <div key={dispute.id} style={{
                        background: 'white', padding: '28px', borderRadius: '24px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.04)', border: '1px solid #f1f5f9',
                        transition: 'transform 0.2s'
                    }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ fontFamily: 'monospace', color: '#94a3b8', fontSize: '12px', fontWeight: '600' }}>#{dispute.id}</span>
                                <span style={{
                                    fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em',
                                    padding: '4px 10px', borderRadius: '6px',
                                    backgroundColor: dispute.severity === 'High' ? '#fef2f2' : dispute.severity === 'Medium' ? '#fffbeb' : '#eff6ff',
                                    color: dispute.severity === 'High' ? '#ef4444' : dispute.severity === 'Medium' ? '#d97706' : '#3b82f6'
                                }}>
                                    {dispute.severity} Severity
                                </span>
                            </div>
                            <span style={{
                                fontSize: '13px', fontWeight: '700',
                                color: dispute.status === 'Open' ? '#10b981' : '#64748b'
                            }}>
                                {dispute.status}
                            </span>
                        </div>

                        <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
                            {dispute.type} <span style={{ color: '#94a3b8', fontWeight: '400' }}>reported by</span> {dispute.user_name}
                        </h3>
                        <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6', marginBottom: '24px' }}>
                            {dispute.description}
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
                            <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>
                                Logged: {new Date(dispute.created_at).toLocaleDateString()}
                            </span>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button style={{
                                    padding: '8px 20px', background: '#f8fafc', border: '1px solid #e2e8f0',
                                    borderRadius: '10px', color: '#475569', fontWeight: '700', fontSize: '13px', cursor: 'pointer'
                                }}>
                                    Inspect
                                </button>
                                <button style={{
                                    padding: '8px 24px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    border: 'none', borderRadius: '10px', color: 'white', fontWeight: '700',
                                    fontSize: '13px', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)'
                                }}>
                                    Resolve
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DisputesIssues;
