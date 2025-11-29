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

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWishlist,
  removeFromWishlist,
  clearWishlist,
} from "@/src/Redux/store/wishlistSlice";
import { AppDispatch, RootState } from "@/src/Redux/store/store";

export default function WishlistPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector(
    (state: RootState) => state.wishlist
  );


  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const removeHandler = (id: string) => {
    dispatch(removeFromWishlist(id));
  };

  const clearHandler = () => {
    dispatch(clearWishlist());
  };

  if (loading)
    return (
      <Typography align="center" sx={{ mt: 4 }}>
        Loading your wishlist...
      </Typography>
    );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        My Wishlist
      </Typography>

      {error && (
        <Typography color="error" mb={2}>
          {error}
        </Typography>
      )}

      {items.length === 0 ? (
        <Typography>Your wishlist is empty.</Typography>
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
                </CardContent>

                {/* Remove Button */}
                <IconButton color="error" onClick={() => removeHandler(item.bookId)}>
                  <DeleteIcon />
                </IconButton>
              </Card>
            ))}
          </Stack>

          {/* Clear Wishlist Button */}
          <Box mt={4} textAlign="right">
            <Button
              variant="outlined"
              color="error"
              sx={{ px: 4, borderRadius: "12px" }}
              onClick={clearHandler}
            >
              Clear Wishlist
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
}
