"use client";

import React from "react";
import { Box, Container, Typography, Button, Stack } from "@mui/material";
import { useRouter } from "next/navigation";

const Unauthorized: React.FC = () => {
  const router = useRouter();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f5f5f5",
        px: 2,
      }}
    >
      <Container
        sx={{
          textAlign: "center",
          bgcolor: "white",
          p: 4,
          borderRadius: 2,
          boxShadow: "0 6px 18px rgba(15,23,42,0.1)",
        }}
      >
        <Typography variant="h3" fontWeight={700} gutterBottom>
          403
        </Typography>
        <Typography variant="h6" gutterBottom>
          Unauthorized Access
        </Typography>
        <Typography variant="body1" sx={{ color: "#6b7280", mb: 3 }}>
          You do not have permission to view this page.
        </Typography>
        <Stack direction="row" justifyContent="center" spacing={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push("/")}
          >
            Go to Home
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => router.push("/login")}
          >
            Login
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

export default Unauthorized;
