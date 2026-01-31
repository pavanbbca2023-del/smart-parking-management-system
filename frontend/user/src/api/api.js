import axios from 'axios';

// Ensure this matches your backend URL
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

                // If the error was due to invalid token on a public endpoint, retry without token
                if (originalRequest && !originalRequest._retryWithoutAuth) {
                    originalRequest._retryWithoutAuth = true;
                    delete originalRequest.headers.Authorization;
                    return api(originalRequest);
                }

                // Only redirect to login if we are currently in a protected section
                const path = window.location.pathname;
                if (path.startsWith('/admin') || path.startsWith('/staff') || path.startsWith('/user')) {
                    window.location.href = '/login';
                }

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export const parkingApi = {
    // Book a slot (Guest Booking)
    bookSlot: async (bookingData) => {
        try {
            const response = await api.post('parking/book/', {
                vehicle_number: bookingData.vehicleNumber,
                zone_id: bookingData.selectedZone,
                mobileNumber: bookingData.mobileNumber,
                email: bookingData.email,
                vehicleType: bookingData.vehicleType
            });
            return response.data;
        } catch (error) {
            console.error("Booking failed:", error.response?.data || error.message);
            throw error;
        }
    },

    // Check slot availability (Optional future integration)
    getZones: () => api.get('core/zones/'),

    // Get booking history by vehicle number
    getBookingHistory: (vehicleNumber) => api.get(`core/sessions/?vehicle_number=${vehicleNumber}`),

    // Razorpay Integration
    createRazorpayOrder: (bookingId, amount) => api.post(`core/sessions/${bookingId}/create-razorpay-order/`, { amount }),
    verifyRazorpayPayment: (paymentData) => api.post(`core/sessions/verify-razorpay-payment/`, paymentData)
};

export const analyticsApi = {
    getDashboardSummary: () => api.get('analytics/dashboard/'),
    getZoneAnalytics: () => api.get('analytics/zones/'),
    getActiveSessions: () => api.get('analytics/active-sessions/'),
    getRevenueAnalytics: (period = 'daily') => api.get(`analytics/revenue/?period=${period}`)
};

export default api;
