"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/api";

export interface Book {
  _id: string;
  title: string;
  author: string;
  image: string[];
  genre: string;
  prize: number;
  createdAt: string;
}

interface HomeState {
  newBooks: Book[];
  bestSellerBooks: Book[];
  loadingNew: boolean;
  loadingBest: boolean;
  errorNew: string | null;
  errorBest: string | null;
}

const initialState: HomeState = {
  newBooks: [],
  bestSellerBooks: [],
  loadingNew: false,
  loadingBest: false,
  errorNew: null,
  errorBest: null,
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

export const getHomeBooksThunk = createAsyncThunk<
  { newBooks: Book[]; bestSellerBooks: Book[] },
  void,
  { rejectValue: string }
>("home/getHomeBooks", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/api/user/gethomebooks");
    const data = response.data as unknown;

    const payload = (data as { newBooks?: Book[]; bestSellers?: Book[] | undefined }) ?? {};

    return {
      newBooks: Array.isArray(payload.newBooks) ? payload.newBooks : [],
      bestSellerBooks: Array.isArray(payload.bestSellers) ? payload.bestSellers : [],
    };
  } catch (err: unknown) {
    return rejectWithValue(extractErrorMessage(err) || "Failed to fetch home books");
  }
});

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    clearHomeState: (state) => {
      state.newBooks = [];
      state.bestSellerBooks = [];
      state.errorNew = null;
      state.errorBest = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getHomeBooksThunk.pending, (state) => {
        state.loadingNew = true;
        state.loadingBest = true;
        state.errorNew = null;
        state.errorBest = null;
      })
      .addCase(getHomeBooksThunk.fulfilled, (state, action) => {
        state.loadingNew = false;
        state.loadingBest = false;
        state.newBooks = action.payload.newBooks;
        state.bestSellerBooks = action.payload.bestSellerBooks;
      })
      .addCase(getHomeBooksThunk.rejected, (state, action) => {
        state.loadingNew = false;
        state.loadingBest = false;
        state.errorNew = action.payload || "Failed to load new books";
        state.errorBest = action.payload || "Failed to load best sellers";
      });
  },
});

export const { clearHomeState } = homeSlice.actions;
export default homeSlice.reducer;
