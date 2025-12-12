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
  Fab,
  Tooltip,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import AddIcon from "@mui/icons-material/Add";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  fetchWishlist,
  removeFromWishlist,
  clearWishlist,
} from "@/src/redux/slices/wishlistSlice";
import { AppDispatch, RootState } from "@/src/redux/store";
import { addToCart } from "@/src/redux/slices/cartSlice";
import { useAuth } from "@/src/context/AuthContext";

export default function WishlistPage() {
  const { blocked } = useAuth()
  const router = useRouter();
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
    dispatch(addToCart(id));
    toast(
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span>Added to cart!</span>
        <ShoppingCartIcon
          onClick={() => router.push("/cart")}
          style={{ cursor: "pointer", color: "#1976d2" }}
        />
      </div>,
      {
        autoClose: 5000,
      }
    );
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
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh", position: "relative" }}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Container maxWidth="lg" sx={{ py: 4 }}>
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
                  disabled={blocked}
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
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
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
              href="/viewbooks"
            >
              Browse Books
            </Button>
          </Box>
        )}

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
  disabled={blocked}
  onClick={() => removeHandler(item.bookId)}
  sx={{
    position: "absolute",
    top: 8,
    right: 8,
    bgcolor: "#ffffff",
    opacity: blocked ? 0.4 : 1,        // ← Dim when blocked
    pointerEvents: blocked ? "none" : "auto", // ← Prevent clicking even if opacity allows
    "&:hover": {
      bgcolor: blocked ? "#ffffff" : "#f1f5f9", // No hover effect if blocked
    },
  }}
>
  <DeleteIcon
    fontSize="small"
    color={blocked ? "disabled" : "error"}   // ← Grey out icon
  />
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
                          disabled={blocked}
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
                          onClick={() => router.push(`/viewonebook/${item.bookId}`)}
                        >
                          View Details
                        </Button>
                      </Box>
                    </Card>
                  </Box>
                ))}
              </Box>
            </Box>

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
