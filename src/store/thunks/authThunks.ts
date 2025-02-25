import axiosInstance from '../../config/axiosConfig';
import { setUser, setLoading, setError } from '../slices/authSlice';
import { createAsyncThunk } from '@reduxjs/toolkit';

interface ErrorResponse {
  error?: string;
  message?: string;
}

export const fetchUserData = createAsyncThunk(
  'auth/fetchUserData',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        dispatch(setUser(null));
        return rejectWithValue('No authentication token found');
      }
      console.log('[fetchUserData] Starting to fetch user data...');
      console.log('[fetchUserData] Making API request to /api/user/me...');
      console.log(axiosInstance.defaults.baseURL);
      const response = await axiosInstance.get('/api/user/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      dispatch(setUser(response.data));
      return response.data;
    } catch (error) {
      console.error('[fetchUserData] Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.response?.data?.message,
        error: error.message,
      });
      if (error.response?.status === 401) {
        localStorage.removeItem('jwtToken');
        delete axiosInstance.defaults.headers.common['Authorization'];
        dispatch(setUser(null));
      }
      return rejectWithValue(error.response?.data || error.message);
    } finally {
      console.log('[fetchUserData] Request completed');
      dispatch(setLoading(false));
    }
  }
);
