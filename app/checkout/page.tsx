// CheckoutPage.tsx
"use client";

import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Stack,
  TextField,
  Button,
  Divider,
  Chip,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/src/redux/store";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  placeOrderThunk,
  fetchAddressThunk,
  saveAddressThunk,
  addAddressThunk,
  deleteAddressThunk,
} from "@/src/redux/slices/orderSlice";
import { useEffect, useState, useMemo } from "react";
import { clearCart } from "@/src/redux/slices/cartSlice";

// ------------------ validation schema ------------------
const addressSchema = yup.object({
  fullName: yup.string().required("Full name is required"),
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, "Enter a valid 10-digit phone number")
    .required("Phone is required"),
  addressLine1: yup.string().required("Address Line 1 is required"),
  addressLine2: yup.string().notRequired(),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  pinCode: yup
    .string()
    .matches(/^[0-9]{6}$/, "Enter a valid 6-digit pincode")
    .required("Pincode is required"),
});

type AddressForm = yup.InferType<typeof addressSchema> & { _id?: string };

// ------------------ helper: normalize API payload ------------------
function normalizeSavedAddresses(raw: any): AddressForm[] | null {
  if (!raw) return null;

  // If it's already a flat array of address objects
  if (Array.isArray(raw) && raw.length && raw[0]._id && raw[0].fullName) {
    return raw as AddressForm[];
  }

  // If API returned the wrapper array like:
  // [ { _id: wrapperId, user, addresses: [ {..}, {...} ] }, ... ]
  if (Array.isArray(raw) && raw.length && raw[0].addresses && Array.isArray(raw[0].addresses)) {
    // flatten all inner addresses from all wrapper entries
    const flattened: AddressForm[] = raw.flatMap((entry: any) =>
      Array.isArray(entry.addresses) ? entry.addresses : []
    );
    return flattened.length ? flattened : null;
  }

  // If API returned object with addresses property
  if (typeof raw === "object" && raw.addresses && Array.isArray(raw.addresses)) {
    return raw.addresses;
  }

  // If single address object
  if (typeof raw === "object" && raw._id && raw.fullName) {
    return [raw as AddressForm];
  }

  return null;
}

