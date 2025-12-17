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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
import { useAuth } from "@/src/context/AuthContext";

export default function CartPage() {
  const { blocked } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [page, setPage] = useState(1);
  const limit = 4;


  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const {
    items = [],
    loading,
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

  const openRemoveConfirm = (id: string) => {
    setSelectedItemId(id);
    setConfirmRemoveOpen(true);
  };

  const confirmRemoveItem = () => {
    if (selectedItemId) {
      dispatch(removeCartItem(selectedItemId));
    }
    setConfirmRemoveOpen(false);
    setSelectedItemId(null);
  };

  const confirmClearCart = () => {
    dispatch(clearCart());
    setConfirmClearOpen(false);
  };

  if (loading) {
    return (
      <Box minHeight="70vh" display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box minHeight="100vh" bgcolor="#f5f7fb" py={5}>
      <Container maxWidth="md">
      
        <Stack direction="row" justifyContent="space-between" mb={4}>
          <Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <ShoppingCartIcon sx={{ color: "#c57a45" }} />
              <Typography variant="h4" fontWeight={700}>
                My Cart
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} mt={1}>
              <Chip label={`${items.length} items`} />
              <Chip label={`Total ₹${totalPrice}`} color="primary" />
            </Stack>
          </Stack>

          {items.length > 0 && (
            <Button
              variant="outlined"
              color="error"
              disabled={blocked}
              onClick={() => setConfirmClearOpen(true)}
            >
              Clear Cart
            </Button>
          )}
        </Stack>

     
        {items.length === 0 ? (
          <Box textAlign="center" bgcolor="#fff" p={4} borderRadius={3}>
            <Typography variant="h6">Your cart is empty</Typography>
            <Button
              sx={{ mt: 2 }}
              variant="contained"
              onClick={() => router.push("/viewbooks")}
            >
              Browse Books
            </Button>
          </Box>
        ) : (
          <>
            <Stack spacing={2}>
              {items.map((item) => (
                <Card key={item.bookId} sx={{ display: "flex", p: 2 }}>
                  <CardMedia
                    component="img"
                    image={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${item.image}`}
                    sx={{ width: 100, height: 140 }}
                  />

                  <CardContent sx={{ flex: 1 }}>
                    <Typography fontWeight={700}>{item.title}</Typography>
                    <Typography color="text.secondary">{item.genre}</Typography>

                    <Stack direction="row" spacing={2} mt={1}>
                      <Typography>₹{item.prize}</Typography>
                      <Typography>
                        Subtotal ₹{item.prize * item.quantity}
                      </Typography>
                    </Stack>

                    <Stack direction="row" justifyContent="space-between" mt={2}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <IconButton
                          disabled={item.quantity === 1 || blocked}
                          onClick={() => decreaseQty(item.bookId, item.quantity)}
                        >
                          <RemoveIcon />
                        </IconButton>

                        <Typography>{item.quantity}</Typography>

                        <IconButton
                          disabled={blocked}
                          onClick={() => increaseQty(item.bookId, item.quantity)}
                        >
                          <AddIcon />
                        </IconButton>
                      </Stack>

                      <Button
                        color="error"
                        startIcon={<DeleteIcon />}
                        disabled={blocked}
                        onClick={() => openRemoveConfirm(item.bookId)}
                      >
                        Remove
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>

          
            <Box mt={4} p={3} bgcolor="#fff" borderRadius={3}>
              <Stack direction="row" justifyContent="space-between">
                <Typography>Total Items: {totalQuantity}</Typography>
                <Typography fontWeight={700}>₹{totalPrice}</Typography>
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Button
                fullWidth
                variant="contained"
                disabled={blocked}
                onClick={() => router.push("/checkout")}
              >
                Checkout
              </Button>
            </Box>
          </>
        )}

       
        {items.length >= limit && (
          <Box display="flex" justifyContent="center" mt={4}>
            <Pagination
              count={totalPageCount}
              page={page}
              onChange={(_, value) => setPage(value)}
            />
          </Box>
        )}
      </Container>

   
      <Dialog open={confirmRemoveOpen} onClose={() => setConfirmRemoveOpen(false)}>
        <DialogTitle>Remove Item</DialogTitle>
        <DialogContent>
          Are you sure you want to remove this item from the cart?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmRemoveOpen(false)}>Cancel</Button>
          <Button color="error" onClick={confirmRemoveItem}>
            Remove
          </Button>
        </DialogActions>
      </Dialog>

   
      <Dialog open={confirmClearOpen} onClose={() => setConfirmClearOpen(false)}>
        <DialogTitle>Clear Cart</DialogTitle>
        <DialogContent>
          Are you sure you want to remove all items from the cart?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmClearOpen(false)}>Cancel</Button>
          <Button color="error" onClick={confirmClearCart}>
            Clear
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
