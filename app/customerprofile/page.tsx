"use client";

import { useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Stack,
  Avatar,
  Button,
  Divider,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/src/redux/store";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { fetchProfileThunk } from "@/src/redux/slices/authSlice";

export default function UserProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // 🔹 Redux state
  const { user, loading } = useSelector((state: RootState) => state.auth);
  const { totalItems: wishlistCount = 0 } = useSelector(
    (state: RootState) => state.wishlist
  );
  const { totalQuantity: cartItems = 0 } = useSelector(
    (state: RootState) => state.cart
  );

  // 🔹 AuthContext just for logout (token/cookie cleanup)
  const { logoutUser } = useAuth();

  // 🔹 Fetch latest profile from backend on mount
  useEffect(() => {
    dispatch(fetchProfileThunk());
  }, [dispatch]);

  const userName =
    user && (user.firstName || user.lastName)
      ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
      : "Reader";

  const userEmail = user?.email ?? "";
  const userPhone = user?.fullPhone ? String(user.fullPhone) : "";
  const imageUrl = user?.image
  ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/${user.image}`
  : undefined;

  const handleLogout = () => {
    logoutUser(); 
    router.push("/login");
  };

  return (
    <Box sx={{ bgcolor: "#f5f7fb", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        {/* Optional: small loading text */}
        {loading && (
          <Typography
            variant="body2"
            sx={{ mb: 2, color: "#6b7280", textAlign: "center" }}
          >
            Loading your profile...
          </Typography>
        )}

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
          }}
        >
          {/* Left: Profile card */}
          <Card
            sx={{
              flex: "0 0 330px",
              borderRadius: 4,
              boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
              bgcolor: "#ffffff",
              height: "fit-content",
            }}
          >
            <CardContent>
              <Stack alignItems="center" spacing={2}>
                <Avatar
                  src={imageUrl}
                  sx={{
                    width: 90,
                    height: 90,
                    bgcolor: "#c57a45",
                    fontSize: 34,
                    fontWeight: 700,
                  }}
                >
                  {userName.charAt(0)}
                </Avatar>

                <Typography variant="h6" fontWeight={700}>
                  {userName}
                </Typography>

                <Typography variant="body2" sx={{ color: "#6b7280", mb: 0.5 }}>
                  {userEmail}
                </Typography>
                <Typography variant="body2" sx={{ color: "#6b7280", mb: 1 }}>
                  {userPhone}
                </Typography>

                {user?.bio && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#4b5563",
                      textAlign: "center",
                      mt: 1,
                    }}
                  >
                    {user.bio}
                  </Typography>
                )}

                <Divider sx={{ width: "100%", my: 2 }} />

                <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                  <Button
                    variant="outlined"
                    sx={{ textTransform: "none" }}
                    onClick={() => router.push("/editprofile")}
                  >
                    Edit Profile
                  </Button>

                  <Button
                    variant="outlined"
                    color="error"
                    sx={{ textTransform: "none" }}
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          {/* Right: Stats + actions */}
          <Box sx={{ flex: 1 }}>
            <Stack spacing={3}>
              {/* Stats cards */}
              <Box
                sx={{
                  display: "flex",
                  gap: 3,
                  flexWrap: "wrap",
                }}
              >
                {/* Wishlist card */}
                <Card
                  sx={{
                    flex: "1 1 250px",
                    borderRadius: 3,
                    boxShadow: "0 8px 20px rgba(15,23,42,0.06)",
                    bgcolor: "#ffffff",
                  }}
                >
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: "#fff7f0",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FavoriteBorderIcon sx={{ color: "#c57a45" }} />
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: "#6b7280" }}>
                          Wishlist Items
                        </Typography>
                        <Typography variant="h6" fontWeight={700}>
                          {wishlistCount}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>

                {/* Cart card */}
                <Card
                  sx={{
                    flex: "1 1 250px",
                    borderRadius: 3,
                    boxShadow: "0 8px 20px rgba(15,23,42,0.06)",
                    bgcolor: "#ffffff",
                  }}
                >
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: "#e3f2fd",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <ShoppingCartOutlinedIcon sx={{ color: "#1976d2" }} />
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: "#6b7280" }}>
                          Cart Items
                        </Typography>
                        <Typography variant="h6" fontWeight={700}>
                          {cartItems}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Box>

              {/* Orders */}
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
                  bgcolor: "#ffffff",
                }}
              >
                <CardContent>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Stack direction="row" spacing={2}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: "#f3f4f6",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <ReceiptLongIcon sx={{ color: "#4b5563" }} />
                      </Box>

                      <Box>
                        <Typography variant="h6" fontWeight={700}>
                          My Orders
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#6b7280" }}>
                          View and track all your book purchases.
                        </Typography>
                      </Box>
                    </Stack>

                    <Button
                      variant="contained"
                      sx={{
                        bgcolor: "#c57a45",
                        borderRadius: "999px",
                        textTransform: "none",
                        px: 3,
                        "&:hover": { bgcolor: "#b36a36" },
                      }}
                      onClick={() => router.push("/orders")}
                    >
                      View Orders
                    </Button>
                  </Stack>
                </CardContent>
              </Card>

              {/* Quick actions */}
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 6px 18px rgba(15,23,42,0.05)",
                  bgcolor: "#ffffff",
                }}
              >
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={600} mb={2}>
                    Quick Actions
                  </Typography>

                  <Stack direction="row" spacing={2} flexWrap="wrap">
                    <Button
                      variant="outlined"
                      startIcon={<FavoriteBorderIcon />}
                      sx={{
                        textTransform: "none",
                        borderRadius: "999px",
                        px: 3,
                      }}
                      onClick={() => router.push("/wishlist")}
                    >
                      Wishlist
                    </Button>

                    <Button
                      variant="outlined"
                      startIcon={<ShoppingCartOutlinedIcon />}
                      sx={{
                        textTransform: "none",
                        borderRadius: "999px",
                        px: 3,
                      }}
                      onClick={() => router.push("/cart")}
                    >
                      Cart
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
