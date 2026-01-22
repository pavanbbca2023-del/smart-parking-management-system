// API Configuration for Smart Parking Admin
const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000',
  ENDPOINTS: {
    // Authentication
    AUTH: {
      LOGIN: '/api/auth/login/',
      REFRESH: '/api/auth/refresh/',
      LOGOUT: '/api/auth/logout/',
    },

    // Core APIs
    CORE: {
      DASHBOARD: '/api/dashboard/',
      ZONES: '/api/zones/',
      SESSIONS: '/api/sessions/',
      VEHICLES: '/api/vehicles/',
      PAYMENTS: '/api/payments/',
      BOOK_PARKING: '/api/parking/book/',
      SCAN_ENTRY: '/api/parking/scan-entry/',
      SCAN_EXIT: '/api/parking/scan-exit/',
      REFUND: '/api/parking/refund/',
      PAYMENT_STATUS: '/api/parking/payment-status/',
    },

    // Analytics APIs (actual backend endpoints)
    ANALYTICS: {
      DASHBOARD: '/api/analytics/dashboard/',
      REVENUE: '/api/analytics/revenue/',
      OCCUPANCY: '/api/analytics/zones/',
      PEAK_HOURS: '/api/analytics/peak-hours/',
      ACTIVE_SESSIONS: '/api/analytics/active-sessions/',
      COMPLETED_SESSIONS: '/api/analytics/completed-sessions/',
      PAYMENTS: '/api/analytics/payments/',
    },

    // Role-based APIs
    ADMIN: {
      USERS: '/api/admin/users/',
      STAFF: '/api/admin/staff/',
      REPORTS: '/api/admin/reports/',
      PAYMENTS: '/api/admin/payments/',
      ZONES: '/api/admin/zones/',
    },

    STAFF: {
      ENTRY: '/api/staff/entry/',
      EXIT: '/api/staff/exit/',
      SESSIONS: '/api/staff/current-sessions/',
    },

    USER: {
      BOOK_SLOT: '/api/user/book-slot/',
      BOOKINGS: '/api/user/bookings/',
      CURRENT_SESSION: '/api/user/current-session/',
    }
  }
};

export default API_CONFIG;