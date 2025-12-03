
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

import { addToCart } from "@/src/redux/slices/cartSlice";
import { addToWishlist } from "@/src/redux/slices/wishlistSlice";

import { AppDispatch, RootState } from "@/src/redux/store";
import { fetchSingleBook, deleteBook } from "@/src/redux/slices/bookSlice";
import { useAuth } from "@/src/context/AuthContext";

export default function ViewOneBook() {
  const {role } = useAuth()
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { singleBook, loading, error } = useSelector(
    (state: RootState) => state.books
  );

  const [openConfirm, setOpenConfirm] = useState(false);



  

  useEffect(() => {
    if (id) {
      dispatch(fetchSingleBook(id));
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


  const handleAddToWishlist = async () => {
    const result = await dispatch(addToWishlist(id));
    if (addToWishlist.fulfilled.match(result)) {
      toast.success("Added to wishlist! ❤️");
      router.push("/cart");
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
