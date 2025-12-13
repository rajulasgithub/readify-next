"use client";

import { Box, Container, Typography, Stack, Card, CardContent } from "@mui/material";

export default function AboutPage() {
  return (
    <Box sx={{ bgcolor: "#f5f7fb", py: 8, minHeight: "100vh" }}>
      <Container maxWidth="md">
        
      
        <Typography
          variant="h3"
          fontWeight={700}
          textAlign="center"
          sx={{ mb: 3, color: "#111827" }}
        >
          About Readify
        </Typography>

        <Typography
          variant="h6"
          textAlign="center"
          sx={{ mb: 6, color: "#6b7280", px: 2 }}
        >
          Your trusted online marketplace for books — discover, explore, and enjoy reading.
        </Typography>

      
        <Card
          sx={{
            mb: 4,
            p: 3,
            borderRadius: 4,
            boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
            bgcolor: "#ffffff",
          }}
        >
          <CardContent>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
              Our Story
            </Typography>
            <Typography sx={{ color: "#4b5563", lineHeight: 1.8 }}>
              Readify was born from a passion for books and a mission to make reading more
              accessible for everyone. Whether you’re a casual reader, a student, or a collector,
              Readify is designed to help you find books effortlessly and enjoy a smooth shopping experience.
              We aim to bridge the gap between readers and books by offering a platform that is
              intuitive, fast, and filled with the genres you love.
            </Typography>
          </CardContent>
        </Card>

     
        <Card
          sx={{
            mb: 4,
            p: 3,
            borderRadius: 4,
            boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
            bgcolor: "#ffffff",
          }}
        >
          <CardContent>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
              What We Offer
            </Typography>
            <Typography sx={{ color: "#4b5563", lineHeight: 1.8, mb: 2 }}>
              At Readify, we bring together a curated selection of books across multiple
              categories and languages. Our platform helps you:
            </Typography>

            <Stack spacing={1.5}>
              <Typography sx={{ color: "#374151" }}>✔ Browse books effortlessly</Typography>
              <Typography sx={{ color: "#374151" }}>✔ Search by title, author, genre, or category</Typography>
              <Typography sx={{ color: "#374151" }}>✔ Save books to your wishlist</Typography>
              <Typography sx={{ color: "#374151" }}>✔ Add items to your cart and checkout securely</Typography>
              <Typography sx={{ color: "#374151" }}>✔ Explore new arrivals and trending books</Typography>
            </Stack>
          </CardContent>
        </Card>

   
        <Card
          sx={{
            mb: 4,
            p: 3,
            borderRadius: 4,
            boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
            bgcolor: "#ffffff",
          }}
        >
          <CardContent>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
              Our Mission
            </Typography>
            <Typography sx={{ color: "#4b5563", lineHeight: 1.8 }}>
              Our goal is to create a space where readers feel at home.  
              A place where every book lover can connect with stories, knowledge,
              and inspiration — anytime, anywhere.  
              We believe reading has the power to change lives, and Readify is here to
              make that power more accessible than ever.
            </Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            p: 3,
            borderRadius: 4,
            boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
            bgcolor: "#ffffff",
          }}
        >
          <CardContent>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
              Why Choose Readify?
            </Typography>

            <Stack spacing={1.5}>
              <Typography sx={{ color: "#374151" }}>✔ Clean & simple browsing experience</Typography>
              <Typography sx={{ color: "#374151" }}>✔ Smooth wishlist & cart features</Typography>
              <Typography sx={{ color: "#374151" }}>✔ Support for multiple genres & languages</Typography>
              <Typography sx={{ color: "#374151" }}>✔ A customer-first platform</Typography>
              <Typography sx={{ color: "#374151" }}>✔ Built with passion by book lovers</Typography>
            </Stack>
          </CardContent>
        </Card>
        <Typography
          textAlign="center"
          sx={{ mt: 5, color: "#6b7280", fontSize: 14 }}
        >
          Thank you for choosing Readify 
          <br />
          We hope you enjoy your reading journey with us.
        </Typography>
      </Container>
    </Box>
  );
}
