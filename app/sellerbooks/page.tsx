"use client";

import React, { useEffect, useState, ChangeEvent } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Stack,
  Pagination,
  CircularProgress,
  Fab,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import { AppDispatch, RootState } from "@/src/redux/store";
import { fetchBooks, Book } from "@/src/redux/slices/bookSlice";
import Searchfield from "@/src/components/Searchfield";

export default function ViewSellerBooks() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { books, loading, error, totalPages } = useSelector(
    (state: RootState) => state.books
  );

  const [page, setPage] = useState(1);
  const limit = 8;


  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");


  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);

    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    dispatch(
      fetchBooks({
        page,
        limit,
        search: search || undefined,
      })
    );
  }, [page, search, dispatch]);

  const handlePageChange = (_: ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const viewDetails = (id: string) => {
    router.push(`/viewonebook/${id}`);
  };

  const goToAdd = () => router.push("/addbook");

  return (
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">

        <Box component="form" onSubmit={(e) => e.preventDefault()} sx={{ mb: 8 }}>
          <Searchfield
            value={searchInput}
            onChange={(val) => setSearchInput(val)}
            placeholder="Search books..."
            onKeyDown={(e) => {
              if (e.key === "Enter") e.preventDefault();
            }}
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
            No books uploaded yet.
          </Typography>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              gap: 3,
              mb: 5,
            }}
          >
            {books
              .filter((book): book is Book => Boolean(book && book._id))
              .map((book) => (
                <Card
                  key={book._id}
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    bgcolor: "#ffffff",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    minHeight: 360,
                    "&:hover": {
                      boxShadow: "0 10px 25px rgba(15,23,42,0.08)",
                      transform: "translateY(-4px)",
                    },
                    transition: "all 0.25s ease",
                  }}
                >
                  <Box sx={{ position: "relative", pt: "130%" }}>
                    <CardMedia
                      component="img"
                      image={
                        book.image
                          ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/${book.image}`
                          : "/placeholder-book.png"
                      }
                      alt={book.title}
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>

                  <CardContent sx={{ pt: 1, pb: 0, flexGrow: 1 }}>
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
                      variant="contained"
                      size="small"
                      onClick={() => viewDetails(book._id)}
                      sx={{
                        borderRadius: "999px",
                        textTransform: "none",
                        bgcolor: "#c57a45",
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: 14,
                        "&:hover": {
                          bgcolor: "#b36a36",
                        },
                        boxShadow: "0 4px 12px rgba(197,122,69,0.4)",
                      }}
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              ))}
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

      <Fab
        color="primary"
        aria-label="add"
        onClick={goToAdd}
        sx={{
          position: "fixed",
          right: { xs: 16, md: 32 },
          bottom: { xs: 16, md: 32 },
          bgcolor: "#c57a45",
          "&:hover": { bgcolor: "#b36a36" },
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
}
