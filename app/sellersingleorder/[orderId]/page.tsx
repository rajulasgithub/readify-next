"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Divider,
  Stack,
  CircularProgress,
  CardMedia,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

import { AppDispatch, RootState } from "@/src/redux/store";
import {
  fetchSellerOrderDetailsThunk,
  updateOrderItemStatusThunk,
} from "@/src/redux/slices/orderSlice";

export default function SellerOrderDetailsPage({ params }: any) {
  const { orderId } = params;
  const dispatch = useDispatch<AppDispatch>();

  const {
    selectedSellerOrder,
    selectedSellerOrderLoading,
    selectedSellerOrderError,
    loading: updatingStatus,
    error: updateError,
  } = useSelector((state: RootState) => state.orders);

  const [itemStatus, setItemStatus] = useState<Record<number, string>>({});

 const handleStatusChange = (idx: number, value: string, itemId: string) => {
  setItemStatus((prev) => ({ ...prev, [idx]: value }));

  // Dispatch Redux thunk with orderId and itemId
  if (!orderId || !itemId) return; // safety check

  dispatch(
    updateOrderItemStatusThunk({
      orderId,      // orderId from params
      itemId,       // item._id from map
      action: value // new status
    })
  );
};

  useEffect(() => {
    dispatch(fetchSellerOrderDetailsThunk(orderId));
  }, [dispatch, orderId]);

  if (selectedSellerOrderLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (selectedSellerOrderError) {
    return (
      <Typography color="error" textAlign="center" mt={5}>
        {selectedSellerOrderError}
      </Typography>
    );
  }

  if (!selectedSellerOrder) return null;

  const order = selectedSellerOrder;

  return (
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh", py: 5 }}>
      <Container maxWidth="md">
        {/* HEADER */}
        <Typography
          variant="overline"
          sx={{ letterSpacing: 3, color: "text.secondary" }}
        >
          ORDER DETAILS
        </Typography>

        <Typography variant="h4" fontWeight="bold" mb={4} sx={{ lineHeight: 1.2 }}>
          Order Summary
        </Typography>

        {/* ORDER INFORMATION */}
        <Card elevation={0} sx={{ mb: 3, borderRadius: 3, p: 1, boxShadow: "0 4px 15px rgba(0,0,0,0.06)" }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
              Order Information
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Stack spacing={1.2}>
              <Typography><strong>Order ID:</strong> {order._id}</Typography>
              <Typography><strong>Payment Status:</strong> {order.paymentStatus}</Typography>
              <Typography><strong>Payment Method:</strong> {order.paymentMethod.toUpperCase()}</Typography>
            </Stack>
          </CardContent>
        </Card>

        {/* CUSTOMER DETAILS */}
        <Card elevation={0} sx={{ mb: 3, borderRadius: 3, p: 1, boxShadow: "0 4px 15px rgba(0,0,0,0.06)" }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
              Customer Details
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Stack spacing={1.2}>
              <Typography><strong>Name:</strong> {order.customer?.name}</Typography>
              <Typography><strong>Email:</strong> {order.customer?.email}</Typography>
              <Typography><strong>Phone:</strong> {order.customer?.phone}</Typography>
            </Stack>
          </CardContent>
        </Card>

        {/* DELIVERY ADDRESS */}
        <Card elevation={0} sx={{ mb: 3, borderRadius: 3, p: 1, boxShadow: "0 4px 15px rgba(0,0,0,0.06)" }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
              Delivery Address
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Stack spacing={1.2}>
              <Typography><strong>{order.address.fullName}</strong></Typography>
              <Typography>{order.address.addressLine1}</Typography>
              {order.address.addressLine2 && <Typography>{order.address.addressLine2}</Typography>}
              <Typography>{order.address.city}, {order.address.state} - {order.address.pinCode}</Typography>
              <Typography><strong>Phone:</strong> {order.address.phone}</Typography>
            </Stack>
          </CardContent>
        </Card>

        {/* ORDERED ITEMS */}
        <Card elevation={0} sx={{ borderRadius: 3, p: 1, boxShadow: "0 4px 15px rgba(0,0,0,0.06)" }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
              Ordered Items
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Stack spacing={2}>
              {order.items.map((item: any, idx: number) => (
                <Box
                  key={idx}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    border: "1px solid #eee",
                    bgcolor: "#fff",
                    display: "flex",
                    gap: 2,
                    alignItems: "flex-start",
                  }}
                >
                  {/* IMAGE */}
                  <CardMedia
                    component="img"
                    image={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${item.book?.image}`}
                    alt={item.book?.title}
                    sx={{
                      width: 90,
                      height: 120,
                      borderRadius: 2,
                      objectFit: "cover",
                    }}
                  />

                  {/* DETAILS */}
                  <Stack flex={1} spacing={1}>
                    <Typography fontWeight="bold">{item.book?.title}</Typography>
                    <Typography><strong>Qty:</strong> {item.quantity}</Typography>
                    <Typography><strong>Price:</strong> ₹{item.price}</Typography>
                    <Typography><strong>Total:</strong> ₹{item.price * item.quantity}</Typography>
                    <Typography><strong>Current Status:</strong> {item.status || "Pending"}</Typography>
                  </Stack>

                  {/* STATUS DROPDOWN */}
                  <FormControl size="small" sx={{ minWidth: 160 }}>
                    <InputLabel>Status</InputLabel>
                   <Select
  value={itemStatus[idx] || item.status || ""}
  label="Status"
  onChange={(e) =>
    handleStatusChange(idx, e.target.value as string, item._id) // <-- pass item._id here
  }
  disabled={updatingStatus}
>
  <MenuItem value="dispatched">Mark as Dispatched</MenuItem>
  <MenuItem value="delivered">Mark as Delivered</MenuItem>
  <MenuItem value="cancelled" sx={{ color: "red" }}>
    Cancel Item
  </MenuItem>
</Select>
                  </FormControl>
                </Box>
              ))}
            </Stack>
            {updateError && (
              <Typography color="error" mt={2}>
                {updateError}
              </Typography>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
