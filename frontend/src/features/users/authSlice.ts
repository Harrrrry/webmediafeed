import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../services/api';
import type { User, UserLoginRequest, UserLoginResponse, UserProfileResponse } from '../../utils/interfaces/user';

interface AuthState {
  user: User | null;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  status: 'idle',
  error: null,
};

export const login = createAsyncThunk('auth/login', async (data: { username: string; password: string }) => {
  const res = await api.login(data);
  localStorage.setItem('token', res.access_token);
  return res.access_token;
});

export const register = createAsyncThunk('auth/register', async (data: { username: string; email: string; password: string }) => {
  return await api.register(data);
});

export const getProfile = createAsyncThunk<User, string>('auth/getProfile', async (id: string) => {
  const user = await api.getProfile(id);
  return { ...user, id: user._id || user.id };
});

export const getProfileMe = createAsyncThunk<User>('auth/getProfileMe', async () => {
  const user = await api.getProfileMe();
  return { ...user, id: user._id || user.id };
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Login failed';
      })
      .addCase(register.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Registration failed';
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(getProfileMe.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer; 