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
  Divider,
  CircularProgress,
  Grid,
  CardMedia,
  Button,
} from "@mui/material";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";

import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/src/redux/store";
import { cancelOrderThunk, fetchUserOrdersThunk } from "@/src/redux/slices/orderSlice";


type OrderItem = {
  _id: string;
  quantity: number;
  price: number;
  status: "ordered" | "cancelled" | "shipped" | "delivered";
  book?: {
    _id: string;
    title?: string;
    author?: string;
    prize?: number;
    price?: number;
    image?: string;
  };
};

type Order = {
  _id: string;
  items: OrderItem[];
  totalQty: number;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
  address?: any;
};

type FlattenedOrderItem = OrderItem & {
  orderId: string;
  orderStatus: Order["status"];
  paymentMethod: string;
  createdAt: string;
  orderTotalAmount: number;
  address?: Order["address"];
};

export default function UserOrdersPage() {
  const dispatch = useDispatch<AppDispatch>();

  const { userOrders, userOrdersLoading, userOrdersError } = useSelector(
    (state: RootState) => state.orders
  );

  const [cancelLoadingItem, setCancelLoadingItem] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchUserOrdersThunk());
  }, [dispatch]);

  const orders: Order[] = userOrders || [];
  const loading = userOrdersLoading;
  const error = userOrdersError;

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

  const formatDate = (iso: string) => {
    if (!iso) return "";
    return new Date(iso).toLocaleString();
  };

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const itemCards: FlattenedOrderItem[] = orders.flatMap((order) =>
    order.items.map((item) => ({
      ...item,
      orderId: order._id,
      orderStatus: order.status,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt,
      orderTotalAmount: order.totalAmount,
      address: order.address,
    }))
  );

  // 🔥 ITEM-LEVEL CANCEL HANDLER
  const handleCancelOrderItem = async (orderId: string, itemId: string) => {
    const ask = window.confirm("Cancel this item?");
    if (!ask) return;

    try {
      setCancelLoadingItem(itemId); // loading per item
      await dispatch(
        cancelOrderThunk({ orderId, itemId })
      ).unwrap();
    } catch (err) {
      console.error("Failed to cancel item", err);
    } finally {
      setCancelLoadingItem(null);
    }
  };

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

        {loading && (
          <Box sx={{ py: 8, display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        )}

        {!loading && error && (
          <Box sx={{ py: 5, textAlign: "center" }}>
            <Typography color="error">{error}</Typography>
          </Box>
        )}

        {!loading && !error && itemCards.length === 0 && (
          <Box sx={{ py: 5, textAlign: "center" }}>
            <Typography variant="h6" fontWeight={600}>
              No orders found.
            </Typography>
          </Box>
        )}

        {!loading && !error && itemCards.length > 0 && (
          <Grid container spacing={2}>
            {itemCards.map((item) => {
              const title = item.book?.title || "Book";
              const author = item.book?.author || "";
              const unitPrice =
                item.price ?? item.book?.price ?? item.book?.prize ?? 0;
              const lineTotal = unitPrice * (item.quantity || 1);

              const imageUrl = item.book?.image
                ? `${backendUrl}/${item.book.image}`
                : "/images/book-placeholder.png";

              const isCancelling = cancelLoadingItem === item._id;

              const disableCancel =
                item.status === "cancelled" ||
                item.status === "shipped" ||
                item.status === "delivered";

              return (
                <Grid item xs={12} sm={6} md={3} key={item._id}>
                  <Card
                    sx={{
                      height: "100%",
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
                      alt={title}
                      sx={{
                        height: 170,
                        objectFit: "contain",
                        bgcolor: "#f9fafb",
                        p: 1.2,
                      }}
                    />

                    <CardContent sx={{ p: 1.75, flexGrow: 1 }}>
                      <Stack spacing={0.3} mb={0.75}>
                        <Typography
                          variant="subtitle2"
                          fontWeight={700}
                          sx={{
                            fontSize: 13.5,
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 2,
                            overflow: "hidden",
                          }}
                        >
                          {title}
                        </Typography>
                        {author && (
                          <Typography
                            variant="body2"
                            sx={{ color: "#6b7280", fontSize: 12.5 }}
                          >
                            by {author}
                          </Typography>
                        )}
                      </Stack>

                      {/* 🔥 Item status chip */}
                      <Chip
                        label={item.status.toUpperCase()}
                        size="small"
                        color={getStatusColor(item.status)}
                        sx={{
                          fontSize: 9,
                          fontWeight: 600,
                          height: 20,
                          mb: 1,
                        }}
                      />

                      <Stack direction="row" spacing={0.75} mb={0.75}>
                        <Chip
                          label={item.paymentMethod.toUpperCase()}
                          size="small"
                          sx={{
                            bgcolor: "#ecfdf3",
                            fontSize: 9,
                            fontWeight: 600,
                            height: 20,
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{ color: "#9ca3af", fontSize: 11 }}
                        >
                          Order #{item.orderId.slice(-6)} •{" "}
                          {formatDate(item.createdAt)}
                        </Typography>
                      </Stack>

                      <Stack spacing={0.4} mb={1}>
                        <Stack direction="row" spacing={0.75}>
                          <LocalShippingOutlinedIcon
                            sx={{ fontSize: 15, color: "#9ca3af" }}
                          />
                          <Typography
                            variant="caption"
                            sx={{ color: "#9ca3af", fontSize: 11 }}
                          >
                            Qty: <b>{item.quantity}</b> • ₹{unitPrice}/book
                          </Typography>
                        </Stack>
                      </Stack>

                      <Divider sx={{ my: 1 }} />

                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        mb={0.5}
                      >
                        <Typography
                          variant="body2"
                          sx={{ color: "#6b7280", fontSize: 12.5 }}
                        >
                          Line Total
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          fontWeight={800}
                          sx={{ fontSize: 14 }}
                        >
                          ₹{lineTotal}
                        </Typography>
                      </Stack>

                      {/* ITEM CANCEL BUTTON */}
                      <Box mt={1.2} display="flex" justifyContent="flex-end">
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          disabled={disableCancel || isCancelling}
                          onClick={() =>
                            handleCancelOrderItem(item.orderId, item._id)
                          }
                          sx={{
                            textTransform: "none",
                            fontSize: 12,
                            borderRadius: 999,
                            px: 1.5,
                            py: 0.2,
                          }}
                        >
                          {isCancelling
                            ? "Cancelling..."
                            : item.status === "cancelled"
                            ? "Cancelled"
                            : "Cancel Item"}
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
