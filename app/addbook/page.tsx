"use client";

import React, { useRef, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  MenuItem,
  Card,
  CardMedia,
  IconButton,
  CircularProgress,
  Autocomplete,
} from "@mui/material";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { FieldError } from "react-hook-form";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/src/redux/store";
import { addBook } from "@/src/redux/slices/bookSlice";

import { useRouter } from "next/navigation";

const categories = [
  "Academic",
  "Fiction",
  "Non-Fiction",
  "Comics",
  "Children",
  "Poetry",
];

const genres = [
  "Fiction",
  "Thriller",
  "Romance",
  "Fantasy",
  "Sci-Fi",
  "Mystery",
  "Biography",
  "Adventure",
  "Self-help",
];

const languages = [
  "English",
  "Malayalam",
  "Hindi",
  "Tamil",
  "Kannada",
  "Telugu",
];

type BookFormInputs = {
  title: string;
  description: string;
  excerpt?: string;
  page_count: number;   // ✅ FIXED
  publish_date: string;
  author: string;
  genre: string[];
  language: string[];
  prize: number;        // ✅ FIXED
  category: string;
};

const bookSchema = yup.object({
  title: yup.string().required("Title is required"),

  description: yup
    .string()
    .required("Description is required")
    .test(
      "len",
      "Description must be at least 20 characters and at most 1000 characters",
      (val) => !!val && val.length >= 20 && val.length <= 1000
    ),

  excerpt: yup
    .string()
    .nullable()
    .test(
      "excerpt-len",
      "Excerpt must be at least 20 characters and at most 1000 characters",
      (val) => {
        if (!val) return true;
        return val.length >= 20 && val.length <= 1000;
      }
    ),

 page_count: yup
  .number()
  .transform((value, originalValue) =>
    originalValue === "" ? undefined : Number(originalValue)
  )
  .typeError("Page count must be a number")
  .positive("Page count must be positive")
  .required("Page count is required"),

  publish_date: yup.string().required("Publish date is required"),

  author: yup.string().required("Author is required"),

 genre: yup
  .array()
  .ensure() // ✅ converts undefined → []
  .of(yup.string().required())
  .min(1, "Select at least one genre"),


language: yup
  .array()
  .ensure() // ✅ converts undefined → []
  .of(yup.string().required())
  .min(1, "Select at least one language"),
 prize: yup
  .number()
  .transform((value, originalValue) =>
    originalValue === "" ? undefined : Number(originalValue)
  )
  .typeError("Price must be a number")
  .positive("Price must be positive")
  .required("Price is required"),
  category: yup.string().required("Category is required"),
});

