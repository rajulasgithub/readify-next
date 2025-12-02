"use client";

import React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Stack,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";

import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useRouter } from "next/navigation";
import SellerSalesChart from "../sellersaleschart/page";

type StatCard = {
  id: number;
  label: string;
  value: string;
  helper: string;
  icon: React.ReactNode;
};

type SellerBook = {
  id: string;
  title: string;
  price: string;
  status: "Active" | "Out of Stock" | "Draft";
  category: string;
};

type SellerOrder = {
  id: string;
  customer: string;
  book: string;
  amount: string;
  status: "Pending" | "Completed" | "Cancelled";
  date: string;
};

const stats: StatCard[] = [
  {
    id: 1,
    label: "My Books",
    value: "18",
    helper: "2 drafts | 3 out of stock",
    icon: <LibraryBooksIcon />,
  },
  {
    id: 2,
    label: "Total Orders",
    value: "52",
    helper: "8 new this week",
    icon: <ShoppingBagOutlinedIcon />,
  },
  {
    id: 3,
    label: "Revenue",
    value: "₹38,450",
    helper: "Last 30 days",
    icon: <CurrencyRupeeOutlinedIcon />,
  },
];

const myBooks: SellerBook[] = [
  {
    id: "b1",
    title: "The Silent Library",
    price: "₹399",
    status: "Active",
    category: "Fiction",
  },
  {
    id: "b2",
    title: "Love Beyond Words",
    price: "₹220",
    status: "Active",
    category: "Romance",
  },
  {
    id: "b3",
    title: "The Art of Calm",
    price: "₹350",
    status: "Out of Stock",
    category: "Self-help",
  },
  {
    id: "b4",
    title: "Future Unlocked",
    price: "₹330",
    status: "Draft",
    category: "Non-fiction",
  },
];


const SellerDashboard: React.FC = () => {
    const router = useRouter()

  const handleAddBook = () => {
   router.push('/addbook')
  };

  const handleEditBook = (bookId: string) => {
    router.push(`/updatebook/${bookId}`)
    
  };

  
  const handleManageOrders = () => {
    console.log("Go to orders page");
    
  };

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

        {/* STATS */}
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
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    Overview
                  </Typography>
                </Stack>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", mb: 0.5 }}
                >
                  {stat.label}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {stat.value}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "text.secondary" }}
                >
                  {stat.helper}
                </Typography>
              </Card>
            </Box>
          ))}
        </Box>

        {/* <SellerSalesChar /> */}
     
      </Container>
    </Box>
  );
};

export default SellerDashboard;
