import React, { useState, useEffect } from 'react';
import apiService from '../../../services/apiService';
import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

const StaffSchedule = () => {
    const [schedule, setSchedule] = useState([]);
    const [zones, setZones] = useState([]);
    const [staffList, setStaffList] = useState([]);
    const [selectedZone, setSelectedZone] = useState('');
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        staff: '',
        zone: '',
        day: 'Monday',
        shift_type: 'Alpha',
        shift_start: '06:00',
        shift_end: '14:00'
    });

    useEffect(() => {
        fetchZones();
        fetchStaff();
        fetchSchedule();
    }, [selectedZone]);

    const fetchStaff = async () => {
        try {
            const data = await apiService.adminGetAllUsers('STAFF');
            setStaffList(data || []);
        } catch (error) {
            console.error('Error fetching staff:', error);
        }
    };

    const fetchZones = async () => {
        try {
            const data = await apiService.getZones();
            if (data.success) {
                setZones(data.zones || []);
            }
        } catch (error) {
            console.error('Error fetching zones:', error);
        }
    };

    const fetchSchedule = async () => {
        try {
            setLoading(true);
            const response = await apiService.adminGetAllSchedules(selectedZone).catch(() => ({ success: false }));
            const data = response.schedules || [];

            // Mock data fallback for visualization if empty
            if (!data || data.length === 0) {
                setSchedule([
                    { day: 'Monday', shift1_name: 'Amit K.', shift2_name: 'Sneha R.', shift3_name: 'Rahul V.' },
                    { day: 'Tuesday', shift1_name: 'Sneha R.', shift2_name: 'Rahul V.', shift3_name: 'Amit K.' },
                    { day: 'Wednesday', shift1_name: 'Rahul V.', shift2_name: 'Amit K.', shift3_name: 'Sneha R.' },
                    { day: 'Thursday', shift1_name: 'Amit K.', shift2_name: 'Sneha R.', shift3_name: 'Rahul V.' },
                    { day: 'Friday', shift1_name: 'Sneha R.', shift2_name: 'Rahul V.', shift3_name: 'Amit K.' }
                ]);
            } else {
                setSchedule(data);
            }
        } catch (error) {
            console.error('Error fetching schedule:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAssign = async (e) => {
        e.preventDefault();
        try {
            await apiService.adminCreateSchedule(formData);
            setShowModal(false);
            fetchSchedule();
        } catch (error) {
            alert('Failed to allocate staff: ' + (error.response?.data?.error || error.message));
        }
    };

    return (
        <div style={{ position: 'relative' }}>
            {/* Allocation Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', zIndex: 1000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backdropFilter: 'blur(4px)'
                }}>
                    <div style={{
                        background: 'white', padding: '40px', borderRadius: '24px',
                        width: '450px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
                    }}>
                        <h2 style={{ margin: '0 0 24px 0', fontSize: '24px', fontWeight: '800', color: '#1e293b' }}>Allocate Staff</h2>
                        <form onSubmit={handleAssign} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>Staff Member</label>
                                <select
                                    required
                                    value={formData.staff}
                                    onChange={(e) => setFormData({ ...formData, staff: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', fontWeight: '600' }}
                                >
                                    <option value="">Select Staff</option>
                                    {staffList.map(s => <option key={s.id} value={s.id}>{s.username}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>Target Zone</label>
                                <select
                                    required
                                    value={formData.zone}
                                    onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', fontWeight: '600' }}
                                >
                                    <option value="">Select Zone</option>
                                    {zones.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
                                </select>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>Day</label>
                                    <select
                                        value={formData.day}
                                        onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                                        style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', fontWeight: '600' }}
                                    >
                                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>Shift</label>
                                    <select
                                        value={formData.shift_type}
                                        onChange={(e) => {
                                            const times = { Alpha: ['06:00', '14:00'], Bravo: ['14:00', '22:00'], Charlie: ['22:00', '06:00'] };
                                            setFormData({ ...formData, shift_type: e.target.value, shift_start: times[e.target.value][0], shift_end: times[e.target.value][1] });
                                        }}
                                        style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', fontWeight: '600' }}
                                    >
                                        <option value="Alpha">Morning (06:00 - 14:00)</option>
                                        <option value="Bravo">Afternoon (14:00 - 22:00)</option>
                                        <option value="Charlie">Night (22:00 - 06:00)</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '14px', borderRadius: '14px', border: '1px solid #e2e8f0', background: 'white', fontWeight: '700', cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" style={{ flex: 1, padding: '14px', borderRadius: '14px', border: 'none', background: '#3b82f6', color: 'white', fontWeight: '700', cursor: 'pointer' }}>Assign Duty</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(20px)',
                borderRadius: '28px',
                boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                overflow: 'hidden',
                animation: 'fadeIn 0.5s ease-out'
            }}>
                <div style={{
                    padding: '32px 40px', borderBottom: '1px solid rgba(0, 0, 0, 0.04)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: 'rgba(248, 250, 252, 0.4)'
                }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '12px', margin: 0 }}>
                        <Calendar style={{ width: '24px', height: '24px', color: '#f59e0b' }} />
                        Staff Weekly Schedule
                    </h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748b' }}>Filter Zone:</span>
                            <select
                                value={selectedZone}
                                onChange={(e) => setSelectedZone(e.target.value)}
                                style={{
                                    padding: '8px 12px',
                                    borderRadius: '10px',
                                    border: '1px solid #e2e8f0',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    color: '#1e293b',
                                    outline: 'none',
                                    cursor: 'pointer',
                                    background: 'white'
                                }}
                            >
                                <option value="">All Zones</option>
                                {zones.map(zone => (
                                    <option key={zone.id} value={zone.id}>{zone.name}</option>
                                ))}
                            </select>
                        </div>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '4px',
                            background: 'white', border: '1px solid #e2e8f0',
                            padding: '6px 14px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                        }}>
                            <button style={{ border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}><ChevronLeft size={16} /></button>
                            <span style={{ fontSize: '13px', fontWeight: '700', color: '#475569', minWidth: '100px', textAlign: 'center' }}>Nov 20 - Nov 26</span>
                            <button style={{ border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}><ChevronRight size={16} /></button>
                        </div>
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0' }}>
                        <thead>
                            <tr style={{ background: 'rgba(248, 250, 252, 0.5)' }}>
                                <th style={{ padding: '20px 40px', textAlign: 'left', fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Day of Week</th>
                                <th style={{ padding: '20px 40px', textAlign: 'left', fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Clock size={14} style={{ color: '#3b82f6' }} /> Morning (06:00 - 14:00)
                                    </div>
                                </th>
                                <th style={{ padding: '20px 40px', textAlign: 'left', fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Clock size={14} style={{ color: '#f59e0b' }} /> Afternoon (14:00 - 22:00)
                                    </div>
                                </th>
                                <th style={{ padding: '20px 40px', textAlign: 'left', fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Clock size={14} style={{ color: '#8b5cf6' }} /> Night (22:00 - 06:00)
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4" style={{ padding: '80px 40px', textAlign: 'center', color: '#94a3b8' }}>Analyzing deployment cycles...</td></tr>
                            ) : schedule.map((day, index) => (
                                <tr key={index} style={{ transition: 'all 0.2s' }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(248, 250, 252, 0.5)'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                    <td style={{ padding: '24px 40px', fontWeight: '800', color: '#1e293b', background: 'rgba(248, 250, 252, 0.3)', width: '150px' }}>
                                        {day.day}
                                    </td>
                                    <td style={{ padding: '24px 40px' }}>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                            {(day.shift1_name || 'Standby').split(', ').map((staff, i) => (
                                                <div key={i} style={{
                                                    display: 'inline-flex', padding: '8px 14px', borderRadius: '10px',
                                                    background: day.shift1_name ? '#eff6ff' : '#f1f5f9',
                                                    color: day.shift1_name ? '#1d4ed8' : '#94a3b8',
                                                    fontSize: '13px', fontWeight: '700', border: '1px solid transparent',
                                                    borderColor: day.shift1_name ? '#dbeafe' : 'transparent'
                                                }}>
                                                    {staff}
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td style={{ padding: '24px 40px' }}>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                            {(day.shift2_name || 'Standby').split(', ').map((staff, i) => (
                                                <div key={i} style={{
                                                    display: 'inline-flex', padding: '8px 14px', borderRadius: '10px',
                                                    background: day.shift2_name ? '#fffbeb' : '#f1f5f9',
                                                    color: day.shift2_name ? '#b45309' : '#94a3b8',
                                                    fontSize: '13px', fontWeight: '700', border: '1px solid transparent',
                                                    borderColor: day.shift2_name ? '#fef3c7' : 'transparent'
                                                }}>
                                                    {staff}
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td style={{ padding: '24px 40px' }}>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                            {(day.shift3_name || 'Standby').split(', ').map((staff, i) => (
                                                <div key={i} style={{
                                                    display: 'inline-flex', padding: '8px 14px', borderRadius: '10px',
                                                    background: day.shift3_name ? '#f5f3ff' : '#f1f5f9',
                                                    color: day.shift3_name ? '#6d28d9' : '#94a3b8',
                                                    fontSize: '13px', fontWeight: '700', border: '1px solid transparent',
                                                    borderColor: day.shift3_name ? '#ede9fe' : 'transparent'
                                                }}>
                                                    {staff}
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div style={{
                    padding: '24px 40px', background: 'rgba(248, 250, 252, 0.4)',
                    borderTop: '1px solid rgba(0,0,0,0.04)', textAlign: 'center'
                }}>
                    <button
                        onClick={() => setShowModal(true)}
                        style={{
                            background: '#3b82f6', border: 'none', padding: '12px 28px',
                            borderRadius: '14px', fontSize: '14px', fontWeight: '800', color: 'white',
                            cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                        }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                        + Assign New Shift
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StaffSchedule;