const AddBook: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const route = useRouter();

  const { loading, error } = useSelector((state: RootState) => state.books);

 const {
  register,
  handleSubmit,
  control,
  watch,
  formState: { errors },
} = useForm<BookFormInputs>({
  resolver: yupResolver(bookSchema),
  defaultValues: { genre: [], language: [] },
});

  const descriptionValue = watch("description") || "";
  const excerptValue = watch("excerpt") || "";

  // Only a single image now
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setImageError(null);

    // reset input value so same file can be selected again if needed
    if (fileRef.current) fileRef.current.value = "";
  };

  const removeImage = () => {
    if (preview) URL.revokeObjectURL(preview);
    setImage(null);
    setPreview(null);
  };

  const openFilePicker = () => {
    fileRef.current?.click();
  };

  const onSubmit = async (data: BookFormInputs) => {
    if (!image) {
      setImageError("An image is required");
      return;
    }

    const formData = new FormData();

    formData.append("image", image);

    formData.append("title", data.title);
    formData.append("description", data.description);
    if (data.excerpt) formData.append("excerpt", data.excerpt);
    formData.append("page_count", String(data.page_count));
    formData.append("publish_date", data.publish_date);
    formData.append("author", data.author);

    formData.append("genre", JSON.stringify(data.genre));
    formData.append("language", JSON.stringify(data.language));

    formData.append("prize", String(data.prize));
    formData.append("category", data.category);

    try {

    const dispatchTyped = dispatch as AppDispatch;
   const resultAction = await dispatchTyped(addBook(formData));

      if (addBook.fulfilled.match(resultAction)) {
        route.push("/sellerbooks");
      }
    } catch (err) {
      console.error("Error adding book:", err);
    }
  };

  return (
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh", py: 4 }}>
      <Box
        sx={{
          maxWidth: 720,
          mx: "auto",
          p: 4,
          bgcolor: "#ffffff",
          borderRadius: 3,
          border: "1px solid #e5e7eb",
        }}
      >
        <Typography variant="overline" sx={{ letterSpacing: 3, color: "text.secondary" }}>
          SELLER
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
          Add New Book
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 3, maxWidth: 400 }}>
          Fill in the book details and upload cover images to list your book in the store.
        </Typography>

        <Stack spacing={1.5} sx={{ mb: 3, alignItems: "center" }}>
          <Typography variant="subtitle2">Book Image *</Typography>

          {/* Hidden input (single file) */}
          <input
            ref={fileRef}
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageUpload}
          />

          {/* Centered preview area (click to open) */}
          <Box
            onClick={openFilePicker}
            sx={{
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
              position: 'relative'
            }}
            aria-hidden
          >
            {preview ? (
              <Card sx={{ width: 160, height: 200, borderRadius: 2, overflow: "hidden", position: 'relative' }}>
                <CardMedia component="img" image={preview} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                {/* delete button on top-right of preview */}
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage();
                  }}
                  sx={{ position: 'absolute', top: 8, right: 8, bgcolor: '#fff', '&:hover': { bgcolor: '#f3f4f6' } }}
                >
                  <DeleteOutlineIcon />
                </IconButton>
              </Card>
            ) : (
              <Box
                sx={{
                  width: 160,
                  height: 200,
                  borderRadius: 2,
                  border: "1px dashed #e5e7eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AddPhotoAlternateIcon />
              </Box>
            )}

            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Click to choose image
            </Typography>

            {imageError && (
              <Typography variant="caption" sx={{ color: "red" }}>
                {imageError}
              </Typography>
            )}
          </Box>
        </Stack>

        {error && (
          <Typography variant="body2" sx={{ color: "#b91c1c", mb: 2, fontWeight: 500 }}>
            {typeof error === "string" ? error : "Failed to add book"}
          </Typography>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={2.3}>
            <TextField label="Title" fullWidth {...register("title")} error={!!errors.title} helperText={errors.title?.message} />

            <Box>
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={4}
                {...register("description")}
                error={!!errors.description}
                helperText={errors.description?.message}
                inputProps={{ maxLength: 1000 }}
              />

              {/* character counter aligned right */}
              <Typography variant="caption" sx={{ display: "block", textAlign: "right", color: "text.secondary", mt: 0.5 }}>
                {`${descriptionValue.length}/1000`}
              </Typography>
            </Box>

            <Box>
              <TextField
                label="Excerpt"
                fullWidth
                multiline
                rows={3}
                {...register("excerpt")}
                error={!!errors.excerpt}
                helperText={errors.excerpt?.message}
                inputProps={{ maxLength: 1000 }}
              />

              <Typography variant="caption" sx={{ display: "block", textAlign: "right", color: "text.secondary", mt: 0.5 }}>
                {`${excerptValue.length}/1000`}
              </Typography>
            </Box>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField label="Page Count" type="number" fullWidth {...register("page_count")} error={!!errors.page_count} helperText={errors.page_count?.message} />

              <TextField label="Publish Date" type="date" fullWidth InputLabelProps={{ shrink: true }} {...register("publish_date")} error={!!errors.publish_date} helperText={errors.publish_date?.message} />
            </Stack>

            <TextField label="Author" fullWidth {...register("author")} error={!!errors.author} helperText={errors.author?.message} />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Controller
  name="genre"
  control={control}
  render={({ field }) => (
    <Autocomplete
      multiple
      options={genres}
      value={field.value || []}
      onChange={(_, value) => field.onChange(value)}
      isOptionEqualToValue={(opt, val) => opt === val}  // ✅ REQUIRED
      getOptionLabel={(opt) => opt}                     // ✅ REQUIRED
      sx={{ width: "100%" }}
      slotProps={{
        popper: {
          style: { minWidth: 240, maxWidth: 480 },
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Genre"
          error={!!errors.genre}
          helperText={(errors.genre as FieldError)?.message}
          fullWidth
        />
      )}
    />
  )}
/>
<Controller
  name="language"
  control={control}
  render={({ field }) => (
    <Autocomplete
      multiple
      options={languages}
      value={field.value || []}
      onChange={(_, value) => field.onChange(value)}
      isOptionEqualToValue={(opt, val) => opt === val}   // ✅ REQUIRED
      getOptionLabel={(opt) => opt}                     // ✅ REQUIRED
      sx={{ width: "100%" }}
      slotProps={{
        popper: {
          style: { minWidth: 240, maxWidth: 480 },
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Language"
          error={!!errors.language}
          helperText={(errors.language as FieldError)?.message}
          fullWidth
        />
      )}
    />
  )}
/>
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField label="Price (₹)" type="number" fullWidth {...register("prize")} error={!!errors.prize} helperText={errors.prize?.message} />

              <TextField select label="Category" fullWidth {...register("category")} error={!!errors.category} helperText={errors.category?.message}>
                {categories.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>

            <Button
              variant="contained"
              type="submit"
              disabled={loading}
              sx={{
                bgcolor: "#c57a45",
                "&:hover": { bgcolor: "#b36a36" },
                py: 1.2,
                fontSize: 16,
                borderRadius: "999px",
                textTransform: "none",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
              }}
            >
              {loading && <CircularProgress size={18} sx={{ color: "#fff" }} />}
              {loading ? "Adding..." : "Add Book"}
            </Button>
          </Stack>
        </form>
      </Box>
    </Box>
  );
};

export default AddBook;
