"use client";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  MenuItem,
  Paper,
  Stack,
} from "@mui/material";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "@/src/Redux/store/authSlice";


type SignupFormData = {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
};

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, "Enter a valid 10-digit phone number")
    .required("Phone number is required"),
  password: yup.string().min(6, "Minimum 6 characters").required("Password is required"),
  role: yup.string().required("Please select a role"),
});

export default function RegisterPage() {
  const dispatch = useDispatch();

  // Get Redux state
  const { loading, error, user } = useSelector((state: any) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: SignupFormData) => {
    dispatch(registerUser(data)); // ⬅🔥 send to Redux backend API
  };

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 4,
          border: "1px solid #e5e7eb",
          bgcolor: "#ffffff",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            textAlign: "center",
            mb: 1,
            color: "#111827",
          }}
        >
          Create Account
        </Typography>

        <Typography
          variant="body2"
          sx={{
            textAlign: "center",
            color: "text.secondary",
            mb: 3,
          }}
        >
          Join Readify and start exploring books!
        </Typography>

        {/* Show error */}
        {error && (
          <Typography sx={{ color: "red", mb: 2, textAlign: "center" }}>
            {error}
          </Typography>
        )}

        {/* Show success */}
        {user && (
          <Typography sx={{ color: "green", mb: 2, textAlign: "center" }}>
            Account created successfully!
          </Typography>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <TextField
              label="Full Name"
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
              fullWidth
            />

            <TextField
              label="Email Address"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              fullWidth
            />

            <TextField
              label="Phone Number"
              {...register("phone")}
              error={!!errors.phone}
              helperText={errors.phone?.message}
              fullWidth
            />

            <TextField
              type="password"
              label="Password"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              fullWidth
            />

            <TextField
              select
              label="Select Role"
              {...register("role")}
              error={!!errors.role}
              helperText={errors.role?.message}
              fullWidth
            >
              <MenuItem value="customer">Customer</MenuItem>
              <MenuItem value="seller">Seller</MenuItem>
            </TextField>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading} // disable while loading
              sx={{
                mt: 1,
                borderRadius: "999px",
                textTransform: "none",
                bgcolor: "#c57a45",
                py: 1.4,
                fontSize: 16,
                "&:hover": { bgcolor: "#b36a36" },
              }}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
