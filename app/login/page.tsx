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
import type { RootState, AppDispatch } from "@/src/redux/store";
import { loginUserThunk } from "@/src/redux/slices/authSlice";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext"; 


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
   const { loginUser } = useAuth();
   
   
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
  
    const payload = await dispatch(loginUserThunk(data)).unwrap();
    // const tokenFromCookie = Cookies.get("accessToken") ?? "";
    // const roleFromCookie = Cookies.get("role") ?? "";
    // const emailFromCookie = Cookies.get("email") ?? "";

    // loginUser(tokenFromCookie, roleFromCookie, emailFromCookie);

  loginUser(
  payload.accessToken ?? "",
  payload.data.role ?? "",
  payload.data.email ?? "",
  payload.data.firstName ?? "",
  payload.data.lastName ?? "",
  String(payload.data.phone ?? "")   
);
    switch (payload.data.role) {
      case "seller":
        router.push("/sellerdashboard"); 
        break;
      case "customer":
        router.push("/viewbooks");
        break;
      case "admin":
        router.push("/admin"); 
        break;
      default:
        router.push("/"); 
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
        <CardContent sx={{ p: 4,boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          <Typography
            variant="h5"
            
            sx={{ fontWeight: 700, textAlign: "center", mb: 2, }}
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
          
              <TextField
                label="Email Address"
                type="email"
                fullWidth
                required
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
              />

         
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
                  bgcolor: "#c57a45",
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
              onClick={() => (window.location.href = "/register")}
            >
              Sign up
            </span>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
