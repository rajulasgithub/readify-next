"use client";

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/utils/api";
import Cookies from "js-cookie";

export interface WishlistItem {
  bookId: string;
  title: string;
  description: string;
  excerpt?: string;
  page_count: number;
  publish_date: string;
  author: string;
  genre: string;
  language: string;
  prize: number;
  category: string;
  image: string | string[];
}

interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
  success: boolean;

  totalPages: number;
  currentPage: number;
  totalItems: number;
}

const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
  success: false,

  totalPages: 1,
  currentPage: 1,
  totalItems: 0,
};

const getToken = () => {
  if (typeof window === "undefined") return null;
  return Cookies.get("accessToken") || null;
};

const extractErrorMessage = (err: unknown): string => {
  if (!err) return "Unknown error";
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message;

  try {
    const possible = err as { response?: { data?: { message?: unknown } }; message?: unknown };
    const maybe = possible.response?.data?.message ?? possible.message;
    if (typeof maybe === "string" && maybe.length > 0) return maybe;
    const str = JSON.stringify(err);
    if (str && str !== "{}") return str;
  } catch {
  }
  return "Unknown error";
};

interface FetchWishlistResponse {
  items: WishlistItem[];
  totalPages: number;
  currentPage: number;
}

export const fetchWishlist = createAsyncThunk<
  FetchWishlistResponse,
  { page: number; limit: number },
  { rejectValue: string }
>("wishlist/fetchWishlist", async ({ page, limit }, { rejectWithValue }) => {
  try {
    const token = getToken();
    if (!token) return rejectWithValue("No token found");

    const res = await api.get("/api/wishlist/getallwishlistitem", {
      headers: { Authorization: `Bearer ${token}` },
      params: { page, limit },
    });

    return {
      items: (res.data.data as WishlistItem[]) || [],
      totalPages: Number(res.data.totalPages ?? 1),
      currentPage: Number(res.data.currentPage ?? page),
    };
  } catch (err: unknown) {
    return rejectWithValue(extractErrorMessage(err) || "Failed to fetch wishlist");
  }
});

export const addToWishlist = createAsyncThunk<void, string, { rejectValue: string }>(
  "wishlist/addToWishlist",
  async (bookId, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) return rejectWithValue("No token found");

      await api.post(`/api/wishlist/addtowishlist/${bookId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
    } catch (err: unknown) {
      return rejectWithValue(extractErrorMessage(err) || "Failed to add to wishlist");
    }
  }
);

export const removeFromWishlist = createAsyncThunk<string, string, { rejectValue: string }>(
  "wishlist/removeFromWishlist",
  async (bookId, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) return rejectWithValue("No token found");

      await api.delete(`/api/wishlist/removewishlistitem/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return bookId;
    } catch (err: unknown) {
      return rejectWithValue(extractErrorMessage(err) || "Failed to remove from wishlist");
    }
  }
);

export const clearWishlist = createAsyncThunk<void, void, { rejectValue: string }>(
  "wishlist/clearWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) return rejectWithValue("No token found");

      await api.delete("/api/wishlist/clearwishlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err: unknown) {
      return rejectWithValue(extractErrorMessage(err) || "Failed to clear wishlist");
    }
  }
);

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    resetWishlistState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    // FETCH
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchWishlist.fulfilled, (state, action: PayloadAction<FetchWishlistResponse>) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.success = true;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || "Failed to fetch wishlist";
        state.items = [];
      });

    // ADD
    builder
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addToWishlist.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || "Failed to add to wishlist";
      });

    // REMOVE
    builder
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.success = true;
        state.items = state.items.filter((item) => item.bookId !== action.payload);
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || "Failed to remove from wishlist";
      });

    // CLEAR
    builder
      .addCase(clearWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(clearWishlist.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.items = [];
        state.totalPages = 1;
        state.currentPage = 1;
      })
      .addCase(clearWishlist.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || "Failed to clear wishlist";
      });
  },
});

export const { resetWishlistState } = wishlistSlice.actions;

export default wishlistSlice.reducer;
