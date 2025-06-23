import api from "axios";
import { getTokenCookie, removeTokenCookie } from "./helper";

export const apiClient = api.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export const ApiEndpoints = {
  menus:"/api/v1/menus",
  login: "/api/v1/login",
  register: "/api/v1/signup",
  logout: "/api/v1/logout",
  users: "/api/v1/users",
  roles: "/api/v1/roles",
  leave:"/api/v1/leaves",
  leaveTypes:"/api/v1/leaveTypes",
  permissions: `/api/v1/rolePermissionMenu`,
  changePassword: "/api/v1/change-password",
};

// Add request interceptor
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = getTokenCookie();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.warn('No token found for request:', config.url);
      } 
    }
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      // Clear invalid token
      removeTokenCookie();

      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/signin';
      }
    }
    
    if (error.response?.status === 403) {

      // If this is a permissions endpoint error, log additional details
      if (error.config?.url?.includes('/api/v1/rolePermissionMenu')) {
        console.error('Permission fetch failed:', {
          roleId: error.config?.url?.split('/').pop(),
          error: error.response?.data
        });
      }
    }

    // Log other errors
    if (error.response?.status !== 401 && error.response?.status !== 403) {
      console.error('API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: error.response?.data?.message || error.message
      });
    }
    
    return Promise.reject(error.response?.data?.message || error.message);
  }
);
