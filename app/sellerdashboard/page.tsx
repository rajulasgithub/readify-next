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

const recentOrders: SellerOrder[] = [
  {
    id: "#ORD-2048",
    customer: "Rahul Menon",
    book: "The Silent Library",
    amount: "₹399",
    status: "Completed",
    date: "Today",
  },
  {
    id: "#ORD-2047",
    customer: "Ananya Verma",
    book: "Love Beyond Words",
    amount: "₹220",
    status: "Pending",
    date: "Today",
  },
  {
    id: "#ORD-2046",
    customer: "Vikram Shah",
    book: "The Art of Calm",
    amount: "₹350",
    status: "Cancelled",
    date: "Yesterday",
  },
];

const SellerDashboard: React.FC = () => {
  // TODO: replace with real API navigation / actions
  const handleAddBook = () => {
    console.log("Add new book");
    // navigate("/seller/add-book") etc.
  };

  const handleEditBook = (bookId: string) => {
    console.log("Edit book:", bookId);
    // navigate(`/seller/books/edit/${bookId}`)
  };

  const handleDeleteBook = (bookId: string) => {
    console.log("Delete book:", bookId);
    // api.delete(`/api/seller/books/${bookId}`).then(refetch)
  };

  const handleManageOrders = () => {
    console.log("Go to orders page");
    // navigate("/seller/orders")
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

        {/* MAIN LAYOUT: LEFT (MY BOOKS) | RIGHT (RECENT ORDERS + ACTIONS) */}
        <Stack
          direction={{ xs: "column", lg: "row" }}
          spacing={3}
          alignItems="stretch"
        >
          {/* LEFT – MY BOOKS */}
          <Box sx={{ flex: 2, minWidth: 0 }}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                bgcolor: "#ffffff",
                border: "1px solid #e5e7eb",
                height: "100%",
              }}
            >
              <CardHeader
                title={
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    My Books
                  </Typography>
                }
                subheader={
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary" }}
                  >
                    Manage your active, out-of-stock, and draft listings.
                  </Typography>
                }
              />
              <Divider />
              <CardContent sx={{ p: 0, maxHeight: 380, overflowY: "auto" }}>
                <List disablePadding>
                  {myBooks.map((book, index) => (
                    <React.Fragment key={book.id}>
                      <ListItem
                        sx={{
                          px: 3,
                          py: 1.5,
                          alignItems: "flex-start",
                          "&:hover": { bgcolor: "#f9fafb" },
                        }}
                        secondaryAction={
                          <Stack direction="row" spacing={1}>
                            <IconButton
                              size="small"
                              onClick={() => handleEditBook(book.id)}
                              sx={{
                                color: "#334155",
                                "&:hover": { bgcolor: "#e5e7eb" },
                              }}
                            >
                              <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteBook(book.id)}
                              sx={{
                                color: "#b91c1c",
                                "&:hover": { bgcolor: "#fee2e2" },
                              }}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        }
                      >
                        <ListItemText
                          primary={
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                              noWrap
                            >
                              {book.title}
                            </Typography>
                          }
                          secondary={
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                              sx={{ mt: 0.3, flexWrap: "wrap" }}
                            >
                              <Typography
                                variant="body2"
                                sx={{ color: "text.secondary" }}
                              >
                                {book.category}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 600 }}
                              >
                                • {book.price}
                              </Typography>
                              <Chip
                                label={book.status}
                                size="small"
                                sx={{
                                  ml: 0.5,
                                  borderRadius: "999px",
                                  fontSize: 11,
                                  bgcolor:
                                    book.status === "Active"
                                      ? "#dcfce7"
                                      : book.status === "Out of Stock"
                                      ? "#fee2e2"
                                      : "#e5e7eb",
                                  color:
                                    book.status === "Active"
                                      ? "#166534"
                                      : book.status === "Out of Stock"
                                      ? "#b91c1c"
                                      : "#4b5563",
                                }}
                              />
                            </Stack>
                          }
                        />
                      </ListItem>
                      {index !== myBooks.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Box>

          {/* RIGHT – RECENT ORDERS + QUICK ACTIONS */}
          <Box sx={{ flex: 1.3, minWidth: 0 }}>
            <Stack spacing={3} height="100%">
              {/* Recent Orders */}
              <Card
                elevation={0}
                sx={{
                  borderRadius: 3,
                  bgcolor: "#ffffff",
                  border: "1px solid #e5e7eb",
                }}
              >
                <CardHeader
                  title={
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Recent Orders
                    </Typography>
                  }
                  subheader={
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      Latest orders placed on your books.
                    </Typography>
                  }
                />
                <Divider />
                <CardContent sx={{ p: 0, maxHeight: 260, overflowY: "auto" }}>
                  <List disablePadding>
                    {recentOrders.map((order, index) => (
                      <React.Fragment key={order.id}>
                        <ListItem
                          sx={{
                            px: 3,
                            py: 1.5,
                            "&:hover": { bgcolor: "#f9fafb" },
                          }}
                        >
                          <ListItemText
                            primary={
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 600 }}
                              >
                                {order.id} • {order.book}
                              </Typography>
                            }
                            secondary={
                              <Typography
                                variant="body2"
                                sx={{ color: "text.secondary" }}
                              >
                                {order.customer} • {order.date}
                              </Typography>
                            }
                          />
                          <Stack
                            direction="column"
                            alignItems="flex-end"
                            spacing={0.5}
                          >
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {order.amount}
                            </Typography>
                            <Chip
                              label={order.status}
                              size="small"
                              sx={{
                                borderRadius: "999px",
                                fontSize: 11,
                                bgcolor:
                                  order.status === "Completed"
                                    ? "#dcfce7"
                                    : order.status === "Pending"
                                    ? "#fef9c3"
                                    : "#fee2e2",
                                color:
                                  order.status === "Completed"
                                    ? "#166534"
                                    : order.status === "Pending"
                                    ? "#854d0e"
                                    : "#b91c1c",
                              }}
                            />
                          </Stack>
                        </ListItem>
                        {index !== recentOrders.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card
                elevation={0}
                sx={{
                  borderRadius: 3,
                  bgcolor: "#ffffff",
                  border: "1px solid #e5e7eb",
                }}
              >
                <CardHeader
                  title={
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Quick Actions
                    </Typography>
                  }
                />
                <CardContent sx={{ pt: 0 }}>
                  <Stack spacing={1.5}>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="small"
                      sx={{
                        borderRadius: "999px",
                        textTransform: "none",
                        borderColor: "#e5e7eb",
                        justifyContent: "flex-start",
                        "&:hover": {
                          borderColor: "#c57a45",
                          bgcolor: "rgba(197,122,69,0.04)",
                        },
                      }}
                      startIcon={<AddOutlinedIcon />}
                      onClick={handleAddBook}
                    >
                      Add New Book
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="small"
                      sx={{
                        borderRadius: "999px",
                        textTransform: "none",
                        borderColor: "#e5e7eb",
                        justifyContent: "flex-start",
                        "&:hover": {
                          borderColor: "#c57a45",
                          bgcolor: "rgba(197,122,69,0.04)",
                        },
                      }}
                      startIcon={<ShoppingBagOutlinedIcon />}
                      onClick={handleManageOrders}
                    >
                      Manage Orders
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="small"
                      sx={{
                        borderRadius: "999px",
                        textTransform: "none",
                        borderColor: "#e5e7eb",
                        justifyContent: "flex-start",
                        "&:hover": {
                          borderColor: "#c57a45",
                          bgcolor: "rgba(197,122,69,0.04)",
                        },
                      }}
                      startIcon={<EditOutlinedIcon />}
                    >
                      Edit Store Profile
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default SellerDashboard;
