import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/src/components/api";

// -------------------- TYPES --------------------
export interface DashboardStats {
  customersCount: number;
  sellersCount: number;
  booksCount: number;
  ordersCount: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt?: string;
  orders?: { totalAmount: number }[];
  totalOrders: number;   // number of orders
  totalSpent: number;    // total amount spent
}

interface FetchUsersResponse {
  success: boolean;
  data: User[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface AdminState {
  loading: boolean;
  error: string | null;
  stats: DashboardStats;
  sellers: User[];
  customers: User[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// -------------------- ASYNC THUNKS --------------------

// Fetch dashboard stats
export const fetchDashboardStats = createAsyncThunk<
  DashboardStats,
  void,
  { rejectValue: string }
>("admin/fetchDashboardStats", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await api.get("/api/admin/dashboardstats", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data as DashboardStats;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Fetch sellers
export const fetchSellers = createAsyncThunk<
  FetchUsersResponse,
  { page?: number; limit?: number; search?: string } | undefined,
  { rejectValue: string }
>("admin/fetchSellers", async (params, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("accessToken");
    const queryParams = new URLSearchParams({
      type: "seller",
      page: params?.page?.toString() || "1",
      limit: params?.limit?.toString() || "10",
      search: params?.search || "",
    }).toString();

    const res = await api.get(`/api/admin/viewallusers?${queryParams}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data as FetchUsersResponse;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Fetch customers
export const fetchCustomers = createAsyncThunk<
  FetchUsersResponse,
  { page?: number; limit?: number; search?: string } | undefined,
  { rejectValue: string }
>("admin/fetchCustomers", async (params, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("accessToken");
    const queryParams = new URLSearchParams({
      type: "customer",
      page: params?.page?.toString() || "1",
      limit: params?.limit?.toString() || "10",
      search: params?.search || "",
    }).toString();

    const res = await api.get(`/api/admin/viewallusers?${queryParams}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data as FetchUsersResponse;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

// -------------------- INITIAL STATE --------------------
const initialState: AdminState = {
  loading: false,
  error: null,
  stats: {
    customersCount: 0,
    sellersCount: 0,
    booksCount: 0,
    ordersCount: 0,
  },
  sellers: [],
  customers: [],
  pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
};

// -------------------- SLICE --------------------
const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    resetAdminState: (state) => {
      state.loading = false;
      state.error = null;
      state.stats = {
        customersCount: 0,
        sellersCount: 0,
        booksCount: 0,
        ordersCount: 0,
      };
      state.sellers = [];
      state.customers = [];
      state.pagination = { total: 0, page: 1, limit: 10, totalPages: 0 };
    },
  },
  extraReducers: (builder) => {
    // Dashboard stats
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchDashboardStats.fulfilled,
        (state, action: PayloadAction<DashboardStats>) => {
          state.loading = false;
          state.stats = action.payload;
        }
      )
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Sellers
    builder
      .addCase(fetchSellers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellers.fulfilled, (state, action: PayloadAction<FetchUsersResponse>) => {
        state.loading = false;
        state.sellers = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchSellers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Customers
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action: PayloadAction<FetchUsersResponse>) => {
        state.loading = false;
        state.customers = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetAdminState } = adminSlice.actions;
export default adminSlice.reducer;
