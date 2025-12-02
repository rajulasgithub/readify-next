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
  Stack,
  Pagination,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
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
  const [search, setSearch] = useState("");

 
  useEffect(() => {
    const res = dispatch(
      fetchBooks({
        page,
        limit,
        search: search.trim() || undefined,
      }) as any
    );
    console.log(res);
  }, [page, search, dispatch]);

  const handlePageChange = (_: any, value: number) => setPage(value);

  const viewDetails = (id: string) => {
    router.push(`/viewonebook/${id}`);
  };

  return (
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
 
        <Box sx={{ mb: 3 }}>
          <Searchfield
            value={search}
            onChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
            placeholder="Search books..."
          />
        </Box>

      
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            My Books
          </Typography>
          <Typography sx={{ color: "text.secondary" }}>
            Manage your uploaded books
          </Typography>
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
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
              justifyContent: "center",
              mb: 5,
            }}
          >
            {books.map((book: Book) => (
              <Card
                key={book._id}
                elevation={0}
                sx={{
                  width: 230,
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
                <CardMedia
                  component="img"
                  image={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${book.image}`}
                  alt={book.title}
                  sx={{ borderRadius: 3, height: 170, objectFit: "cover" }}
                />

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
    </Box>
  );
}
