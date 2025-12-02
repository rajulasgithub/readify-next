"use client";
import {
  TextField,
  Button,
  Typography,
  Container,
  MenuItem,
  Paper,
  Stack,
  Select,
} from "@mui/material";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/src/redux/store";
import { registerUser } from "@/src/redux/slices/authSlice";
import { useEffect } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";


type SignupFormData = {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phone: string;
  password: string;
  role: string;
};

const schema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  countryCode: yup.string().required("Country code is required"),
  phone: yup
  .string()
  .required("Phone number is required")
  .matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),
  password: yup.string().min(6, "Minimum 6 characters").required("Password is required"),
  role: yup.string().required("Please select a role"),
});

export default function RegisterPage() {
  const router = useRouter()
 const { loginUser } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (error) {
      console.log(" REGISTER ERROR FROM REDUX:", error);
    }
  }, [error]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      countryCode: "+91", 
    },
  });

 const onSubmit = async (data: SignupFormData) => {
  const res = await dispatch(registerUser(data));

  if (registerUser.fulfilled.match(res)) {
    const payload = res.payload;
   

    switch (payload.data.role) {
      case "seller":
        router.push("/sellerdashboard"); 
        break;
      case "customer":
        router.push("/viewbooks");
        break;
      case "admin":
        router.push("/admindashboard"); 
        break;
      default:
        router.push("/"); 
    }
  } else {
    console.log("Registration failed:", res);
  }
};

  

  return (
    <Container maxWidth="sm" >
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

        {error && (
          <Typography sx={{ color: "red", mb: 2, textAlign: "center" }}>
            {error}
          </Typography>
        )}

        {user && (
          <Typography sx={{ color: "green", mb: 2, textAlign: "center" }}>
            Account created successfully!
          </Typography>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <TextField
              label="First Name"
              {...register("firstName")}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
              fullWidth
            />

            <TextField
              label="Last Name"
              {...register("lastName")}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
              fullWidth
            />

            <TextField
              label="Email Address"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              fullWidth
            />

          <Stack direction="row" spacing={1}>
        <Controller
          name="countryCode"
          control={control}
          render={({ field }) => (
            <Select {...field} fullWidth>
              <MenuItem value="+91">+91</MenuItem>
              <MenuItem value="+1">+1</MenuItem>
              <MenuItem value="+44">+44</MenuItem>
            </Select>
          )}
        />

        <TextField
          label="Phone Number"
          {...register("phone")}
          error={!!errors.phone}
          helperText={errors.phone?.message}
          fullWidth
        />
      </Stack>

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
              disabled={loading}
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
