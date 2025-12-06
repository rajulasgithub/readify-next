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
  Pagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar, // 🆕 Added
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/src/redux/store";
import {
  fetchUsers,
  toggleBlockUser,
  deleteUserThunk,
} from "@/src/redux/slices/adminSlice";
import { useSearchParams, useRouter } from "next/navigation";

interface ConfirmDialogState {
  open: boolean;
  action: "block" | "delete" | null;
  userId: string | null;
}

const AdminUsersList: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("type");

  const initialPage = Number(searchParams.get("page")) || 1;
  const [page, setPage] = useState(initialPage);

  const dispatch = useDispatch<AppDispatch>();

  const {
    customers,
    sellers,
    loading,
    error,
    pagination,
    actionLoading,
  } = useSelector((state: RootState) => state.admin);

  const [search, setSearch] = useState<string>("");

  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    open: false,
    action: null,
    userId: null,
  });

  const users = role === "seller" ? sellers : customers;

  useEffect(() => {
    if (!role) return;

    dispatch(
      fetchUsers({
        type: role as "seller" | "customer",
        page,
        limit: 2,
      })
    );

    router.replace(`?type=${role}&page=${page}`);
  }, [dispatch, role, page, router]);

  const filteredUsers = users || [];

  const formatDate = (iso?: string) => {
    if (!iso) return "-";
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const title = role === "seller" ? "All Sellers" : "All Customers";

  const openBlockDialog = (userId: string) => {
    setConfirmDialog({
      open: true,
      action: "block",
      userId,
    });
  };

  const openDeleteDialog = (userId: string) => {
    setConfirmDialog({
      open: true,
      action: "delete",
      userId,
    });
  };

  const handleCloseDialog = () => {
    setConfirmDialog({
      open: false,
      action: null,
      userId: null,
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmDialog.userId || !confirmDialog.action || !role) {
      handleCloseDialog();
      return;
    }

    try {
      if (confirmDialog.action === "block") {
        await dispatch(
          toggleBlockUser({ userId: confirmDialog.userId, role })
        ).unwrap();
      }

      if (confirmDialog.action === "delete") {
        await dispatch(
          deleteUserThunk({ userId: confirmDialog.userId, role })
        ).unwrap();
      }

      await dispatch(
        fetchUsers({
          type: role as "seller" | "customer",
          page,
          limit: 2,
        })
      );
    } catch (err) {
      console.error(err);
    } finally {
      handleCloseDialog();
    }
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
                {title}
              </Typography>
            }
            subheader={
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                View all registered {role ?? ""}s, their order count and total spend.
              </Typography>
            }
          />

          <CardContent sx={{ pt: 0 }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="space-between"
              sx={{ py: 2 }}
            >
              <TextField
                size="small"
                label={`Search ${role ?? "user"} by name or email`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ maxWidth: 320 }}
              />

              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Total {role ?? "user"}s:{" "}
                <Typography
                  component="span"
                  sx={{ fontWeight: 600, color: "#0f172a" }}
                >
                  {pagination?.total ?? users.length}
                </Typography>
              </Typography>
            </Stack>

            {loading && (
              <Box sx={{ py: 6, display: "flex", justifyContent: "center" }}>
                <CircularProgress size={28} />
              </Box>
            )}

            {error && !loading && (
              <Alert severity="error" sx={{ my: 2 }}>
                {error}
              </Alert>
            )}

            {!loading && !error && (
              <>
                <Box sx={{ overflowX: "auto" }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>
                          Total Orders
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Joined On</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {filteredUsers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            No {role ?? "user"}s found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredUsers.map((user) => (
                          <TableRow key={user._id} hover>
                            <TableCell>
                              <Stack direction="row" spacing={2} alignItems="center">
                                
                                {/* 🆕 Round Image Added */}
                              <Avatar
  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${user.image}`}
  alt={user.firstName}
  sx={{ width: 40, height: 40 }}
/>

                                <Typography>
                                  {user.firstName} {user.lastName}
                                </Typography>
                              </Stack>
                            </TableCell>

                            <TableCell>{user.email}</TableCell>

                            <TableCell>
                              <Chip
                                label={`${user.totalOrders || 0} orders`}
                                size="small"
                              />
                            </TableCell>

                            <TableCell>{formatDate(user.createdAt)}</TableCell>

                            <TableCell align="right">
                              <Stack direction="row" spacing={1}>
                                {role === "seller" && (
                                  <Chip
                                    label="View Store"
                                    size="small"
                                    sx={{
                                      cursor: "pointer",
                                      bgcolor: "#e0f2fe",
                                      color: "#0369a1",
                                      fontWeight: 600,
                                    }}
                                    onClick={() =>
                                      router.push(`/admin/viewstore/${user._id}`)
                                    }
                                  />
                                )}

                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={() => openBlockDialog(user._id)}
                                  disabled={actionLoading}
                                  sx={{ textTransform: "none" }}
                                >
                                  {user.blocked ? "Unblock" : "Block"}
                                </Button>

                                <Button
                                  variant="contained"
                                  size="small"
                                  color="error"
                                  sx={{ textTransform: "none" }}
                                  onClick={() => openDeleteDialog(user._id)}
                                  disabled={actionLoading}
                                >
                                  Delete
                                </Button>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </Box>

                <Stack sx={{ py: 3 }} alignItems="center">
                  <Pagination
                    count={pagination?.totalPages || 1}
                    page={page}
                    onChange={(_, value) => setPage(value)}
                    color="primary"
                    shape="rounded"
                  />
                </Stack>
              </>
            )}

            {/* Confirm Dialog */}
            <Dialog open={confirmDialog.open} onClose={handleCloseDialog}>
              <DialogTitle>
                {confirmDialog.action === "delete" ? "Delete User" : "Block User"}
              </DialogTitle>

              <DialogContent>
                <Typography>
                  {confirmDialog.action === "delete"
                    ? "Are you sure you want to permanently delete this user?"
                    : "Are you sure you want to block this user?"}
                </Typography>
              </DialogContent>

              <DialogActions>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                <Button
                  onClick={handleConfirmAction}
                  color="error"
                  variant="contained"
                  disabled={actionLoading}
                >
                  Confirm
                </Button>
              </DialogActions>
            </Dialog>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default AdminUsersList;
