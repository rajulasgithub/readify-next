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
} from "@mui/material";
import { useRouter, useParams } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import { addToCart } from "@/src/redux/slices/cartSlice";
import { addToWishlist, fetchWishlist, removeFromWishlist } from "@/src/redux/slices/wishlistSlice";

import { AppDispatch, RootState } from "@/src/redux/store";
import { fetchSingleBook, deleteBook } from "@/src/redux/slices/bookSlice";
import { useAuth } from "@/src/context/AuthContext";

export default function ViewOneBook() {
  const { role } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { singleBook, loading, error } = useSelector(
    (state: RootState) => state.books
  );

  const { items: wishlistItems } = useSelector(
    (state: RootState) => state.wishlist
  );

  const [openConfirm, setOpenConfirm] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchSingleBook(id));
      dispatch(fetchWishlist({ page: 1, limit: 9999 }) as any); // fetch wishlist to check status
    }
  }, [id, dispatch]);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!singleBook) return <Typography>No book found!</Typography>;

  const bookImage = Array.isArray(singleBook.image)
    ? singleBook.image[0]
    : singleBook.image;

  const confirmDelete = async () => {
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
    const result = await dispatch(addToCart(id));
    if (addToCart.fulfilled.match(result)) {
      toast.success("Book added to cart!");
    } else {
      toast.error(result.payload || "Failed to add book to cart.");
    }
  };

 const isInWishlist = wishlistItems?.some((item) => item.bookId === id);

  const handleWishlistToggle = async () => {
  if (isInWishlist) {
    // remove from wishlist
    const result = await dispatch(removeFromWishlist(id) as any);
    if (removeFromWishlist.fulfilled.match(result)) {
      toast.info(
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span>Removed from wishlist </span>
          <FavoriteBorderIcon
            style={{ cursor: "pointer", color: "#c57a45" }}
            onClick={() => router.push("/wishlist")}
          />
        </div>,
        { autoClose: 5000 }
      );
      dispatch(fetchWishlist({ page: 1, limit: 9999 }) as any); // refresh wishlist
    } else {
      toast.error(result.payload || "Failed to remove from wishlist.");
    }
  } else {
    // add to wishlist
    const result = await dispatch(addToWishlist(id) as any);
    if (addToWishlist.fulfilled.match(result)) {
      toast.success(
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span>Added to wishlist </span>
          <FavoriteBorderIcon
            style={{ cursor: "pointer", color: "#c57a45" }}
            onClick={() => router.push("/wishlist")}
          />
        </div>,
        { autoClose: 5000 }
      );
      dispatch(fetchWishlist({ page: 1, limit: 9999 }) as any); // refresh wishlist
    } else {
      toast.error(result.payload || "Failed to add to wishlist.");
    }
  }
};

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <ToastContainer />

      <Typography variant="h4" fontWeight="bold" mb={3}>
        {singleBook.title}
      </Typography>

      <CardMedia
        component="img"
        image={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${bookImage}`}
        alt={singleBook.title}
        sx={{
          width: "100%",
          height: 350,
          borderRadius: 3,
          objectFit: "cover",
          mb: 3,
        }}
      />

      <Typography variant="h6" gutterBottom>
        Author: {singleBook.author}
      </Typography>

      <Typography variant="body1">{singleBook.description}</Typography>

      <Typography mt={2} variant="h6">
        Price: ₹{singleBook.prize}
      </Typography>

      <Stack direction="row" spacing={2} mt={3}>
        {role === "customer" && (
          <>
            <Button variant="contained" color="primary" onClick={handleAddToCart}>
              Add to Cart
            </Button>
           <Button
  variant={isInWishlist ? "outlined" : "contained"}
  color={isInWishlist ? "secondary" : "primary"}
  onClick={handleWishlistToggle}
  sx={{
  
   
    cursor: "pointer",
    backgroundColor: isInWishlist ? "#fff" : undefined,
    borderColor: isInWishlist ? "#c57a45" : undefined,
    color: isInWishlist ? "#c57a45" : undefined,
    "&:hover": {
      backgroundColor: isInWishlist ? "#f9f5f2" : undefined,
      borderColor: "#c57a45",
    },
  }}
>
  {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
</Button>
          </>
        )}

        {role === "seller" && (
          <>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => router.push(`/updatebook/${id}`)}
            >
              Update
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => setOpenConfirm(true)}
            >
              Delete
            </Button>
          </>
        )}

        {role === "admin" && (
          <Button
            variant="contained"
            color="error"
            onClick={() => setOpenConfirm(true)}
          >
            Delete
          </Button>
        )}
      </Stack>

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
  );
}
