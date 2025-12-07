"use client";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import bookReducer from "./slices/bookSlice";
import cartReducer from "./slices/cartSlice";
import wishlistReducer from "./slices/wishlistSlice";
import adminReducer from "./slices/adminSlice";
import ordersReducer from "./slices/orderSlice";
import homeReducer from "./slices/homeSlice"; 


export const store = configureStore({
  reducer: {
    auth: authReducer,
    books: bookReducer,
    cart: cartReducer, 
    wishlist: wishlistReducer, 
     admin: adminReducer,
    orders: ordersReducer,
     home: homeReducer,  
  },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