// ------------------ component ------------------
export default function CheckoutPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const cart = useSelector((state: RootState) => state.cart as any);
  const items: any[] = cart?.items || [];
  const totalPrice: number | undefined = cart?.totalPrice;

  const ordersState = useSelector((state: RootState) => state.orders as any);
  const placing: boolean = ordersState?.placing || false;
  const rawSaved = ordersState?.savedAddresses ?? null; // whatever is stored in slice
  const addressLoading: boolean = ordersState?.addressLoading || false;

  // Normalize the addresses so UI always sees flat AddressForm[] or null
  const savedAddresses = useMemo(() => normalizeSavedAddresses(rawSaved), [rawSaved]);

  // debug log to confirm shape — remove in production
  useEffect(() => {
    console.log("Normalized savedAddresses:", savedAddresses);
  }, [savedAddresses]);

  // Local UI states
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false); // for add/edit dialog

  // subtotal calculation
  const subtotal =
    typeof totalPrice === "number"
      ? totalPrice
      : items.reduce((sum, item) => {
          const price =
            item.price ??
            item.prize ??
            item.book?.price ??
            item.book?.prize ??
            0;
          const qty = item.quantity ?? item.qty ?? 1;
          return sum + price * qty;
        }, 0);

  const shipping = items.length ? 40 : 0;
  const grandTotal = subtotal + shipping;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AddressForm>({
    resolver: yupResolver(addressSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pinCode: "",
    },
  });

  // fetch addresses on mount
  useEffect(() => {
    dispatch(fetchAddressThunk());
  }, [dispatch]);

  // when addresses change, select the first by default (if none selected)
  useEffect(() => {
    if (savedAddresses && savedAddresses.length && !selectedAddressId) {
      setSelectedAddressId(savedAddresses[0]._id);
    }
    // if there are no addresses, clear selection
    if (!savedAddresses || savedAddresses.length === 0) {
      setSelectedAddressId(null);
    }
  }, [savedAddresses, selectedAddressId]);

  // prefill form when editingAddressId changes
  useEffect(() => {
    if (editingAddressId && savedAddresses) {
      const addr = savedAddresses.find((a) => a._id === editingAddressId);
      if (addr) {
        reset({
          fullName: addr.fullName ?? "",
          phone: addr.phone ?? "",
          addressLine1: addr.addressLine1 ?? "",
          addressLine2: addr.addressLine2 ?? "",
          city: addr.city ?? "",
          state: addr.state ?? "",
          pinCode: addr.pinCode ?? "",
          _id: addr._id,
        } as AddressForm);
      }
    }
  }, [editingAddressId, savedAddresses, reset]);

  // open add dialog
  const openAdd = () => {
    setEditingAddressId(null);
    reset();
    setDialogOpen(true);
  };

  // open edit dialog
  const openEdit = (id: string) => {
    setEditingAddressId(id);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingAddressId(null);
    reset();
  };

  // handle add or save
  const onSaveAddress = async (data: AddressForm) => {
    try {
      if (editingAddressId) {
        await dispatch(saveAddressThunk({ addressId: editingAddressId, updatedAddress: data as any })).unwrap();
        toast.success("Address updated successfully");
        setSelectedAddressId(editingAddressId);
      } else {
        const newAddrPayload = { ...data };
        await dispatch(addAddressThunk({ newAddress: newAddrPayload as any })).unwrap();
        toast.success("Address added successfully");
        // The fetch/fulfilled should refresh the list; effect will auto-select the first
      }
      // refresh to ensure slice shape is consistent
      dispatch(fetchAddressThunk());
      closeDialog();
    } catch (err: any) {
      const msg = typeof err === "string" ? err : err?.message || "Failed to save address";
      toast.error(msg);
      console.error(err);
    }
  };

  const onDeleteAddress = async (id: string) => {
    if (!confirm("Delete this address?")) return;
    try {
      await dispatch(deleteAddressThunk(id)).unwrap();
      toast.success("Address deleted");
      if (selectedAddressId === id) setSelectedAddressId(null);
      dispatch(fetchAddressThunk());
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete address");
    }
  };

  // Place order using selected address id
  const placeOrderWithSelected = async () => {
    if (!items.length) {
      toast.error("Your cart is empty");
      return;
    }
    if (!selectedAddressId) {
      toast.error("Please select an address");
      return;
    }

    const addr = savedAddresses?.find((a) => a._id === selectedAddressId);
    if (!addr) {
      toast.error("Selected address not found");
      return;
    }

    try {
      const mappedItems = items.map((item) => {
        const bookId = item.bookId ?? item.book?._id ?? item._id ?? undefined;
        const price = item.price ?? item.prize ?? item.book?.price ?? item.book?.prize ?? 0;
        const quantity = item.quantity ?? item.qty ?? 1;
        return { book: bookId, quantity, price };
      });

      await dispatch(placeOrderThunk({ address: addr, items: mappedItems })).unwrap();
      toast.success("Order placed successfully!");
      dispatch(clearCart());
      router.push("/vieworders");
    } catch (err: any) {
      toast.error(err?.message || "Failed to place order");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "linear-gradient(135deg, #f5f7fb 0%, #e5edf7 100%)", py: 4 }}>
      <Container maxWidth="lg">
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
          <Box sx={{ width: 40, height: 40, borderRadius: "50%", bgcolor: "#c57a45", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
            <ShoppingBagOutlinedIcon fontSize="small" />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Checkout
            </Typography>
            <Typography variant="body2" sx={{ color: "#6b7280" }}>
              Choose delivery address and review your order.
            </Typography>
          </Box>
        </Stack>

        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3 }}>
          {/* LEFT: Addresses */}
          <Card sx={{ flex: 1, borderRadius: 3, boxShadow: "0 12px 30px rgba(15,23,42,0.08)", bgcolor: "#ffffff" }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6" fontWeight={700}>
                  Delivery Address
                </Typography>
                <Button startIcon={<AddIcon />} variant="outlined" onClick={openAdd} sx={{ textTransform: "none", borderRadius: "999px" }}>
                  Add New
                </Button>
              </Stack>

              {/* Addresses list */}
              {addressLoading ? (
                <Typography>Loading addresses...</Typography>
              ) : savedAddresses && savedAddresses.length ? (
                <RadioGroup value={selectedAddressId ?? ""} onChange={(e) => setSelectedAddressId(e.target.value)}>
                  <Stack spacing={2}>
                    {savedAddresses.map((addr) => (
                      <Box
                        key={addr._id}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: selectedAddressId === addr._id ? "#f3f4ff" : "#f9fafb",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ width: "100%" }}>
                          <FormControlLabel
                            value={addr._id}
                            control={<Radio />}
                            label={
                              <Box>
                                <Typography fontWeight={600}>{addr.fullName}</Typography>
                                <Typography variant="body2" sx={{ color: "#6b7280" }}>
                                  {addr.phone}
                                </Typography>
                                <Typography variant="body2" sx={{ color: "#6b7280" }}>
                                  {addr.addressLine1}, {addr.addressLine2}
                                </Typography>
                                <Typography variant="body2" sx={{ color: "#6b7280" }}>
                                  {addr.city}, {addr.state} - {addr.pinCode}
                                </Typography>
                              </Box>
                            }
                            sx={{ flex: 1 }}
                          />

                          <Stack direction="row" spacing={0.5}>
                            <IconButton size="small" onClick={() => openEdit(addr._id)} aria-label="edit address">
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" onClick={() => onDeleteAddress(addr._id)} aria-label="delete address">
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                </RadioGroup>
              ) : (
                <Box sx={{ p: 2 }}>
                  <Typography variant="body2" sx={{ color: "#6b7280" }}>
                    No saved addresses. Add one to continue.
                  </Typography>
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  sx={{ textTransform: "none", borderRadius: "999px" }}
                  onClick={() => {
                    reset();
                    setDialogOpen(true);
                    setEditingAddressId(null);
                  }}
                >
                  Cancel
                </Button>
                <Button variant="contained" sx={{ textTransform: "none", borderRadius: "999px", bgcolor: "#c57a45", "&:hover": { bgcolor: "#b36a36" } }} onClick={placeOrderWithSelected} disabled={placing}>
                  {placing ? "Placing..." : "Place Order"}
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {/* RIGHT: Order Summary */}
          <Card sx={{ flex: { xs: "unset", md: "0 0 360px" }, borderRadius: 3, boxShadow: "0 12px 30px rgba(15,23,42,0.1)", bgcolor: "#ffffff", height: "fit-content" }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
                <Typography variant="h6" fontWeight={700}>
                  Order Summary
                </Typography>
                {items.length > 0 && <Chip label={`${items.length} item${items.length > 1 ? "s" : ""}`} size="small" sx={{ bgcolor: "#f3f4ff" }} />}
              </Stack>

              {items.length === 0 ? (
                <Typography variant="body2" sx={{ color: "#6b7280" }}>
                  Your cart is empty.
                </Typography>
              ) : (
                <>
                  <Box sx={{ maxHeight: 260, overflowY: "auto", pr: 1, mb: 2 }}>
                    <Stack spacing={1.5}>
                      {items.map((item) => {
                        const title = item.title ?? item.book?.title ?? "Book";
                        const author = item.author ?? item.book?.author;
                        const qty = item.quantity ?? item.qty ?? 1;
                        const price = item.price ?? item.prize ?? item.book?.price ?? item.book?.prize ?? 0;
                        return (
                          <Box key={item._id ?? item.book?._id} sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", p: 1.2, borderRadius: 2, bgcolor: "#f9fafb" }}>
                            <Box sx={{ maxWidth: "70%" }}>
                              <Typography variant="body1" fontWeight={600} sx={{ mb: 0.3 }}>
                                {title}
                              </Typography>
                              {author && (
                                <Typography variant="body2" sx={{ color: "#6b7280" }}>
                                  {author}
                                </Typography>
                              )}
                              <Typography variant="body2" sx={{ color: "#6b7280", mt: 0.4 }}>
                                Qty: {qty}
                              </Typography>
                            </Box>
                            <Typography variant="body1" fontWeight={700} sx={{ whiteSpace: "nowrap" }}>
                              ₹{price * qty}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Stack>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Stack spacing={1.1}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                      <Typography variant="body2" sx={{ color: "#6b7280" }}>
                        Subtotal
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        ₹{subtotal}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                      <Typography variant="body2" sx={{ color: "#6b7280" }}>
                        Shipping
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {shipping ? `₹${shipping}` : "Free"}
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 1 }} />

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography variant="subtitle1" fontWeight={700}>
                        Total
                      </Typography>
                      <Typography variant="h6" fontWeight={800}>
                        ₹{grandTotal}
                      </Typography>
                    </Box>
                  </Stack>
                </>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Add/Edit Dialog */}
        <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
          <DialogTitle>{editingAddressId ? "Edit Address" : "Add Address"}</DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleSubmit(onSaveAddress)} noValidate sx={{ mt: 1 }}>
              <Stack spacing={2}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField label="Full Name" fullWidth {...register("fullName")} error={!!errors.fullName} helperText={errors.fullName?.message as string | undefined} />
                  <TextField label="Phone Number" fullWidth {...register("phone")} error={!!errors.phone} helperText={errors.phone?.message as string | undefined} />
                </Stack>

                <TextField label="Address Line 1" fullWidth {...register("addressLine1")} error={!!errors.addressLine1} helperText={errors.addressLine1?.message as string | undefined} />
                <TextField label="Address Line 2" fullWidth {...register("addressLine2")} error={!!errors.addressLine2} helperText={errors.addressLine2?.message as string | undefined} />

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField label="City" fullWidth {...register("city")} error={!!errors.city} helperText={errors.city?.message as string | undefined} />
                  <TextField label="State" fullWidth {...register("state")} error={!!errors.state} helperText={errors.state?.message as string | undefined} />
                </Stack>

                <TextField label="Pincode" fullWidth {...register("pinCode")} error={!!errors.pinCode} helperText={errors.pinCode?.message as string | undefined} />
              </Stack>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog} variant="outlined" sx={{ textTransform: "none" }}>
              Cancel
            </Button>
            <Button onClick={handleSubmit(onSaveAddress) as any} variant="contained" sx={{ textTransform: "none", bgcolor: "#c57a45", "&:hover": { bgcolor: "#b36a36" } }} disabled={isSubmitting || placing}>
              {isSubmitting ? (editingAddressId ? "Saving..." : "Adding...") : editingAddressId ? "Save" : "Add & Save"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
