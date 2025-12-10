"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  CircularProgress,
  Grid,
  CardMedia,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  TextField,
} from "@mui/material";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/src/redux/store";
import {
  updateOrderItemStatusThunk,
  fetchUserOrdersThunk,
} from "@/src/redux/slices/orderSlice";
import { addReview } from "@/src/redux/slices/bookSlice";

/**
 * Minimal typed shapes for the data your UI accesses.
 * They intentionally only include fields used in this component.
 */
type ReviewType = {
  user: string;
  rating: number;
  comment?: string;
};

type BookType = {
  _id?: string;
  title?: string;
  image?: string[]; // we access image[0]
  reviews?: ReviewType[];
};

type OrderItemType = {
  _id: string;
  book: string | BookType; // backend may return populated book or just id
  status: string;
  paymentMethod?: string;
};

type OrderType = {
  _id: string;
  items: OrderItemType[];
  status: string;
  paymentMethod?: string;
  createdAt?: string;
  totalAmount?: number;
  address?: unknown;
};

type FlattenedItemType = OrderItemType & {
  book: BookType;
  orderId: string;
  orderStatus: string;
  paymentMethod?: string;
  createdAt?: string;
  orderTotalAmount?: number;
  address?: unknown;
};

export default function UserOrdersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState<number | null>(null);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewBookId, setReviewBookId] = useState<string | null>(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const { userOrders, userOrdersLoading, userOrdersError } = useSelector(
    (state: RootState) => state.orders
  );

  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchUserOrdersThunk());
  }, [dispatch]);

  const orders: OrderType[] = (userOrders as OrderType[]) || [];
  const loading = userOrdersLoading;
  const error = userOrdersError;
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ordered":
        return "info";
      case "delivered":
        return "success";
      case "cancelled":
        return "error";
      case "shipped":
        return "warning";
      default:
        return "default";
    }
  };

  const formatDate = (iso?: string) => {
    if (!iso) return "";
    return new Date(iso).toLocaleString();
  };

  // ---------------------------------------
  // GET USER REVIEW FOR THIS BOOK
  // ---------------------------------------
  const getUserReview = (book?: BookType | null) => {
    if (!book?.reviews) return null;
    const userId = localStorage.getItem("userId");
    if (!userId) return null;
    return book.reviews.find((r) => r.user === userId) || null;
  };

  // ---------------------------------------
  // FLATTEN ORDER ITEMS
  // ---------------------------------------
  const itemCards: FlattenedItemType[] = orders.flatMap((order) =>
    order.items.map((item) => {
      // convert item.book to BookType if it's a string id
      const bookObj: BookType =
        typeof item.book === "string" ? { _id: item.book } : (item.book as BookType);

      return {
        ...item,
        book: bookObj,
        orderId: order._id,
        orderStatus: order.status,
        paymentMethod: order.paymentMethod,
        createdAt: order.createdAt,
        orderTotalAmount: order.totalAmount,
        address: order.address,
      };
    })
  );

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fb", py: 3 }}>
      <Container maxWidth="lg">
        <Stack direction="row" alignItems="center" spacing={1.5} mb={2.5}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              bgcolor: "#c57a45",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}
          >
            <ShoppingBagOutlinedIcon fontSize="small" />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              My Orders
            </Typography>
            <Typography variant="body2" sx={{ color: "#6b7280" }}>
              Each card shows a single ordered book.
            </Typography>
          </Box>
        </Stack>

        {/* Loader */}
        {loading && (
          <Box sx={{ py: 8, display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        )}

        {/* Error */}
        {!loading && error && (
          <Box sx={{ py: 5, textAlign: "center" }}>
            <Typography color="error">{error}</Typography>
          </Box>
        )}

        {/* No Orders */}
        {!loading && !error && itemCards.length === 0 && (
          <Box sx={{ py: 5, textAlign: "center" }}>
            <Typography variant="h6" fontWeight={600}>
              No orders found.
            </Typography>
          </Box>
        )}

        {/* Orders */}
        {!loading && !error && itemCards.length > 0 && (
          <Grid container spacing={2} justifyContent="center">
            {itemCards.map((item) => {
              const firstImage =
                item.book?.image && item.book.image.length > 0 ? item.book.image[0] : null;
              const imageUrl = firstImage
                ? `${backendUrl}/${firstImage}`
                : "/images/book-placeholder.png";

              const existingReview = getUserReview(item.book);
              const isCancelling = updatingItemId === item._id;
              const disableCancel = item.status !== "ordered" || isCancelling;

              return (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={3}
                  key={item._id}
                  display="flex"
                  justifyContent="center"
                >
                  <Card
                    sx={{
                      width: "100%",
                      maxWidth: 260,
                      borderRadius: 2.5,
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      boxShadow: "0 6px 18px rgba(15,23,42,0.10)",
                      bgcolor: "#ffffff",
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={imageUrl}
                      alt="Book"
                      sx={{ height: 170, objectFit: "contain", bgcolor: "#f9fafb", p: 1.2 }}
                    />

                    <CardContent sx={{ p: 1.75, flexGrow: 1 }}>
                      <Typography
                        variant="subtitle2"
                        fontWeight={700}
                        sx={{
                          fontSize: 14,
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 2,
                          overflow: "hidden",
                        }}
                      >
                        {item.book?.title}
                      </Typography>

                      <Chip
                        label={item.status.toUpperCase()}
                        size="small"
                        color={getStatusColor(item.status)}
                        sx={{ fontSize: 9, fontWeight: 600, height: 20, mt: 1, mb: 1 }}
                      />

                      {/* Show Rating If User Already Reviewed */}
                      {existingReview && (
                        <Rating value={existingReview.rating} readOnly size="small" sx={{ mb: 1 }} />
                      )}

                      {/* Payment + Order */}
                      <Stack direction="row" spacing={0.5} mb={1}>
                        <Chip
                          label={item.paymentMethod?.toUpperCase()}
                          size="small"
                          sx={{ bgcolor: "#ecfdf3", fontSize: 9, fontWeight: 600, height: 20 }}
                        />
                        <Typography variant="caption" sx={{ color: "#9ca3af", fontSize: 11 }}>
                          #{String(item.orderId)?.slice(-6)} • {formatDate(item.createdAt)}
                        </Typography>
                      </Stack>

                      {/* Buttons */}
                      <Stack direction="row" spacing={1} mt={1}>
                        {/* ADD/EDIT REVIEW */}
                        {item.status === "delivered" && (
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => {
                              setReviewBookId(item.book._id ?? null);
                              setReviewRating(existingReview?.rating ?? null);
                              setReviewComment(existingReview?.comment ?? "");
                              setReviewOpen(true);
                            }}
                            sx={{ textTransform: "none", fontSize: 12, borderRadius: 999, px: 1.8, py: 0.3 }}
                          >
                            {existingReview ? "Edit Review" : "Add Review"}
                          </Button>
                        )}

                        {/* CANCEL BUTTON */}
                        {item.status !== "cancelled" && (
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            disabled={disableCancel}
                            onClick={() => {
                              setSelectedOrderId(item.orderId);
                              setSelectedItemId(item._id);
                              setCancelModalOpen(true);
                            }}
                            sx={{ textTransform: "none", fontSize: 12, borderRadius: 999, px: 1.5, py: 0.2 }}
                          >
                            {isCancelling ? "Cancelling..." : "Cancel"}
                          </Button>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}

            {/* REVIEW MODAL */}
            <Dialog open={reviewOpen} onClose={() => setReviewOpen(false)}>
              <DialogTitle>Add Review</DialogTitle>
              <DialogContent>
                <Rating value={reviewRating} onChange={(_, v) => setReviewRating(v)} size="large" />
                <TextField
                  multiline
                  rows={4}
                  fullWidth
                  label="Write your review"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  sx={{ mt: 2 }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setReviewOpen(false)}>Cancel</Button>
                <Button
                  variant="contained"
                  onClick={async () => {
                    if (!reviewBookId || reviewRating === null) {
                      alert("Please add a rating");
                      return;
                    }

                    // dispatch addReview, then refresh orders
                    await dispatch(
                      addReview({
                        bookId: reviewBookId,
                        rating: reviewRating,
                        comment: reviewComment,
                      })
                    );
                    // refresh orders so UI updates
                    dispatch(fetchUserOrdersThunk());
                    setReviewOpen(false);
                    setReviewRating(null);
                    setReviewComment("");
                  }}
                >
                  Submit
                </Button>
              </DialogActions>
            </Dialog>

            {/* CANCEL CONFIRM MODAL */}
            <Dialog open={cancelModalOpen} onClose={() => setCancelModalOpen(false)}>
              <DialogTitle sx={{ fontWeight: 700 }}> Cancel Item </DialogTitle>
              <DialogContent>
                <Typography> Are you sure you want to cancel this item? </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setCancelModalOpen(false)}> No </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={async () => {
                    if (!selectedOrderId || !selectedItemId) return;
                    try {
                      setUpdatingItemId(selectedItemId);
                      await dispatch(
                        updateOrderItemStatusThunk({
                          orderId: selectedOrderId,
                          itemId: selectedItemId,
                          action: "cancelled",
                        })
                      ).unwrap();
                    } catch {
                      alert("Failed to cancel item");
                    } finally {
                      setUpdatingItemId(null);
                      setCancelModalOpen(false);
                    }
                  }}
                >
                  Yes, Cancel
                </Button>
              </DialogActions>
            </Dialog>
          </Grid>
        )}
      </Container>
    </Box>
  );
}
