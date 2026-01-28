import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api/';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const alertApi = {
    getAll: () => api.get('analytics/alerts/'),
    markAsRead: (id) => api.patch(`analytics/alerts/${id}/`, { is_read: true }),
    clearAll: () => api.post('analytics/alerts/clear_all/'),
};

export const parkingApi = {
    getDashboardStats: () => api.get('analytics/dashboard/'),
    getZones: () => api.get('core/zones/'),
    getActiveSessions: () => api.get('core/sessions/?status=active,reserved'),
    getCompletedSessions: () => api.get('core/sessions/?status=completed'),
    getAvailableSlots: (zoneId) => api.get(`core/slots/?zone=${zoneId}&is_occupied=false&is_active=true`),
    processEntry: (data) => api.post('core/sessions/scan-entry/', {
        vehicle_number: data.vehicleNumber,
        zone_id: data.zoneId,
        initial_amount: data.initial_amount,
        payment_method: data.payment_method
    }),
    processExit: (data) => api.post('core/sessions/scan-exit/', {
        vehicle_number: data.vehicle_number || data.vehicleNumber,
        session_id: data.session_id || data.sessionId
    }),
    getPayments: () => api.get('core/payments/'),
    getPendingSessions: () => api.get('core/sessions/?payment_status=pending,partially_paid'),
};

export const reportApi = {
    getDailyShift: (date) => api.get(`core/shift-logs/?date=${date}`),
    getRevenueSummary: (period = 'DAILY') => api.get(`analytics/revenue/?period=${period}`),
    getVehicleHistory: (vehicleNumber) => api.get(`core/sessions/?vehicle_number=${vehicleNumber}`),
    getZonePerformance: () => api.get('analytics/zones/'),
};

export default api;
