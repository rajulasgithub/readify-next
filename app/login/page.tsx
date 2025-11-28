"use client";

import React from "react";
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

// ---- Types ----
type LoginFormInputs = {
  email: string;
  password: string;
};

// ---- Yup Schema ----
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
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    console.log("Login Data:", data);
    // Example:
    // const res = await api.post("/login", data);
  };

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
                disabled={isSubmitting}
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
                {isSubmitting ? "Logging in..." : "Login"}
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
