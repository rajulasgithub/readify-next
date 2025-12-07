"use client";

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
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



export const getHomeBooksThunk = createAsyncThunk<
  { newBooks: Book[]; bestSellerBooks: Book[] },
  void,
  { rejectValue: string }
>("home/getHomeBooks", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/api/user/gethomebooks");
    return {
      newBooks: data.newBooks || [],
      bestSellerBooks: data.bestSellers || [],
    };
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch home books");
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
