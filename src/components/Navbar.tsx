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
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SearchIcon from "@mui/icons-material/Search";

import Link from "next/link";

// nav items with paths
const navItems: { label: string; href: string }[] = [

  { label: "Categories", href: "/categories" },
  { label: "Browse", href: "/browse" },
  { label: "About", href: "/about" },
  { label: "Register", href: "/register" }

 

];



export default function Navbar() {
   const [mounted, setMounted] = useState(false); // ✅ define mounted

  useEffect(() => {
    setMounted(true); // ✅ set mounted after client mounts
  }, []);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  const handleDrawerToggle = (): void => {
    setMobileOpen((prev) => !prev);
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

          {/* Desktop Navigation */}
          <Stack
            direction="row"
            spacing={3}
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
            }}
          >
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

            {/* Icons */}
            <IconButton>
              <SearchIcon sx={{ color: "#4b5563" }} />
            </IconButton>

            <IconButton>
              <FavoriteBorderIcon sx={{ color: "#4b5563" }} />
            </IconButton>

            <IconButton>
              <PersonOutlineIcon sx={{ color: "#4b5563" }} />
            </IconButton>

            {/* Sign In */}
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
