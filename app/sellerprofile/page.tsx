"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Stack,
  Avatar,
  Button,
  Divider,
} from "@mui/material";
import StorefrontIcon from "@mui/icons-material/Storefront";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

export default function SellerProfilePage() {
  const router = useRouter();

  // ======= PLACEHOLDERS (style-only; replace with real data later) =======
  const sellerName = "The Book Nook";
  const sellerEmail = "store@example.com";
  const sellerPhone = "+91 98765 43210";
  const storeDescription = "Curated selection of fiction & non-fiction — books you'll love.";
  const productCount = 42;
  const ordersCount = 128;
  const revenue = 254320; // INR
  const imageUrl = undefined; // set to a real URL when integrating

  // ======================================================================

  return (
    <Box sx={{ bgcolor: "#f5f7fb", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3 }}>
          {/* Left: Seller profile card */}
          <Card
            sx={{
              flex: "0 0 330px",
              borderRadius: 4,
              boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
              bgcolor: "#ffffff",
              height: "fit-content",
            }}
          >
            <CardContent>
              <Stack alignItems="center" spacing={2}>
                <Avatar
                  src={imageUrl}
                  sx={{ width: 90, height: 90, bgcolor: "#c57a45", fontSize: 34, fontWeight: 700 }}
                >
                  {sellerName.charAt(0)}
                </Avatar>

                <Typography variant="h6" fontWeight={700}>
                  {sellerName}
                </Typography>

                <Typography variant="body2" sx={{ color: "#6b7280", mb: 0.5 }}>
                  {sellerEmail}
                </Typography>
                <Typography variant="body2" sx={{ color: "#6b7280", mb: 1 }}>
                  {sellerPhone}
                </Typography>

                {storeDescription && (
                  <Typography variant="body2" sx={{ color: "#4b5563", textAlign: "center", mt: 1 }}>
                    {storeDescription}
                  </Typography>
                )}

                <Divider sx={{ width: "100%", my: 2 }} />

                <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                  <Button variant="outlined" sx={{ textTransform: "none" }} onClick={() => router.push("/seller/editprofile")}>
                    Edit Profile
                  </Button>

                  <Button variant="outlined" color="error" sx={{ textTransform: "none" }} onClick={() => router.push("/login") }>
                    Logout
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          {/* Right: Stats + actions */}
          <Box sx={{ flex: 1 }}>
            <Stack spacing={3}>
              {/* Stats cards */}
              <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                {/* Store card */}
                <Card sx={{ flex: "1 1 250px", borderRadius: 3, boxShadow: "0 8px 20px rgba(15,23,42,0.06)", bgcolor: "#ffffff" }}>
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "#fff7f0", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <StorefrontIcon sx={{ color: "#c57a45" }} />
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: "#6b7280" }}>
                          Store
                        </Typography>
                        <Typography variant="h6" fontWeight={700}>
                          {sellerName}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>

                {/* Products card */}
                <Card sx={{ flex: "1 1 250px", borderRadius: 3, boxShadow: "0 8px 20px rgba(15,23,42,0.06)", bgcolor: "#ffffff" }}>
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "#f0f9ff", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Inventory2Icon sx={{ color: "#0ea5a3" }} />
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: "#6b7280" }}>
                          Products
                        </Typography>
                        <Typography variant="h6" fontWeight={700}>
                          {productCount}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>

                {/* Orders card */}
                <Card sx={{ flex: "1 1 250px", borderRadius: 3, boxShadow: "0 8px 20px rgba(15,23,42,0.06)", bgcolor: "#ffffff" }}>
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "#fff7ed", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <ReceiptLongIcon sx={{ color: "#b45309" }} />
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: "#6b7280" }}>
                          Orders Received
                        </Typography>
                        <Typography variant="h6" fontWeight={700}>
                          {ordersCount}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>

                {/* Revenue / Payouts card */}
                <Card sx={{ flex: "1 1 250px", borderRadius: 3, boxShadow: "0 8px 20px rgba(15,23,42,0.06)", bgcolor: "#ffffff" }}>
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "#ecfdf5", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <AccountBalanceWalletIcon sx={{ color: "#059669" }} />
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: "#6b7280" }}>
                          Revenue
                        </Typography>
                        <Typography variant="h6" fontWeight={700}>
                          ₹{revenue}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Box>

              {/* Manage Orders card */}
              <Card sx={{ borderRadius: 3, boxShadow: "0 8px 24px rgba(15,23,42,0.06)", bgcolor: "#ffffff" }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" spacing={2}>
                      <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "#f3f4f6", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <ReceiptLongIcon sx={{ color: "#4b5563" }} />
                      </Box>

                      <Box>
                        <Typography variant="h6" fontWeight={700}>
                          Manage Orders
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#6b7280" }}>
                          View and manage orders placed to your store.
                        </Typography>
                      </Box>
                    </Stack>

                    <Button variant="contained" sx={{ bgcolor: "#c57a45", borderRadius: "999px", textTransform: "none", px: 3, "&:hover": { bgcolor: "#b36a36" } }} onClick={() => router.push("/seller/orders") }>
                      View Orders
                    </Button>
                  </Stack>
                </CardContent>
              </Card>

              {/* Quick actions */}
              <Card sx={{ borderRadius: 3, boxShadow: "0 6px 18px rgba(15,23,42,0.05)", bgcolor: "#ffffff" }}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={600} mb={2}>
                    Quick Actions
                  </Typography>

                  <Stack direction="row" spacing={2} flexWrap="wrap">
                    <Button variant="outlined" startIcon={<Inventory2Icon />} sx={{ textTransform: "none", borderRadius: "999px", px: 3 }} onClick={() => router.push("/seller/products") }>
                      Manage Products
                    </Button>

                    <Button variant="outlined" startIcon={<StorefrontIcon />} sx={{ textTransform: "none", borderRadius: "999px", px: 3 }} onClick={() => router.push("/store/the-book-nook") }>
                      View Store
                    </Button>

                    <Button variant="outlined" startIcon={<AccountBalanceWalletIcon />} sx={{ textTransform: "none", borderRadius: "999px", px: 3 }} onClick={() => router.push("/seller/payouts") }>
                      Payouts
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
