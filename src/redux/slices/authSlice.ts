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
  createdAt?: string;
  image?: string;
  bio?: string;
  fullPhone?: number | string;
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

/** Safely extract an error message from different error shapes */
const extractErrorMessage = (err: unknown): string => {
  if (!err) return "Unknown error";

  if (typeof err === "string") return err;

  if (err instanceof Error) return err.message;

  try {
    const possible = err as {
      response?: { data?: { message?: unknown } };
      message?: unknown;
    };
    const maybeMessage = possible.response?.data?.message ?? possible.message;
    if (typeof maybeMessage === "string" && maybeMessage.length > 0) return maybeMessage;

    const str = JSON.stringify(err);
    if (str && str !== "{}") return str;
  } catch {
    // ignore and fallback
  }

  return "Unknown error";
};

// REGISTER USER
export const registerUser = createAsyncThunk<
  ApiResponse,
  RegisterFormData,
  { rejectValue: string }
>("auth/registerUser", async (formData, { rejectWithValue }) => {
  try {
    const { data } = await api.post<ApiResponse>("/api/user/register", formData);
    return data;
  } catch (err: unknown) {
    console.log(" FULL ERROR:", err);
    return rejectWithValue(extractErrorMessage(err) || "Something went wrong");
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
  } catch (err: unknown) {
    return rejectWithValue(extractErrorMessage(err) || "Invalid credentials");
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
  } catch (err: unknown) {
    return rejectWithValue(extractErrorMessage(err) || "Failed to update profile");
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
  } catch (err: unknown) {
    return rejectWithValue(extractErrorMessage(err) || "Failed to fetch profile");
  }
});

/**
 * NEW: fetchSellerStats thunk
 * Expects backend endpoint: GET /api/seller/stats
 * Response shape can be either:
 *  - { success: true, data: { totalBooks, totalOrders, totalRevenue } }
 *  - or directly { totalBooks, totalOrders, totalRevenue }
 *
 * We robustly handle both shapes without using `any`.
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

    // raw holds the unknown response body
    const raw: unknown = data;

    // Helper to safely coerce a value to number (handles number or numeric string)
    const toNumber = (v: unknown): number => {
      if (typeof v === "number") return v;
      if (typeof v === "string") {
        const n = Number(v);
        return Number.isFinite(n) ? n : 0;
      }
      return 0;
    };

    // Determine payload object either from data.data or data directly
    let payloadObj: Record<string, unknown> = {};

    if (raw && typeof raw === "object") {
      const rawObj = raw as Record<string, unknown>;
      // prefer raw.data if present
      const possibleInner = rawObj["data"];
      if (possibleInner && typeof possibleInner === "object") {
        payloadObj = possibleInner as Record<string, unknown>;
      } else {
        payloadObj = rawObj;
      }
    }

    const totalBooks = toNumber(payloadObj["totalBooks"]);
    const totalOrders = toNumber(payloadObj["totalOrders"]);
    const totalRevenue = toNumber(payloadObj["totalRevenue"]);

    return {
      totalBooks,
      totalOrders,
      totalRevenue,
    };
  } catch (err: unknown) {
    return rejectWithValue(extractErrorMessage(err) || "Failed to fetch seller stats");
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
      .addCase(
        fetchSellerStats.fulfilled,
        (state, action: PayloadAction<{ totalBooks: number; totalOrders: number; totalRevenue: number }>) => {
          state.sellerStatsLoading = false;
          state.sellerStats = {
            totalBooks: action.payload.totalBooks,
            totalOrders: action.payload.totalOrders,
            totalRevenue: action.payload.totalRevenue,
          };
        }
      )
      .addCase(fetchSellerStats.rejected, (state, action) => {
        state.sellerStatsLoading = false;
        state.sellerStatsError = action.payload ?? "Failed to fetch seller stats";
      });
  },
});

export const { logout, clearSellerStats } = authSlice.actions;
export default authSlice.reducer;
