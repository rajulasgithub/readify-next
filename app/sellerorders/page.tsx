"use client";

import React, { useEffect } from "react";
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
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/src/redux/store";
import { fetchSellerOrdersThunk } from "@/src/redux/slices/orderSlice";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";

export default function SellerOrdersPage() {
  const {blocked } = useAuth()
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { sellerOrders, sellerOrdersLoading, sellerOrdersError } = useSelector(
    (state: RootState) => state.orders
  );

  useEffect(() => {
    dispatch(fetchSellerOrdersThunk());
  }, [dispatch]);

  const handleView = (orderId: string) => {
    router.push(`/sellersingleorder/${orderId}`);
  };

  const handleBack = () => {
    router.push("/sellerdashboard");
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fb", py: 4 }}>
      <Container maxWidth="lg">
        <Stack direction="row" alignItems="center" spacing={2} mb={3}>
          <IconButton onClick={handleBack}>
            <ArrowBackIcon />
          </IconButton>

          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" fontWeight={700}>
              Seller Orders
            </Typography>
            <Typography variant="body2" sx={{ color: "#6b7280" }}>
              Orders that include your books
            </Typography>
          </Box>
        </Stack>

        {sellerOrdersLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        )}

        {!sellerOrdersLoading && sellerOrdersError && (
          <Box sx={{ textAlign: "center", py: 6 }}>
            <Typography color="error">{sellerOrdersError}</Typography>
          </Box>
        )}

        {!sellerOrdersLoading && !sellerOrdersError && Array.isArray(sellerOrders) && sellerOrders.length === 0 && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6">No orders found for your books yet.</Typography>
            <Typography variant="body2" sx={{ color: "#6b7280", mt: 1 }}>
              Orders containing your listed books will appear here.
            </Typography>
          </Box>
        )}

        {!sellerOrdersLoading && !sellerOrdersError && Array.isArray(sellerOrders) && sellerOrders.length > 0 && (
          <Stack spacing={2}>
            {sellerOrders.map((order: Order) => {
              // Display a single card per order
              const orderItemCount = Array.isArray(order.items) ? order.items.length : 0;
              const subtotal = order.totalAmount ?? (order.items || []).reduce((s: number, it: Order) => s + ((it.price ?? 0) * (it.quantity ?? 1)), 0);

              return (
                <Card key={order._id}>
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
  <Typography variant="subtitle1" fontWeight={700}>
    Order #{String(order._id).slice(-8)}
  </Typography>

  <Typography
    variant="caption"
    sx={{ color: "#6b7280", display: "block", mt: 0.5 }}
  >
    Placed: {new Date(order.createdAt).toLocaleString()}
  </Typography>

  {/* ⭐ CUSTOMER NAME */}
  <Typography variant="body2" sx={{ color: "#6b7280", mt: 1 }}>
    Customer: {order.user?.firstName} {order.user?.lastName}
  </Typography>

  <Typography variant="body2" sx={{ color: "#6b7280", mt: 0.5 }}>
    Items in order: {orderItemCount}
  </Typography>

  <Typography variant="body2" sx={{ color: "#6b7280", mt: 0.5 }}>
    Total: ₹{subtotal}
  </Typography>
</Box>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Button
                          size="small"
                          disabled={blocked}
                          variant="outlined"
                          startIcon={<VisibilityOutlinedIcon />}
                          onClick={() => handleView(order._id)}
                          sx={{ textTransform: "none" }}
                        >
                          View
                        </Button>
                        <Chip label={order.paymentStatus?.toUpperCase() ?? "PAID"} size="small" color={order.paymentStatus === "paid" ? "success" : "default"} />
                      </Stack>
                    </Stack>

                    <Divider sx={{ my: 1.5 }} />

                    {/* brief preview of first item title(s) */}
                    <Stack spacing={0.5}>
                      {(order.items || []).slice(0, 3).map((it: Order, idx: number) => (
                        <Typography key={idx} variant="body2" sx={{ color: "#374151" }}>
                          • {it.book?.title ?? `Book id: ${typeof it.book === "string" ? it.book : it.book?._id ?? "?"}`} — Qty: {it.quantity ?? 1}
                        </Typography>
                      ))}
                      {order.items && order.items.length > 3 && (
                        <Typography variant="caption" sx={{ color: "#6b7280" }}>
                          +{order.items.length - 3} more items
                        </Typography>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              );
            })}
          </Stack>
        )}
      </Container>
    </Box>
  );
}
