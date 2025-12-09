"use client";

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/utils/api";
import Cookies from "js-cookie";
import type { AxiosResponse } from "axios";

/* ------------------------- TYPES ------------------------- */

export interface OrderAddress {
  _id: string;
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
  status?: string;
  cancelledAt?: string | null;
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

/* ------------------------- INITIAL STATE ------------------------- */

interface OrdersState {
  placing: boolean;
  placeError: string | null;
  lastPlacedMessage: string | null;

  userOrders: Order[];
  userOrdersLoading: boolean;
  userOrdersError: string | null;

  sellerOrders: Order[];
  sellerOrdersLoading: boolean;
  sellerOrdersError: string | null;

  selectedSellerOrder: Order | null;
  selectedSellerOrderLoading: boolean;
  selectedSellerOrderError: string | null;

  savedAddresses: OrderAddress[] | null;
  addressLoading: boolean;
  addressError: string | null;

  loading: boolean; // generic loading for status updates
  error: string | null; // generic error for status updates
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

  savedAddresses: null,
  addressLoading: false,
  addressError: null,

  loading: false,
  error: null,
};



export const fetchAddressThunk = createAsyncThunk<
  { addresses: OrderAddress[] },
  void,
  { rejectValue: string }
>("orders/fetchAddress", async (_, { rejectWithValue }) => {
  try {
    const token = Cookies.get("accessToken");
    if (!token) return rejectWithValue("No token found");

    const { data } = await api.get("/api/orders/address", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { addresses: data.addresses };
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message || "Failed to fetch addresses");
  }
});

export const saveAddressThunk = createAsyncThunk<
  { addresses: OrderAddress[] },
  { addressId?: string; updatedAddress: OrderAddress },
  { rejectValue: string }
>("orders/saveAddress", async ({ addressId, updatedAddress }, { rejectWithValue }) => {
  try {
    const token = Cookies.get("accessToken");
    if (!token) return rejectWithValue("No token found");

    const { data } = await api.patch("/api/orders/updateaddress", { addressId, updatedAddress }, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { addresses: data.addresses };
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message || "Failed to save address");
  }
});

export const addAddressThunk = createAsyncThunk<
  { addresses: OrderAddress[] },
  { newAddress: Omit<OrderAddress, "_id"> },
  { rejectValue: string }
>("orders/addAddress", async ({ newAddress }, { rejectWithValue }) => {
  try {
    const token = Cookies.get("accessToken");
    if (!token) return rejectWithValue("No token found");

    const { data } = await api.post("/api/orders/addaddress", newAddress, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { addresses: data.addresses };
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message || "Failed to add address");
  }
});

export const deleteAddressThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("orders/deleteAddress", async (addressId, { rejectWithValue }) => {
  try {
    const token = Cookies.get("accessToken");
    if (!token) return rejectWithValue("No token found");

    await api.delete(`/api/orders/deleteaddress/${addressId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return addressId;
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message || "Failed to delete address");
  }
});



// ---------- Place Order ----------
export const placeOrderThunk = createAsyncThunk<PlaceOrderResponse, PlaceOrderPayload, { rejectValue: string }>(
  "orders/placeOrder",
  async (payload, { rejectWithValue }) => {
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
  }
);

// ---------- Fetch User Orders ----------
export const fetchUserOrdersThunk = createAsyncThunk<OrdersListResponse, void, { rejectValue: string }>(
  "orders/fetchUserOrders",
  async (_, { rejectWithValue }) => {
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
  }
);

// ---------- Fetch Seller Orders ----------
export const fetchSellerOrdersThunk = createAsyncThunk<OrdersListResponse, void, { rejectValue: string }>(
  "orders/fetchSellerOrders",
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get("accessToken");
      if (!token) return rejectWithValue("No token found");

      const { data } = await api.get("/api/orders/sellerorder", {
        headers: { Authorization: `Bearer ${token}` },
      });

      return data;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || "Failed to fetch seller orders");
    }
  }
);

// ---------- Update Order Item Status (cancel/dispatched/delivered) ----------
export const updateOrderItemStatusThunk = createAsyncThunk<
  OrderDetailResponse,
  { orderId: string; itemId: string; action: string },
  { rejectValue: string }
>(
  "orders/updateOrderItemStatus",
  async ({ orderId, itemId, action }, { rejectWithValue }) => {
    try {
      const token = Cookies.get("accessToken");
      if (!token) return rejectWithValue("No token found");

      const { data } = await api.patch(
        `/api/orders/updatestatus/${orderId}/${itemId}`,
        { action },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return data;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || "Failed to update item status");
    }
  }
);

// ---------- Fetch Seller Order Details ----------
export const fetchSellerOrderDetailsThunk = createAsyncThunk<OrderDetailResponse, string, { rejectValue: string }>(
  "orders/fetchSellerOrderDetails",
  async (orderId, { rejectWithValue }) => {
    try {
      const token = Cookies.get("accessToken");
      if (!token) return rejectWithValue("No token found");

      const { data } = await api.get(`/api/orders/sellerorderdetail/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return data;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || "Failed to fetch order details");
    }
  }
);

/* ------------------------- SLICE ------------------------- */

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
    // ---------- Address reducers ----------
    builder
      .addCase(fetchAddressThunk.pending, (state) => { state.addressLoading = true; state.addressError = null; })
      .addCase(fetchAddressThunk.fulfilled, (state, action) => { state.addressLoading = false; state.savedAddresses = action.payload.addresses; })
      .addCase(fetchAddressThunk.rejected, (state, action) => { state.addressLoading = false; state.addressError = action.payload || "Failed to fetch addresses"; });

