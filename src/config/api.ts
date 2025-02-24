// API configuration based on environment
const isDevelopment = import.meta.env.MODE === 'development';

export const API_BASE_URL = isDevelopment
  ? 'http://localhost:5002'
  : 'https://glacial-river-04858-a83417b9c48e.herokuapp.com';