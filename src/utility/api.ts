import api from "axios";

export const apiClient = api.create({
  baseURL: "http://server1.apinext.in:3002/",
});

export const ApiEndpoints = {
  login: "/api/v1/login",
  register: "/api/v1/signup",
  logout: "/api/v1/logout",
};

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

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
