import axios from "axios";
import { API_BASE_URL } from "./api.ts";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(API_BASE_URL);
    const token = localStorage.getItem("jwtToken");
    console.log("Token from localStorage:", token ? "exists" : "missing");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(
        "Setting Authorization header:",
        `Bearer ${token.substring(0, 20)}...`
      );
    } else {
      console.log("No token found in localStorage");
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token-related errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Received 401 error, clearing token");
      localStorage.removeItem("jwtToken");
      // Optionally redirect to login page
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
