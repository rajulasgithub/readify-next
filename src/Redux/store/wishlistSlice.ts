"use client";

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/src/components/api";

/*
getAllWishList returns each item mapped as:

{
  bookId: item.book._id,
  title: item.book.title,
  description: item.book.description,
  excerpt: item.book.excerpt,
  page_count: item.book.page_count,
  publish_date: item.book.publish_date,
  author: item.book.author,
  genre: item.book.genre,
  language: item.book.language,
  prize: item.book.prize,
  category: item.book.category,
  image: item.book.image,
}

*/

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
  image: string | string[]; // in case Book.image is array
}

interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
  success: false,
};

// helper for token
const getToken = () => localStorage.getItem("accessToken");

 

// 1️⃣ Get all wishlist items
export const fetchWishlist = createAsyncThunk<
  WishlistItem[],
  void,
  { rejectValue: string }
>("wishlist/fetchWishlist", async (_, { rejectWithValue }) => {
  try {
    const token = getToken();
    if (!token) return rejectWithValue("No token found");

    const res = await api.get("/api/wishlist/getallwishlistitem", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data.data || [];
  } catch (err: any) {
    // treat "Wishlist is Empty" as empty list
    if (
      err.response?.status === 400 &&
      typeof err.response?.data?.message === "string" &&
      err.response.data.message.toLowerCase().includes("wishlist is empty")
    ) {
      return [] as WishlistItem[];
    }

    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch wishlist"
    );
  }
});


export const addToWishlist = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>("wishlist/addToWishlist", async (bookId, { rejectWithValue }) => {
  try {
    const token = getToken();
    if (!token) return rejectWithValue("No token found");

    await api.post(
      `/api/wishlist/addtowishlist/${bookId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

  
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to add to wishlist"
    );
  }
});


export const removeFromWishlist = createAsyncThunk<
  string, 
  string,
  { rejectValue: string }
>("wishlist/removeFromWishlist", async (bookId, { rejectWithValue }) => {
  try {
    const token = getToken();
    if (!token) return rejectWithValue("No token found");

    await api.delete(`/api/wishlist/removewishlistitem/${bookId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return bookId;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to remove from wishlist"
    );
  }
});


export const clearWishlist = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("wishlist/clearWishlist", async (_, { rejectWithValue }) => {
  try {
    const token = getToken();
    if (!token) return rejectWithValue("No token found");

    await api.delete("/api/wishlist/clearwishlist", {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to clear wishlist"
    );
  }
});

/* ─────────────────────────────
   SLICE
   ───────────────────────────── */

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
      .addCase(
        fetchWishlist.fulfilled,
        (state, action: PayloadAction<WishlistItem[]>) => {
          state.loading = false;
          state.items = action.payload;
          state.success = true;
        }
      )
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error =
          (action.payload as string) || "Failed to fetch wishlist";

        if (
          typeof action.payload === "string" &&
          action.payload.toLowerCase().includes("wishlist is empty")
        ) {
          state.items = [];
        }
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
        state.error =
          (action.payload as string) || "Failed to add to wishlist";
      });

    // REMOVE
    builder
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        removeFromWishlist.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.success = true;
          state.items = state.items.filter(
            (item) => item.bookId !== action.payload
          );
        }
      )
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error =
          (action.payload as string) ||
          "Failed to remove from wishlist";
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
      })
      .addCase(clearWishlist.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error =
          (action.payload as string) ||
          "Failed to clear wishlist";
      });
  },
});

export const { resetWishlistState } = wishlistSlice.actions;

export default wishlistSlice.reducer;
