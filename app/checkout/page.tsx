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
} from "@mui/material";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/src/redux/store";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { placeOrderThunk ,fetchAddressThunk} from "@/src/redux/slices/orderSlice";
import { useEffect,useState } from "react";

import { saveAddressThunk } from "@/src/redux/slices/orderSlice";


// ✅ Address validation schema
const addressSchema = yup.object({
  fullName: yup.string().required("Full name is required"),
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, "Enter a valid 10-digit phone number")
    .required("Phone is required"),
  addressLine1: yup.string().required("Address Line 1 is required"),
  addressLine2: yup.string().required("Address Line 2 is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  pinCode: yup
    .string()
    .matches(/^[0-9]{6}$/, "Enter a valid 6-digit pincode")
    .required("Pincode is required"),
});

type AddressForm = yup.InferType<typeof addressSchema>;

export default function CheckoutPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  
  const cart = useSelector((state: RootState) => state.cart as any);
  const items: any[] = cart?.items || [];
  const totalPrice: number | undefined = cart?.totalPrice;

  const ordersState = useSelector((state: RootState) => state.orders as any);
  const placing: boolean = ordersState?.placing || false;
  const savedAddress = useSelector(
  (state: RootState) => state.orders?.savedAddresses?.[0] ?? null
);

  


  // 🔍 Debug once to see real structure
  console.log("Cart from Redux:", cart);
  console.log("Cart items:", items);

  // 🔹 Subtotal from items
  const subtotal =
    typeof totalPrice === "number"
      ? totalPrice
      : items.reduce((sum, item) => {
          // 🔧 TODO: adjust these 2 lines once you see your structure
          const price =
            item.price ??                // flat
            item.prize ??                // if you use "prize"
            item.book?.price ??          // nested
            item.book?.prize ??          // nested with "prize"
            0;

          const qty =
            item.quantity ??             // flat
            item.qty ??                  // some slices use "qty"
            1;

          return sum + price * qty;
        }, 0);

  const shipping = items.length ? 40 : 0;
  const grandTotal = subtotal + shipping;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue
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

  useEffect(()=>{
       dispatch(fetchAddressThunk())
  },[])

  useEffect(() => {
  if (savedAddress && editing) {
    setValue("fullName", savedAddress.fullName);
    setValue("phone", savedAddress.phone);
    setValue("addressLine1", savedAddress.addressLine1);
    setValue("addressLine2", savedAddress.addressLine2 ?? "");
    setValue("city", savedAddress.city);
    setValue("state", savedAddress.state);
    setValue("pinCode", savedAddress.pinCode);
    setEditingAddressId(savedAddress._id ?? ""); // store the id
  }
}, [savedAddress, editing, setValue]);

