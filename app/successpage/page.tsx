"use client";

import React from "react";
import { Box, Container, Typography, Card, CardContent, Button, Stack } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useRouter } from "next/navigation";

export default function CheckoutSuccessPage() {
  const router = useRouter();

  return (
    <Container maxWidth="sm" sx={{ minHeight: "80vh", display: "flex", alignItems: "center" }}>
      <Card sx={{ width: "100%", textAlign: "center", p: 2 }}>
        <CardContent>
          <CheckCircleOutlineIcon sx={{ fontSize: 80, color: "success.main", mb: 2 }} />

          <Typography variant="h4" fontWeight={600} gutterBottom>
            Order Placed Successfully 🎉
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Thank you for your purchase! Your order has been confirmed and will be processed soon.
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Order ID
            </Typography>
            <Typography variant="subtitle1" fontWeight={500}>
              #ORD-XXXXXX
            </Typography>
          </Box>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
            <Button
              variant="contained"
              color="primary"
              onClick={() => router.push("/vieworders")}
            >
              View My Orders
            </Button>

            <Button
              variant="outlined"
              onClick={() => router.push("/")}
            >
              Continue Shopping
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
