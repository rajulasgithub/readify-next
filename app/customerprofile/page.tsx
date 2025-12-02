"use client";

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
  Chip,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { useSelector } from "react-redux";
import { RootState } from "@/src/Redux/store/store";
import { useRouter } from "next/navigation";

export default function UserProfilePage() {
  const router = useRouter();

  const { user } = useSelector((state: RootState) => state.auth);
  const { totalItems: wishlistCount = 0 } = useSelector(
    (state: RootState) => state.wishlist
  );
  const { totalQuantity: cartItems = 0 } = useSelector(
    (state: RootState) => state.cart
  );

  const userName = user?.firstName || "Reaer";
  const userEmail = user?.email || "Not provided";
  const userPhone = user?.phone || "Not provided";
  const userRole = user?.role || "Customer";
  // const joinedAt = user?.createdAt
  //   ? new Date(user.createdAt).toLocaleDateString()
  //   : "Recently joined";

  return (
    <Box sx={{ bgcolor: "#f5f7fb", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          fontWeight={700}
          sx={{ mb: 4, color: "#111827" }}
        >
          My Profile
        </Typography>

       
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
          }}
        >
        
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

                <Typography
                  variant="body2"
                  sx={{ color: "#6b7280", mb: 1 }}
                >
                  {userEmail}
                </Typography>

                <Chip
                  label={userRole}
                  size="small"
                  sx={{
                    bgcolor: "#fff7f0",
                    color: "#c57a45",
                    fontWeight: 600,
                    mb: 2,
                  }}
                />

                <Divider sx={{ width: "100%", my: 1 }} />

                <Box sx={{ width: "100%" }}>
                  <Typography variant="subtitle2" sx={{ color: "#6b7280" }}>
                    Phone
                  </Typography>
                  {/* <Typography sx={{ mb: 1.5 }}>{userPhone}</Typography> */}

                  <Typography variant="subtitle2" sx={{ color: "#6b7280" }}>
                    Member Since
                  </Typography>
                  {/* <Typography>{joinedAt}</Typography> */}
                </Box>

                <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                  <Button variant="outlined" sx={{ textTransform: "none" }}>
                    Edit Profile
                  </Button>

                  <Button
                    variant="outlined"
                    color="error"
                    sx={{ textTransform: "none" }}
                  >
                    Logout
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          {/* ---------- RIGHT SIDE : CONTENT ---------- */}
          <Box sx={{ flex: 1 }}>
            <Stack spacing={3}>
              {/* --------- Stats Section --------- */}
              <Box
                sx={{
                  display: "flex",
                  gap: 3,
                  flexWrap: "wrap",
                }}
              >
                {/* Wishlist */}
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

                {/* Cart */}
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

              {/* ----------- Orders Section ----------- */}
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

              {/* -------- Quick Actions -------- */}
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
