import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/utils/api";
import Cookies from "js-cookie";

export interface DashboardStats {
  customersCount: number;
  sellersCount: number;
  booksCount: number;
  ordersCount: number;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt?: string;
  orders?: { totalAmount: number }[];
  totalOrders: number;
  totalSpent: number;
  role?: string;
  blocked: boolean;
  image:string
}

export interface Book {
  _id: string;
  title: string;
  author: string;
  prize: number;
  category: string;
  coverImage?: string;
  createdAt: string;
  image:string
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
  sellerBooks: Book[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  actionLoading: boolean;
  actionError: string | null;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}


const getToken = () => {
  if (typeof window === "undefined") return null;
  return Cookies.get("accessToken") || null;
};


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
  }

  return "Unknown error";
};

export const fetchDashboardStats = createAsyncThunk<
  DashboardStats,
  void,
  { rejectValue: string }
>("admin/fetchDashboardStats", async (_, { rejectWithValue }) => {
  try {
    const token = getToken();
    const res = await api.get("/api/admin/dashboardstats", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data.data as DashboardStats;
  } catch (err: unknown) {
    return rejectWithValue(extractErrorMessage(err));
  }
});

export const fetchUsers = createAsyncThunk<
  FetchUsersResponse,
  { type: "seller" | "customer"; page?: number; limit?: number; search?: string },
  { rejectValue: string }
>("admin/fetchUsers", async (params, { rejectWithValue }) => {
  try {
    const token = getToken();

    const queryParams = new URLSearchParams({
      type: params.type,
      page: params.page?.toString() || "1",
      limit: params.limit?.toString() || "10",
      search: params.search || "",
    }).toString();

    const res = await api.get(`/api/admin/viewallusers?${queryParams}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    return res.data as FetchUsersResponse;
  } catch (err: unknown) {
    return rejectWithValue(extractErrorMessage(err));
  }
});

export const fetchSellerBooks = createAsyncThunk<
  { books: Book[]; pagination: Pagination },
  { id: string; page?: number; limit?: number },
  { rejectValue: string }
>(
  "admin/fetchSellerBooks",
  async ({ id, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const token = getToken();
      const res = await api.get(
        `/api/admin/sellerbooks/${id}?page=${page}&limit=${limit}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      return {
        books: res.data.data,
        pagination: res.data.pagination,
      };
    } catch (err: unknown) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);




export const toggleBlockUser = createAsyncThunk<
  { userId: string; role: "seller" | "customer" },
  { userId: string; role: "seller" | "customer" },
  { rejectValue: string }
>("admin/toggleBlockUser", async ({ userId, role }, { rejectWithValue }) => {
  try {
    const token = getToken();
    await api.patch(
      `/api/admin/blockuser/${userId}`,
      {},
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );
    return { userId, role };
  } catch (err: unknown) {
    return rejectWithValue(extractErrorMessage(err));
  }
});

export const deleteUserThunk = createAsyncThunk<
  { userId: string; role: "seller" | "customer" },
  { userId: string; role: "seller" | "customer" },
  { rejectValue: string }
>("admin/deleteUser", async ({ userId, role }, { rejectWithValue }) => {
  try {
    const token = getToken();
    await api.delete(`/api/admin/deleteuser/${userId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return { userId, role };
  } catch (err: unknown) {
    return rejectWithValue(extractErrorMessage(err));
  }
});



export const deleteBookThunk = createAsyncThunk<
  { bookId: string },
  { bookId: string },
  { rejectValue: string }
>(
  "admin/deleteBook",
  async ({ bookId }, { rejectWithValue }) => {
    try {
      const token = getToken();

      await api.patch(
        `/api/admin/deletebook/${bookId}`,
        {},
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      return { bookId };
    } catch (err: unknown) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);


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
  sellerBooks: [],
  pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
  actionLoading: false,
  actionError: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    resetAdminState: (state) => {
      state.loading = false;
      state.error = null;
      state.actionLoading = false;
      state.actionError = null;
      state.stats = {
        customersCount: 0,
        sellersCount: 0,
        booksCount: 0,
        ordersCount: 0,
      };
      state.sellers = [];
      state.customers = [];
      state.sellerBooks = [];
      state.pagination = { total: 0, page: 1, limit: 10, totalPages: 0 };
    },
    clearSellerBooks: (state) => {
      state.sellerBooks = [];
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

    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;

        if (action.meta.arg.type === "seller") {
          state.sellers = action.payload.data;
        } else {
          state.customers = action.payload.data;
        }

        state.pagination = action.payload.pagination;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
  .addCase(fetchSellerBooks.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
 .addCase(
  fetchSellerBooks.fulfilled,
  (state, action: PayloadAction<{ books: Book[]; pagination: Pagination }>) => {
    state.loading = false;
    state.sellerBooks = action.payload.books;
    state.pagination = action.payload.pagination;
  }
)
  .addCase(fetchSellerBooks.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload as string;
  });

    builder
      .addCase(toggleBlockUser.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(toggleBlockUser.fulfilled, (state, action) => {
        state.actionLoading = false;
        const { userId, role } = action.payload;
        const list = role === "seller" ? state.sellers : state.customers;
        const user = list.find((u) => u._id === userId);
        if (user) {
          user.blocked = !user.blocked;
        }
      })
      .addCase(toggleBlockUser.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload as string;
      });

    //  Delete User
    builder
      .addCase(deleteUserThunk.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(deleteUserThunk.fulfilled, (state, action) => {
        state.actionLoading = false;
        const { userId, role } = action.payload;

        if (role === "seller") {
          state.sellers = state.sellers.filter((u) => u._id !== userId);
        } else {
          state.customers = state.customers.filter((u) => u._id !== userId);
        }
      })
      .addCase(deleteUserThunk.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload as string;
      });
      // deletebook
      builder
  .addCase(deleteBookThunk.pending, (state) => {
    state.actionLoading = true;
    state.actionError = null;
  })
  .addCase(deleteBookThunk.fulfilled, (state, action) => {
    state.actionLoading = false;

    const { bookId } = action.payload;
    state.sellerBooks = state.sellerBooks.filter(
      (book) => book._id !== bookId
    );
  })
  .addCase(deleteBookThunk.rejected, (state, action) => {
    state.actionLoading = false;
    state.actionError = action.payload as string;
  });
  },
});

export const { resetAdminState, clearSellerBooks } = adminSlice.actions;
export default adminSlice.reducer;
