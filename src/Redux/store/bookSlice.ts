"use client";

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/src/components/api";


export interface Book {
  _id: string; 
  user?: string;
  image: string;
  title: string;
  description: string;
  excerpt?: string;
  page_count: number;
  publish_date: string; 
  author: string;
  genre: string;
  language: string;
  prize: number;
  category: "Academic" | "Fiction" | "Non-Fiction" | "Comics" | "Children" | "Poetry";
  is_deleted?: boolean;
}

interface BookState {
  books: Book[];
  singleBook: Book | null; 
  loading: boolean;
  error: string | null;
  success: boolean;
  totalPages: number;
  currentPage: number;

  singleBookLoading: boolean;   // for single book
  singleBookError: string | null;
}

const initialState: BookState = {
  books: [],
  singleBook: null,
  loading: false,
  error: null,
  success: false,
  totalPages: 0,   
  currentPage: 1, 
   singleBookLoading: false,
  singleBookError: null,
};


export const addBook = createAsyncThunk(
  "books/addBook",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      console.log(token)
      const res = await api.post("/api/books/addbook", formData, {
        headers: {
          Authorization: `Bearer ${token}`, 
     
        },
      });
      return res.data; 
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


interface FetchBooksParams {
  page: number;
  limit: number;
  search?: string;
}



export const fetchBooks = createAsyncThunk<
  { books: Book[]; totalPages: number },
  FetchBooksParams,
  { rejectValue: string }
>(
  "books/fetchBooks",
  async ({ page, limit, search }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return rejectWithValue("No token found");

      const res = await api.get("/api/books/viewbooks", {
        params: {
          page,
          limit,
          // only send if value exists
          ...(search ? { search } : {}),
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      return {
        books: res.data.data,
        totalPages: res.data.pagination.totalPages,
      };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch books"
      );
    }
  }
);


export const fetchSingleBook = createAsyncThunk<Book, string, { rejectValue: string }>(
  "books/fetchSingleBook",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return rejectWithValue("No token found");

      const res = await api.get(`/api/books/viewbook/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data.data; // backend: { data: Book }
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch book");
    }
  }
);



export const deleteBook = createAsyncThunk<string, string, { rejectValue: string }>(
  "books/deleteBook",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return rejectWithValue("No token found");

      await api.patch(`/api/books/deletetbook/${id}`,{}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return id; // return deleted book id
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete book");
    }
  }
);


interface UpdateBookParams {
  id: string;
  formData: FormData;
}

export const updateBook = createAsyncThunk<Book, UpdateBookParams, { rejectValue: string }>(
  "books/updateBook",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return rejectWithValue("No token found");

      const res = await api.patch(`/api/books/updatebook/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        
        },
      });

      return res.data.data; 
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to update book");
    }
  }
);







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
        state.error = action.payload || "Something went wrong"; 
        state.success = false;
      });

 
    builder
       .addCase(fetchBooks.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
   .addCase(fetchBooks.fulfilled, (state, action: PayloadAction<{ books: Book[]; totalPages: number }>) => {
  state.loading = false;
  state.books = action.payload.books;
  state.totalPages = action.payload.totalPages;
})
    .addCase(fetchBooks.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to fetch books";
    });


    builder
  .addCase(fetchSingleBook.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(fetchSingleBook.fulfilled, (state, action) => {
    state.loading = false;
    state.singleBook = action.payload;
  })
  .addCase(fetchSingleBook.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload || "Failed to load book details";
  });

  builder
  .addCase(deleteBook.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(deleteBook.fulfilled, (state, action: PayloadAction<string>) => {
    state.loading = false;
    state.books = state.books.filter(book => book._id !== action.payload);
    state.singleBook = null;
  })
  .addCase(deleteBook.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload || "Failed to delete book";
  });


  builder
  // Update Book
  .addCase(updateBook.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(updateBook.fulfilled, (state, action: PayloadAction<Book>) => {
    state.loading = false;
    state.singleBook = action.payload; // update singleBook view
    // Optionally update books array if present
    const index = state.books.findIndex(b => b._id === action.payload._id);
    if (index !== -1) state.books[index] = action.payload;
  })
  .addCase(updateBook.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload || "Failed to update book";
  });

   
   
  },
});

export const { resetBookState } = bookSlice.actions;


export default bookSlice.reducer;