    builder
      .addCase(saveAddressThunk.pending, (state) => { state.addressLoading = true; state.addressError = null; })
      .addCase(saveAddressThunk.fulfilled, (state, action) => { state.addressLoading = false; state.savedAddresses = action.payload.addresses; })
      .addCase(saveAddressThunk.rejected, (state, action) => { state.addressLoading = false; state.addressError = action.payload || "Failed to save address"; });

    builder
      .addCase(addAddressThunk.pending, (state) => { state.addressLoading = true; state.addressError = null; })
      .addCase(addAddressThunk.fulfilled, (state, action) => { state.addressLoading = false; state.savedAddresses = action.payload.addresses; })
      .addCase(addAddressThunk.rejected, (state, action) => { state.addressLoading = false; state.addressError = action.payload || "Failed to add address"; });

    builder
      .addCase(deleteAddressThunk.pending, (state) => { state.addressLoading = true; state.addressError = null; })
      .addCase(deleteAddressThunk.fulfilled, (state, action: PayloadAction<string>) => {
        state.addressLoading = false;
        if (state.savedAddresses) state.savedAddresses = state.savedAddresses.filter(a => a._id !== action.payload);
      })
      .addCase(deleteAddressThunk.rejected, (state, action) => { state.addressLoading = false; state.addressError = action.payload || "Failed to delete address"; });

    // ---------- Place order ----------
  builder
  .addCase(placeOrderThunk.pending, (state) => { state.placing = true; state.placeError = null; state.lastPlacedMessage = null; })
  .addCase(placeOrderThunk.fulfilled, (state, action) => {
    state.placing = false;
    state.lastPlacedMessage = action.payload.message;
    // IMPORTANT: do NOT add action.payload.order.address into savedAddresses here.
  })
  .addCase(placeOrderThunk.rejected, (state, action) => { state.placing = false; state.placeError = action.payload || "Failed to place order"; });
    // ---------- User orders ----------
    builder
      .addCase(fetchUserOrdersThunk.pending, (state) => { state.userOrdersLoading = true; state.userOrdersError = null; })
      .addCase(fetchUserOrdersThunk.fulfilled, (state, action) => { state.userOrdersLoading = false; state.userOrders = action.payload.orders; })
      .addCase(fetchUserOrdersThunk.rejected, (state, action) => { state.userOrdersLoading = false; state.userOrdersError = action.payload || "Failed to fetch user orders"; });

    // ---------- Seller orders ----------
    builder
      .addCase(fetchSellerOrdersThunk.pending, (state) => { state.sellerOrdersLoading = true; state.sellerOrdersError = null; })
      .addCase(fetchSellerOrdersThunk.fulfilled, (state, action) => { state.sellerOrdersLoading = false; state.sellerOrders = action.payload.orders; })
      .addCase(fetchSellerOrdersThunk.rejected, (state, action) => { state.sellerOrdersLoading = false; state.sellerOrdersError = action.payload || "Failed to fetch seller orders"; });

    // ---------- Update order item status ----------
    builder.addCase(updateOrderItemStatusThunk.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(updateOrderItemStatusThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;

      const updatedOrder = action.payload.order;
      state.userOrders = state.userOrders.map(o => o._id === updatedOrder._id ? updatedOrder : o);
      state.sellerOrders = state.sellerOrders.map(o => o._id === updatedOrder._id ? updatedOrder : o);
      if (state.selectedSellerOrder?._id === updatedOrder._id) state.selectedSellerOrder = updatedOrder;
    });
    builder.addCase(updateOrderItemStatusThunk.rejected, (state, action) => { state.loading = false; state.error = action.payload || "Failed to update item status"; });

    // ---------- Selected seller order details ----------
    builder
      .addCase(fetchSellerOrderDetailsThunk.pending, (state) => { state.selectedSellerOrderLoading = true; state.selectedSellerOrderError = null; })
      .addCase(fetchSellerOrderDetailsThunk.fulfilled, (state, action) => { state.selectedSellerOrderLoading = false; state.selectedSellerOrder = action.payload.order; })
      .addCase(fetchSellerOrderDetailsThunk.rejected, (state, action) => { state.selectedSellerOrderLoading = false; state.selectedSellerOrderError = action.payload || "Failed to fetch order details"; });
  },
});

export const { clearOrderState, clearSelectedSellerOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
