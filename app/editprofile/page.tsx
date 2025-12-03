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

import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/src/redux/store";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { updateProfileThunk } from "@/src/redux/slices/authSlice";

const schema = yup
  .object({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    email: yup
      .string()
      .email("Invalid email")
      .required("Email is required"),
    phone: yup
      .string()
      .transform((value) => value.replace(/\s/g, "")) // remove spaces
      .matches(
        /^\+?[0-9]{10,15}$/,
        "Enter a valid phone number with country code"
      )
      .required("Phone number is required"),
    bio: yup
      .string()
      .max(300, "Bio can be max 300 characters")
      .optional(),
  })
  .required();

type EditProfileForm = yup.InferType<typeof schema>;

export default function EditProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { user, loading } = useSelector((state: RootState) => state.auth);

  // 👇 Build full URL for previously saved image
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const initialImageUrl =
    user?.image && backendUrl
      ? `${backendUrl}/${user.image}`
      : user?.image
      ? user.image
      : null;

  const [photoPreview, setPhotoPreview] = useState<string | null>(
    initialImageUrl
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
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone ? String(user.phone) : "",
      bio: (user as any)?.bio || "",
    },
  });

  // 🔄 Sync with Redux user whenever it changes
  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.fullPhone ? String(user.fullPhone) : "",
        bio: (user as any)?.bio || "",
      });

      const imgUrl =
        user.image && backendUrl
          ? `${backendUrl}/${user.image}`
          : user.image
          ? user.image
          : null;

      setPhotoPreview(imgUrl);
    }
  }, [user, reset, backendUrl]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);

    // 👇 Show instant preview of newly selected image
    const url = URL.createObjectURL(file);
    setPhotoPreview(url);
  };

  const onSubmit = async (data: EditProfileForm) => {
    try {
      const formData = new FormData();
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("bio", data.bio ?? "");

      if (photoFile) {
        formData.append("image", photoFile);
      }

      await dispatch(updateProfileThunk(formData)).unwrap();

      toast.success("Profile updated successfully");
      router.push("/customerprofile");
    } catch (err: any) {
      const msg =
        typeof err === "string"
          ? err
          : err?.response?.data?.message ||
            "Failed to update profile. Try again.";
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
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField
                    label="First Name"
                    fullWidth
                    {...register("firstName")}
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                  />
                  <TextField
                    label="Last Name"
                    fullWidth
                    {...register("lastName")}
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                  />
                </Stack>

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
                  label="Bio / About"
                  multiline
                  rows={4}
                  fullWidth
                  {...register("bio")}
                  error={!!errors.bio}
                  helperText={errors.bio?.message}
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
                    onClick={() => router.push("/customerprofile")}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting || loading}
                    sx={{
                      textTransform: "none",
                      borderRadius: "999px",
                      px: 4,
                      bgcolor: "#c57a45",
                      "&:hover": { bgcolor: "#b36a36" },
                    }}
                  >
                    {isSubmitting || loading ? "Saving..." : "Save Changes"}
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
