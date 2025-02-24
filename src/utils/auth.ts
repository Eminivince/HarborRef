// src/utils/auth.ts
import axiosInstance from '../config/axiosConfig';

// Function to store JWT token
export const setAuthToken = (token: string) => {
  localStorage.setItem('jwtToken', token);
  // Immediately update axios instance headers
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

// Function to get JWT token
export const getAuthToken = () => {
  return localStorage.getItem('jwtToken');
};

// Function to remove JWT token
export const removeAuthToken = () => {
  localStorage.removeItem('jwtToken');
  // Clear the Authorization header
  delete axiosInstance.defaults.headers.common['Authorization'];
};

// Function to check if user is authenticated
export const isAuthenticated = () => {
  const token = getAuthToken();
  return !!token;
};

// Function to get auth header
export const getAuthHeader = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};