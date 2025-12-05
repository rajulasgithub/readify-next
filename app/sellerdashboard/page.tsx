"use client";

import React, { useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  Stack,
  Button,
} from "@mui/material";

import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { useRouter } from "next/navigation";

import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/src/redux/store";
import { fetchSellerStats } from "@/src/redux/slices/authSlice";

type StatCard = {
  id: number;
  label: string;
  value: string;
  helper: string;
  icon: React.ReactNode;
};

const SellerDashboard: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // Fetch seller stats once when mounted
  useEffect(() => {
    dispatch(fetchSellerStats());
  }, [dispatch]);

  // Read seller stats from auth slice
  const { sellerStats, sellerStatsLoading } = useSelector(
    (state: RootState) => state.auth
  );

  // Demo fallback numbers used only if sellerStats is null
  const demo = {
    totalBooks: 18,
    totalOrders: 52,
    totalRevenue: 38450,
  };

  const stats: StatCard[] = [
    {
      id: 1,
      label: "My Books",
      value: sellerStatsLoading
        ? "Loading..."
        : `${sellerStats?.totalBooks ?? demo.totalBooks}`,
      helper: "2 drafts | 3 out of stock",
      icon: <LibraryBooksIcon />,
    },
    {
      id: 2,
      label: "Total Orders",
      value: sellerStatsLoading
        ? "Loading..."
        : `${sellerStats?.totalOrders ?? demo.totalOrders}`,
      helper: "8 new this week",
      icon: <ShoppingBagOutlinedIcon />,
    },
    {
      id: 3,
      label: "Revenue",
      value: sellerStatsLoading
        ? "Loading..."
        : `₹${(sellerStats?.totalRevenue ?? demo.totalRevenue).toLocaleString()}`,
      helper: "Last 30 days",
      icon: <CurrencyRupeeOutlinedIcon />,
    },
  ];

  const handleAddBook = () => {
    router.push("/addbook");
  };

  const handleManageOrders = () => {
    router.push("/sellerorders");
  };

  return (
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          sx={{
            mb: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="overline"
              sx={{ letterSpacing: 3, color: "text.secondary" }}
            >
              SELLER DASHBOARD
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, lineHeight: 1.1, mt: 0.5 }}
            >
              Welcome back, Seller
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", mt: 1, maxWidth: 420 }}
            >
              Track your books, manage orders, and monitor your earnings from a
              single place.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5}>
            <Button
              variant="outlined"
              sx={{
                textTransform: "none",
                borderRadius: "999px",
                borderColor: "#e5e7eb",
                color: "text.primary",
                "&:hover": {
                  borderColor: "#c57a45",
                  bgcolor: "rgba(197,122,69,0.04)",
                },
              }}
              onClick={handleManageOrders}
            >
              View Orders
            </Button>
            <Button
              variant="contained"
              startIcon={<AddOutlinedIcon />}
              sx={{
                textTransform: "none",
                borderRadius: "999px",
                px: 3,
                bgcolor: "#c57a45",
                "&:hover": { bgcolor: "#b36a36" },
              }}
              onClick={handleAddBook}
            >
              Add New Book
            </Button>
          </Stack>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
            mb: 5,
          }}
        >
          {stats.map((stat) => (
            <Box
              key={stat.id}
              sx={{
                flex: "1 1 230px",
                maxWidth: { xs: "100%", md: "32%" },
              }}
            >
              <Card
                elevation={0}
                sx={{
                  borderRadius: 3,
                  bgcolor: "#ffffff",
                  p: 2.5,
                  border: "1px solid #e5e7eb",
                  height: "100%",
                }}
              >
                <Stack direction="row" justifyContent="space-between" mb={1}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 2,
                      bgcolor: "#fdf7f2",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#c57a45",
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    Overview
                  </Typography>
                </Stack>

                <Typography variant="body2" sx={{ color: "text.secondary", mb: 0.5 }}>
                  {stat.label}
                </Typography>

                <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {stat.value}
                </Typography>

                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  {stat.helper}
                </Typography>
              </Card>
            </Box>
          ))}
        </Box>

        {/* You can add other dashboard sections below (book list, chart, etc.) */}

      </Container>
    </Box>
  );
};

export default SellerDashboard;
