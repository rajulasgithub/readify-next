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
  fullPhone: Number;
  
}

interface SellerStats {
  totalBooks: number;
  totalOrders: number;
  totalRevenue: number;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;

  // seller stats
  sellerStats: SellerStats | null;
  sellerStatsLoading: boolean;
  sellerStatsError: string | null;
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
    return rejectWithValue(err.response?.data?.message || "Something went wrong");
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
    return rejectWithValue(err.response?.data?.message || "Invalid credentials");
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

    const { data } = await api.patch<ApiResponse>("/api/user/updateprofile", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Failed to update profile");
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
    console.log(data);
    return data;
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message || "Failed to fetch profile");
  }
});

/**
 * NEW: fetchSellerStats thunk
 * Expects backend endpoint: GET /api/seller/stats
 * Response shape: { success: true, data: { totalBooks, totalOrders, totalRevenue } }
 */
export const fetchSellerStats = createAsyncThunk<
  { totalBooks: number; totalOrders: number; totalRevenue: number },
  void,
  { rejectValue: string }
>("auth/fetchSellerStats", async (_, { rejectWithValue }) => {
  try {
    const token = Cookies.get("accessToken");
    if (!token) return rejectWithValue("No token found. Please login.");

    const { data } = await api.get("/api/user/getsellerstats", {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Accept either { success, data } or direct object
    const payload =
      data && data.data ? data.data : data;

    return {
      totalBooks: payload.totalBooks ?? 0,
      totalOrders: payload.totalOrders ?? 0,
      totalRevenue: payload.totalRevenue ?? 0,
    };
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message || "Failed to fetch seller stats");
  }
});

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,

  sellerStats: null,
  sellerStatsLoading: false,
  sellerStatsError: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
    },
    // optional: clear seller stats
    clearSellerStats: (state) => {
      state.sellerStats = null;
      state.sellerStatsError = null;
      state.sellerStatsLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<ApiResponse>) => {
        state.loading = false;
        state.user = action.payload.data;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Something went wrong";
      })

      // LOGIN
      .addCase(loginUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, action: PayloadAction<ApiResponse>) => {
        state.loading = false;
        state.user = action.payload.data;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Something went wrong";
      })

      // UPDATE PROFILE
      .addCase(updateProfileThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfileThunk.fulfilled, (state, action: PayloadAction<ApiResponse>) => {
        state.loading = false;
        state.user = action.payload.data;
      })
      .addCase(updateProfileThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to update profile";
      })

      // FETCH PROFILE
      .addCase(fetchProfileThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfileThunk.fulfilled, (state, action: PayloadAction<ApiResponse>) => {
        state.loading = false;
        state.user = action.payload.data;
      })
      .addCase(fetchProfileThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch profile";
      })

      // ===== Seller stats reducers =====
      .addCase(fetchSellerStats.pending, (state) => {
        state.sellerStatsLoading = true;
        state.sellerStatsError = null;
      })
      .addCase(fetchSellerStats.fulfilled, (state, action: PayloadAction<{ totalBooks: number; totalOrders: number; totalRevenue: number }>) => {
        state.sellerStatsLoading = false;
        state.sellerStats = {
          totalBooks: action.payload.totalBooks,
          totalOrders: action.payload.totalOrders,
          totalRevenue: action.payload.totalRevenue,
        };
      })
      .addCase(fetchSellerStats.rejected, (state, action) => {
        state.sellerStatsLoading = false;
        state.sellerStatsError = action.payload ?? "Failed to fetch seller stats";
      });
  },
});

export const { logout, clearSellerStats } = authSlice.actions;
export default authSlice.reducer;
