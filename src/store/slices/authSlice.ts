import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  _id?: string;
  user_id?: string;
  username?: string;
  email?: string;
  earnings_over_time?: Record<string, number>;
  stake_amount_over_time?: Record<string, number>;
  friends_earnings?: Record<string, number>;
  [key: string]: any;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  success: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  success: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setSuccess: (state, action: PayloadAction<string | null>) => {
      state.success = action.payload;
      state.loading = false;
    },
    clearAuth: (state) => {
      state.user = null;
      state.error = null;
      state.success = null;
      state.loading = false;
    },
  },
});

export const { setUser, setLoading, setError, setSuccess, clearAuth } = authSlice.actions;

export default authSlice.reducer;