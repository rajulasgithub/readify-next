"use client";

import React, { useState } from "react";
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
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

type StatCard = {
  id: number;
  label: string;
  value: string;
  change: string;
  positive?: boolean;
  icon: React.ReactNode;
};

type SellerBook = {
  id: string;
  title: string;
  price: string;
};

type Seller = {
  id: string;
  name: string;
  email: string;
  totalBooks: number;
  books: SellerBook[];
};

type UserRow = {
  id: string;
  name: string;
  email: string;
  orders: number;
  totalSpent: string;
};

const stats: StatCard[] = [
  {
    id: 1,
    label: "Total Books",
    value: "328",
    change: "+12 this week",
    positive: true,
    icon: <LibraryBooksIcon />,
  },
  {
    id: 2,
    label: "Orders",
    value: "92",
    change: "+8 today",
    positive: true,
    icon: <ShoppingBagOutlinedIcon />,
  },
  {
    id: 3,
    label: "Sellers",
    value: "24",
    change: "+2 this month",
    positive: true,
    icon: <PeopleAltOutlinedIcon />,
  },
  {
    id: 4,
    label: "Revenue",
    value: "₹1.2L",
    change: "-3% vs last week",
    positive: false,
    icon: <BarChartOutlinedIcon />,
  },
];

const sellers: Seller[] = [
  {
    id: "seller-1",
    name: "Book Haven Store",
    email: "bookhaven@example.com",
    totalBooks: 18,
    books: [
      { id: "b1", title: "The Silent Library", price: "₹399" },
      { id: "b2", title: "Whispers in the Wind", price: "₹299" },
    ],
  },
  {
    id: "seller-2",
    name: "Readers Corner",
    email: "readerscorner@example.com",
    totalBooks: 12,
    books: [
      { id: "b3", title: "Love Beyond Words", price: "₹220" },
      { id: "b4", title: "The Art of Calm", price: "₹350" },
    ],
  },
  {
    id: "seller-3",
    name: "City Lights Books",
    email: "citylights@example.com",
    totalBooks: 9,
    books: [
      { id: "b5", title: "Shadows of the Night", price: "₹249" },
    ],
  },
];

const users: UserRow[] = [
  {
    id: "user-1",
    name: "Rahul Menon",
    email: "rahul@example.com",
    orders: 5,
    totalSpent: "₹1,899",
  },
  {
    id: "user-2",
    name: "Ananya Verma",
    email: "ananya@example.com",
    orders: 3,
    totalSpent: "₹789",
  },
  {
    id: "user-3",
    name: "Vikram Shah",
    email: "vikram@example.com",
    orders: 4,
    totalSpent: "₹1,120",
  },
];

