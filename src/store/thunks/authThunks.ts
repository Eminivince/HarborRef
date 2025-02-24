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
      const authHeader = axiosInstance.defaults.headers.common['Authorization'];
      console.log('[fetchUserData] Authorization header:', authHeader);
      const response = await axiosInstance.get('/api/user/me');
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
