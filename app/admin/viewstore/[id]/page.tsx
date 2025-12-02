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
  Card,
  CardMedia,
  Button,
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


  if (loading)
    return (
      <Box sx={{ py: 6, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box sx={{ py: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );

  return (
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom>
          Seller&apos;s Books
        </Typography>

        
        {(!sellerBooks || sellerBooks.length === 0) && (
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

      
        {sellerBooks && sellerBooks.length > 0 && (
          <Box sx={{ overflowX: "auto" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Author</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Price</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {sellerBooks.map((book) => (
                  <TableRow key={book._id} hover>
                    

                    <TableCell sx={{ fontWeight: 600 }}>
                      {book.title}
                    </TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>{formatCurrency(book.prize)}</TableCell>
                    <TableCell>{book.category}</TableCell>

                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() =>
                          router.push(`/viewonebook/${book._id}`)
                        }
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
