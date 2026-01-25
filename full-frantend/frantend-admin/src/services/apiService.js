import axios from 'axios';
import API_CONFIG from '../config/api.js';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
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

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(
            `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REFRESH}`,
            { refresh: refreshToken }
          );

          const { access } = response.data;
          localStorage.setItem('access_token', access);

          originalRequest.headers.Authorization = `Bearer ${access}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// API Service Class
class ApiService {
  // Authentication
  async login(credentials) {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials);
    const { access, refresh } = response.data;
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    return response.data;
  }

  async logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  // Dashboard Data
  async getDashboardData() {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.CORE.DASHBOARD);
    return response.data;
  }

  async getAnalyticsDashboard() {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.ANALYTICS.DASHBOARD);
    return response.data;
  }

  // Zones Management
  async getZones() {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.CORE.ZONES);
    return response.data;
  }

  async createZone(zoneData) {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.CORE.ZONES, zoneData);
    return response.data;
  }

  async updateZone(zoneId, zoneData) {
    const response = await apiClient.put(`${API_CONFIG.ENDPOINTS.CORE.ZONES}${zoneId}/`, zoneData);
    return response.data;
  }

  async deleteZone(zoneId) {
    const response = await apiClient.delete(`${API_CONFIG.ENDPOINTS.CORE.ZONES}${zoneId}/`);
    return response.data;
  }

  // Sessions Management
  async getSessions() {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.CORE.SESSIONS);
    return response.data;
  }

  async getActiveSessions() {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.ANALYTICS.ACTIVE_SESSIONS);
    return response.data;
  }

  async getCompletedSessions() {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.ANALYTICS.COMPLETED_SESSIONS);
    return response.data;
  }

  // Parking Operations
  async bookParking(bookingData) {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.CORE.BOOK_PARKING, bookingData);
    return response.data;
  }

  async scanEntry(qrData) {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.CORE.SCAN_ENTRY, qrData);
    return response.data;
  }

  async scanExit(exitData) {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.CORE.SCAN_EXIT, exitData);
    return response.data;
  }

  async checkRefund(qrData) {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.CORE.REFUND, qrData);
    return response.data;
  }

  async getPaymentStatus(sessionData) {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.CORE.PAYMENT_STATUS, sessionData);
    return response.data;
  }

  // Analytics
  async getRevenueReport(params = {}) {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.ANALYTICS.REVENUE, { params });
    return response.data;
  }

  async getOccupancyData(params = {}) {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.ANALYTICS.OCCUPANCY, { params });
    return response.data;
  }

  async getPeakHours(params = {}) {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.ANALYTICS.PEAK_HOURS, { params });
    return response.data;
  }

  async getPaymentAnalytics(params = {}) {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.ANALYTICS.PAYMENTS, { params });
    return response.data;
  }

  // Staff Operations
  async staffEntry(entryData) {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.STAFF.ENTRY, entryData);
    return response.data;
  }

  async staffExit(exitData) {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.STAFF.EXIT, exitData);
    return response.data;
  }

  async getStaffSessions() {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.STAFF.SESSIONS);
    return response.data;
  }

  // User Operations
  async userBookSlot(bookingData) {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.USER.BOOK_SLOT, bookingData);
    return response.data;
  }

  async getUserBookings() {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.USER.BOOKINGS);
    return response.data;
  }

  async getCurrentSession() {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.USER.CURRENT_SESSION);
    return response.data;
  }

  // Admin Operations
  async getAdminReports(params = {}) {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.ADMIN.REPORTS, { params });
    return response.data;
  }

  async getAdminPayments(params = {}) {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.ADMIN.PAYMENTS, { params });
    return response.data;
  }

  // Admin User Management
  async adminGetAllUsers(role = null) {
    const params = role ? { role } : {};
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.ADMIN.USERS, { params });
    // Backend returns { users: [...] }, extract the array
    return response.data.users || response.data || [];
  }

  async adminCreateUser(userData) {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.ADMIN.CREATE_USER, userData);
    return response.data;
  }

  async getUsers() {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.ADMIN.USERS || '/api/users/');
      return response.data;
    } catch (error) {
      console.warn('Failed to fetch users from backend, using mock data');
      // Fallback mock data
      return {
        users: [
          { id: 1, username: 'john_doe', email: 'john@parking.io', role: 'STAFF', salary: 5000 },
          { id: 2, username: 'jane_smith', email: 'jane@parking.io', role: 'STAFF', salary: 6000 },
          { id: 3, username: 'mike_wilson', email: 'mike@parking.io', role: 'STAFF', salary: 5500 }
        ]
      };
    }
  }

  // Staff OperationsUpdateUser(userId, userData) {
  async adminUpdateUser(userId, userData) {
    const response = await apiClient.put(`${API_CONFIG.ENDPOINTS.ADMIN.USERS}${userId}/`, userData);
    return response.data;
  }

  async adminDeleteUser(userId) {
    const response = await apiClient.delete(`${API_CONFIG.ENDPOINTS.ADMIN.USERS}${userId}/`);
    return response.data;
  }

  // Admin Zone Management
  async adminGetAllZones() {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.ADMIN.ZONES);
    return response.data;
  }

  async adminCreateZone(zoneData) {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.ADMIN.ZONES, zoneData);
    return response.data;
  }

  async adminUpdateZone(zoneId, zoneData) {
    const response = await apiClient.put(`${API_CONFIG.ENDPOINTS.ADMIN.ZONES}${zoneId}/`, zoneData);
    return response.data;
  }

  async adminDeleteZone(zoneId) {
    const response = await apiClient.delete(`${API_CONFIG.ENDPOINTS.ADMIN.ZONES}${zoneId}/`);
    return response.data;
  }

  async adminToggleZoneStatus(zoneId) {
    const response = await apiClient.post(`${API_CONFIG.ENDPOINTS.ADMIN.ZONES}${zoneId}/toggle_status/`);
    return response.data;
  }

  // Admin Disputes & Schedules
  async adminGetAllDisputes() {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.ADMIN.DISPUTES);
    return response.data;
  }

  async adminGetAllSchedules() {
    const response = await apiClient.get('/api/admin/schedules/');
    return response.data;
  }

  async adminUpdateSchedule(id, data) {
    const response = await apiClient.patch(`/api/admin/schedules/${id}/`, data);
    return response.data;
  }

  async adminGetAllAttendance() {
    const response = await apiClient.get('/api/admin/attendance/');
    return response.data;
  }
}

export default new ApiService();