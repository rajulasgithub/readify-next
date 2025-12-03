"use client";

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/utils/api";
import Cookies from "js-cookie";

// ---- Types ----

export interface OrderAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pinCode: string;
}

export interface OrderItem {
  _id?: string;
  book: any;
  quantity: number;
  orderedAt?: string;
  price: number;
}

export interface Order {
  _id: string;
  user: any;
  items: OrderItem[];
  totalQty: number;
  totalAmount: number;
  address: OrderAddress;
  paymentMethod: "upi" | "card" | "netbanking" | "cod";
  status: string;
  cancelledAt?: string | null;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlaceOrderPayload {
  items: {
    book: string;
    quantity: number;
    price: number;
  }[];
  address: OrderAddress;
}

interface PlaceOrderResponse {
  success: boolean;
  message: string;
  order?: Order;
}

interface OrdersListResponse {
  message: string;
  orders: Order[];
}

interface OrderDetailResponse {
  message: string;
  order: Order;
}

// ---- Slice State ----

interface OrdersState {
  // place order
  placing: boolean;
  placeError: string | null;
  lastPlacedMessage: string | null;

  // user orders
  userOrders: Order[];
  userOrdersLoading: boolean;
  userOrdersError: string | null;

  // seller orders
  sellerOrders: Order[];
  sellerOrdersLoading: boolean;
  sellerOrdersError: string | null;

  // seller order details
  selectedSellerOrder: Order | null;
  selectedSellerOrderLoading: boolean;
  selectedSellerOrderError: string | null;

  // address
  savedAddress: OrderAddress | null;
  addressLoading: boolean;
  addressError: string | null;
}

const initialState: OrdersState = {
  placing: false,
  placeError: null,
  lastPlacedMessage: null,

  userOrders: [],
  userOrdersLoading: false,
  userOrdersError: null,

  sellerOrders: [],
  sellerOrdersLoading: false,
  sellerOrdersError: null,

  selectedSellerOrder: null,
  selectedSellerOrderLoading: false,
  selectedSellerOrderError: null,

  savedAddress: null,
  addressLoading: false,
  addressError: null,
};

// ---------- ADDRESS THUNKS ----------

// GET SAVED ADDRESS
export const fetchAddressThunk = createAsyncThunk<
  { address: OrderAddress },
  void,
  { rejectValue: string }
>("orders/fetchAddress", async (_, { rejectWithValue }) => {
  try {
    const token = Cookies.get("accessToken");
    if (!token) return rejectWithValue("No token found");

    const { data } = await api.get("/api/user/address", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return data;
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message || "Failed to fetch address"
    );
  }
});

// SAVE / UPDATE ADDRESS
export const saveAddressThunk = createAsyncThunk<
  { address: OrderAddress },
  OrderAddress,
  { rejectValue: string }
>("orders/saveAddress", async (address, { rejectWithValue }) => {
  try {
    const token = Cookies.get("accessToken");
    if (!token) return rejectWithValue("No token found");

    const { data } = await api.post(
      "/api/user/address",
      { address },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return data;
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message || "Failed to save address"
    );
  }
});

// ---------- ORDER THUNKS ----------

// PLACE ORDER
export const placeOrderThunk = createAsyncThunk<
  PlaceOrderResponse,
  PlaceOrderPayload,
  { rejectValue: string }
>("orders/placeOrder", async (payload, { rejectWithValue }) => {
  try {
    const token = Cookies.get("accessToken");
    if (!token) return rejectWithValue("No token found");

    const { data } = await api.post("/api/orders/orderitems", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return data;
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message || "Failed to place order");
  }
});

// GET USER ORDERS
export const fetchUserOrdersThunk = createAsyncThunk<
  OrdersListResponse,
  void,
  { rejectValue: string }
>("orders/fetchUserOrders", async (_, { rejectWithValue }) => {
  try {
    const token = Cookies.get("accessToken");
    if (!token) return rejectWithValue("No token found");

    const { data } = await api.get("/api/orders/getallorder", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return data;
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message || "Failed to fetch user orders");
  }
});

// GET SELLER ORDERS
export const fetchSellerOrdersThunk = createAsyncThunk<
  OrdersListResponse,
  void,
  { rejectValue: string }
>("orders/fetchSellerOrders", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/api/order/seller");
    return data;
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message || "Failed to fetch seller orders");
  }
});

// CANCEL ORDER ITEM
export const cancelOrderThunk = createAsyncThunk<
  OrderDetailResponse,
  { orderId: string; itemId: string },
  { rejectValue: string }
