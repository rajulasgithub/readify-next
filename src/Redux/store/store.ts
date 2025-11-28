"use client";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";

// --- Configure store ---
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

// --- Infer the `RootState` and `AppDispatch` types ---
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
