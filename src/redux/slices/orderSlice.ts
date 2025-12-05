"use client";

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/utils/api";
import Cookies from "js-cookie";
import type { AxiosResponse } from "axios";

/* ------------------------- Types / Interfaces ------------------------- */

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

/* ------------------------- Slice state ------------------------- */

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
};

/* ------------------------- THUNKS ------------------------- */

/* ---------- ADDRESS THUNKS ---------- */

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

    const { data } = await api.delete(`/api/orders/deleteaddress/${addressId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Expect backend to return { success: true, deletedId: addressId } or similar
    // But return the id so reducers can remove it locally
    return addressId;
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message || "Failed to delete address");
  }
});

/* ---------- PLACE ORDER ---------- */

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

/* ---------- FETCH USER ORDERS ---------- */

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

/* ---------- FETCH SELLER ORDERS (uses your controller) ---------- */
/**
 * Controller requires auth (req.userData) and returns:
 * { message: "...", orders: [...] }
 */
export const fetchSellerOrdersThunk = createAsyncThunk<
  OrdersListResponse,
  void,
  { rejectValue: string }
>("orders/fetchSellerOrders", async (_, { rejectWithValue }) => {
  try {
    const token = Cookies.get("accessToken");
    if (!token) return rejectWithValue("No token found");

    // NOTE: your controller route in the example was likely "/api/order/seller" or similar.
    // Using "/api/order/seller" to match previous usage — update to exact route if different.
    const { data } = await api.get("/api/orders/sellerorder", {
      headers: { Authorization: `Bearer ${token}` },
    });
  console.log(data)
    // Expect { message, orders }
    return data;
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message || "Failed to fetch seller orders");
  }
});

/* ---------- CANCEL ORDER ITEM ---------- */

export const cancelOrderThunk = createAsyncThunk<
  OrderDetailResponse,
  { orderId: string; itemId: string },
  { rejectValue: string }
>("orders/cancelOrder", async ({ orderId, itemId }, { rejectWithValue }) => {
  try {
    const token = Cookies.get("accessToken");
    if (!token) return rejectWithValue("No token found");

    const { data } = await api.patch(`/api/orders/cancelorder/${orderId}/${itemId}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return data;
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message || "Failed to cancel order");
  }
});

/* ---------- FETCH SELLER ORDER DETAILS ---------- */

export const fetchSellerOrderDetailsThunk = createAsyncThunk<
  OrderDetailResponse,
  string,
  { rejectValue: string }
>("orders/fetchSellerOrderDetails", async (orderId, { rejectWithValue }) => {
  try {
    const token = Cookies.get("accessToken");
    if (!token) return rejectWithValue("No token found");

    const { data } = await api.get(`/api/orders/sellerorderdetail/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(data)

    return data;
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message || "Failed to fetch order details");
  }
});

/* ------------------------- Slice ------------------------- */

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
    // ---------- FETCH ADDRESSES ----------
    builder
      .addCase(fetchAddressThunk.pending, (state) => {
        state.addressLoading = true;
        state.addressError = null;
      })
      .addCase(fetchAddressThunk.fulfilled, (state, action) => {
        state.addressLoading = false;
        state.savedAddresses = Array.isArray(action.payload?.addresses) ? action.payload.addresses : [];
      })
      .addCase(fetchAddressThunk.rejected, (state, action) => {
        state.addressLoading = false;
        state.addressError = action.payload || "Failed to fetch addresses";
        state.savedAddresses = state.savedAddresses ?? [];
      });

    // ---------- SAVE / UPDATE ADDRESS ----------
    builder
      .addCase(saveAddressThunk.pending, (state) => {
        state.addressLoading = true;
        state.addressError = null;
      })
      .addCase(saveAddressThunk.fulfilled, (state, action) => {
        state.addressLoading = false;
        state.savedAddresses = action.payload.addresses;
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

        if (action.payload.order) {
          const orderAddress = action.payload.order.address;
          if (state.savedAddresses) {
            const exists = state.savedAddresses.find((a) => a._id === orderAddress._id);
            if (!exists) state.savedAddresses.unshift(orderAddress);
          } else {
            state.savedAddresses = [orderAddress];
          }
        }
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

        if (action.payload.orders.length > 0) {
          const latestAddress = action.payload.orders[0].address;
          if (state.savedAddresses) {
            const exists = state.savedAddresses.find((a) => a._id === latestAddress._id);
            if (!exists) state.savedAddresses.unshift(latestAddress);
          } else {
            state.savedAddresses = [latestAddress];
          }
        }
      })
      .addCase(fetchUserOrdersThunk.rejected, (state, action) => {
        state.userOrdersLoading = false;
        state.userOrdersError = action.payload || "Failed to fetch user orders";
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
        state.sellerOrdersError = action.payload || "Failed to fetch seller orders";
      });

    // ---------- CANCEL ORDER ----------
    builder.addCase(cancelOrderThunk.fulfilled, (state, action) => {
      const updated = action.payload.order;
      state.userOrders = state.userOrders.map((o) => (o._id === updated._id ? updated : o));
      state.sellerOrders = state.sellerOrders.map((o) => (o._id === updated._id ? updated : o));
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
        state.selectedSellerOrderError = action.payload || "Failed to fetch order details";
      });

    // ---------- ADD ADDRESS ----------
    builder
      .addCase(addAddressThunk.pending, (state) => {
        state.addressLoading = true;
        state.addressError = null;
      })
      .addCase(addAddressThunk.fulfilled, (state, action) => {
        state.addressLoading = false;
        state.savedAddresses = action.payload.addresses;
      })
      .addCase(addAddressThunk.rejected, (state, action) => {
        state.addressLoading = false;
        state.addressError = action.payload || "Failed to add address";
      });

    // ---------- DELETE ADDRESS ----------
    builder
      .addCase(deleteAddressThunk.pending, (state) => {
        state.addressLoading = true;
        state.addressError = null;
      })
      .addCase(deleteAddressThunk.fulfilled, (state, action: PayloadAction<string>) => {
        state.addressLoading = false;
        const deletedId = action.payload;
        if (state.savedAddresses && Array.isArray(state.savedAddresses)) {
          state.savedAddresses = state.savedAddresses.filter((a: any) => {
            const id = a?._id ?? a?.id ?? a?.addressId ?? null;
            return id !== deletedId;
          });
        }
      })
      .addCase(deleteAddressThunk.rejected, (state, action) => {
        state.addressLoading = false;
        state.addressError = action.payload || "Failed to delete address";
      });
  },
});

export const { clearOrderState, clearSelectedSellerOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