>("orders/cancelOrder", async ({ orderId, itemId }, { rejectWithValue }) => {
  try {
    const token = Cookies.get("accessToken");
    if (!token) return rejectWithValue("No token found");

    const { data } = await api.patch(
      `/api/orders/cancelorder/${orderId}/${itemId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return data;
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message || "Failed to cancel order");
  }
});

// GET SELLER ORDER DETAILS
export const fetchSellerOrderDetailsThunk = createAsyncThunk<
  OrderDetailResponse,
  string,
  { rejectValue: string }
>("orders/fetchSellerOrderDetails", async (orderId, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/api/order/seller/${orderId}`);
    return data;
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message || "Failed to fetch order details");
  }
});

// ----------- SLICE -----------

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearOrderState: (state) => {
      state.placeError = null;
      state.lastPlacedMessage = null;
    },
    clearSelectedSellerOrder: (state) => {
      state.selectedSellerOrder = null;
      state.selectedSellerOrderError = null;
    },
  },

  extraReducers: (builder) => {
    // ---------- ADDRESS ----------
    builder
      .addCase(fetchAddressThunk.pending, (state) => {
        state.addressLoading = true;
        state.addressError = null;
      })
      .addCase(fetchAddressThunk.fulfilled, (state, action) => {
        state.addressLoading = false;
        state.savedAddress = action.payload.address;
      })
      .addCase(fetchAddressThunk.rejected, (state, action) => {
        state.addressLoading = false;
        state.addressError = action.payload || "Failed to fetch address";
      });

    builder
      .addCase(saveAddressThunk.pending, (state) => {
        state.addressLoading = true;
        state.addressError = null;
      })
      .addCase(saveAddressThunk.fulfilled, (state, action) => {
        state.addressLoading = false;
        state.savedAddress = action.payload.address;
      })
      .addCase(saveAddressThunk.rejected, (state, action) => {
        state.addressLoading = false;
        state.addressError = action.payload || "Failed to save address";
      });

    // ---------- PLACE ORDER ----------
    builder
      .addCase(placeOrderThunk.pending, (state) => {
        state.placing = true;
        state.placeError = null;
        state.lastPlacedMessage = null;
      })
      .addCase(placeOrderThunk.fulfilled, (state, action) => {
        state.placing = false;
        state.lastPlacedMessage = action.payload.message;
      })
      .addCase(placeOrderThunk.rejected, (state, action) => {
        state.placing = false;
        state.placeError = action.payload || "Failed to place order";
      });

    // ---------- USER ORDERS ----------
    builder
      .addCase(fetchUserOrdersThunk.pending, (state) => {
        state.userOrdersLoading = true;
        state.userOrdersError = null;
      })
      .addCase(fetchUserOrdersThunk.fulfilled, (state, action) => {
        state.userOrdersLoading = false;
        state.userOrders = action.payload.orders;
      })
      .addCase(fetchUserOrdersThunk.rejected, (state, action) => {
        state.userOrdersLoading = false;
        state.userOrdersError =
          action.payload || "Failed to fetch user orders";
      });

    // ---------- SELLER ORDERS ----------
    builder
      .addCase(fetchSellerOrdersThunk.pending, (state) => {
        state.sellerOrdersLoading = true;
        state.sellerOrdersError = null;
      })
      .addCase(fetchSellerOrdersThunk.fulfilled, (state, action) => {
        state.sellerOrdersLoading = false;
        state.sellerOrders = action.payload.orders;
      })
      .addCase(fetchSellerOrdersThunk.rejected, (state, action) => {
        state.sellerOrdersLoading = false;
        state.sellerOrdersError =
          action.payload || "Failed to fetch seller orders";
      });

    // ---------- CANCEL ORDER ----------
    builder
      .addCase(cancelOrderThunk.fulfilled, (state, action) => {
        const updated = action.payload.order;

        state.userOrders = state.userOrders.map((o) =>
          o._id === updated._id ? updated : o
        );

        state.sellerOrders = state.sellerOrders.map((o) =>
          o._id === updated._id ? updated : o
        );

        if (state.selectedSellerOrder?._id === updated._id) {
          state.selectedSellerOrder = updated;
        }
      });

    // ---------- SELLER ORDER DETAILS ----------
    builder
      .addCase(fetchSellerOrderDetailsThunk.pending, (state) => {
        state.selectedSellerOrderLoading = true;
        state.selectedSellerOrderError = null;
      })
      .addCase(fetchSellerOrderDetailsThunk.fulfilled, (state, action) => {
        state.selectedSellerOrderLoading = false;
        state.selectedSellerOrder = action.payload.order;
      })
      .addCase(fetchSellerOrderDetailsThunk.rejected, (state, action) => {
        state.selectedSellerOrderLoading = false;
        state.selectedSellerOrderError =
          action.payload || "Failed to fetch order details";
      });
  },
});

export const {
  clearOrderState,
  clearSelectedSellerOrder,
} = ordersSlice.actions;

export default ordersSlice.reducer;
