"use client";

import React, { useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Alert,
  Button,
  CardMedia
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import type { RootState, AppDispatch } from "@/src/redux/store";
import { fetchSellerBooks, clearSellerBooks } from "@/src/redux/slices/adminSlice";

const ViewStore: React.FC = () => {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { sellerBooks, loading, error } = useSelector(
    (state: RootState) => state.admin
  );

  useEffect(() => {
    if (!id) return;

    dispatch(fetchSellerBooks(id));

    return () => {
      dispatch(clearSellerBooks());
    };
  }, [dispatch, id]);

  const formatCurrency = (value: number | undefined) =>
    `₹${(value || 0).toLocaleString("en-IN")}`;

  return (
    <Box
      sx={{
        bgcolor: "#f5f5f5",
        minHeight: "100vh", // ensures footer stays at bottom
        py: 4,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Container maxWidth="lg" sx={{ flex: 1 }}>
        <Typography variant="h4" gutterBottom>
          Seller&apos;s Books
        </Typography>

        {/* Loading State */}
        {loading && (
          <Box sx={{ py: 6, display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        )}

        {/* Error State */}
        {!loading && error && (
          <Box sx={{ py: 6 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}

        {/* Empty State */}
        {!loading && !error && (!sellerBooks || sellerBooks.length === 0) && (
          <Box
            sx={{
              py: 6,
              textAlign: "center",
              color: "text.secondary",
              fontSize: "1.1rem",
              fontWeight: 500,
            }}
          >
            No books added by this seller.
          </Box>
        )}

        {/* Table of Seller Books */}
        {!loading && !error && sellerBooks && sellerBooks.length > 0 && (
          <Box sx={{ overflowX: "auto" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Book Cover</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Author</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Price</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {sellerBooks.map((book) => (
                  <TableRow key={book._id} hover>
                     <TableCell>
    {/* Display Book Image */}
    {book.image ? (
      <CardMedia
        component="img"
        image={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${book.image}`} // adjust path
        alt={book.title}
        sx={{
          width: 60,
          height: 80,
          borderRadius: 1,
          objectFit: "cover",
        }}
      />
    ) : (
      <Box
        sx={{
          width: 60,
          height: 80,
          borderRadius: 1,
          bgcolor: "#e0e0e0",
        }}
      />
    )}
  </TableCell>

                    <TableCell sx={{ fontWeight: 600 }}>{book.title}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>{formatCurrency(book.prize)}</TableCell>
                    <TableCell>{book.category}</TableCell>
                    <TableCell >
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => router.push(`/viewonebook/${book._id}`)}
                        sx={{ textTransform: "none", borderRadius: "999px" }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default ViewStore;
