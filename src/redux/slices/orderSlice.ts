"use client";

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/utils/api";
import Cookies from "js-cookie";


export interface OrderAddress {
  _id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  pinCode: string;
}

export interface Book {
  _id: string;
  title: string;
  price?: number;
  image:string;
}

export interface OrderItem {
  _id: string;
  book: Book; 
  quantity: number;
  orderedAt?: string;
  price: number;
  status?: string;
  cancelledAt?: string | null;
  
}

interface OrderItemApi {
  _id: string;
  items: {
    _id: string;      // ✅ itemId
    quantity: number;
    price: number;
    status?: string;
    cancelledAt?: string | null;
  };
  createdAt: string;
  book: Book;
}



export interface OrderUser {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
}

export interface Order {
  _id: string;
  user: OrderUser; 
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

export interface OrdersListResponse {
  message: string;
  orders: Order[];

   orderItems: OrderItemApi[];
  page?: number;
  limit?: number;
  totalPages?: number;
  totalOrders?: number;
   totalItems?: number;     
}

interface OrderDetailResponse {
  message: string;
  order: Order;
}


interface PaginationState {
  page: number;
  limit: number;
  totalPages: number;
  totalOrders: number;
  totalItems: number;
}


interface OrdersState {
  placing: boolean;
  placeError: string | null;
  lastPlacedMessage: string | null;

  userOrders: Order[];
  userOrdersLoading: boolean;
  userOrdersError: string | null;
  pagination: PaginationState | null;

  sellerOrders: Order[];
  sellerOrdersLoading: boolean;
  sellerOrdersError: string | null;

  selectedSellerOrder: Order | null;
  selectedSellerOrderLoading: boolean;
  selectedSellerOrderError: string | null;

  savedAddresses: OrderAddress[] | null;
  addressLoading: boolean;
  addressError: string | null;

