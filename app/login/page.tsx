"use client";

import React, { useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/src/Redux/store/store";
import { loginUser } from "@/src/Redux/store/authSlice";
import { useRouter } from "next/navigation";

type LoginFormInputs = {
  email: string;
  password: string;
};

const schema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function LoginPage() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>();
   
   
  const { user, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

 
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });


  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
  try {
    // dispatch the loginUser thunk and unwrap the result
    const payload = await dispatch(loginUser(data)).unwrap();

    // save data to localStorage
    localStorage.setItem("accessToken", payload.accessToken);
    localStorage.setItem("role", payload.data.role);
    localStorage.setItem("email", payload.data.email);

    switch (payload.data.role) {
      case "seller":
        router.push("/sellerbooks"); 
        break;
      case "customer":
        router.push("/viewbooks");
        break;
      case "admin":
        router.push("/admin"); 
        break;
      default:
        router.push("/"); // fallback
    }

    
  } catch (err) {
    console.error("Login failed:", err);
  }
};

 
  useEffect(() => {
    if (error) console.log("Login error:", error);
  }, [error]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        p: 2,
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 420,
          borderRadius: 4,
          boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.1)",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, textAlign: "center", mb: 2 }}
          >
            Welcome Back
          </Typography>

          <Typography
            variant="body2"
            sx={{ textAlign: "center", color: "text.secondary", mb: 4 }}
          >
            Login to continue
          </Typography>

          {error && (
            <Typography sx={{ color: "red", mb: 2, textAlign: "center" }}>
              {error}
            </Typography>
          )}

          {user && (
            <Typography sx={{ color: "green", mb: 2, textAlign: "center" }}>
              Logged in successfully!
            </Typography>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack spacing={3}>
              {/* EMAIL */}
              <TextField
                label="Email Address"
                type="email"
                fullWidth
                required
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
              />

              {/* PASSWORD */}
              <TextField
                label="Password"
                type="password"
                fullWidth
                required
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  py: 1.3,
                  borderRadius: "10px",
                  textTransform: "none",
                  fontSize: "16px",
                  bgcolor: "#111827",
                  "&:hover": {
                    bgcolor: "#1f2937",
                  },
                }}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </Stack>
          </form>

          <Typography
            variant="body2"
            sx={{ textAlign: "center", mt: 3, color: "text.secondary" }}
          >
            Don’t have an account?{" "}
            <span
              style={{
                color: "#111827",
                fontWeight: 600,
                cursor: "pointer",
              }}
              onClick={() => (window.location.href = "/signup")}
            >
              Sign up
            </span>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
