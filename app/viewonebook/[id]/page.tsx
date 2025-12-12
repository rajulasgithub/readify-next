"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CardMedia,
  Container,
  Typography,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogActions,
  Box,
  Chip,
  Skeleton,
  Divider,
} from "@mui/material";
import { useRouter, useParams } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import HeartBrokenIcon from "@mui/icons-material/HeartBroken";

import { addToCart } from "@/src/redux/slices/cartSlice";

import {
  addToWishlist,
  fetchWishlist,
  removeFromWishlist,
} from "@/src/redux/slices/wishlistSlice";
import { useAuth } from "@/src/context/AuthContext"; 

import { AppDispatch, RootState } from "@/src/redux/store";
import { fetchSingleBook, deleteBook } from "@/src/redux/slices/bookSlice";


type BookType = {
  title?: string;
  image?: string | string[];
  author?: string;
  genre?: string[];
  language?: string[];
  page_count?: number;
  publish_date?: string | number;
  excerpt?: string;
  description?: string;
  prize?: number;
};

export default function ViewOneBook() {
  const { role } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const params = useParams();
  const id = (params as { id?: string } | undefined)?.id;
   const { blocked } = useAuth();

  const { singleBook, loading, error } = useSelector(
    (state: RootState) => state.books
  );

  const { items: wishlistItems } = useSelector(
    (state: RootState) => state.wishlist
  );

  const [openConfirm, setOpenConfirm] = useState(false);
  const [busyWishlist, setBusyWishlist] = useState(false);
  const [busyCart, setBusyCart] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchSingleBook(id));
      // fetch wishlist to check status (no explicit any cast)
      dispatch(fetchWishlist({ page: 1, limit: 9999 }));
    }
  }, [id, dispatch]);

  // typed book object used in UI
  const book = (singleBook as BookType) || ({} as BookType);
  const bookImage = Array.isArray(book.image) ? book.image?.[0] : book.image;

  const confirmDelete = async () => {
    if (!id) return;
    // deleteBook thunk dispatch
    await dispatch(deleteBook(id));
    setOpenConfirm(false);

    if (role === "seller") {
      router.push("/sellerbooks");
    } else if (role === "customer") {
      router.push("/viewbooks");
    } else {
      router.push("/admin");
    }
  };

  const handleAddToCart = async () => {
    if (!id) return;
    setBusyCart(true);
    const result = await dispatch(addToCart(id));
    setBusyCart(false);

    if (addToCart.fulfilled.match(result)) {
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
    } else {
      // result.payload might be undefined or a string; keep behavior same
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payloadMsg = (result as any)?.payload;
      toast.error(payloadMsg || "Failed to add book to cart.");
    }
  };

  const isInWishlist = wishlistItems?.some((item) => item.bookId === id);

  const handleWishlistToggle = async () => {
    if (!id) return;
    setBusyWishlist(true);

    if (isInWishlist) {
      const result = await dispatch(removeFromWishlist(id));
      setBusyWishlist(false);
      if (removeFromWishlist.fulfilled.match(result)) {
        toast(
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span>removed from Wishlist!</span>
          <HeartBrokenIcon
            onClick={() => router.push("/cart")}
            style={{ cursor: "pointer", color: "#1976d2" }}
          />
        </div>,
        {
          autoClose: 5000,
        }
      );
        dispatch(fetchWishlist({ page: 1, limit: 9999 }));
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const payloadMsg = (result as any)?.payload;
         toast(
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span>Failed to remove from Wishlist!</span>
          <ShoppingCartIcon
            onClick={() => router.push("/cart")}
            style={{ cursor: "pointer", color: "#1976d2" }}
          />
        </div>,
        {
          autoClose: 5000,
        }
      );
      }
    } else {
      const result = await dispatch(addToWishlist(id));
      setBusyWishlist(false);
      if (addToWishlist.fulfilled.match(result)) {
         toast(
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span>Added to Wishlist!</span>
          <FavoriteIcon
            onClick={() => router.push("/cart")}
            style={{ cursor: "pointer", color: "#1976d2" }}
          />
        </div>,
        {
          autoClose: 5000,
        }
      );
        dispatch(fetchWishlist({ page: 1, limit: 9999 }));
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const payloadMsg = (result as any)?.payload;
         toast(
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span>failed adding Wishlist!</span>
          <ShoppingCartIcon
            onClick={() => router.push("/cart")}
            style={{ cursor: "pointer", color: "#1976d2" }}
          />
        </div>,
        {
          autoClose: 5000,
        }
      );
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#f8f8f8",
        pt: 4,
      }}
    >
      <Container maxWidth="md" sx={{ py: 4, minHeight: "70vh" }}>
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

        {loading ? (
          <Skeleton variant="text" width="60%" height={40} sx={{ mb: 2 }} />
        ) : (
          <Typography variant="h4" fontWeight="bold" mb={3}>
            {book.title}
          </Typography>
        )}

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={4}
          alignItems={{ xs: "flex-start", md: "center" }}
        >
          {/* Left: Image */}
          <Box sx={{ flex: "0 0 420px", width: { xs: "100%", md: 420 } }}>
            {loading ? (
              <Skeleton
                variant="rectangular"
                width="100%"
                height={380}
                sx={{ borderRadius: 2 }}
              />
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: 380,
                  borderRadius: 2,
                  bgcolor: "#fafafa",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  border: "1px solid #f1f5f9",
                  position: "relative",
                }}
              >
                {bookImage ? (
                  <CardMedia
                    component="img"
                    image={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${bookImage}`}
                    alt={book.title}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      p: 2,
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,0.35), rgba(245,245,245,0.35))",
                    }}
                  />
                ) : (
                  <Box sx={{ textAlign: "center", color: "text.secondary", p: 2 }}>
                    <Typography variant="body2">No image available</Typography>
                  </Box>
                )}
              </Box>
            )}
          </Box>

          {/* Right: Details */}
          <Box sx={{ flex: 1 }}>
            {loading ? (
              <>
                <Skeleton variant="text" width="40%" height={30} />
                <Skeleton variant="text" width="50%" height={28} />
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={110}
                  sx={{ mt: 2, borderRadius: 1 }}
                />
              </>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <>
                <Typography variant="h6" gutterBottom>
                  Author: {book.author}
                </Typography>

                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" mb={2}>
                  {book.genre && Array.isArray(book.genre) && book.genre.length > 0 && (
                    <Chip label={book.genre.join(", ")} size="small" sx={{ mr: 1 }} />
                  )}

                  {book.language && Array.isArray(book.language) && book.language.length > 0 && (
                    <Chip label={book.language.join(", ")} size="small" sx={{ mr: 1 }} />
                  )}

                  {book.page_count && <Chip label={`${book.page_count} pages`} size="small" sx={{ mr: 1 }} />}

                  {book.publish_date && <Chip label={new Date(String(book.publish_date)).toLocaleDateString()} size="small" />}
                </Stack>

                <Divider sx={{ mb: 2 }} />

                {book.excerpt && (
                  <Box sx={{ mb: 2, p: 2, borderRadius: 1, bgcolor: "#fffaf3", border: "1px solid #fbedd8" }}>
                    <Typography variant="subtitle2" sx={{ fontStyle: "italic", mb: 1 }}>
                      Excerpt
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.primary", whiteSpace: "pre-line" }}>
                      {book.excerpt}
                    </Typography>
                  </Box>
                )}

                <Typography variant="body1" sx={{ color: "text.secondary", mb: 2, whiteSpace: "pre-line" }}>
                  {book.description}
                </Typography>

                <Typography mt={1} variant="h6" sx={{ mb: 2 }}>
                  Price: <Box component="span" sx={{ fontWeight: 800 }}>₹{book.prize}</Box>
                </Typography>

                <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                  {role === "customer" && (
                    <>
                      <Button
                        variant="contained"
                    
                        startIcon={<ShoppingCartIcon />}
                        disabled={busyCart || blocked}
                        onClick={handleAddToCart}
                        sx={{ bgcolor: "#c57a45", "&:hover": { bgcolor: "#b36a36" }, textTransform: "none" }}
                      >
                        {busyCart ? "Adding..." : "Add to Cart"}
                      </Button>

                      <Button
                        variant={isInWishlist ? "outlined" : "contained"}
                        startIcon={isInWishlist ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                        onClick={handleWishlistToggle}
                        disabled={busyWishlist || blocked}
                        sx={{
                          textTransform: "none",
                          borderColor: isInWishlist ? "#c57a45" : undefined,
                          color: isInWishlist ? "#c57a45" : undefined,
                          bgcolor: isInWishlist ? "#fff" : undefined,
                          "&:hover": { borderColor: "#c57a45" },
                        }}
                      >
                        {isInWishlist ? "Remove Wishlist" : "Add to Wishlist"}
                      </Button>
                    </>
                  )}

                  {role === "seller" && (
                    <>
                      <Button
                        variant="outlined"
                        disabled={blocked}
                        startIcon={<EditIcon />}
                        onClick={() => router.push(`/updatebook/${id}`)}
                        sx={{ textTransform: "none" }}
                      >
                        Update
                      </Button>

                      <Button
                        variant="contained"
                         disabled={blocked}
                        color="error"
                        startIcon={<DeleteOutlineIcon />}
                        onClick={() => setOpenConfirm(true)}
                        sx={{ textTransform: "none" }}
                      >
                        Delete
                      </Button>
                    </>
                  )}

                  {role === "admin" && (
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<DeleteOutlineIcon />}
                      onClick={() => setOpenConfirm(true)}
                      sx={{ textTransform: "none" }}
                    >
                      Delete
                    </Button>
                  )}
                </Stack>
              </>
            )}
          </Box>
        </Stack>

        {/* Delete confirmation */}
        <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
          <DialogTitle>Are you sure you want to delete this book?</DialogTitle>
          <DialogActions>
            <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
            <Button onClick={confirmDelete} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
