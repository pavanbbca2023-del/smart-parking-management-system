import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';

const SessionTest = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const testActiveSessions = async () => {
        try {
            setLoading(true);
            setError(null);
            
            console.log('Testing active sessions API...');
            const response = await apiService.getActiveSessions();
            console.log('Response:', response);
            
            if (response && response.success && response.data) {
                setSessions(response.data);
                console.log('Found', response.data.length, 'active sessions');
            } else {
                setError('Unexpected response format');
            }
            
        } catch (err) {
            console.error('Error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        testActiveSessions();
    }, []);

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Session Management Test</h1>
            
            <button onClick={testActiveSessions} disabled={loading}>
                {loading ? 'Loading...' : 'Test Active Sessions API'}
            </button>
            
            {error && (
                <div style={{ color: 'red', margin: '10px 0' }}>
                    Error: {error}
                </div>
            )}
            
            <div style={{ margin: '20px 0' }}>
                <h3>Active Sessions ({sessions.length})</h3>
                {sessions.length === 0 ? (
                    <p>No active sessions found</p>
                ) : (
                    <ul>
                        {sessions.map((session, index) => (
                            <li key={index} style={{ margin: '10px 0', padding: '10px', border: '1px solid #ccc' }}>
                                <strong>{session.vehicle_number}</strong> - {session.owner_name}<br/>
                                Zone: {session.zone_name}<br/>
                                Slot: {session.slot_number}<br/>
                                Entry: {new Date(session.entry_time).toLocaleString()}<br/>
                                Duration: {session.duration_hours?.toFixed(2)} hours
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default SessionTest;