import axiosInstance from '../../config/axiosConfig';
import { setUser, setLoading } from '../slices/authSlice';
import { createAsyncThunk } from '@reduxjs/toolkit';

// interface ErrorResponse {
//   error?: string;
//   message?: string;
// }

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
      const response = await axiosInstance.get('/api/user/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      dispatch(setUser(response.data));
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { 
          response?: { 
            status?: number; 
            statusText?: string; 
            data?: { message?: string };
          };
          message: string;
        };
        
        console.error('[fetchUserData] Error details:', {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          message: axiosError.response?.data?.message,
          error: axiosError.message,
        });

        if (axiosError.response?.status === 401) {
          localStorage.removeItem('jwtToken');
          delete axiosInstance.defaults.headers.common['Authorization'];
          dispatch(setUser(null));
        }
        
        return rejectWithValue(axiosError.response?.data || axiosError.message);
      }
      
      // Handle non-axios errors
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('[fetchUserData] Unexpected error:', errorMessage);
      return rejectWithValue(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  }
);
