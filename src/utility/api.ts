import api from "axios";
import { getTokenCookie } from "./helper";

export const apiClient = api.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
});

export const ApiEndpoints = {
  menus:"/api/v1/menus",
  login: "/api/v1/login",
  register: "/api/v1/signup",
  logout: "/api/v1/logout",
  users: "/api/v1/users",
  roles: "/api/v1/roles",
  permissions: `/api/v1/rolePermissionMenu`,
  changePassword: "/api/v1/change-password",
};

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = getTokenCookie();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
