"use client";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import bookReducer from "./bookSlice";
import cartReducer from "./cartSlice";
import wishlistReducer from "./wishlistSlice";
import adminReducer from "./adminSlice";

// --- Configure store ---
export const store = configureStore({
  reducer: {
    auth: authReducer,
    books: bookReducer,
    cart: cartReducer, 
    wishlist: wishlistReducer, 
     admin: adminReducer,
  },
});

// --- Infer the `RootState` and `AppDispatch` types ---
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
