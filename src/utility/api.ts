import api from "axios";
import { getTokenCookie } from "./helper";

export const apiClient = api.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
});

export const ApiEndpoints = {
  login: "/api/v1/login",
  register: "/api/v1/signup",
  logout: "/api/v1/logout",
  menu: "/api/v1/menus",
  users: "/api/v1/users",
  roles: "/api/v1/roles",
  permissions: "/api/v1/permissions",
  rolesPaginated: "/api/v1/roles?page=1&limit=4",
  deleteRole: (id: string) => `/api/v1/roles/${id}`,
  updateRole: (id: string) => `/api/v1/roles/${id}`,
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
