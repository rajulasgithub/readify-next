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
  Badge,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/src/context/AuthContext";

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

  const { role, logoutUser } = useAuth();
  const isLoggedIn = !!role;
  const isCustomer = role === "customer";
  const isSeller = role === "seller";
  const isAdmin = role === "admin"; // ✅ Added

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDrawerToggle = (): void => setMobileOpen((prev) => !prev);
  const handleCategoriesClick = (event: React.MouseEvent<HTMLElement>) =>
    setCatAnchorEl(event.currentTarget);
  const handleCategoriesClose = () => setCatAnchorEl(null);
  const handleCategorySelect = (cat: string) => {
    setCatAnchorEl(null);
    router.push(`/categories?name=${encodeURIComponent(cat)}`);
  };
  const handleLogout = () => {
    logoutUser();
    router.push("/login");
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ width: 260, p: 2 }}>
      <Typography
        variant="h5"
        sx={{
          my: 1,
          fontWeight: 800,
          color: "#111827",
          letterSpacing: 1,
        }}
      >
        Readify
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <List>
        {/* CUSTOMER MOBILE MENU */}
        {isCustomer && (
          <>
            <ListItem component={Link} href="/categories" sx={{ cursor: "pointer" }}>
              <ListItemText primary="Categories" />
            </ListItem>
            <ListItem component={Link} href="/about" sx={{ cursor: "pointer" }}>
              <ListItemText primary="About" />
            </ListItem>
            <ListItem component={Link} href="/wishlist" sx={{ cursor: "pointer" }}>
              <ListItemText primary="Wishlist" />
            </ListItem>
            <ListItem component={Link} href="/cart" sx={{ cursor: "pointer" }}>
              <ListItemText primary="Cart" />
            </ListItem>
            <ListItem component={Link} href="/vieworders" sx={{ cursor: "pointer" }}>
              <ListItemText primary="Orders" />
            </ListItem>
            <ListItem component={Link} href="/customerprofile" sx={{ cursor: "pointer" }}>
              <ListItemText primary="Profile" />
            </ListItem>
            <Divider sx={{ my: 2 }} />
            <ListItem onClick={handleLogout} sx={{ color: "#b91c1c", cursor: "pointer" }}>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        )}

        {/* SELLER MOBILE MENU */}
        {isSeller && (
          <>
            <ListItem component={Link} href="/about" sx={{ cursor: "pointer" }}>
              <ListItemText primary="About" />
            </ListItem>
            <ListItem component={Link} href="/sellerbooks" sx={{ cursor: "pointer" }}>
              <ListItemText primary="Books" />
            </ListItem>
            <ListItem component={Link} href="/sellerprofile" sx={{ cursor: "pointer" }}>
              <ListItemText primary="Profile" />
            </ListItem>
            <Divider sx={{ my: 2 }} />
            <ListItem onClick={handleLogout} sx={{ color: "#b91c1c", cursor: "pointer" }}>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        )}

        {/* ADMIN MOBILE MENU */}
        {isAdmin && (
          <>
            <ListItem component={Link} href="/admin/dashboard" sx={{ cursor: "pointer" }}>
              <ListItemText primary="Dashboard" />
            </ListItem>

            <ListItem component={Link} href="/adminprofile" sx={{ cursor: "pointer" }}>
              <ListItemText primary="Profile" />
            </ListItem>

            <Divider sx={{ my: 2 }} />
            <ListItem onClick={handleLogout} sx={{ color: "#b91c1c", cursor: "pointer" }}>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        )}

        {/* GUEST MOBILE MENU */}
        {!isLoggedIn && (
          <>
            <ListItem component={Link} href="/about" sx={{ cursor: "pointer" }}>
              <ListItemText primary="About" />
            </ListItem>
            <ListItem component={Link} href="/register" sx={{ cursor: "pointer" }}>
              <ListItemText primary="Register" />
            </ListItem>
            <Divider sx={{ my: 2 }} />
            <ListItem component={Link} href="/login" sx={{ cursor: "pointer" }}>
              <ListItemText primary="Sign In" sx={{ color: "#c57a45" }} />
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
        elevation={3}
        sx={{ bgcolor: "#fff", borderBottom: "1px solid #e5e7eb" }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            px: { xs: 2, md: 5 },
          }}
        >
          {/* LOGO */}
          <Link href="/">
            <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer", gap: 1 }}>
              <Box
                component="img"
                src="/logo.jpg"
                alt="Readify Logo"
                sx={{ width: 32, height: 32 }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  letterSpacing: 2,
                  color: "#111827",
                }}
              >
                Readify
              </Typography>
            </Box>
          </Link>

          {/* DESKTOP MENU */}
          <Stack
            direction="row"
            spacing={3}
            sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}
          >
            {/* CUSTOMER DESKTOP MENU */}
            {isCustomer && (
              <>
                <Link href="/viewbooks" style={{ textDecoration: "none" }}>
                  <Typography sx={{ fontWeight: 500, fontSize: 15, color: "#4b5563", cursor: "pointer", "&:hover": { color: "#111827" } }}>
                    Books
                  </Typography>
                </Link>

                <Typography
                  onClick={handleCategoriesClick}
                  sx={{
                    fontWeight: 500,
                    fontSize: 15,
                    color: "#4b5563",
                    cursor: "pointer",
                    "&:hover": { color: "#111827" },
                  }}
                >
                  Categories
                </Typography>

                <Link href="/about" style={{ textDecoration: "none" }}>
                  <Typography sx={{ fontWeight: 500, fontSize: 15, color: "#4b5563", cursor: "pointer", "&:hover": { color: "#111827" } }}>
                    About
                  </Typography>
                </Link>

                <IconButton
                  sx={{ color: "#c57a45", "&:hover": { color: "#b36a36" } }}
                  onClick={() => router.push("/wishlist")}
                >
                  <Badge badgeContent={0} color="error">
                    <FavoriteBorderIcon />
                  </Badge>
                </IconButton>

                <IconButton
                  sx={{ color: "#4b5563", "&:hover": { color: "#111827" } }}
                  onClick={() => router.push("/cart")}
                >
                  <Badge badgeContent={0} color="primary">
                    <ShoppingCartOutlinedIcon />
                  </Badge>
                </IconButton>

                <IconButton
                  sx={{ color: "#4b5563", "&:hover": { color: "#111827" } }}
                  onClick={() => router.push("/customerprofile")}
                >
                  <PersonOutlineIcon />
                </IconButton>

                <Button
                  onClick={handleLogout}
                  sx={{
                    textTransform: "none",
                    fontSize: 14,
                    ml: 1,
                    color: "#b91c1c",
                    "&:hover": { backgroundColor: "#fee2e2" },
                  }}
                >
                  Logout
                </Button>
              </>
            )}

            {/* SELLER DESKTOP MENU */}
            {isSeller && (
              <>
                <Link href="/about" style={{ textDecoration: "none" }}>
                  <Typography sx={{ fontWeight: 500, fontSize: 15, color: "#4b5563", cursor: "pointer", "&:hover": { color: "#111827" } }}>
                    About
                  </Typography>
                </Link>

                <Link href="/sellerbooks" style={{ textDecoration: "none" }}>
                  <Typography sx={{ fontWeight: 500, fontSize: 15, color: "#4b5563", cursor: "pointer", "&:hover": { color: "#111827" } }}>
                    Books
                  </Typography>
                </Link>

                <IconButton
                  sx={{ color: "#4b5563", "&:hover": { color: "#111827" } }}
                  onClick={() => router.push("/sellerprofile")}
                >
                  <PersonOutlineIcon />
                </IconButton>

                <Button
                  onClick={handleLogout}
                  sx={{
                    textTransform: "none",
                    fontSize: 14,
                    ml: 1,
                    color: "#b91c1c",
                    "&:hover": { backgroundColor: "#fee2e2" },
                  }}
                >
                  Logout
                </Button>
              </>
            )}

            {/* ADMIN DESKTOP MENU */}
            {isAdmin && (
              <>
                <Link href="/admin" style={{ textDecoration: "none" }}>
                  <Typography sx={{ fontWeight: 500, fontSize: 15, color: "#4b5563", cursor: "pointer", "&:hover": { color: "#111827" } }}>
                    Dashboard
                  </Typography>
                </Link>

             
                <Button
                  onClick={handleLogout}
                  sx={{
                    textTransform: "none",
                    fontSize: 14,
                    ml: 1,
                    color: "#b91c1c",
                    "&:hover": { backgroundColor: "#fee2e2" },
                  }}
                >
                  Logout
                </Button>
              </>
            )}

            {/* GUEST DESKTOP MENU */}
            {!isLoggedIn && (
              <>
                <Link href="/about" style={{ textDecoration: "none" }}>
                  <Typography sx={{ fontWeight: 500, fontSize: 15, color: "#4b5563", cursor: "pointer", "&:hover": { color: "#111827" } }}>
                    About
                  </Typography>
                </Link>

                <Link href="/register" style={{ textDecoration: "none" }}>
                  <Typography sx={{ fontWeight: 500, fontSize: 15, color: "#4b5563", cursor: "pointer", "&:hover": { color: "#111827" } }}>
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

          {/* MOBILE MENU BUTTON */}
          <IconButton sx={{ display: { xs: "flex", md: "none" } }} onClick={handleDrawerToggle}>
            <MenuIcon sx={{ color: "#111827" }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* CATEGORY MENU */}
      <Menu
        anchorEl={catAnchorEl}
        open={isCatMenuOpen}
        onClose={handleCategoriesClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{
          sx: {
            mt: 1,
            p: 2,
            borderRadius: 2,
            boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
          },
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(3, 1fr)" },
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
                "&:hover": { backgroundColor: "#f3f4f6" },
              }}
            >
              {cat}
            </MenuItem>
          ))}
        </Box>
      </Menu>

      {/* MOBILE DRAWER */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: 260, boxShadow: "2px 0 8px rgba(0,0,0,0.1)" },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}
