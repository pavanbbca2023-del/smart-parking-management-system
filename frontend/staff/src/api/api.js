import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')}/api/` : 'http://127.0.0.1:8000/api/';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refresh_token');
                if (refreshToken) {
                    const response = await axios.post(
                        `${API_BASE_URL}auth/refresh/`,
                        { refresh: refreshToken }
                    );

                    const { access } = response.data;
                    localStorage.setItem('access_token', access);

                    originalRequest.headers.Authorization = `Bearer ${access}`;
                    return api(originalRequest);
                }
                throw new Error('No refresh token');
            } catch (refreshError) {
                // If refresh fails (401, 500, or any error), clear tokens
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');

                // Only redirect to login if we are currently in a protected section
                const path = window.location.pathname;
                if (path.startsWith('/admin') || path.startsWith('/staff') || path.startsWith('/user')) {
                    window.location.href = '/login';
                } else if (error.response?.status === 401) {
                    // For 401 on public pages, just reload once to clear the "Unauthorized" state from UI
                    window.location.reload();
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

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

export const attendanceApi = {
    logExit: () => api.post('core/attendance/exit/'),
};

export const reportApi = {
    getDailyShift: (date) => api.get(`core/shift-logs/?date=${date}`),
    getRevenueSummary: (period = 'DAILY') => api.get(`analytics/revenue/?period=${period}`),
    getVehicleHistory: (vehicleNumber) => api.get(`core/sessions/?vehicle_number=${vehicleNumber}`),
    getZonePerformance: () => api.get('analytics/zones/'),
};

export default api;
