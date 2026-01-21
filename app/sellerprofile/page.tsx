"use client";

import React, { useEffect } from "react";
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
  CircularProgress,
} from "@mui/material";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/src/redux/store";
import { fetchProfileThunk, fetchSellerStats, logout } from "@/src/redux/slices/authSlice";

export default function SellerProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { user, loading: userLoading, error: userError, sellerStats, sellerStatsLoading } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    dispatch(fetchProfileThunk());
    dispatch(fetchSellerStats());
  }, [dispatch]);

  if (userLoading || sellerStatsLoading) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}> <CircularProgress /> </Box>
    );
  }

  if (userError) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}> <Typography color="error">{userError}</Typography> </Box>
    );
  }

  const sellerName = user ? `${user.firstName} ${user.lastName}` : "Seller";
  const sellerEmail = user?.email || "";
  const sellerPhone = user?.fullPhone || "";
  const imageUrl = user?.image
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/${user.image}`
    : undefined;

  const productCount = sellerStats?.totalBooks ?? 0;
  const ordersCount = sellerStats?.totalOrders ?? 0;
  const revenue = sellerStats?.totalRevenue ?? 0;

  return (
    <Box sx={{ bgcolor: "#f5f7fb", minHeight: "100vh", py: 4 }}> <Container maxWidth="lg">
      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3 }}>
        <Card
          sx={{
            flex: "0 0 330px",
            borderRadius: 4,
            boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
            bgcolor: "#ffffff",
            height: "fit-content",
          }}
        > <CardContent> <Stack alignItems="center" spacing={2}>
          <Avatar
            src={imageUrl}
            sx={{ width: 90, height: 90, bgcolor: "#c57a45", fontSize: 34, fontWeight: 700 }}
          >
            {sellerName.charAt(0)} </Avatar>

          <Typography variant="h6" fontWeight={700}>
            {sellerName}
          </Typography>

          <Typography variant="body2" sx={{ color: "#6b7280", mb: 0.5 }}>
            {sellerEmail}
          </Typography>
          <Typography variant="body2" sx={{ color: "#6b7280", mb: 1 }}>
            {sellerPhone}
          </Typography>

          {user?.bio && (
            <Typography
              variant="body2"
              sx={{
                color: "#4b5563",
                textAlign: "center",
                mt: 1,
              }}
            >
              {user.bio}
            </Typography>
          )}

          <Divider sx={{ width: "100%", my: 2 }} />

          <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
            <Button
              variant="outlined"
              sx={{ textTransform: "none" }}
              onClick={() => router.push("/editprofile")}
            >
              Edit Profile
            </Button>

            <Button
              variant="outlined"
              color="error"
              sx={{ textTransform: "none" }}
              onClick={() => {
                dispatch(logout());
                router.push("/login");
              }}
            >
              Logout
            </Button>
          </Stack>
        </Stack>
          </CardContent>
        </Card>

        <Box sx={{ flex: 1 }}>
          <Stack spacing={3}>
            <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
              <Card sx={{ flex: "1 1 250px", borderRadius: 3, boxShadow: "0 8px 20px rgba(15,23,42,0.06)", bgcolor: "#ffffff" }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: "#f0f9ff",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Inventory2Icon sx={{ color: "#0ea5a3" }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: "#6b7280" }}>
                        Books
                      </Typography>
                      <Typography variant="h6" fontWeight={700}>
                        {productCount}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>

              <Card sx={{ flex: "1 1 250px", borderRadius: 3, boxShadow: "0 8px 20px rgba(15,23,42,0.06)", bgcolor: "#ffffff" }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: "#fff7ed",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
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

              <Card sx={{ flex: "1 1 250px", borderRadius: 3, boxShadow: "0 8px 20px rgba(15,23,42,0.06)", bgcolor: "#ffffff" }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: "#ecfdf5",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
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

            <Card sx={{ borderRadius: 3, boxShadow: "0 8px 24px rgba(15,23,42,0.06)", bgcolor: "#ffffff" }}>
              <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Stack direction="row" spacing={2}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: "#f3f4f6",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
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

                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: "#c57a45",
                      borderRadius: "999px",
                      textTransform: "none",
                      px: 3,
                      "&:hover": { bgcolor: "#b36a36" },
                    }}
                    onClick={() => router.push("/sellerorders")}
                  >
                    View Orders
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Box>
      </Box>
    </Container>
    </Box>
  )
}


