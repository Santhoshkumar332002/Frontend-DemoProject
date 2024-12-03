import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';

interface AuthState {
  userData: {
    username?: string;
    email: string;
    token: string | null;
  } | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  userData: null,
  status: 'idle',
  error: null,
};

interface RegisterUser {
  username: string;
  email: string;
  password: string;
}

interface LoginUser {
  email: string;
  password: string;
}

export const register = createAsyncThunk(
  'auth/register',
  async (userInfo: RegisterUser, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', userInfo);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response && axiosError.response.data) {
        return rejectWithValue((axiosError.response.data as { message: string }).message);
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (userInfo: LoginUser, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', userInfo);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response && axiosError.response.data) {
        return rejectWithValue((axiosError.response.data as { message: string }).message);
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.userData = null;
      localStorage.removeItem('user');
    },
    setUserFromLocalStorage: (state) => {
      const user = localStorage.getItem('user');
      if (user) {
        state.userData = JSON.parse(user);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Register cases
      .addCase(register.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Login cases
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userData = {
          token: action.payload.token,
          username: action.payload.username,
          email: action.payload.email,
        };
        state.error = null;

        // Save user info to localStorage
        localStorage.setItem('user', JSON.stringify(state.userData));
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { logout, setUserFromLocalStorage } = authSlice.actions;

export default authSlice.reducer;
