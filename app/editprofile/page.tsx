"use client";

import { useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
import { toast } from "react-toastify";

type EditProfileForm = {
  name: string;
  email: string;
  phone: string;
};

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, "Enter a valid 10-digit phone number")
    .required("Phone number is required"),
});

export default function EditProfilePage() {
  const router = useRouter();

  const { user } = useSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EditProfileForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: user?.firstName || "",
      email: user?.email || "",
   
    },
  });

  
  useEffect(() => {
    if (user) {
      reset({
        name: user.firstName || "",
        email: user.email || "",
       
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: EditProfileForm) => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;

      if (!token) {
        toast.error("You are not logged in");
        router.push("/login");
        return;
      }

     
      const res = await api.put(
        "/api/users/update-profile",
        {
          name: data.name,
          email: data.email,
          phone: data.phone,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Profile updated successfully");

    

      router.push("/profile");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Failed to update profile. Try again.";
      toast.error(msg);
    }
  };

 
  if (!user) {
    return (
      <Box
        sx={{
          bgcolor: "#f5f7fb",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
        }}
      >
        <Card
          sx={{
            maxWidth: 400,
            width: "100%",
            borderRadius: 4,
            boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
            bgcolor: "#ffffff",
            p: 3,
          }}
        >
          <Typography variant="h6" fontWeight={700} mb={1}>
            You are not logged in
          </Typography>
          <Typography color="text.secondary" mb={3}>
            Please sign in to edit your profile details.
          </Typography>
          <Button
            fullWidth
            variant="contained"
            sx={{
              textTransform: "none",
              borderRadius: "999px",
              bgcolor: "#c57a45",
              "&:hover": { bgcolor: "#b36a36" },
            }}
            onClick={() => router.push("/login")}
          >
            Go to Login
          </Button>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "#f5f7fb", minHeight: "100vh", py: 6 }}>
      <Container maxWidth="sm">
        <Typography
          variant="h4"
          fontWeight={700}
          sx={{ mb: 3, color: "#111827" }}
        >
          Edit Profile
        </Typography>

        <Card
          sx={{
            borderRadius: 4,
            boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
            bgcolor: "#ffffff",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <Stack spacing={3}>
                <TextField
                  label="Name"
                  fullWidth
                  {...register("name")}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />

                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  {...register("email")}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />

                <TextField
                  label="Phone"
                  fullWidth
                  {...register("phone")}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                />

                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button
                    type="button"
                    variant="outlined"
                    sx={{
                      textTransform: "none",
                      borderRadius: "999px",
                      px: 3,
                    }}
                    onClick={() => router.push("/profile")}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    sx={{
                      textTransform: "none",
                      borderRadius: "999px",
                      px: 4,
                      bgcolor: "#c57a45",
                      "&:hover": { bgcolor: "#b36a36" },
                    }}
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </Stack>
              </Stack>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
