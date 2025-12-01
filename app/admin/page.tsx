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

import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardStats } from "@/src/Redux/store/adminSlice";
import { AppDispatch, RootState } from "@/src/Redux/store/store";

const AdminDashboard: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { stats, loading, error } = useSelector(
    (state: RootState) => state.admin
  );

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  const summaryCards = [
    {
      id: 1,
      label: "Total Sellers",
      value: stats.sellersCount,
      icon: <PeopleAltOutlinedIcon />,
    },
    {
      id: 2,
      label: "Total Customers",
      value: stats.customersCount,
      icon: <PeopleAltOutlinedIcon />,
    },
    {
      id: 3,
      label: "Total Books Added",
      value: stats.booksCount,
      icon: <LibraryBooksIcon />,
    },
    {
      id: 4,
      label: "Total Orders",
      value: stats.ordersCount,
      icon: <ShoppingBagOutlinedIcon />,
    },
  ];

  return (
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* HEADER */}
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
              ADMIN PANEL
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, lineHeight: 1.1, mt: 0.5 }}
            >
              Dashboard Overview
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5}>
            <Button
              variant="outlined"
              startIcon={<SettingsOutlinedIcon />}
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
            >
              Settings
            </Button>
          </Stack>
        </Box>

        {/* SUMMARY CARDS ROW */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
            mb: 5,
          }}
        >
          {loading ? (
            <Typography>Loading stats...</Typography>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            summaryCards.map((item) => (
              <Box
                key={item.id}
                sx={{
                  flex: "1 1 220px",
                  maxWidth: { xs: "100%", md: "23%" },
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
                      {item.icon}
                    </Box>
                  </Stack>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", mb: 0.5 }}
                  >
                    {item.label}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {item.value}
                  </Typography>
                </Card>
              </Box>
            ))
          )}
        </Box>

        {/* ACTION CARDS: VIEW SELLERS / CUSTOMERS */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
          }}
        >
          {/* Sellers card */}
          <Card
            elevation={0}
            sx={{
              flex: "1 1 320px",
              borderRadius: 3,
              bgcolor: "#ffffff",
              border: "1px solid #e5e7eb",
              p: 3,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2} mb={1.5}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  bgcolor: "#fdf7f2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#c57a45",
                }}
              >
                <PeopleAltOutlinedIcon />
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Manage Sellers
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", mt: 0.2 }}
                >
                  View and manage all sellers in the marketplace.
                </Typography>
              </Box>
            </Stack>
            <Button
              variant="contained"
              onClick={() => router.push("/admin/users?type=seller")}
              sx={{
                mt: 2,
                textTransform: "none",
                borderRadius: "999px",
                bgcolor: "#c57a45",
                "&:hover": { bgcolor: "#b36a36" },
              }}
            >
              View All Sellers
            </Button>
          </Card>

          {/* Customers card */}
          <Card
            elevation={0}
            sx={{
              flex: "1 1 320px",
              borderRadius: 3,
              bgcolor: "#ffffff",
              border: "1px solid #e5e7eb",
              p: 3,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2} mb={1.5}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  bgcolor: "#fdf7f2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#c57a45",
                }}
              >
                <PeopleAltOutlinedIcon />
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Manage Customers
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", mt: 0.2 }}
                >
                  View all registered customers and their activity.
                </Typography>
              </Box>
            </Stack>
            <Button
              variant="contained"
              onClick={() => router.push("/admin/users?type=customer")}
              sx={{
                mt: 2,
                textTransform: "none",
                borderRadius: "999px",
                bgcolor: "#c57a45",
                "&:hover": { bgcolor: "#b36a36" },
              }}
            >
              View All Customers
            </Button>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
