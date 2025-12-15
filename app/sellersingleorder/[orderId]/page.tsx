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
import { useAuth } from "@/src/context/AuthContext";
import { useParams } from "next/navigation";
import type { OrderItem } from "@/src/redux/slices/orderSlice";


export default function SellerOrderDetailsPage() {
   const { orderId } = useParams<{ orderId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { blocked } = useAuth()

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

    if (!orderId || !itemId) return;

    dispatch(
      updateOrderItemStatusThunk({
        orderId,
        itemId,
        action: value,
      })
    );
  };

  useEffect(() => {
    if (orderId) dispatch(fetchSellerOrderDetailsThunk(orderId));
  }, [dispatch, orderId]);

  return (
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh", py: 5 }}>
      <Container maxWidth="md">
        <Typography
          variant="overline"
          sx={{ letterSpacing: 3, color: "text.secondary" }}
        >
          ORDER DETAILS
        </Typography>

        <Typography
          variant="h4"
          fontWeight="bold"
          mb={4}
          sx={{ lineHeight: 1.2 }}
        >
          Order Summary
        </Typography>

        {selectedSellerOrderLoading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: { xs: "40vh", md: "48vh" },
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {!selectedSellerOrderLoading && selectedSellerOrderError && (
          <Box
            sx={{
              mb: 3,
              p: 2,
              borderRadius: 2,
              bgcolor: "#fff7f0",
              border: "1px solid #fcd6c2",
            }}
          >
            <Typography color="error" align="center">
              {selectedSellerOrderError}
            </Typography>
          </Box>
        )}

        {!selectedSellerOrderLoading && selectedSellerOrder && (
          <>
            <Card
              elevation={0}
              sx={{
                mb: 3,
                borderRadius: 3,
                p: 1,
                boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                  Order Information
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Stack spacing={1.2}>
                  <Typography>
                    <strong>Order ID:</strong> {selectedSellerOrder._id}
                  </Typography>
                  <Typography>
                    <strong>Payment Status:</strong> {selectedSellerOrder.paymentStatus}
                  </Typography>
                  <Typography>
                    <strong>Payment Method:</strong>{" "}
                    {String(selectedSellerOrder.paymentMethod).toUpperCase()}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>

            <Card
              elevation={0}
              sx={{
                mb: 3,
                borderRadius: 3,
                p: 1,
                boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                  Customer Details
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Stack spacing={1.2}>
                 <Stack spacing={1.2}>
  <Typography>
    <strong>Name:</strong>{" "}
    {selectedSellerOrder.user?.firstName}{" "}
    {selectedSellerOrder.user?.lastName}
  </Typography>

  <Typography>
    <strong>Email:</strong> {selectedSellerOrder.user?.email}
  </Typography>
</Stack>
                </Stack>
              </CardContent>
            </Card>

            <Card
              elevation={0}
              sx={{
                mb: 3,
                borderRadius: 3,
                p: 1,
                boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                  Delivery Address
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Stack spacing={1.2}>
                  <Typography>
                    <strong>{selectedSellerOrder.address?.fullName}</strong>
                  </Typography>
                  <Typography>{selectedSellerOrder.address?.addressLine1}</Typography>
                  {selectedSellerOrder.address?.addressLine2 && (
                    <Typography>{selectedSellerOrder.address.addressLine2}</Typography>
                  )}
                  <Typography>
                    {selectedSellerOrder.address?.city}, {selectedSellerOrder.address?.state} -{" "}
                    {selectedSellerOrder.address?.pinCode}
                  </Typography>
                  <Typography>
                    <strong>Phone:</strong> {selectedSellerOrder.address?.phone}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>

            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                p: 1,
                boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                  Ordered Items
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Stack spacing={2}>
                  {selectedSellerOrder.items.map((item: OrderItem, idx: number) => (
                    <Box
                      key={item._id ?? idx}
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

                      <Stack flex={1} spacing={1}>
                        <Typography fontWeight="bold">{item.book?.title}</Typography>
                        <Typography>
                          <strong>Qty:</strong> {item.quantity}
                        </Typography>
                        <Typography>
                          <strong>Price:</strong> ₹{item.price}
                        </Typography>
                        <Typography>
                          <strong>Total:</strong> ₹{item.price * item.quantity}
                        </Typography>
                        <Typography>
                          <strong>Current Status:</strong> {item.status || "Pending"}
                        </Typography>
                      </Stack>

                      <FormControl size="small" sx={{ minWidth: 160 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                          value={itemStatus[idx] || item.status || ""}
                          label="Status"
                          onChange={(e) =>
                            handleStatusChange(idx, e.target.value as string, item._id)
                          }
                          disabled={updatingStatus ||blocked}
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
          </>
        )}

        {!selectedSellerOrderLoading && !selectedSellerOrder && !selectedSellerOrderError && (
          <Box sx={{ minHeight: "30vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Typography color="text.secondary">No order details available.</Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}
