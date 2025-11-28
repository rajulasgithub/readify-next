"use client";

import React from "react";
import {
  Typography,
  Box,
  Container,
  IconButton,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Chip,
  Stack,
} from "@mui/material";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";

type BookCard = {
  id: number;
  name: string;
  author: string;
  price: string;
  tag: string;
  img: string;
};

const collections: BookCard[] = [
  {
    id: 1,
    name: "The Silent Library",
    author: "Anna Peterson",
    price: "₹399",
    tag: "New",
    img: "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    name: "Shadows of the Night",
    author: "Rafael Cruz",
    price: "₹249",
    tag: "Best Seller",
    img: "https://images.unsplash.com/photo-1528209392026-79f1773f6a33?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 3,
    name: "The Lost Kingdom",
    author: "Mira Hawkins",
    price: "₹499",
    tag: "Hot",
    img: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 4,
    name: "Whispers in the Wind",
    author: "Daniel Hart",
    price: "₹299",
    tag: "New",
    img: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 5,
    name: "The Art of Calm",
    author: "Sophie Lee",
    price: "₹350",
    tag: "Sale",
    img: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 6,
    name: "Mystery of the Old House",
    author: "Kevin Brooks",
    price: "₹275",
    tag: "",
    img: "https://images.unsplash.com/photo-1496104679561-38d3af7af8dd?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 7,
    name: "Love Beyond Words",
    author: "Clara Bennett",
    price: "₹220",
    tag: "Trending",
    img: "https://images.unsplash.com/photo-1507842252143-4f38314f05bb?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 8,
    name: "Future Unlocked",
    author: "Tom Sanders",
    price: "₹330",
    tag: "",
    img: "https://images.unsplash.com/photo-1528209402113-1a55b4e2c48f?auto=format&fit=crop&w=600&q=80",
  },
];

const categories: string[] = [
  "All",
  "Fiction",
  "Non-fiction",
  "Romance",
  "Thriller",
  "Self-help",
  "Kids",
];

const Home: React.FC = () => {
  return (
    <>
      <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh" }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box
            sx={{
              maxWidth: "900px",
              mx: "auto",
              width: "100%",
            }}
          >
            <Grid
              container
              spacing={4}
              alignItems="center"
              justifyContent="center"
              sx={{ mb: 6, mt: 1 }}
            >
              {/* LEFT SIDE */}
              <Grid item xs={12} md={6}>
                <Box>
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

                    <Button
                      variant="text"
                      sx={{
                        textTransform: "none",
                        color: "text.secondary",
                        fontWeight: 500,
                      }}
                    >
                      View Collections
                    </Button>
                  </Stack>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box
                  sx={{
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

                  <Grid container justifyContent="center">
                    <Grid item xs={10} md={12}>
                      <Card elevation={0} sx={{ bgcolor: "transparent" }}>
                        <CardMedia
                          component="img"
                          image="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80"
                          alt="Featured book"
                          sx={{
                            borderRadius: 3,
                            height: 230,
                            objectFit: "cover",
                          }}
                        />
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", md: "center" }}
            >
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ color: "text.secondary" }}
                >
                  Explore Categories
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Handpicked Books
                </Typography>
              </Box>

              <Stack direction="row" spacing={1} flexWrap="wrap">
                {categories.map((cat) => (
                  <Chip
                    key={cat}
                    label={cat}
                    variant={cat === "All" ? "filled" : "outlined"}
                    size="small"
                    sx={{
                      borderRadius: "999px",
                      bgcolor: cat === "All" ? "#111827" : "#fff",
                      color: cat === "All" ? "#fff" : "text.secondary",
                      borderColor: "#e5e7eb",
                      fontSize: 12,
                    }}
                  />
                ))}
              </Stack>
            </Stack>
          </Box>

          <Grid container spacing={3} sx={{ mb: 6 }}>
            {collections.map((book) => (
              <Grid item xs={12} sm={6} md={3} key={book.id}>
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
                        }}
                      />
                    )}
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
                      image={book.img}
                      alt={book.name}
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
                      {book.name}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 700, color: "#111827" }}
                    >
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
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Home; 