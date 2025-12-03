"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Stack,
  Avatar,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useSelector } from "react-redux";
import type { RootState } from "@/src/redux/store";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
import { toast } from "react-toastify";

// ✅ Schema first
const schema = yup
  .object({
    name: yup.string().required("Name is required"),
    email: yup
      .string()
      .email("Invalid email")
      .required("Email is required"),
    phone: yup
      .string()
      .matches(/^[0-9]{10}$/, "Enter a valid 10-digit phone number")
      .required("Phone number is required"),
    // optional description
    description: yup
      .string()
      .max(300, "Description can be max 300 characters")
      .optional(),
  })
  .required();

// ✅ Infer the TS type directly from schema
type EditProfileForm = yup.InferType<typeof schema>;

export default function EditProfilePage() {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);

  const [photoPreview, setPhotoPreview] = useState<string | null>(
    (user as any)?.avatar || (user as any)?.profileImage || null
  );
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EditProfileForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      // Name: try full name, fallback to firstName
      name:
        (user as any)?.name ||
        (user?.firstName && user?.lastName
          ? `${user.firstName} ${user.lastName}`
          : user?.firstName || ""),
      email: user?.email || "",
      phone: user?.phone ? String(user.phone) : "",
      description: (user as any)?.description || "",
    },
  });

  // Sync with Redux user on mount / change
  useEffect(() => {
    if (user) {
      reset({
        name:
          (user as any)?.name ||
          (user?.firstName && user?.lastName
            ? `${user.firstName} ${user.lastName}`
            : user?.firstName || ""),
        email: user.email || "",
        phone: user?.phone ? String(user.phone) : "",
        description: (user as any)?.description || "",
      });

      setPhotoPreview(
        (user as any)?.avatar || (user as any)?.profileImage || null
      );
    }
  }, [user, reset]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    const url = URL.createObjectURL(file);
    setPhotoPreview(url);
  };

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

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("description", data.description ?? "");

      if (photoFile) {
        // 👇 make sure backend expects "avatar"
        formData.append("avatar", photoFile);
      }

      await api.put("/api/users/update-profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Profile updated successfully");
      router.push("/profile");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Failed to update profile. Try again.";
      toast.error(msg);
    }
  };

  // If user is not logged in
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
            {/* Avatar + Upload */}
            <Stack spacing={2} alignItems="center" mb={3}>
              <Avatar
                src={photoPreview || undefined}
                sx={{
                  width: 96,
                  height: 96,
                  fontSize: 32,
                  bgcolor: "#c57a45",
                }}
              >
                {user?.firstName?.[0]?.toUpperCase() ||
                  user?.email?.[0]?.toUpperCase()}
              </Avatar>

              <Button
                variant="outlined"
                component="label"
                sx={{
                  borderRadius: "999px",
                  textTransform: "none",
                  px: 3,
                }}
              >
                Change Photo
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={handlePhotoChange}
                />
              </Button>
            </Stack>

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

                <TextField
                  label="Description / About"
                  multiline
                  rows={4}
                  fullWidth
                  {...register("description")}
                  error={!!errors.description}
                  helperText={errors.description?.message}
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
