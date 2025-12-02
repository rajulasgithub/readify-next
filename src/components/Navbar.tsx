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
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useRouter } from "next/navigation";
import Link from "next/link";

// normal nav items (without Categories)
const navItems: { label: string; href: string }[] = [
  { label: "About", href: "/about" },
  { label: "Register", href: "/register" },
];

// your category list (show these in 3 columns)
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

  // state for Categories menu
  const [catAnchorEl, setCatAnchorEl] = useState<null | HTMLElement>(null);
  const isCatMenuOpen = Boolean(catAnchorEl);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDrawerToggle = (): void => {
    setMobileOpen((prev) => !prev);
  };

  // open categories menu
  const handleCategoriesClick = (event: React.MouseEvent<HTMLElement>) => {
    setCatAnchorEl(event.currentTarget);
  };

  // close categories menu
  const handleCategoriesClose = () => {
    setCatAnchorEl(null);
  };

  // when user clicks a category
  const handleCategorySelect = (cat: string) => {
    setCatAnchorEl(null);
    // navigate however you want, example:
    router.push(`/categories?name=${encodeURIComponent(cat)}`);
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
        {/* For mobile: just go to /categories page */}
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

        {navItems.map((item) => (
          <ListItem key={item.label}>
            <Link
              href={item.href}
              style={{ textDecoration: "none", width: "100%" }}
            >
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  sx: { fontSize: 16, fontWeight: 500, color: "#374151" },
                }}
              />
            </Link>
          </ListItem>
        ))}

        <Divider sx={{ my: 2 }} />

        <ListItem>
          <Link href="/signin" style={{ textDecoration: "none", width: "100%" }}>
            <ListItemText
              primary="Sign In"
              primaryTypographyProps={{
                sx: { fontSize: 16, fontWeight: 600, color: "#c57a45" },
              }}
            />
          </Link>
        </ListItem>
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

          {/* Desktop Nav */}
          <Stack
            direction="row"
            spacing={3}
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
            }}
          >
            {/* Categories dropdown trigger */}
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

            {/* Normal nav items */}
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                style={{ textDecoration: "none" }}
              >
                <Typography
                  sx={{
                    color: "#4b5563",
                    fontSize: 15,
                    fontWeight: 500,
                    cursor: "pointer",
                    "&:hover": { color: "#111827" },
                  }}
                >
                  {item.label}
                </Typography>
              </Link>
            ))}

            <IconButton onClick={() => router.push("/wishlist")}>
              <FavoriteBorderIcon sx={{ color: "#c57a45" }} />
            </IconButton>

            <IconButton onClick={() => router.push("/cart")}>
              <ShoppingCartOutlinedIcon sx={{ color: "#4b5563" }} />
            </IconButton>

            <IconButton>
              <PersonOutlineIcon sx={{ color: "#4b5563" }} />
            </IconButton>

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
          </Stack>

          {/* Mobile Menu Button */}
          <IconButton
            sx={{ display: { xs: "flex", md: "none" } }}
            onClick={handleDrawerToggle}
          >
            <MenuIcon sx={{ color: "#111827" }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Categories dropdown menu (desktop) */}
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

      {/* Mobile Drawer */}
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
