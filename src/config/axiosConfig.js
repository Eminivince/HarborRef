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

    const token = localStorage.getItem("jwtToken");


    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      
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

      localStorage.removeItem("jwtToken");
      // Optionally redirect to login page
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
