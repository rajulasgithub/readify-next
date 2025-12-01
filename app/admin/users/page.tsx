"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardHeader,
  CardContent,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  CircularProgress,
  Alert,
  Stack,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/src/Redux/store/store";
import { fetchCustomers } from "@/src/Redux/store/adminSlice";
import { useSearchParams } from "next/navigation";


const AdminUsersList: React.FC = () => {
    const searchParams = useSearchParams();
    const role = searchParams.get("type"); 
  const dispatch = useDispatch<AppDispatch>();

  const { customers, loading, error } = useSelector(
    (state: RootState) => state.admin
  );

  const [search, setSearch] = useState<string>("");

 
 useEffect(() => {
  dispatch(fetchCustomers({ page: 1, limit: 20, role }));
}, [dispatch, role]);

 
  const filteredUsers = (customers || []).filter((user) => {
  const term = (search || "").toLowerCase();

  const name = (user?.name || "").toLowerCase();
  const email = (user?.email || "").toLowerCase();

  return name.includes(term) || email.includes(term);
});
  const formatCurrency = (value: number | undefined) =>
    `₹${(value || 0).toLocaleString("en-IN")}`;

  const formatDate = (iso?: string) => {
    if (!iso) return "-";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid #e5e7eb",
            bgcolor: "#ffffff",
          }}
        >
          <CardHeader
            title={
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                All Customers
              </Typography>
            }
            subheader={
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                View all registered users, their order count and total spend.
              </Typography>
            }
          />
          <CardContent sx={{ pt: 0 }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems={{ xs: "stretch", sm: "center" }}
              justifyContent="space-between"
              sx={{ py: 2 }}
            >
              <TextField
                size="small"
                label="Search by name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ maxWidth: 320 }}
              />
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", textAlign: "right" }}
              >
                Total Customers:{" "}
                <Typography component="span" sx={{ fontWeight: 600, color: "#0f172a" }}>
                  {customers.length}
                </Typography>
              </Typography>
            </Stack>

            {loading && (
              <Box
                sx={{
                  py: 6,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CircularProgress size={28} />
              </Box>
            )}

            {error && !loading && (
              <Box sx={{ py: 2 }}>
                <Alert severity="error">{error}</Alert>
              </Box>
            )}

            {!loading && !error && (
              <Box sx={{ overflowX: "auto" }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Total Orders</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Total Spent</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Joined On</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5}>
                          <Typography
                            variant="body2"
                            sx={{
                              py: 3,
                              textAlign: "center",
                              color: "text.secondary",
                            }}
                          >
                            No customers found.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user._id} hover>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {user.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{user.email}</Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={`${user.totalOrders || 0} orders`}
                              size="small"
                              sx={{
                                borderRadius: "999px",
                                bgcolor: "#f1f5f9",
                                color: "#0f172a",
                                fontSize: 11,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {formatCurrency(user.totalSpent)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ color: "text.secondary" }}>
                              {formatDate(user.createdAt)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default AdminUsersList;
