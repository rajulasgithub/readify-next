"use client";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/utils/api";

interface User {
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  phone: Number;
  createdAt?: boolean;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface RegisterFormData {
  firstName: string;
  lastName: string;
  countryCode: string;
  phone: string;
  password: string;
  role: string;
}

interface LoginFormData {
  email: string;
  password: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  accessToken?: string; 
  data: User;
}


export const registerUser = createAsyncThunk<
  ApiResponse,
  RegisterFormData,
  { rejectValue: string }
>("auth/registerUser", async (formData, { rejectWithValue }) => {
  try {
    const { data } = await api.post<ApiResponse>("/api/user/register", formData);
    return data;
  } catch (err: any) {
    console.log(" FULL ERROR:", err.response);
    return rejectWithValue(
      err.response?.data?.message || "Something went wrong"
    );
  }
});

// LOGIN USER
export const loginUser = createAsyncThunk<
  ApiResponse,
  LoginFormData,
  { rejectValue: string }
>("auth/loginUser", async (formData, { rejectWithValue }) => {
  try {
   
    const { data } = await api.post<ApiResponse>("/api/user/login", formData);
    return data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Invalid credentials"
    );
  }
});

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<ApiResponse>) => {
          state.loading = false;
          state.user = action.payload.data;
        }
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Something went wrong";
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<ApiResponse>) => {
          state.loading = false;
          state.user = action.payload.data; 
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Something went wrong";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
