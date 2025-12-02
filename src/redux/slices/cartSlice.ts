"use client";

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/utils/api";



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
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
  success: false,
  totalQuantity: 0,
  totalPrice: 0,
};


const getToken = () => localStorage.getItem("accessToken");


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



export const fetchCartItems = createAsyncThunk<
  CartItem[],
  void,
  { rejectValue: string }
>("cart/fetchCartItems", async (_, { rejectWithValue }) => {
  try {
    const token = getToken();
    if (!token) return rejectWithValue("No token found");

    const res = await api.get("/api/cart/getallcartitems", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data.data || [];
  } catch (err: any) {
   
    if (
      err.response?.status === 400 &&
      typeof err.response?.data?.message === "string" &&
      err.response.data.message.toLowerCase().includes("cart is empty")
    ) {
      return [] as CartItem[];
    }

    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch cart items"
    );
  }
});


export const addToCart = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>("cart/addToCart", async (bookId, { rejectWithValue }) => {
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

  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to add item to cart"
    );
  }
});

export const removeCartItem = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("cart/removeCartItem", async (bookId, { rejectWithValue }) => {
  try {
    const token = getToken();
    if (!token) return rejectWithValue("No token found");

    await api.delete(`/api/cart/deletecartitem/${bookId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return bookId;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to remove item from cart"
    );
  }
});


export const clearCart = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("cart/clearCart", async (_, { rejectWithValue }) => {
  try {
    const token = getToken();
    if (!token) return rejectWithValue("No token found");

    await api.delete("/api/cart/clearcartitem", {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to clear cart"
    );
  }
});


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
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to update quantity"
    );
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
    // FETCH CART ITEMS
    builder
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        fetchCartItems.fulfilled,
        (state, action: PayloadAction<CartItem[]>) => {
          state.loading = false;
          state.items = action.payload;
          state.success = true;
          recalcTotals(state);
        }
      )
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error =
          (action.payload as string) || "Failed to fetch cart items";
       
        if (
          typeof action.payload === "string" &&
          action.payload.toLowerCase().includes("cart is empty")
        ) {
          state.items = [];
          recalcTotals(state);
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
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error =
          (action.payload as string) || "Failed to add item to cart";
      });

    // REMOVE ITEM
    builder
      .addCase(removeCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        removeCartItem.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.success = true;
          state.items = state.items.filter(
            (item) => item.bookId !== action.payload
          );
          recalcTotals(state);
        }
      )
      .addCase(removeCartItem.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error =
          (action.payload as string) || "Failed to remove item from cart";
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
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error =
          (action.payload as string) || "Failed to clear cart";
      });

    // UPDATE QUANTITY
    builder
      .addCase(updateCartQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        updateCartQuantity.fulfilled,
        (state, action: PayloadAction<{ bookId: string; quantity: number }>) => {
          state.loading = false;
          state.success = true;
          const { bookId, quantity } = action.payload;
          const item = state.items.find((i) => i.bookId === bookId);
          if (item) {
            item.quantity = quantity;
          }
          recalcTotals(state);
        }
      )
      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error =
          (action.payload as string) || "Failed to update quantity";
      });
  },
});

export const { resetCartState } = cartSlice.actions;

export default cartSlice.reducer;
