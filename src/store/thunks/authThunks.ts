import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { setUser, setLoading, setError } from '../slices/authSlice';
import { API_BASE_URL } from '../../config/api';

interface ErrorResponse {
  error?: string;
  message?: string;
}

export const fetchUserData = createAsyncThunk(
  'auth/fetchUser',
  async (_, { dispatch }) => {
    try {
      console.log('[fetchUserData] Starting to fetch user data...');
      dispatch(setLoading(true));
      
      console.log('[fetchUserData] Making API request to /api/user/me...');
      const response = await axios.get(`${API_BASE_URL}/api/user/me`, {
        withCredentials: true
      });
      console.log('[fetchUserData] API Response:', response.data);
      
      console.log('[fetchUserData] Dispatching user data to Redux store...');
      dispatch(setUser(response.data));
      return response.data;
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      console.error("[fetchUserData] Error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.response?.data?.message,
        error: error.message
      });
      dispatch(setError(error.response?.data?.message || 'Authentication failed'));
      throw err;
    } finally {
      console.log('[fetchUserData] Request completed');
      dispatch(setLoading(false));
    }
  }
);