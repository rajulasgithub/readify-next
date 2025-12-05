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
  Button,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { useRouter, useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/src/redux/store";
import {
  fetchSellerOrderDetailsThunk,
  cancelOrderThunk,
} from "@/src/redux/slices/orderSlice";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";

export default function SellerOrderDetailPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
 const searchParams = useSearchParams();
const orderId = searchParams.get("orderId");
  console.log(orderId)

  const { selectedSellerOrder, selectedSellerOrderLoading } = useSelector((state: RootState) => state.orders);
  const authUser = useSelector((state: RootState) => state.auth.user);
  const authUserId = (authUser as any)?._id ?? (authUser as any)?.id ?? null;

  const [cancellingItemId, setCancellingItemId] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;
    dispatch(fetchSellerOrderDetailsThunk(orderId));
  }, [dispatch, orderId]);

  const handleBack = () => {
    router.push("/seller/orders");
  };

  const handleCancelItem = async (orderId: string, itemId: string) => {
    if (!confirm("Cancel this item? This action cannot be undone.")) return;
    try {
      setCancellingItemId(itemId);
      await dispatch(cancelOrderThunk({ orderId, itemId })).unwrap();
      toast.success("Item cancelled");
      // refresh order details
      if (orderId) await dispatch(fetchSellerOrderDetailsThunk(orderId)).unwrap();
    } catch (err: any) {
      console.error("Cancel failed", err);
      toast.error(err?.message || "Failed to cancel item");
    } finally {
      setCancellingItemId(null);
    }
  };

  // filter items to show only seller's items where book.user matches seller id (but fall back to include items if can't determine)
  const itemsToShow = (selectedSellerOrder?.items || []).filter((item: any) => {
    const book = item.book;
    if (!book) return true;
    const bookUser = book.user;
    if (bookUser && authUserId) {
      const bookUserId = bookUser._id ?? bookUser.id ?? bookUser;
      return String(bookUserId) === String(authUserId);
    }
    // if book.user not present, include item (controller might not populate)
    return true;
  });

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fb", py: 4 }}>
      <Container maxWidth="md">
        <Stack direction="row" alignItems="center" spacing={2} mb={3}>
          <Button startIcon={<ArrowBackIcon />} variant="text" onClick={handleBack} sx={{ textTransform: "none" }}>
            Back
          </Button>
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Order Details
            </Typography>
            <Typography variant="body2" sx={{ color: "#6b7280" }}>
              {orderId ? `Order #${String(orderId).slice(-8)}` : "Order"}
            </Typography>
          </Box>
        </Stack>

        {selectedSellerOrderLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        )}

        {!selectedSellerOrderLoading && !selectedSellerOrder && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography>No order details available.</Typography>
          </Box>
        )}

        {!selectedSellerOrderLoading && selectedSellerOrder && (
          <>
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="subtitle1" fontWeight={700}>
                      Order #{String(selectedSellerOrder._id).slice(-8)}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#6b7280" }}>
                      Placed: {new Date(selectedSellerOrder.createdAt).toLocaleString()}
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip label={selectedSellerOrder.paymentStatus?.toUpperCase() ?? "PAID"} size="small" />
                    <Chip label={selectedSellerOrder.status?.toUpperCase() ?? ""} size="small" />
                  </Stack>
                </Stack>
              </CardContent>
            </Card>

            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle2" mb={1}>Items</Typography>

                <List>
                  {itemsToShow.map((item: any) => {
                    const book = item.book ?? {};
                    const title = book.title ?? (typeof book === "string" ? `Book id: ${book}` : book._id ?? "Untitled");
                    const qty = item.quantity ?? 1;
                    const price = item.price ?? 0;
                    const lineTotal = qty * price;
                    const cancellable = item.status !== "cancelled" && item.status !== "shipped" && item.status !== "delivered";

                    return (
                      <ListItem key={item._id ?? JSON.stringify(item)} divider>
                        <ListItemText
                          primary={title}
                          secondary={`Qty: ${qty} • ₹${price} • Total ₹${lineTotal} • Status: ${item.status ?? "N/A"}`}
                        />

                        <Stack direction="row" spacing={1}>
                          {cancellable ? (
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              startIcon={<CancelOutlinedIcon />}
                              onClick={() => handleCancelItem(selectedSellerOrder._id, item._id)}
                              disabled={cancellingItemId === item._id}
                              sx={{ textTransform: "none" }}
                            >
                              {cancellingItemId === item._id ? "Cancelling..." : "Cancel Item"}
                            </Button>
                          ) : (
                            <Chip label={(item.status ?? "N/A").toUpperCase()} size="small" />
                          )}
                        </Stack>
                      </ListItem>
                    );
                  })}
                </List>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="subtitle2" mb={1}>Shipping Address</Typography>
                <Typography fontWeight={600}>{selectedSellerOrder.address?.fullName}</Typography>
                <Typography variant="body2" sx={{ color: "#6b7280" }}>
                  {selectedSellerOrder.address?.addressLine1}{selectedSellerOrder.address?.addressLine2 ? `, ${selectedSellerOrder.address.addressLine2}` : ""}
                </Typography>
                <Typography variant="body2" sx={{ color: "#6b7280" }}>
                  {selectedSellerOrder.address?.city}, {selectedSellerOrder.address?.state} - {selectedSellerOrder.address?.pinCode}
                </Typography>
              </CardContent>
            </Card>
          </>
        )}
      </Container>
    </Box>
  );
}
