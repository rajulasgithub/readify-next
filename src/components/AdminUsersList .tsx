"use client";

import React, { useEffect, useState, useRef, useCallback  } from "react";
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
Avatar,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/src/redux/store";
import {
fetchUsers,
toggleBlockUser,
deleteUserThunk,
} from "@/src/redux/slices/adminSlice";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext"; // adjust the path if ne

interface ConfirmDialogState {
open: boolean;
action: "block" | "delete" | null;
userId: string | null;
 isBlocked?: boolean; 
}

const AdminUsersList: React.FC = () => {
const router = useRouter();
const searchParams = useSearchParams();

const roleParam = searchParams.get("type");

const role: UserRole | null =
  roleParam === "seller" || roleParam === "customer"
    ? roleParam
    : null;
const { setBlocked } = useAuth();

const initialPage = Number(searchParams.get("page")) || 1;
const [page, setPage] = useState(initialPage);
const [search, setSearch] = useState<string>(searchParams.get("search") || "");

const dispatch = useDispatch<AppDispatch>();

const { customers, sellers, loading, error, pagination, actionLoading } =
useSelector((state: RootState) => state.admin);

const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
open: false,
action: null,
userId: null,
});

type UserRole = "seller" | "customer";

const users = role === "seller" ? sellers : customers;

const searchTimeout = useRef<NodeJS.Timeout | null>(null);

const fetchUsersWithSearch = useCallback(
  (searchVal: string, pageNum: number) => {
    if (!role) return;

    dispatch(
      fetchUsers({
        type: role ,
        page: pageNum,
        limit: 10,
        search: searchVal,
      })
    );

    router.replace(
      `?type=${role}&page=${pageNum}&search=${encodeURIComponent(searchVal)}`
    );
  },
  [dispatch, role, router] 
);


useEffect(() => {
  if (searchTimeout.current) clearTimeout(searchTimeout.current);

  searchTimeout.current = setTimeout(() => {
    fetchUsersWithSearch(search, page);
  }, 500);

  return () => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
  };
}, [search, page, role, fetchUsersWithSearch]);

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

const openBlockDialog = (userId: string,isBlocked: boolean) => {
setConfirmDialog({ open: true, action: "block", userId , isBlocked,});
};

const openDeleteDialog = (userId: string) => {
setConfirmDialog({ open: true, action: "delete", userId });
};

const handleCloseDialog = () => {
setConfirmDialog({ open: false, action: null, userId: null });
};

const handleConfirmAction = async () => {
if (!confirmDialog.userId || !confirmDialog.action || !role) {
handleCloseDialog();
return;
}

try {
  if (confirmDialog.action === "block") {
    await dispatch(toggleBlockUser({ userId: confirmDialog.userId, role })).unwrap();
    
      setBlocked(!confirmDialog.isBlocked);
  }
  if (confirmDialog.action === "delete") {
    await dispatch(deleteUserThunk({ userId: confirmDialog.userId, role })).unwrap();
  }
  fetchUsersWithSearch(search, page);
} catch (err) {
  console.error(err);
} finally {
  handleCloseDialog();
}


};

return (
  
<Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh", py: 4 }}> <Container maxWidth="lg">
<Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #e5e7eb", bgcolor: "#fff" }}>
<CardHeader
title={<Typography variant="h6" sx={{ fontWeight: 600 }}>{title}</Typography>}
subheader={
<Typography variant="body2" sx={{ color: "text.secondary" }}>
View all registered {role ?? ""}s. </Typography>
}
/>
<CardContent sx={{ pt: 0 }}>
<Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="space-between" sx={{ py: 2 }}>
<TextField
size="small"
label={`Search ${role ?? "user"} by name or email`}
value={search}
onChange={(e) => setSearch(e.target.value)}
sx={{ maxWidth: 320 }}
/>
<Typography variant="body2" sx={{ color: "text.secondary" }}>
Total {role ?? "user"}s:{" "}
<Typography component="span" sx={{ fontWeight: 600, color: "#0f172a" }}>
{pagination?.total ?? users.length} </Typography> </Typography> </Stack>

        {loading && (
          <Box sx={{ py: 6, display: "flex", justifyContent: "center" }}>
            <CircularProgress size={28} />
          </Box>
        )}

        {error && !loading && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}

        {!loading && !error && (
          <>
            <Box sx={{ overflowX: "auto" }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Joined On</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">No {role ?? "user"}s found</TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user._id} hover>
                        <TableCell>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${user.image}`} alt={user.firstName} sx={{ width: 40, height: 40 }} />
                            <Typography>{user.firstName} {user.lastName}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{formatDate(user.createdAt)}</TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={1}>
                            {role === "seller" && (
                              <Chip
                                label="View Store"
                                size="small"
                                sx={{ cursor: "pointer", bgcolor: "#e0f2fe", color: "#0369a1", fontWeight: 600 }}
                                onClick={() => router.push(`/admin/viewstore/${user._id}`)}
                              />
                            )}
                            <Button variant="outlined" size="small"  onClick={() => openBlockDialog(user._id, user.blocked)} disabled={actionLoading} sx={{ textTransform: "none" }}>
                              {user.blocked ? "Unblock" : "Block"}
                            </Button>
                            <Button variant="contained" size="small" color="error" sx={{ textTransform: "none" }} onClick={() => openDeleteDialog(user._id)} disabled={actionLoading}>
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

        <Dialog open={confirmDialog.open} onClose={handleCloseDialog}>
        <DialogTitle>
  {confirmDialog.action === "delete"
    ? "Delete User"
    : confirmDialog.isBlocked
    ? "Unblock User"
    : "Block User"}
</DialogTitle>
         <DialogContent>
  <Typography>
    {confirmDialog.action === "delete"
      ? "Are you sure you want to permanently delete this user?"
      : confirmDialog.isBlocked
      ? "Are you sure you want to unblock this user?"
      : "Are you sure you want to block this user?"}
  </Typography>
</DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleConfirmAction} color="error" variant="contained" disabled={actionLoading}>
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
