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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCartItems,
  removeCartItem,
  updateCartQuantity,
  clearCart,          
} from "@/src/Redux/store/cartSlice";
import { AppDispatch, RootState } from "@/src/Redux/store/store";

export default function CartPage() {
  const dispatch = useDispatch<AppDispatch>();

  const { items, loading, error, totalPrice, totalQuantity } = useSelector(
    (state: RootState) => state.cart
  );

  useEffect(() => {
    dispatch(fetchCartItems());
  }, [dispatch]);

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

  if (loading)
    return (
      <Typography align="center" sx={{ mt: 4 }}>
        Loading your cart...
      </Typography>
    );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        My Cart
      </Typography>

      {error && (
        <Typography color="error" mb={2}>
          {error}
        </Typography>
      )}

      {items.length === 0 ? (
        <Typography>No items in your cart.</Typography>
      ) : (
        <>
          <Stack spacing={3}>
            {items.map((item) => (
              <Card
                key={item.bookId}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 2,
                  borderRadius: 3,
                  boxShadow: "0 3px 12px rgba(0,0,0,0.06)",
                }}
              >
                <CardMedia
                  component="img"
                  image={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${item.image}`}
                  alt={item.title}
                  sx={{
                    width: 110,
                    height: 130,
                    borderRadius: 2,
                    objectFit: "cover",
                    mr: 2,
                  }}
                />

                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" noWrap>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.genre}
                  </Typography>

                  <Typography variant="h6" mt={1}>
                    ₹{item.prize}
                  </Typography>

                  <Stack direction="row" alignItems="center" spacing={1} mt={1}>
                    <IconButton
                      size="small"
                      onClick={() => decreaseQty(item.bookId, item.quantity)}
                    >
                      <RemoveIcon />
                    </IconButton>

                    <Typography>{item.quantity}</Typography>

                    <IconButton
                      size="small"
                      onClick={() => increaseQty(item.bookId, item.quantity)}
                    >
                      <AddIcon />
                    </IconButton>
                  </Stack>
                </CardContent>

                <IconButton
                  color="error"
                  onClick={() => removeItemHandler(item.bookId)}
                >
                  <DeleteIcon />
                </IconButton>
              </Card>
            ))}
          </Stack>

          <Box mt={4} textAlign="right">
            <Typography variant="h6">Total Items: {totalQuantity}</Typography>
            <Typography variant="h5" fontWeight={700}>
              Total Price: ₹{totalPrice}
            </Typography>

            <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
     
              <Button
                variant="outlined"
                color="error"
                onClick={clearAllHandler}
                sx={{ px: 4, borderRadius: "12px" }}
              >
                Clear Cart
              </Button>

             
              <Button
                variant="contained"
                color="primary"
                sx={{ px: 4, borderRadius: "12px" }}
              >
                Checkout
              </Button>
            </Stack>
          </Box>
        </>
      )}
    </Container>
  );
}
