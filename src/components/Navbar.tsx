"use client";

import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Stack,
  Divider,
  Menu,
  MenuItem,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/src/context/AuthContext"; // 👈 auth context

const categories = [
  "Fiction",
  "Non-Fiction",
  "Romance",
  "Thriller",
  "Science",
  "Self Help",
  "Biography",
  "Children",
  "Comics",
  "Fantasy",
  "Horror",
  "History",
];

export default function Navbar() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  const [catAnchorEl, setCatAnchorEl] = useState<null | HTMLElement>(null);
  const isCatMenuOpen = Boolean(catAnchorEl);

  // 🔐 Auth
  const { role, logoutUser } = useAuth();
  const isLoggedIn = !!role;
  const isCustomer = role === "customer";
  const isSeller = role === "seller";

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDrawerToggle = (): void => {
    setMobileOpen((prev) => !prev);
  };

  const handleCategoriesClick = (event: React.MouseEvent<HTMLElement>) => {
    setCatAnchorEl(event.currentTarget);
  };

  const handleCategoriesClose = () => {
    setCatAnchorEl(null);
  };

  const handleCategorySelect = (cat: string) => {
    setCatAnchorEl(null);
    router.push(`/categories?name=${encodeURIComponent(cat)}`);
  };

  const handleLogout = () => {
    logoutUser();
    router.push("/login");
  };

  const drawer = (
    <Box
      onClick={handleDrawerToggle}
      sx={{
        textAlign: "center",
        width: 260,
        p: 2,
      }}
    >
      <Typography
        variant="h6"
        sx={{ my: 1, fontWeight: 700, color: "#111827" }}
      >
        Readify
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <List>
        
        {isCustomer && (
          <>
            <ListItem>
              <Link
                href="/categories"
                style={{ textDecoration: "none", width: "100%" }}
              >
                <ListItemText
                  primary="Categories"
                  primaryTypographyProps={{
                    sx: { fontSize: 16, fontWeight: 500, color: "#374151" },
                  }}
                />
              </Link>
            </ListItem>

            <ListItem>
              <Link
                href="/about"
                style={{ textDecoration: "none", width: "100%" }}
              >
                <ListItemText
                  primary="About"
                  primaryTypographyProps={{
                    sx: { fontSize: 16, fontWeight: 500, color: "#374151" },
                  }}
                />
              </Link>
            </ListItem>

            <ListItem>
              <Link
                href="/wishlist"
                style={{ textDecoration: "none", width: "100%" }}
              >
                <ListItemText
                  primary="Wishlist"
                  primaryTypographyProps={{
                    sx: { fontSize: 16, fontWeight: 500, color: "#374151" },
                  }}
                />
              </Link>
            </ListItem>

            <ListItem>
              <Link
                href="/cart"
                style={{ textDecoration: "none", width: "100%" }}
              >
                <ListItemText
                  primary="Cart"
                  primaryTypographyProps={{
                    sx: { fontSize: 16, fontWeight: 500, color: "#374151" },
                  }}
                />
              </Link>
            </ListItem>
            <ListItem>
              <Link
                href="/vieworders"
                style={{ textDecoration: "none", width: "100%" }}
              >
                
                <ListItemText
                  primary="Orders"
                  primaryTypographyProps={{
                    sx: { fontSize: 16, fontWeight: 500, color: "#374151" },
                  }}
                />
              </Link>
            </ListItem>

            <ListItem>
              <Link
                href="/profile"
                style={{ textDecoration: "none", width: "100%" }}
              >
                <ListItemText
                  primary="Profile"
                  primaryTypographyProps={{
                    sx: { fontSize: 16, fontWeight: 500, color: "#374151" },
                  }}
                />
              </Link>
            </ListItem>

            <Divider sx={{ my: 2 }} />

            <ListItem onClick={handleLogout} sx={{ cursor: "pointer" }}>
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{
                  sx: { fontSize: 16, fontWeight: 600, color: "#b91c1c" },
                }}
              />
            </ListItem>
          </>
        )}

        {/* 🧑‍🏫 SELLER MENU (mobile) */}
        {isSeller && (
          <>
            <ListItem>
              <Link
                href="/about"
                style={{ textDecoration: "none", width: "100%" }}
              >
                <ListItemText
                  primary="About"
                  primaryTypographyProps={{
                    sx: { fontSize: 16, fontWeight: 500, color: "#374151" },
                  }}
                />
              </Link>
            </ListItem>

            <ListItem>
              <Link
                href="/profile"
                style={{ textDecoration: "none", width: "100%" }}
              >
                <ListItemText
                  primary="Profile"
                  primaryTypographyProps={{
                    sx: { fontSize: 16, fontWeight: 500, color: "#374151" },
                  }}
                />
              </Link>
            </ListItem>

            <Divider sx={{ my: 2 }} />

            <ListItem onClick={handleLogout} sx={{ cursor: "pointer" }}>
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{
                  sx: { fontSize: 16, fontWeight: 600, color: "#b91c1c" },
                }}
              />
            </ListItem>
          </>
        )}

        {/* 🧍 NOT LOGGED IN (mobile) */}
        {!isLoggedIn && (
          <>
            <ListItem>
              <Link
                href="/about"
                style={{ textDecoration: "none", width: "100%" }}
              >
                <ListItemText
                  primary="About"
                  primaryTypographyProps={{
                    sx: { fontSize: 16, fontWeight: 500, color: "#374151" },
                  }}
                />
              </Link>
            </ListItem>

            <ListItem>
              <Link
                href="/register"
                style={{ textDecoration: "none", width: "100%" }}
              >
                <ListItemText
                  primary="Register"
                  primaryTypographyProps={{
                    sx: { fontSize: 16, fontWeight: 500, color: "#374151" },
                  }}
                />
              </Link>
            </ListItem>

            <Divider sx={{ my: 2 }} />

            <ListItem>
              <Link
                href="/login"
                style={{ textDecoration: "none", width: "100%" }}
              >
                <ListItemText
                  primary="Sign In"
                  primaryTypographyProps={{
                    sx: { fontSize: 16, fontWeight: 600, color: "#c57a45" },
                  }}
                />
              </Link>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  if (!mounted) return null;

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            px: { xs: 2, md: 5 },
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none" }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                letterSpacing: 1,
                color: "#111827",
                cursor: "pointer",
              }}
            >
              Readify
            </Typography>
          </Link>

          {/* Desktop menu */}
          <Stack
            direction="row"
            spacing={3}
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
            }}
          >
            {/* 🧑‍💻 CUSTOMER (desktop) */}
            {isCustomer && (
              <>
                <Link href="/viewbooks" style={{ textDecoration: "none" }}>
                  <Typography
                    sx={{
                      color: "#4b5563",
                      fontSize: 15,
                      fontWeight: 500,
                      cursor: "pointer",
                      "&:hover": { color: "#111827" },
                    }}
                  >
                   Books
                  </Typography>
                </Link>
                <Typography
                  onClick={handleCategoriesClick}
                  sx={{
                    color: "#4b5563",
                    fontSize: 15,
                    fontWeight: 500,
                    cursor: "pointer",
                    "&:hover": { color: "#111827" },
                  }}
                >
                  Categories
                </Typography>

                <Link href="/about" style={{ textDecoration: "none" }}>
                  <Typography
                    sx={{
                      color: "#4b5563",
                      fontSize: 15,
                      fontWeight: 500,
                      cursor: "pointer",
                      "&:hover": { color: "#111827" },
                    }}
                  >
                    About
                  </Typography>
                </Link>
               

                <IconButton onClick={() => router.push("/wishlist")}>
                  <FavoriteBorderIcon sx={{ color: "#c57a45" }} />
                </IconButton>

                <IconButton onClick={() => router.push("/cart")}>
                  <ShoppingCartOutlinedIcon sx={{ color: "#4b5563" }} />
                </IconButton>

                <IconButton onClick={() => router.push("/customerprofile")}>
                  <PersonOutlineIcon sx={{ color: "#4b5563" }} />
                </IconButton>

                <Button
                  onClick={handleLogout}
                  sx={{
                    textTransform: "none",
                    fontSize: 14,
                    ml: 1,
                    color: "#b91c1c",
                  }}
                >
                  Logout
                </Button>
              </>
            )}

            {/* 🧑‍🏫 SELLER (desktop) */}
            {isSeller && (
              <>

             
                <Link href="/about" style={{ textDecoration: "none" }}>
                  <Typography
                    sx={{
                      color: "#4b5563",
                      fontSize: 15,
                      fontWeight: 500,
                      cursor: "pointer",
                      "&:hover": { color: "#111827" },
                    }}
                  >
                    About
                  </Typography>
                </Link>

                <IconButton onClick={() => router.push("/profile")}>
                  <PersonOutlineIcon sx={{ color: "#4b5563" }} />
                </IconButton>

                <Button
                  onClick={handleLogout}
                  sx={{
                    textTransform: "none",
                    fontSize: 14,
                    ml: 1,
                    color: "#b91c1c",
                  }}
                >
                  Logout
                </Button>
              </>
            )}

            {/* 🧍 NOT LOGGED IN (desktop) */}
            {!isLoggedIn && (
              <>
                <Link href="/about" style={{ textDecoration: "none" }}>
                  <Typography
                    sx={{
                      color: "#4b5563",
                      fontSize: 15,
                      fontWeight: 500,
                      cursor: "pointer",
                      "&:hover": { color: "#111827" },
                    }}
                  >
                    About
                  </Typography>
                </Link>

                <Link href="/register" style={{ textDecoration: "none" }}>
                  <Typography
                    sx={{
                      color: "#4b5563",
                      fontSize: 15,
                      fontWeight: 500,
                      cursor: "pointer",
                      "&:hover": { color: "#111827" },
                    }}
                  >
                      Register
                  </Typography>
                </Link>

                <Link href="/login" style={{ textDecoration: "none" }}>
                  <Button
                    variant="contained"
                    sx={{
                      ml: 1,
                      borderRadius: "999px",
                      textTransform: "none",
                      bgcolor: "#c57a45",
                      px: 3,
                      "&:hover": { bgcolor: "#b36a36" },
                    }}
                  >
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </Stack>

          {/* Mobile menu icon */}
          <IconButton
            sx={{ display: { xs: "flex", md: "none" } }}
            onClick={handleDrawerToggle}
          >
            <MenuIcon sx={{ color: "#111827" }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Categories dropdown for desktop customer */}
      <Menu
        anchorEl={catAnchorEl}
        open={isCatMenuOpen}
        onClose={handleCategoriesClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        MenuListProps={{ sx: { p: 0 } }}
        PaperProps={{
          sx: {
            mt: 1,
            p: 2,
            borderRadius: 2,
          },
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, minmax(0, 1fr))",
              sm: "repeat(3, minmax(0, 1fr))",
            },
            gap: 1,
            minWidth: 260,
          }}
        >
          {categories.map((cat) => (
            <MenuItem
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              sx={{
                borderRadius: 1,
                fontSize: 14,
              }}
            >
              {cat}
            </MenuItem>
          ))}
        </Box>
      </Menu>

      {/* Mobile drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: 260 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}
