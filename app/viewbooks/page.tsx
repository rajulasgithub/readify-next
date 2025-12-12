"use client";

import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Stack,
  Pagination,
  CircularProgress,
} from "@mui/material";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useEffect, useState, MouseEvent } from "react";
import { useRouter } from "next/navigation";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/redux/store";
import { fetchBooks, Book } from "@/src/redux/slices/bookSlice";
import {
  addToWishlist,
  removeFromWishlist,
  fetchWishlist,
} from "@/src/redux/slices/wishlistSlice";
import Searchfield from "@/src/components/Searchfield";
import { toast } from "react-toastify";

export default function ViewBooks() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { books, loading, error, totalPages } = useSelector(
    (state: RootState) => state.books
  );

  const { items: wishlistItems } = useSelector(
    (state: RootState) => state.wishlist
  );

  const [page, setPage] = useState<number>(1);
  const limit = 8;

  const [searchInput, setSearchInput] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  // Fetch wishlist once
  useEffect(() => {
    dispatch(fetchWishlist({ page: 1, limit: 9999 }));
  }, [dispatch]);

  // Debounced search
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  // Fetch books
  useEffect(() => {
    dispatch(
      fetchBooks({
        page,
        limit,
        search: search || undefined,
      })
    );
  }, [page, search, dispatch]);

  const handlePageChange = (_: unknown, value: number) => setPage(value);

  const viewDetails = (id: string) => {
    router.push(`/viewonebook/${id}`);
  };

  const isInWishlist = (bookId: string) =>
    wishlistItems?.some((item) => item.bookId === bookId);

  const handleWishlistClick = async (
    e: MouseEvent<HTMLButtonElement>,
    bookId: string
  ) => {
    e.stopPropagation();

    const inWishlist = isInWishlist(bookId);

    try {
      if (inWishlist) {
        await dispatch(removeFromWishlist(bookId)).unwrap();
        toast.info("Removed from wishlist");
      } else {
        await dispatch(addToWishlist(bookId)).unwrap();
        toast.success("Added to wishlist");
        dispatch(fetchWishlist({ page: 1, limit: 9999 }));
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Wishlist action failed";
      toast.error(message);
    }
  };

  return (
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Searchfield
            value={searchInput}
            onChange={(val: string) => setSearchInput(val)}
            placeholder="Search books..."
          />
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography align="center" sx={{ py: 6, color: "red" }}>
            {typeof error === "string" ? error : "Something went wrong."}
          </Typography>
        ) : books.length === 0 ? (
          <Typography align="center" sx={{ py: 6 }}>
            No books found.
          </Typography>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 4,
              justifyContent: { xs: "center", sm: "flex-start" },
              mb: 5,
            }}
          >
            {books.map((book: Book) => {
              const wishlisted = isInWishlist(book._id);

              return (
                <Card
                  key={book._id}
                  elevation={0}
                  sx={{
                    width: 250,
                    borderRadius: 3,
                    bgcolor: "#ffffff",
                    overflow: "hidden",
                    "&:hover": {
                      boxShadow: "0 10px 25px rgba(15,23,42,0.08)",
                      transform: "translateY(-4px)",
                    },
                    transition: "all 0.25s ease",
                    cursor: "pointer",
                  }}
                  onClick={() => viewDetails(book._id)}
                >
                  <Box sx={{ position: "relative", p: 2, pb: 0 }}>
                    <IconButton
                      size="small"
                      onClick={(e) => handleWishlistClick(e, book._id)}
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        bgcolor: "#ffffff",
                        "&:hover": { bgcolor: "#f1f5f9" },
                      }}
                    >
                      {wishlisted ? (
                        <FavoriteIcon fontSize="small" color="error" />
                      ) : (
                        <FavoriteBorderOutlinedIcon fontSize="small" />
                      )}
                    </IconButton>

                    <CardMedia
                      component="img"
                      image={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${book.image}`}
                      alt={book.title}
                      sx={{
                        borderRadius: 3,
                        height: 170,
                        width: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </Box>

                  <CardContent sx={{ pt: 1, pb: 0 }}>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary", mb: 0.5 }}
                      noWrap
                    >
                      {book.author}
                    </Typography>

                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, mb: 0.5 }}
                      noWrap
                    >
                      {book.title}
                    </Typography>

                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 700, color: "#111827" }}
                    >
                      ₹{book.prize}
                    </Typography>
                  </CardContent>

                  <CardActions sx={{ px: 2, pb: 2, pt: 1 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        viewDetails(book._id);
                      }}
                      sx={{
                        borderRadius: "999px",
                        textTransform: "none",
                        fontSize: 13,
                        fontWeight: 600,
                        border: "1.8px solid #c57a45",
                        color: "#c57a45",
                        "&:hover": {
                          borderColor: "#a65a28",
                          backgroundColor: "rgba(197,122,69,0.08)",
                        },
                      }}
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              );
            })}
          </Box>
        )}

        {totalPages > 1 && (
          <Stack alignItems="center" sx={{ pb: 4 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Stack>
        )}
      </Container>
    </Box>
  );
}
