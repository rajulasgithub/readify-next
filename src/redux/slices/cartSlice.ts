"use client";

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/utils/api";
import Cookies from "js-cookie";


export interface CartItem {
  bookId: string;
  title: string;
  prize: number;
  genre: string;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
  success: boolean;

  totalQuantity: number;
  totalPrice: number;
  pagination?: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
  };
}

const CART_STORAGE_KEY = "book_app_cart_v1";

function loadCartFromStorage(): { items: CartItem[]; totalQuantity: number; totalPrice: number } | null {
  try {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error("loadCartFromStorage error:", e);
    return null;
  }
}

function saveCartToStorage(cartState: { items: CartItem[]; totalQuantity: number; totalPrice: number }) {
  try {
    if (typeof window === "undefined") return;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartState));
  } catch (e) {
    console.error("saveCartToStorage error:", e);
  }
}

function clearCartFromStorage() {
  try {
    if (typeof window === "undefined") return;
    localStorage.removeItem(CART_STORAGE_KEY);
  } catch (e) {
    console.error("clearCartFromStorage error:", e);
  }
}


const persistedCart = loadCartFromStorage();

const initialState: CartState = persistedCart
  ? {
      items: persistedCart.items,
      loading: false,
      error: null,
      success: false,
      totalQuantity: persistedCart.totalQuantity,
      totalPrice: persistedCart.totalPrice,
      pagination: undefined,
    }
  : {
      items: [],
      loading: false,
      error: null,
      success: false,
      totalQuantity: 0,
      totalPrice: 0,
    };


const getToken = () => {
  if (typeof window === "undefined") return null;
  return Cookies.get("accessToken") || null;
};

const recalcTotals = (state: CartState) => {
  let qty = 0;
  let total = 0;

  state.items.forEach((item) => {
    qty += item.quantity;
    total += item.prize * item.quantity;
  });

  state.totalQuantity = qty;
  state.totalPrice = total;
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
    // ignore
  }

  return "Unknown error";
};

/* ------------------------- THUNKS ------------------------- */

export const fetchCartItems = createAsyncThunk<
  { items: CartItem[]; totalItems: number; totalPages: number; currentPage: number },
  { page: number; limit: number },
  { rejectValue: string }
>("cart/fetchCartItems", async ({ page, limit }, { rejectWithValue }) => {
  try {
    const token = getToken();
    if (!token) return rejectWithValue("No token found");

    const res = await api.get("/api/cart/getallcartitems", {
      headers: { Authorization: `Bearer ${token}` },
      params: { page, limit },
    });

    return {
      items: res.data.data || [],
      totalItems: res.data.pagination?.totalItems || 0,
      totalPages: res.data.pagination?.totalPages || 1,
      currentPage: res.data.pagination?.currentPage || page,
    };
  } catch (err: unknown) {
    return rejectWithValue(extractErrorMessage(err) || "Failed to fetch cart items");
  }
});

export const addToCart = createAsyncThunk<void, string, { rejectValue: string }>(
  "cart/addToCart",
  async (bookId, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) return rejectWithValue("No token found");

      await api.post(
        `/api/cart/addtocart/${bookId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err: unknown) {
      return rejectWithValue(extractErrorMessage(err) || "Failed to add item to cart");
    }
  }
);

export const removeCartItem = createAsyncThunk<string, string, { rejectValue: string }>(
  "cart/removeCartItem",
  async (bookId, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) return rejectWithValue("No token found");

      await api.delete(`/api/cart/deletecartitem/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return bookId;
    } catch (err: unknown) {
      return rejectWithValue(extractErrorMessage(err) || "Failed to remove item from cart");
    }
  }
);

export const clearCart = createAsyncThunk<void, void, { rejectValue: string }>(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) return rejectWithValue("No token found");

      await api.delete("/api/cart/clearcartitem", {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err: unknown) {
      return rejectWithValue(extractErrorMessage(err) || "Failed to clear cart");
    }
  }
);

export const updateCartQuantity = createAsyncThunk<
  { bookId: string; quantity: number },
  { bookId: string; quantity: number },
  { rejectValue: string }
>("cart/updateCartQuantity", async ({ bookId, quantity }, { rejectWithValue }) => {
  try {
    const token = getToken();
    if (!token) return rejectWithValue("No token found");

    await api.patch(
      `/api/cart/updatecart/${bookId}`,
      { quantity },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return { bookId, quantity };
  } catch (err: unknown) {
    return rejectWithValue(extractErrorMessage(err) || "Failed to update quantity");
  }
});


export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetCartState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
   
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        fetchCartItems.fulfilled,
        (state, action: PayloadAction<{
          items: CartItem[];
          totalItems: number;
          totalPages: number;
          currentPage: number;
        }>) => {
          state.loading = false;
          state.items = action.payload.items;
          recalcTotals(state);
          state.pagination = {
            totalItems: action.payload.totalItems,
            totalPages: action.payload.totalPages,
            currentPage: action.payload.currentPage,
          };
          state.success = true;
          saveCartToStorage({ items: state.items, totalQuantity: state.totalQuantity, totalPrice: state.totalPrice });
        }
      )
      .addCase(fetchCartItems.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || "Failed to fetch cart items";

        if (typeof action.payload === "string" && action.payload.toLowerCase().includes("cart is empty")) {
          state.items = [];
          recalcTotals(state);
          saveCartToStorage({ items: state.items, totalQuantity: state.totalQuantity, totalPrice: state.totalPrice });
        }
      });

    // ADD TO CART
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addToCart.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        
      })
      .addCase(addToCart.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || "Failed to add item to cart";
      });

    // REMOVE ITEM
    builder
      .addCase(removeCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(removeCartItem.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.success = true;
        state.items = state.items.filter((item) => item.bookId !== action.payload);
        recalcTotals(state);
        saveCartToStorage({ items: state.items, totalQuantity: state.totalQuantity, totalPrice: state.totalPrice });
      })
      .addCase(removeCartItem.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || "Failed to remove item from cart";
      });

    // CLEAR CART
    builder
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.items = [];
        recalcTotals(state);
        clearCartFromStorage();
      })
      .addCase(clearCart.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || "Failed to clear cart";
      });

    // UPDATE QUANTITY
    builder
      .addCase(updateCartQuantity.pending, (state) => {
        state.error = null;
        state.success = false;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action: PayloadAction<{ bookId: string; quantity: number }>) => {
        state.loading = false;
        state.success = true;
        const { bookId, quantity } = action.payload;
        const item = state.items.find((i) => i.bookId === bookId);
        if (item) {
          item.quantity = quantity;
        }
        recalcTotals(state);
        saveCartToStorage({ items: state.items, totalQuantity: state.totalQuantity, totalPrice: state.totalPrice });
      })
      .addCase(updateCartQuantity.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || "Failed to update quantity";
      });
  },
});

export const { resetCartState } = cartSlice.actions;

export default cartSlice.reducer;
