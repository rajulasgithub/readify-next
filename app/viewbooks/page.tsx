"use client";

import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
  IconButton,
  Stack,
  TextField,
  Pagination,
  CircularProgress,
} from "@mui/material";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import { useEffect, useState } from "react";
import api from "@/src/components/api";
import { useRouter } from "next/navigation";

type Book = {
  _id: string;
  image: string;
  title: string;
  author: string;
  prize: number;
  genres?: string[];
};

const categories = [
  "All",
  "Fiction",
  "Romance",
  "Thriller",
  "Kids",
  "Self-help",
  "Mythology",
];

export default function ViewBooks() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Fetch Books
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");

      const res = await api.get("/api/books/viewbooks", {
        params: {
          page,
          limit,
          search,
          category: selectedCategory !== "All" ? selectedCategory : "",
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBooks(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error("Fetch error:", error);
      setBooks([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [page, search, selectedCategory]);

  const handlePageChange = (_: any, value: number) => setPage(value);

  const viewDetails = (id: string) => {
    router.push(`/books/${id}`);
  };

  return (
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        {/* Heading */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Browse Books
          </Typography>
          <Typography sx={{ color: "text.secondary" }}>
            Explore books from all categories
          </Typography>
        </Box>

        {/* Search + Categories */}
        <Stack spacing={3} sx={{ mb: 4 }}>
          <TextField
            placeholder="Search books..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
            size="small"
            sx={{ bgcolor: "#fff", borderRadius: 2 }}
          />

          <Stack direction="row" spacing={1} flexWrap="wrap">
            {categories.map((cat) => (
              <Chip
                key={cat}
                label={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setPage(1);
                }}
                variant={cat === selectedCategory ? "filled" : "outlined"}
                sx={{
                  borderRadius: "999px",
                  bgcolor: cat === selectedCategory ? "#111827" : "#fff",
                  color: cat === selectedCategory ? "#fff" : "text.secondary",
                  borderColor: "#e5e7eb",
                  cursor: "pointer",
                }}
              />
            ))}
          </Stack>
        </Stack>

        {/* Books Grid */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        ) : books.length === 0 ? (
          <Typography align="center" sx={{ py: 6 }}>
            No books found.
          </Typography>
        ) : (
          <Grid container spacing={3} sx={{ mb: 5 }}>
            {books.map((book) => (
              <Grid item xs={12} sm={6} md={3} key={book._id}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    bgcolor: "#ffffff",
                    overflow: "hidden",
                    "&:hover": {
                      boxShadow: "0 10px 25px rgba(15,23,42,0.08)",
                      transform: "translateY(-4px)",
                    },
                    transition: "all 0.25s ease",
                  }}
                >
                  <Box sx={{ position: "relative", p: 2, pb: 0 }}>
                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        bgcolor: "#ffffff",
                        "&:hover": { bgcolor: "#f1f5f9" },
                      }}
                    >
                      <FavoriteBorderOutlinedIcon fontSize="small" />
                    </IconButton>

                    <CardMedia
                      component="img"
                    //   image={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${book.image.replace(
                    //     "\\",
                    //     "/"
                    //   )}`}
                      alt={book.title}
                      sx={{
                        borderRadius: 3,
                        height: 170,
                        objectFit: "cover",
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
                      onClick={() => viewDetails(book._id)}
                      sx={{
                        borderRadius: "999px",
                        textTransform: "none",
                        borderColor: "#e5e7eb",
                        color: "text.primary",
                        fontSize: 13,
                        "&:hover": {
                          borderColor: "#c57a45",
                          bgcolor: "rgba(197,122,69,0.04)",
                        },
                      }}
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Pagination */}
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
