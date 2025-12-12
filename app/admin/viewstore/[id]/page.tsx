"use client"
import React, { useEffect, useState } from "react";
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
  CardMedia,
  Pagination,
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

  const { sellerBooks, loading, error, pagination } = useSelector((state: RootState) => state.admin);

  const [page, setPage] = useState(1);
  const [limit] = useState(8); // or any default

  useEffect(() => {
    if (!id) return;
    dispatch(fetchSellerBooks({ id, page, limit }));

    return () => {
      dispatch(clearSellerBooks());
    };
  }, [dispatch, id, page, limit]);

  const formatCurrency = (value: number | undefined) =>
    `₹${(value || 0).toLocaleString("en-IN")}`;

  return (
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom>
          Seller&apos;s Books
        </Typography>

        {loading && (
          <Box sx={{ py: 6, display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        )}

        {!loading && error && (
          <Box sx={{ py: 6 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}

        {!loading && !error && (!sellerBooks || sellerBooks.length === 0) && (
          <Box sx={{ py: 6, textAlign: "center", color: "text.secondary", fontSize: "1.1rem", fontWeight: 500 }}>
            No books added by this seller.
          </Box>
        )}

        {!loading && !error && sellerBooks.length > 0 && (
          <>
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
                        {book.image ? (
                          <CardMedia
                            component="img"
                            image={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${book.image}`}
                            alt={book.title}
                            sx={{ width: 60, height: 80, borderRadius: 1, objectFit: "cover" }}
                          />
                        ) : (
                          <Box sx={{ width: 60, height: 80, borderRadius: 1, bgcolor: "#e0e0e0" }} />
                        )}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{book.title}</TableCell>
                      <TableCell>{book.author}</TableCell>
                      <TableCell>{formatCurrency(book.prize)}</TableCell>
                      <TableCell>{book.category}</TableCell>
                      <TableCell>
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

            {/* Pagination */}
            {pagination?.totalPages && pagination.totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                <Pagination
                  count={pagination.totalPages}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default ViewStore;