  loading: boolean; 
  error: string | null; 
}

const initialState: OrdersState = {
  placing: false,
  placeError: null,
  lastPlacedMessage: null,

  userOrders: [],
  userOrdersLoading: false,
  userOrdersError: null,
  pagination: null,

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


export const fetchAddressThunk = createAsyncThunk<
  { addresses: OrderAddress[] },
  void,
  { rejectValue: string }
>("orders/fetchAddress", async (_, { rejectWithValue }) => {
  try {
    const token = Cookies.get("accessToken");
    if (!token) return rejectWithValue("No token found");

    const res = await api.get("/api/orders/address", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { addresses: (res.data?.addresses as OrderAddress[]) ?? [] };
  } catch (err: unknown) {
    return rejectWithValue(extractErrorMessage(err) || "Failed to fetch addresses");
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

    const res = await api.patch("/api/orders/updateaddress", { addressId, updatedAddress }, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { addresses: (res.data?.addresses as OrderAddress[]) ?? [] };
  } catch (err: unknown) {
    return rejectWithValue(extractErrorMessage(err) || "Failed to save address");
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

    const res = await api.post("/api/orders/addaddress", newAddress, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { addresses: (res.data?.addresses as OrderAddress[]) ?? [] };
  } catch (err: unknown) {
    return rejectWithValue(extractErrorMessage(err) || "Failed to add address");
  }
});

export const deleteAddressThunk = createAsyncThunk<string, string, { rejectValue: string }>(
  "orders/deleteAddress",
  async (addressId, { rejectWithValue }) => {
    try {
      const token = Cookies.get("accessToken");
      if (!token) return rejectWithValue("No token found");

      await api.delete(`/api/orders/deleteaddress/${addressId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return addressId;
    } catch (err: unknown) {
      return rejectWithValue(extractErrorMessage(err) || "Failed to delete address");
    }
  }
);

export const placeOrderThunk = createAsyncThunk<PlaceOrderResponse, PlaceOrderPayload, { rejectValue: string }>(
  "orders/placeOrder",
  async (payload, { rejectWithValue }) => {
    try {
      const token = Cookies.get("accessToken");
      if (!token) return rejectWithValue("No token found");

      const res = await api.post("/api/orders/orderitems", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data as PlaceOrderResponse;
    } catch (err: unknown) {
      return rejectWithValue(extractErrorMessage(err) || "Failed to place order");
    }
  }
);

export const fetchUserOrdersThunk = createAsyncThunk<
  OrdersListResponse,
  { page: number; limit: number },
  { rejectValue: string }
>(
  "orders/fetchUserOrders",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const token = Cookies.get("accessToken");
      if (!token) return rejectWithValue("No token found");

      const res = await api.get("/api/orders/getallorder", {
        params: { page, limit },
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data as OrdersListResponse;
    } catch (err: unknown) {
      return rejectWithValue(extractErrorMessage(err) || "Failed to fetch user orders");
    }
  }
);

export const fetchSellerOrdersThunk = createAsyncThunk<OrdersListResponse, void, { rejectValue: string }>(
  "orders/fetchSellerOrders",
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get("accessToken");
      if (!token) return rejectWithValue("No token found");

      const res = await api.get("/api/orders/sellerorder", {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data as OrdersListResponse;
    } catch (err: unknown) {
      return rejectWithValue(extractErrorMessage(err) || "Failed to fetch seller orders");
    }
  }
);

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

      const res = await api.patch(
        `/api/orders/updatestatus/${orderId}/${itemId}`,
        { action },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return res.data as OrderDetailResponse;
    } catch (err: unknown) {
      return rejectWithValue(extractErrorMessage(err) || "Failed to update item status");
    }
  }
);

export const fetchSellerOrderDetailsThunk = createAsyncThunk<OrderDetailResponse, string, { rejectValue: string }>(
  "orders/fetchSellerOrderDetails",
  async (orderId, { rejectWithValue }) => {
    try {
      const token = Cookies.get("accessToken");
      if (!token) return rejectWithValue("No token found");

      const res = await api.get(`/api/orders/sellerorderdetail/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data as OrderDetailResponse;
    } catch (err: unknown) {
      return rejectWithValue(extractErrorMessage(err) || "Failed to fetch order details");
    }
  }
);


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

    builder
      .addCase(placeOrderThunk.pending, (state) => { state.placing = true; state.placeError = null; state.lastPlacedMessage = null; })
      .addCase(placeOrderThunk.fulfilled, (state, action) => {
        state.placing = false;
        state.lastPlacedMessage = action.payload.message;
      })

      .addCase(placeOrderThunk.rejected, (state, action) => { state.placing = false; state.placeError = action.payload || "Failed to place order"; });

    builder.addCase(fetchUserOrdersThunk.pending, (state) => {
  state.userOrdersLoading = true;
  state.userOrdersError = null;
});

builder.addCase(
  fetchUserOrdersThunk.fulfilled,
  (state, action: PayloadAction<OrdersListResponse>) => {
    state.userOrdersLoading = false;

    const orderItems: OrderItemApi[] = action.payload.orderItems ?? [];

    const emptyUser: OrderUser = {
      _id: "",
      firstName: "",
      lastName: "",
    };

    const emptyAddress: OrderAddress = {
      _id: "",
      fullName: "",
      phone: "",
      addressLine1: "",
      addressLine2: null,
      city: "",
      state: "",
      pinCode: "",
    };

    state.userOrders = orderItems.map((oi) => ({
      _id: oi._id,
      user: emptyUser,
      items: [
        {
          _id: oi.items._id,
          book: oi.book,
          quantity: oi.items.quantity,
          price: oi.items.price,
          status: oi.items.status ?? "ordered",
          cancelledAt: oi.items.cancelledAt ?? null,
        },
      ],
      totalQty: oi.items.quantity,
      totalAmount: oi.items.price * oi.items.quantity,
      address: emptyAddress,
      paymentMethod: "cod",
      status: oi.items.status ?? "ordered",
      paymentStatus: "paid",
      createdAt: oi.createdAt,
      updatedAt: oi.createdAt,
      cancelledAt: oi.items.cancelledAt ?? null,
    }));

    state.pagination = {
      page: action.payload.page ?? 1,
      limit: action.payload.limit ?? 8,
      totalPages: action.payload.totalPages ?? 1,
      totalOrders: action.payload.totalItems ?? state.userOrders.length,
      totalItems: action.payload.totalItems ?? state.userOrders.length,
    };
  }
);



builder.addCase(fetchUserOrdersThunk.rejected, (state, action) => {
  state.userOrdersLoading = false;
  state.userOrdersError = action.payload || "Failed to fetch user orders";
});

    builder
      .addCase(fetchSellerOrdersThunk.pending, (state) => { state.sellerOrdersLoading = true; state.sellerOrdersError = null; })
      .addCase(fetchSellerOrdersThunk.fulfilled, (state, action) => { state.sellerOrdersLoading = false; state.sellerOrders = action.payload.orders; })
      .addCase(fetchSellerOrdersThunk.rejected, (state, action) => { state.sellerOrdersLoading = false; state.sellerOrdersError = action.payload || "Failed to fetch seller orders"; });

    builder.addCase(updateOrderItemStatusThunk.pending, (state) => { state.loading = true; state.error = null; });
   builder.addCase(updateOrderItemStatusThunk.fulfilled, (state, action) => {
  state.loading = false;

  const updated = action.payload.order;

  state.userOrders = state.userOrders.map(order => {
    if (order._id !== updated._id) return order;

    return {
      ...order,
      status: updated.status,
      cancelledAt: updated.cancelledAt ?? null,
      items: order.items.map(item => ({
        ...item,
        status: updated.status,
        cancelledAt: updated.cancelledAt ?? null,
      })),
    };
  });
});
    builder.addCase(updateOrderItemStatusThunk.rejected, (state, action) => { state.loading = false; state.error = action.payload || "Failed to update item status"; });

  
    builder
      .addCase(fetchSellerOrderDetailsThunk.pending, (state) => { state.selectedSellerOrderLoading = true; state.selectedSellerOrderError = null; })
      .addCase(fetchSellerOrderDetailsThunk.fulfilled, (state, action) => { state.selectedSellerOrderLoading = false; state.selectedSellerOrder = action.payload.order; })
      .addCase(fetchSellerOrderDetailsThunk.rejected, (state, action) => { state.selectedSellerOrderLoading = false; state.selectedSellerOrderError = action.payload || "Failed to fetch order details"; });
  },
});

export const { clearOrderState, clearSelectedSellerOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
