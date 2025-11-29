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
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { addToCart } from "@/src/Redux/store/cartSlice";
import { addToWishlist } from "@/src/Redux/store/wishlistSlice";

import { AppDispatch, RootState } from "@/src/Redux/store/store";
import { fetchSingleBook, deleteBook } from "@/src/Redux/store/bookSlice";

export default function ViewOneBook({ params }: { params: { id: string } }) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { singleBook, loading, error } = useSelector(
    (state: RootState) => state.books
  );

  const [openConfirm, setOpenConfirm] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    setRole(localStorage.getItem("role"));
  }, []);

  useEffect(() => {
    if (params.id) {
      dispatch(fetchSingleBook(params.id));
    }
  }, [params.id, dispatch]);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!singleBook) return <Typography>No book found!</Typography>;

  const bookImage = Array.isArray(singleBook.image)
    ? singleBook.image[0]
    : singleBook.image;

  // DELETE
  const confirmDelete = async () => {
    await dispatch(deleteBook(params.id));
    setOpenConfirm(false);
    router.push("/sellerbooks");
  };

  // ADD TO CART
  const handleAddToCart = async () => {
    const result = await dispatch(addToCart(params.id));

    if (addToCart.fulfilled.match(result)) {
      toast.success("Book added to cart!");
    } else {
      toast.error(result.payload || "Failed to add book to cart.");
    }
  };

  // ⭐ ADD TO WISHLIST
  const handleAddToWishlist = async () => {
    const result = await dispatch(addToWishlist(params.id));

    if (addToWishlist.fulfilled.match(result)) {
      toast.success("Added to wishlist! ❤️");
    } else {
      toast.error(result.payload || "Failed to add to wishlist.");
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
        sx={{ width: "100%", height: 350, borderRadius: 3, objectFit: "cover", mb: 3 }}
      />

      <Typography variant="h6" gutterBottom>
        Author: {singleBook.author}
      </Typography>

      <Typography variant="body1">{singleBook.description}</Typography>

      <Typography mt={2} variant="h6">
        Price: ₹{singleBook.prize}
      </Typography>

      {/* ⭐ Role Based Buttons */}
      <Stack direction="row" spacing={2} mt={3}>
        {role === "customer" && (
          <>
            <Button variant="contained" color="primary" onClick={handleAddToCart}>
              Add to Cart
            </Button>

            <Button variant="outlined" color="primary" onClick={handleAddToWishlist}>
              Add to Wishlist
            </Button>
          </>
        )}

        {role === "seller" && (
          <>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => router.push(`/updatebook/${params.id}`)}
            >
              Update
            </Button>

            <Button variant="contained" color="error" onClick={() => setOpenConfirm(true)}>
              Delete
            </Button>
          </>
        )}
      </Stack>

      {/* Delete Confirmation */}
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
