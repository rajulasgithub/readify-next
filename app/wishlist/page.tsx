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
  Pagination,
  Chip,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWishlist,
  removeFromWishlist,
  clearWishlist,
} from "@/src/Redux/store/wishlistSlice";
import { AppDispatch, RootState } from "@/src/Redux/store/store";
import { addToCart } from "@/src/Redux/store/cartSlice"; // 👈 add this

export default function WishlistPage() {
  const dispatch = useDispatch<AppDispatch>();

  const { items, loading, error, totalPages } = useSelector(
    (state: RootState) => state.wishlist
  );

  const [page, setPage] = useState(1);
  const limit = 5;
  const totalPageCount = totalPages || 1;

  useEffect(() => {
    dispatch(fetchWishlist({ page, limit }));
  }, [dispatch, page, limit]);

  const removeHandler = (id: string) => {
    dispatch(removeFromWishlist(id));
  };

  const clearHandler = () => {
    dispatch(clearWishlist());
  };

  const addToCartHandler = (id: string) => {
    // ✅ Adjust payload if your cartSlice expects a different shape
    dispatch(addToCart(id));
  };

  if (loading) {
    return (
      <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh" }}>
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Typography
            align="center"
            sx={{ mt: 8, fontWeight: 500, color: "text.secondary" }}
          >
            Loading your wishlist...
          </Typography>
        </Container>
      </Box>
    );
  }

  const hasItems = items && items.length > 0;

  return (
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* HEADER / HERO */}
        <Box
          sx={{
            maxWidth: "900px",
            mx: "auto",
            mb: 4,
            mt: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", md: "center" },
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="overline"
                sx={{ letterSpacing: 3, color: "text.secondary" }}
              >
                WISHLIST
              </Typography>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  lineHeight: 1.1,
                  mb: 1,
                }}
              >
                Saved Books for Later
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: "text.secondary", maxWidth: 420 }}
              >
                Keep track of the books you love. Move them to your cart whenever
                you&apos;re ready to read.
              </Typography>
            </Box>

            {hasItems && (
              <Stack direction="row" spacing={2} alignItems="center">
                <Chip
                  label={`${items.length} item${items.length > 1 ? "s" : ""}`}
                  size="small"
                  sx={{
                    borderRadius: "999px",
                    bgcolor: "#111827",
                    color: "#ffffff",
                    fontSize: 12,
                  }}
                />
                <Button
                  variant="outlined"
                  color="error"
                  sx={{
                    borderRadius: "999px",
                    textTransform: "none",
                    px: 3,
                  }}
                  onClick={clearHandler}
                >
                  Clear Wishlist
                </Button>
              </Stack>
            )}
          </Box>
        </Box>

        {/* ERROR MESSAGE */}
        {error && (
          <Box
            sx={{
              maxWidth: "900px",
              mx: "auto",
              mb: 3,
              bgcolor: "#fef2f2",
              borderRadius: 2,
              px: 2.5,
              py: 1.5,
              border: "1px solid #fecaca",
            }}
          >
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          </Box>
        )}

        {/* EMPTY STATE */}
        {!hasItems && !error && (
          <Box
            sx={{
              maxWidth: 500,
              mx: "auto",
              mt: 6,
              p: 4,
              bgcolor: "#ffffff",
              borderRadius: 4,
              textAlign: "center",
              boxShadow: "0 10px 25px rgba(15,23,42,0.08)",
            }}
          >
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                bgcolor: "#fdf7f2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2,
              }}
            >
              <FavoriteBorderOutlinedIcon sx={{ color: "#c57a45", fontSize: 32 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Your wishlist is empty
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", mb: 3 }}
            >
              Start exploring books and tap the wishlist icon to save your
              favourites here.
            </Typography>
            <Button
              variant="contained"
              sx={{
                borderRadius: "999px",
                px: 4,
                py: 1.2,
                textTransform: "none",
                bgcolor: "#c57a45",
                "&:hover": { bgcolor: "#b36a36" },
              }}
              href="/"
            >
              Browse Books
            </Button>
          </Box>
        )}

        {/* WISHLIST GRID */}
        {hasItems && (
          <>
            <Box
              sx={{
                maxWidth: "1100px",
                mx: "auto",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 3,
                  justifyContent: { xs: "center", md: "flex-start" },
                  mb: 4,
                }}
              >
                {items.map((item) => (
                  <Box
                    key={item.bookId}
                    sx={{
                      width: { xs: "100%", sm: "47%", md: "31%" },
                      minWidth: 260,
                    }}
                  >
                    <Card
                      elevation={0}
                      sx={{
                        borderRadius: 3,
                        bgcolor: "#ffffff",
                        overflow: "hidden",
                        position: "relative",
                        "&:hover": {
                          boxShadow: "0 10px 25px rgba(15,23,42,0.08)",
                          transform: "translateY(-4px)",
                        },
                        transition: "all 0.25s ease",
                      }}
                    >
                      {/* IMAGE + TAG + DELETE */}
                      <Box sx={{ position: "relative", p: 2, pb: 0 }}>
                        {item.genre && (
                          <Chip
                            label={item.genre}
                            size="small"
                            sx={{
                              position: "absolute",
                              top: 10,
                              left: 10,
                              bgcolor: "#f97316",
                              color: "#fff",
                              fontSize: 11,
                              height: 22,
                            }}
                          />
                        )}

                        <IconButton
                          size="small"
                          onClick={() => removeHandler(item.bookId)}
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            bgcolor: "#ffffff",
                            "&:hover": { bgcolor: "#f1f5f9" },
                          }}
                        >
                          <DeleteIcon fontSize="small" color="error" />
                        </IconButton>

                        <CardMedia
                          component="img"
                          image={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${item.image}`}
                        
                          sx={{
                            borderRadius: 3,
                            height: 220,         
                            objectFit: "contain",
                            bgcolor: "#f9fafb",   
                          }}
                        />
                      </Box>

                     
                      <CardContent sx={{ pt: 1.5, pb: 1 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600, mb: 0.5 }}
                          noWrap
                        >
                          {item.title}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary", mb: 1 }}
                          noWrap
                        >
                          {item.genre || "Book"}
                        </Typography>

                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 700, color: "#111827" }}
                        >
                          ₹{item.prize}
                        </Typography>
                      </CardContent>

                      {/* ACTIONS */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          px: 2,
                          pb: 2,
                          pt: 0.5,
                          gap: 1.5,
                        }}
                      >
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            borderRadius: "999px",
                            textTransform: "none",
                            px: 2.5,
                            py: 0.6,
                            bgcolor: "#c57a45",
                            fontSize: 13,
                            "&:hover": { bgcolor: "#b36a36" },
                            flexShrink: 0,
                          }}
                          onClick={() => addToCartHandler(item.bookId)}
                        >
                          Add to Cart
                        </Button>

                        <Button
                          variant="outlined"
                          size="small"
                          sx={{
                            borderRadius: "999px",
                            textTransform: "none",
                            borderColor: "#e5e7eb",
                            color: "text.primary",
                            fontSize: 13,
                            px: 2.5,
                            "&:hover": {
                              borderColor: "#c57a45",
                              bgcolor: "rgba(197,122,69,0.04)",
                            },
                            flexGrow: 1,
                          }}
                          // TODO: hook to your book details page, e.g. router.push(`/viewonebook/${item.bookId}`)
                        >
                          View Details
                        </Button>
                      </Box>
                    </Card>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* PAGINATION */}
            <Box mt={2} mb={4} display="flex" justifyContent="center">
              <Pagination
                count={totalPageCount}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
                shape="rounded"
                size="medium"
              />
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
}
