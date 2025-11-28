"use client";

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/src/components/api";

// ----- Types -----
interface Book {
  _id?: string;
  user?: string;
  image: string[];
  title: string;
  description: string;
  excerpt?: string;
  page_count: number;
  publish_date: string; // ISO string
  author: string;
  genre: string;
  language: string;
  prize: number;
  category: "Academic" | "Fiction" | "Non-Fiction" | "Comics" | "Children" | "Poetry";
  is_deleted?: boolean;
}

interface BookState {
  books: Book[];
  loading: boolean;
  error: string | null;
  success: boolean;
}

// ----- Initial State -----
const initialState: BookState = {
  books: [],
  loading: false,
  error: null,
  success: false,
};

// ----- Async Thunks -----
export const addBook = createAsyncThunk(
  "books/addBook",
  async (bookData: Book, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken"); 
      const res = await api.post("/api/books/addbook", bookData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data; // returned book
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Optionally, you can add fetchBooks, deleteBook, etc.

export const bookSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    resetBookState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // ADD BOOK
      .addCase(addBook.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addBook.fulfilled, (state, action: PayloadAction<Book>) => {
        state.loading = false;
        state.books.push(action.payload);
        state.success = true;
      })
      .addCase(addBook.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { resetBookState } = bookSlice.actions;
export default bookSlice.reducer;
