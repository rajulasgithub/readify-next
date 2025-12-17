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
import { usePathname } from "next/navigation";
import Image from "next/image";



export default function Navbar() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

 
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  const activeStyle = {
  color: "#2563eb", 
  fontWeight: 600,
};

const inactiveStyle = {
  color: "#4b5563",
  fontWeight: 500,
  cursor: "pointer",
  "&:hover": { color: "#111827" },
};


  const { role, logoutUser } = useAuth();
  const isLoggedIn = !!role;
  const isCustomer = role === "customer";
  const isSeller = role === "seller";
  const isAdmin = role === "admin"; 

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDrawerToggle = (): void => setMobileOpen((prev) => !prev);
  
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
       
        {isCustomer && (
          <>
            <ListItem component={Link} href="/categories" sx={{ cursor: "pointer" }}>
              <ListItemText primary="Categories" />
            </ListItem>
            <ListItem component={Link} href="/about" sx={{ cursor: "pointer" }}>
              <ListItemText  primary="About" />
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
          <Link href="/">
            <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer", gap: 1 }}>
              <Box
                component="img"
                src="/logo.jpg"
                alt="ReadifyLogo"
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

          <Stack
            direction="row"
            spacing={3}
            sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}
          >
            {isCustomer && (
              <>
                <Link href="/viewbooks" style={{ textDecoration: "none" }}>
                  <Typography sx={isActive("/viewbooks") ? activeStyle : inactiveStyle}>
                    Books
                  </Typography>
                </Link>

               

                <Link href="/about" style={{ textDecoration: "none" }}>
                  <Typography sx={isActive("/about") ? activeStyle : inactiveStyle}>
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

            {isSeller && (
              <>
                <Link href="/about" style={{ textDecoration: "none" }}>
                  <Typography sx={isActive("/about") ? activeStyle : inactiveStyle}>
                    About
                  </Typography>
                </Link>

                <Link href="/sellerbooks" style={{ textDecoration: "none" }}>
                  <Typography sx={isActive("/sellerbooks") ? activeStyle : inactiveStyle}>
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

            {isAdmin && (
              <>
                <Link href="/admin" style={{ textDecoration: "none" }}>
                  <Typography sx={isActive("/admin") ? activeStyle : inactiveStyle}>
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

            {!isLoggedIn && (
              <>
                <Link href="/about" style={{ textDecoration: "none" }}>
                  <Typography sx={isActive("/about") ? activeStyle : inactiveStyle}>
                    About
                  </Typography>
                </Link>

                <Link href="/register" style={{ textDecoration: "none" }}>
                  <Typography sx={isActive("/register") ? activeStyle : inactiveStyle}>
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

          <IconButton sx={{ display: { xs: "flex", md: "none" } }} onClick={handleDrawerToggle}>
            <MenuIcon sx={{ color: "#111827" }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      
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
