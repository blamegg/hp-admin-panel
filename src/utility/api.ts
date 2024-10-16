import api from "axios";
import { getTokenCookie } from "./helper";

export const apiClient = api.create({
  baseURL: "http://server1.apinext.in:3002",
  // withCredentials: true,
});

export const ApiEndpoints = {
  login: "/api/v1/login",
  register: "/api/v1/signup",
  logout: "/api/v1/logout",
  menu: "/api/v1/menus",
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