const AdminDashboard: React.FC = () => {
  const [selectedSellerId, setSelectedSellerId] = useState<string>(
    sellers[0]?.id || ""
  );

  const selectedSeller = sellers.find((s) => s.id === selectedSellerId);

  const handleSelectSeller = (id: string) => {
    setSelectedSellerId(id);
  };

  // TODO: replace this with real API call
  const handleDeleteBook = (bookId: string) => {
    // Example: api.delete(`/api/admin/books/${bookId}`)
    console.log("Delete book with id:", bookId);
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
              ADMIN PANEL
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, lineHeight: 1.1, mt: 0.5 }}
            >
              Dashboard Overview
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", mt: 1, maxWidth: 420 }}
            >
              Admin can view all sellers and their books, delete books,
              and see all users and their orders.
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
            >
              Add New Book
            </Button>
          </Stack>
        </Box>

        {/* STATS - FLEX, MORE AIRY */}
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
                    {stat.icon}
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    Today
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
                  sx={{
                    fontWeight: 500,
                    color: stat.positive ? "#16a34a" : "#b91c1c",
                  }}
                >
                  {stat.change}
                </Typography>
              </Card>
            </Box>
          ))}
        </Box>

        {/* MAIN LAYOUT: LEFT (SELLERS & BOOKS) | RIGHT (USERS & ORDERS) */}
        <Stack
          direction={{ xs: "column", lg: "row" }}
          spacing={3}
          alignItems="stretch"
        >
          {/* LEFT SIDE */}
          <Stack spacing={3} sx={{ flex: 2, minWidth: 0 }}>
            {/* SELLERS LIST */}
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
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Sellers & Their Books
                  </Typography>
                }
                subheader={
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary" }}
                  >
                    Select a seller to view and manage their books.
                  </Typography>
                }
              />
              <Divider />
              <CardContent sx={{ p: 0, maxHeight: 260, overflowY: "auto" }}>
                <List disablePadding>
                  {sellers.map((seller, index) => (
                    <React.Fragment key={seller.id}>
                      <ListItem
                        sx={{
                          px: 3,
                          py: 1.5,
                          cursor: "pointer",
                          bgcolor:
                            seller.id === selectedSellerId
                              ? "#fdf7f2"
                              : "transparent",
                          "&:hover": { bgcolor: "#f9fafb" },
                        }}
                        onClick={() => handleSelectSeller(seller.id)}
                      >
                        <ListItemText
                          primary={
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                              justifyContent="space-between"
                            >
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 600 }}
                              >
                                {seller.name}
                              </Typography>
                              <Chip
                                label={`${seller.totalBooks} books`}
                                size="small"
                                sx={{
                                  borderRadius: "999px",
                                  fontSize: 11,
                                  bgcolor: "#f1f5f9",
                                  color: "#0f172a",
                                }}
                              />
                            </Stack>
                          }
                          secondary={
                            <Typography
                              variant="body2"
                              sx={{ color: "text.secondary" }}
                            >
                              {seller.email}
                            </Typography>
                          }
                        />
                      </ListItem>
                      {index !== sellers.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>

            {/* SELECTED SELLER BOOKS */}
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
                    {selectedSeller
                      ? `Books by ${selectedSeller.name}`
                      : "Books"}
                  </Typography>
                }
                subheader={
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary" }}
                  >
                    Admin can delete any book from the marketplace.
                  </Typography>
                }
              />
              <Divider />
              <CardContent sx={{ p: 0 }}>
                {selectedSeller && selectedSeller.books.length > 0 ? (
                  <List disablePadding>
                    {selectedSeller.books.map((book, index) => (
                      <React.Fragment key={book.id}>
                        <ListItem
                          sx={{
                            px: 3,
                            py: 1.5,
                            "&:hover": { bgcolor: "#f9fafb" },
                          }}
                          secondaryAction={
                            <IconButton
                              edge="end"
                              aria-label="delete"
                              onClick={() => handleDeleteBook(book.id)}
                              sx={{
                                color: "#b91c1c",
                                "&:hover": { bgcolor: "#fee2e2" },
                              }}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          }
                        >
                          <ListItemText
                            primary={
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 600 }}
                              >
                                {book.title}
                              </Typography>
                            }
                            secondary={
                              <Typography
                                variant="body2"
                                sx={{ color: "text.secondary" }}
                              >
                                {book.price}
                              </Typography>
                            }
                          />
                        </ListItem>
                        {index !== selectedSeller.books.length - 1 && (
                          <Divider />
                        )}
                      </React.Fragment>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ p: 3 }}>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      No books found for this seller.
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Stack>

          {/* RIGHT SIDE: USERS & ORDERS */}
          <Box sx={{ flex: 1.4, minWidth: 0 }}>
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
                    Users & Orders
                  </Typography>
                }
                subheader={
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary" }}
                  >
                    View all users, their order count, and total spend.
                  </Typography>
                }
              />
              <Divider />
              <CardContent sx={{ p: 0, maxHeight: 480, overflowY: "auto" }}>
                <List disablePadding>
                  {users.map((user, index) => (
                    <React.Fragment key={user.id}>
                      <ListItem
                        sx={{
                          px: 3,
                          py: 1.5,
                          alignItems: "flex-start",
                          "&:hover": { bgcolor: "#f9fafb" },
                        }}
                      >
                        <ListItemText
                          primary={
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {user.name}
                            </Typography>
                          }
                          secondary={
                            <>
                              <Typography
                                variant="body2"
                                sx={{ color: "text.secondary" }}
                              >
                                {user.email}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  mt: 0.5,
                                  display: "flex",
                                  gap: 1,
                                  alignItems: "center",
                                }}
                              >
                                <Chip
                                  label={`${user.orders} orders`}
                                  size="small"
                                  sx={{
                                    borderRadius: "999px",
                                    fontSize: 11,
                                    bgcolor: "#f1f5f9",
                                    color: "#0f172a",
                                  }}
                                />
                                <Typography
                                  component="span"
                                  variant="body2"
                                  sx={{ fontWeight: 600 }}
                                >
                                  {user.totalSpent}
                                </Typography>
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                      {index !== users.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