const onSaveAddress = async (data: AddressForm) => {
  if (!editingAddressId) {
    toast.error("No address selected for editing");
    return;
  }

  try {
    await dispatch(saveAddressThunk({ addressId: editingAddressId, updatedAddress: data })).unwrap();
    toast.success("Address updated successfully!");
    setEditing(false);
    setEditingAddressId(null); // clear after save
  } catch (err: any) {
    toast.error(err || "Failed to save address");
  }
};
  

  const onSubmit = async (data: AddressForm) => {
    if (!items.length) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      // 🔹 Map cart items → backend expected shape
      const mappedItems = items.map((item) => {
        // ⬇️ VERY IMPORTANT: adjust these lines according to your console.log
        const bookId =
          item.bookId ??           // e.g. if you store bookId
          item.book?._id ??        // if nested book
          item._id ??              // if _id is the book id
          undefined;

        const price =
          item.price ??            // flat
          item.prize ??            // if you called it "prize"
          item.book?.price ??      // nested
          item.book?.prize ??      // nested + "prize"
          0;

        const quantity =
          item.quantity ??         // flat
          item.qty ??              // alt key
          1;

        return {
          book: bookId,
          quantity,
          price,
        };
      });

      const payload = {
        address: data,
        items: mappedItems,
      };

      console.log("Order payload sent to backend:", payload);

      await dispatch(placeOrderThunk(payload)).unwrap();

      toast.success("Order placed successfully!");
      router.push("/vieworders");
    } catch (err: any) {
      const msg =
        typeof err === "string"
          ? err
          : err?.response?.data?.message ||
            "Failed to place order. Please try again.";
      toast.error(msg);
      console.error("Place order error:", err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "linear-gradient(135deg, #f5f7fb 0%, #e5edf7 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              bgcolor: "#c57a45",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}
          >
            <ShoppingBagOutlinedIcon fontSize="small" />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Checkout
            </Typography>
            <Typography variant="body2" sx={{ color: "#6b7280" }}>
              Enter your delivery address and review your order.
            </Typography>
          </Box>
        </Stack>

        {/* Layout */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
          }}
        >
          {/* LEFT: Delivery Address */}
         {/* LEFT: Delivery Address */}
<Card
  sx={{
    flex: 1,
    borderRadius: 3,
    boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
    bgcolor: "#ffffff",
  }}
>
  <CardContent sx={{ p: 3 }}>
    <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
      Delivery Address
    </Typography>

   {savedAddress && !editing ? (
  // Show saved address view
  <Box sx={{ p: 2, borderRadius: 2, bgcolor: "#f9fafb" }}>
    <Typography variant="body1" fontWeight={600}>
      {savedAddress.fullName}
    </Typography>
    <Typography variant="body2" sx={{ color: "#6b7280" }}>
      {savedAddress.phone}
    </Typography>
    <Typography variant="body2" sx={{ color: "#6b7280", mt: 0.5 }}>
      {savedAddress.addressLine1}, {savedAddress.addressLine2}
    </Typography>
    <Typography variant="body2" sx={{ color: "#6b7280" }}>
      {savedAddress.city}, {savedAddress.state} - {savedAddress.pinCode}
    </Typography>

    <Button
      variant="outlined"
      sx={{ mt: 2, textTransform: "none", borderRadius: "999px" }}
      onClick={() =>{ setEditing(true)
         setEditingAddressId(savedAddress._id ?? ""); 
      }}
    >
      Edit
    </Button>
  </Box>
) : (
  // Show form for new or editing address
  <form onSubmit={handleSubmit(editing ? onSaveAddress : onSubmit)} noValidate>
  <Stack spacing={2.5}>
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
      <TextField
        label="Full Name"
        fullWidth
        {...register("fullName")}
        error={!!errors.fullName}
        helperText={errors.fullName?.message}
      />
      <TextField
        label="Phone Number"
        fullWidth
        {...register("phone")}
        error={!!errors.phone}
        helperText={errors.phone?.message}
      />
    </Stack>

    <TextField
      label="Address Line 1"
      fullWidth
      {...register("addressLine1")}
      error={!!errors.addressLine1}
      helperText={errors.addressLine1?.message}
    />

    <TextField
      label="Address Line 2"
      fullWidth
      {...register("addressLine2")}
      error={!!errors.addressLine2}
      helperText={errors.addressLine2?.message}
    />

    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
      <TextField
        label="City"
        fullWidth
        {...register("city")}
        error={!!errors.city}
        helperText={errors.city?.message}
      />
      <TextField
        label="State"
        fullWidth
        {...register("state")}
        error={!!errors.state}
        helperText={errors.state?.message}
      />
    </Stack>

    <TextField
      label="Pincode"
      fullWidth
      {...register("pinCode")}
      error={!!errors.pinCode}
      helperText={errors.pinCode?.message}
    />

    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      justifyContent="flex-end"
      sx={{ mt: 1 }}
    >
      <Button
        type="button"
        variant="outlined"
        sx={{
          textTransform: "none",
          borderRadius: "999px",
          px: 3,
        }}
        onClick={() => setEditing(false)}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        variant="contained"
        sx={{
          textTransform: "none",
          borderRadius: "999px",
          px: 4,
          bgcolor: "#c57a45",
          "&:hover": { bgcolor: "#b36a36" },
        }}
      >
        Save
      </Button>
    </Stack>
  </Stack>
</form>

)}
  </CardContent>
</Card>


          {/* RIGHT: Order Summary */}
          <Card
            sx={{
              flex: { xs: "unset", md: "0 0 360px" },
              borderRadius: 3,
              boxShadow: "0 12px 30px rgba(15,23,42,0.1)",
              bgcolor: "#ffffff",
              height: "fit-content",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
                <Typography variant="h6" fontWeight={700}>
                  Order Summary
                </Typography>
                {items.length > 0 && (
                  <Chip
                    label={`${items.length} item${items.length > 1 ? "s" : ""}`}
                    size="small"
                    sx={{ bgcolor: "#f3f4ff" }}
                  />
                )}
              </Stack>

              {items.length === 0 ? (
                <Typography variant="body2" sx={{ color: "#6b7280" }}>
                  Your cart is empty.
                </Typography>
              ) : (
                <>
                  <Box
                    sx={{
                      maxHeight: 260,
                      overflowY: "auto",
                      pr: 1,
                      mb: 2,
                    }}
                  >
                    <Stack spacing={1.5}>
                      {items.map((item) => {
                        const title =
                          item.title ?? item.book?.title ?? "Book";
                        const author =
                          item.author ?? item.book?.author;
                        const qty =
                          item.quantity ?? item.qty ?? 1;
                        const price =
                          item.price ??
                          item.prize ??
                          item.book?.price ??
                          item.book?.prize ??
                          0;

                        return (
                          <Box
                            key={item._id ?? item.book?._id}
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              p: 1.2,
                              borderRadius: 2,
                              bgcolor: "#f9fafb",
                            }}
                          >
                            <Box sx={{ maxWidth: "70%" }}>
                              <Typography
                                variant="body1"
                                fontWeight={600}
                                sx={{ mb: 0.3 }}
                              >
                                {title}
                              </Typography>
                              {author && (
                                <Typography
                                  variant="body2"
                                  sx={{ color: "#6b7280" }}
                                >
                                  {author}
                                </Typography>
                              )}
                              <Typography
                                variant="body2"
                                sx={{ color: "#6b7280", mt: 0.4 }}
                              >
                                Qty: {qty}
                              </Typography>
                            </Box>

                            <Typography
                              variant="body1"
                              fontWeight={700}
                              sx={{ whiteSpace: "nowrap" }}
                            >
                              ₹{price * qty}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Stack>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Stack spacing={1.1}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 14,
                      }}
                    >
                      <Typography variant="body2" sx={{ color: "#6b7280" }}>
                        Subtotal
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        ₹{subtotal}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 14,
                      }}
                    >
                      <Typography variant="body2" sx={{ color: "#6b7280" }}>
                        Shipping
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {shipping ? `₹${shipping}` : "Free"}
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 1 }} />

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
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
      </Container>
    </Box>
  );
}
