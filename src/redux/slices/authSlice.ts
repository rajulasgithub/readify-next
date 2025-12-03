"use client";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/utils/api";
import Cookies from "js-cookie";

interface User {
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  phone: number;
  createdAt?: boolean;
  image?: string; 
  bio?: string;
  fullPhone:Number
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


export type UpdateProfilePayload = FormData;

// REGISTER USER
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
export const loginUserThunk = createAsyncThunk<
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


export const updateProfileThunk = createAsyncThunk<
  ApiResponse,
  UpdateProfilePayload,
  { rejectValue: string }
>("auth/updateProfile", async (formData, { rejectWithValue }) => {
  try {

    const token = Cookies.get("accessToken");

    if (!token) {
      return rejectWithValue("No token found. Please login again.");
    }

    const { data } = await api.patch<ApiResponse>(
      "/api/user/updateprofile",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to update profile"
    );
  }
});



export const fetchProfileThunk = createAsyncThunk<
  ApiResponse,
  void,
  { rejectValue: string }
>("auth/fetchProfile", async (_, { rejectWithValue }) => {
  try {
    const token = Cookies.get("accessToken");

    if (!token) {
      return rejectWithValue("No token found. Please login again.");
    }

    const { data } = await api.get<ApiResponse>("/api/user/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
console.log(data)
    return data;
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message || "Failed to fetch profile"
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
      .addCase(loginUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginUserThunk.fulfilled,
        (state, action: PayloadAction<ApiResponse>) => {
          state.loading = false;
          state.user = action.payload.data;
        }
      )
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Something went wrong";
      })

      // 🔹 UPDATE PROFILE
      .addCase(updateProfileThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateProfileThunk.fulfilled,
        (state, action: PayloadAction<ApiResponse>) => {
          state.loading = false;
          // overwrite user in state with updated user from backend
          state.user = action.payload.data;
        }
      )
      // fetch user data
      .addCase(updateProfileThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to update profile";
      })

      .addCase(fetchProfileThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProfileThunk.fulfilled,
        (state, action: PayloadAction<ApiResponse>) => {
          state.loading = false;
          state.user = action.payload.data;
        }
      )
      .addCase(fetchProfileThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch profile";
      })
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
