"use client";

import {
  Typography,
  Box,
  Container,
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Chip,
  Stack,
} from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/redux/store";
import { getHomeBooksThunk } from "@/src/redux/slices/homeSlice";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { newBooks, bestSellerBooks, loadingNew, loadingBest } = useSelector(
    (state: RootState) => state.home
  );

  const { token, role } = useAuth()
  console.log(token)
  useEffect(() => {

    dispatch(getHomeBooksThunk());
  }, [dispatch]);

  const allCollections = [
    ...newBooks.map((b) => ({
      id: b._id,
      name: b.title,
      author: b.author,
      price: `₹${b.prize}`,
      tag: "New",
      img: b.image?.[0] || "",
    })),
    ...bestSellerBooks.map((b) => ({
      id: b._id,
      name: b.title,
      author: b.author,
      price: `₹${b.prize}`,
      tag: "Best Seller",
      img: b.image?.[0] || "",
    })),
  ];

  return (
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ maxWidth: "900px", mx: "auto", width: "100%" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              mb: 6,
              mt: 1,
            }}
          >
            <Box sx={{ flex: 1, width: "100%" }}>
              <Typography
                variant="overline"
                sx={{ letterSpacing: 3, color: "text.secondary" }}
              >
                NEW RELEASES
              </Typography>

              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  mt: 1,
                  mb: 2,
                  lineHeight: 1.1,
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                Find Your Next
                <br />
                Great Read
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "text.secondary",
                  maxWidth: 380,
                  mb: 3,
                  textAlign: { xs: "center", md: "left" },
                  mx: { xs: "auto", md: 0 },
                }}
              >
                Explore a curated collection of books from fiction,
                non-fiction, and bestsellers.
              </Typography>

              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ justifyContent: { xs: "center", md: "flex-start" } }}
              >
                <Button
                  variant="contained"
                  onClick={() => {
                    if (!token) {
                      router.push("/login");
                    } else if (role === "seller") {
                      router.push("/sellerbooks");
                    } else if (role === "customer") {
                      router.push("/viewbooks");
                    } else {
                      router.push("/login");
                    }
                  }}
                  sx={{
                    borderRadius: "999px",
                    px: 4,
                    py: 1.2,
                    textTransform: "none",
                    bgcolor: "#c57a45",
                    "&:hover": { bgcolor: "#b36a36" },
                  }}
                >
                  Browse Books
                </Button>
              </Stack>
            </Box>

            <Box
              sx={{
                flex: 1,
                width: "100%",
                borderRadius: 4,
                bgcolor: "#fdf7f2",
                p: 3,
                position: "relative",
                overflow: "hidden",
                mx: { xs: "auto", md: 0 },
              }}
            >
              <Box
                sx={{
                  width: 220,
                  height: 220,
                  borderRadius: "50%",
                  bgcolor: "#f1ddc8",
                  position: "absolute",
                  right: -40,
                  top: -40,
                }}
              />
              <Box
                sx={{
                  width: 160,
                  height: 160,
                  borderRadius: "50%",
                  bgcolor: "#f6e6d4",
                  position: "absolute",
                  left: -20,
                  bottom: -30,
                }}
              />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <Card elevation={0} sx={{ bgcolor: "transparent", width: "100%" }}>
                  <CardMedia
                    component="img"
                    image="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80"
                    alt="Featured book"
                    sx={{ borderRadius: 3, height: 230, objectFit: "cover" }}
                  />
                </Card>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "center" }}
          >
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Handpicked Books
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
            mb: 6,
            justifyContent: { xs: "center", md: "flex-start" },
          }}
        >
          {(loadingNew || loadingBest) && (
            <Typography variant="body1">Loading books...</Typography>
          )}

          {!loadingNew &&
            !loadingBest &&
            allCollections.map((book) => (
              <Box key={`${book.id}-${book.tag}`} sx={{ width: { xs: "100%", sm: "45%", md: "23%" }, minWidth: 220 }}>
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
                    {book.tag && (
                      <Chip
                        label={book.tag}
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 10,
                          left: 10,
                          bgcolor: "#f97316",
                          color: "#fff",
                          fontSize: 11,
                          height: 22,
                          zIndex: 2,
                        }}
                      />
                    )}

                    <Box sx={{ width: "100%", pt: "140%", position: "relative", overflow: "hidden", borderRadius: 3 }}>
                      <CardMedia
                        component="img"
                        image={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${book.img}`}
                        alt={book.name}
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          backgroundColor: "#f3f3f3",
                        }}
                      />
                    </Box>
                  </Box>


                  <CardContent sx={{ pt: 1, pb: 0 }}>
                    <Typography variant="body2" sx={{ color: "text.secondary", mb: 0.5 }} noWrap>
                      {book.author}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }} noWrap>
                      {book.name}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#111827" }}>
                      {book.price}
                    </Typography>
                  </CardContent>

                  <CardActions sx={{ px: 2, pb: 2, pt: 1 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="small"
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
                      onClick={() => router.push(token ? `/viewonebook/${book.id}` : '/login')}
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Box>
            ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
