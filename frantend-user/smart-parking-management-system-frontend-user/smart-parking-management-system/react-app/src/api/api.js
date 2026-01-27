import axios from 'axios';

// Ensure this matches your backend URL
const API_BASE_URL = 'http://127.0.0.1:8000/api/';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

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
    getBookingHistory: (vehicleNumber) => api.get(`core/sessions/?vehicle_number=${vehicleNumber}`)
};

export const analyticsApi = {
    getDashboardSummary: () => api.get('analytics/dashboard/'),
    getZoneAnalytics: () => api.get('analytics/zones/'),
    getActiveSessions: () => api.get('analytics/active-sessions/'),
    getRevenueAnalytics: (period = 'daily') => api.get(`analytics/revenue/?period=${period}`)
};

export default api;
