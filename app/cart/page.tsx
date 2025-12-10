"use client";

import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Button,
  Stack,
  Chip,
  CircularProgress,
  Divider,
  Pagination,
  Fab,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Link from "next/link";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCartItems,
  removeCartItem,
  updateCartQuantity,
  clearCart,
} from "@/src/redux/slices/cartSlice";
import { AppDispatch, RootState } from "@/src/redux/store";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const [page, setPage] = useState(1);
  const limit = 2;
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const {
    items = [],
    loading,
    error,
    totalPrice = 0,
    totalQuantity = 0,
    pagination,
  } = useSelector((state: RootState) => state.cart);

  const totalPageCount = pagination?.totalPages ?? 1;

  useEffect(() => {
    dispatch(fetchCartItems({ page, limit }));
  }, [dispatch, page]);

  const increaseQty = (id: string, quantity: number) => {
    dispatch(updateCartQuantity({ bookId: id, quantity: quantity + 1 }));
  };

  const decreaseQty = (id: string, quantity: number) => {
    if (quantity > 1) {
      dispatch(updateCartQuantity({ bookId: id, quantity: quantity - 1 }));
    }
  };

  const removeItemHandler = (id: string) => {
    dispatch(removeCartItem(id));
  };

  const clearAllHandler = () => {
    dispatch(clearCart());
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f5f7fb",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f5f7fb",
        py: 5,
        position: "relative",
      }}
    >
      <Container maxWidth="md">
        {/* Header / summary */}
        <Box
          sx={{
            mb: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <ShoppingCartIcon sx={{ color: "#c57a45" }} />
              <Typography variant="h4" fontWeight={700}>
                My Cart
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} mt={1}>
              <Chip
                label={`${items.length} item${totalQuantity !== 1 ? "s" : ""} in cart`}
                size="small"
                sx={{ bgcolor: "#fff7f0", color: "#c57a45", fontWeight: 500 }}
              />
              <Chip
                label={`Total: ₹${typeof totalPrice === "number" ? totalPrice.toFixed(2) : totalPrice}`}
                size="small"
                sx={{ bgcolor: "#e3f2fd", color: "#1976d2", fontWeight: 500 }}
              />
            </Stack>
          </Box>

          {items.length > 0 && (
            <Button
              variant="outlined"
              color="error"
              onClick={clearAllHandler}
              sx={{
                borderRadius: "999px",
                textTransform: "none",
                px: 3,
              }}
            >
              Clear Cart
            </Button>
          )}
        </Box>

        {error && (
          <Typography color="error" mb={2}>
            {error}
          </Typography>
        )}

        {items.length === 0 ? (
          <Box
            sx={{
              mt: 6,
              p: 4,
              bgcolor: "#ffffff",
              borderRadius: 4,
              boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
              textAlign: "center",
            }}
          >
            <Typography variant="h6" fontWeight={600} mb={1}>
              Your cart is empty
            </Typography>
            <Typography color="text.secondary" mb={3}>
              Add some books to your cart to see them here.
            </Typography>
            <Button
              variant="contained"
              sx={{
                bgcolor: "#c57a45",
                textTransform: "none",
                borderRadius: "999px",
                px: 4,
                "&:hover": { bgcolor: "#b36a36" },
              }}
              onClick={() => router.push("/viewbooks")}
            >
              Browse Books
            </Button>
          </Box>
        ) : (
          <>
            <Stack spacing={2.5}>
              {items.map((item) => {
                const subtotal = (item.prize ?? 0) * (item.quantity ?? 0);

                return (
                  <Card
                    key={item.bookId}
                    sx={{
                      display: "flex",
                      alignItems: "stretch",
                      p: 2,
                      borderRadius: 3,
                      boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
                      bgcolor: "#ffffff",
                      position: "relative",
                      overflow: "hidden",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(135deg, rgba(197,122,69,0.06), transparent)",
                        pointerEvents: "none",
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${item.image}`}
                      alt={item.title}
                      sx={{
                        width: 110,
                        height: 150,
                        borderRadius: 2,
                        objectFit: "cover",
                        mr: 2,
                        flexShrink: 0,
                      }}
                    />

                    <CardContent
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        zIndex: 1,
                      }}
                    >
                      <Box>
                        <Typography
                          variant="subtitle1"
                          fontWeight={700}
                          noWrap
                          sx={{ mb: 0.5 }}
                        >
                          {item.title}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 0.5 }}
                        >
                          {item.genre}
                        </Typography>

                        <Stack direction="row" spacing={3} mt={1}>
                          <Typography variant="body2" fontWeight={600}>
                            Price: ₹{item.prize}
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            Subtotal: ₹{subtotal}
                          </Typography>
                        </Stack>
                      </Box>

                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        mt={2}
                      >
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <IconButton
                            size="small"
                            onClick={() => decreaseQty(item.bookId, item.quantity)}
                            disabled={item.quantity === 1}
                            sx={{
                              borderRadius: "999px",
                              bgcolor: "#f3f4f6",
                              "&:hover": { bgcolor: "#e5e7eb" },
                            }}
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>

                          <Typography sx={{ minWidth: 24, textAlign: "center" }}>
                            {item.quantity}
                          </Typography>

                          <IconButton
                            size="small"
                            onClick={() => increaseQty(item.bookId, item.quantity)}
                            sx={{
                              borderRadius: "999px",
                              bgcolor: "#f3f4f6",
                              "&:hover": { bgcolor: "#e5e7eb" },
                            }}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Stack>

                        <Button
                          size="small"
                          startIcon={<DeleteIcon />}
                          onClick={() => removeItemHandler(item.bookId)}
                          sx={{
                            textTransform: "none",
                            color: "#b91c1c",
                            "&:hover": {
                              backgroundColor: "#fee2e2",
                            },
                          }}
                        >
                          Remove
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                );
              })}
            </Stack>

            <Box
              mt={4}
              p={3}
              bgcolor="#ffffff"
              borderRadius={3}
              boxShadow="0 8px 24px rgba(15, 23, 42, 0.08)"
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                mb={2}
                flexWrap="wrap"
                gap={2}
              >
                <Box>
                  <Typography variant="subtitle1" color="text.secondary">
                    Total Items
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    {items.length}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle1" color="text.secondary">
                    Total Price
                  </Typography>
                  <Typography variant="h5" fontWeight={700} color="#111827">
                    ₹{typeof totalPrice === "number" ? totalPrice.toFixed(2) : totalPrice}
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Link href="/checkout" passHref>
                  <Button variant="contained" color="primary">
                    Checkout
                  </Button>
                </Link>
              </Stack>
            </Box>
          </>
        )}

        {/* Pagination placed at the bottom of the component (inside the Container) */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 4,
            mb: 6,
          }}
        >
          <Pagination
            count={totalPageCount}
            page={page}
            onChange={(_, value) => setPage(value)}
            shape="rounded"
            size="medium"
            sx={{
              "& .MuiPaginationItem-root": {
                borderRadius: "10px",
                fontWeight: 600,
                color: "#0369a1",
              },
              "& .Mui-selected": {
                backgroundColor: "#e0f2fe !important",
                color: "#0369a1",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              },
              "& .MuiPaginationItem-root:hover": {
                backgroundColor: "#bae6fd",
              },
            }}
          />
        </Box>
      </Container>

      {/* Floating + button to quickly navigate to viewbooks */}
      <Link href="/viewbooks" passHref>
        <Tooltip title="Browse books" arrow>
          <Fab
            aria-label="browse-books"
            sx={{
              position: "fixed",
              right: 20,
              bottom: 28,
              bgcolor: "#c57a45",
              color: "#fff",
              "&:hover": {
                bgcolor: "#b36a36",
              },
              zIndex: (theme) => theme.zIndex.tooltip + 1,
            }}
          >
            <AddIcon />
          </Fab>
        </Tooltip>
      </Link>
    </Box>
  );
}
