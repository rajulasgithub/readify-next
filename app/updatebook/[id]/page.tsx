"use client";

import React, {  useRef, useState } from "react";
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

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Redux
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/src/redux/store";

import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

const categories = ["Academic","Fiction","Non-Fiction","Comics","Children","Poetry"];
const genres = ["Fiction","Thriller","Romance","Fantasy","Sci-Fi","Mystery","Biography","Adventure","Self-help"];
const languages = ["English","Malayalam","Hindi","Tamil","Kannada","Telugu"];

type BookFormInputs = {
  title: string;
  description: string;
  excerpt?: string;
  page_count: number | string;
  author: string;
  genre: string[];
  language: string[];
  publish_date: string;
  prize: number | string;
  category: string;
};

const DESCRIPTION_MIN = 50;
const DESCRIPTION_MAX = 1000;
const EXCERPT_MIN = 20;
const EXCERPT_MAX = 1000;

const bookSchema: yup.ObjectSchema<BookFormInputs> = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required")
    .min(DESCRIPTION_MIN, `Description must be at least ${DESCRIPTION_MIN} characters`)
    .max(DESCRIPTION_MAX, `Description cannot exceed ${DESCRIPTION_MAX} characters`),
  excerpt: yup.string().nullable()
    .min(EXCERPT_MIN, `Excerpt must be at least ${EXCERPT_MIN} characters`)
    .max(EXCERPT_MAX, `Excerpt cannot exceed ${EXCERPT_MAX} characters`),
  page_count: yup.number().typeError("Must be a number").required("Page count is required"),
  author: yup.string().required("Author is required"),
  genre: yup.array().of(yup.string()).min(1, "Select at least one genre"),
  language: yup.array().of(yup.string()).min(1, "Select at least one language"),
  publish_date: yup.string().required("Publish date is required"),
  prize: yup.number().typeError("Must be a number").required("Price is required"),
  category: yup.string().required("Category is required"),
}).required();

const UpdateBook: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const params = useParams();
  const bookId = params?.id as string;

  const {  singleBookLoading, singleBookError, loading, error } = useSelector((state: RootState) => state.books);

  // image handling
  const [existingImage, setExistingImage] = useState<string>("");
  const [newImage, setNewImage] = useState<File | null>(null);
  const [newPreview, setNewPreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement | null>(null);

  const { register, handleSubmit,  control, watch, formState: { errors } } = useForm<BookFormInputs>({
    resolver: yupResolver(bookSchema),
    defaultValues: {
      title: "",
      description: "",
      excerpt: "",
      page_count: 0,
      publish_date: "",
      author: "",
      genre: [],
      language: [],
      prize: 0,
      category: "",
    },
  });

  const watchDescription = watch("description", "");
  const watchExcerpt = watch("excerpt", "");

//   type MaybeArrayInput = string | string[] | null | undefined | object;

//   const parseMaybeArray = (val: MaybeArrayInput): string[] => {
//   if (val === null || val === undefined || val === "") return [];

//   let v: unknown = val;
//   let attempts = 0;

//   while (typeof v === "string" && attempts < 3) {
//     const trimmed = v.trim();
//     if (trimmed.startsWith("[") || trimmed.startsWith("{") || trimmed.startsWith('"')) {
//       try {
//         v = JSON.parse(trimmed);
//         attempts++;
//         continue;
//       } catch {
//         break;
//       }
//     }
//     break;
//   }

//   if (Array.isArray(v)) return v.map((x) => (x == null ? "" : String(x)));
//   if (typeof v === "string") return v.trim() ? [v.trim()] : [];

//   return [String(v)];
// };


  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setNewImage(file);
    setNewPreview(URL.createObjectURL(file));
    setImageError(null);
  };

  const openFilePicker = () => fileRef.current?.click();

  const removeExistingImage = () => setExistingImage("");
  const removeNewImage = () => {
    if (newPreview) URL.revokeObjectURL(newPreview);
    setNewImage(null);
    setNewPreview(null);
  };

  const onSubmit = async (data: BookFormInputs) => {
    if (!existingImage && !newImage) {
      setImageError("At least one image is required");
      return;
    }

    const formData = new FormData();
    formData.append("bookId", bookId);
    if (existingImage) formData.append("existingImage", existingImage);
    if (newImage) formData.append("image", newImage);
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
      await dispatch(updateBook({ id: bookId, formData })).unwrap();
      router.push("/sellerbooks");
    } catch (err) {
      console.error("Error updating book:", err);
    }
  };

  if (singleBookLoading) return <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}><CircularProgress /></Box>;
  if (singleBookError) return <Typography color="red">{singleBookError}</Typography>;

  const previewSrc = newPreview || (existingImage ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/${existingImage}` : null);

  return (
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh", py: 4 }}>
      <Box sx={{ maxWidth: 720, mx: "auto", p: 3, bgcolor: "#fff", borderRadius: 3, border: "1px solid #e5e7eb" }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>Update Book</Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 3, maxWidth: 420 }}>
          Edit the book details and images. Changes will be reflected in the store instantly.
        </Typography>

        <Stack spacing={1.5} sx={{ mb: 3, alignItems: "center" }}>
          <Typography variant="subtitle2">Book Image *</Typography>
          <input ref={fileRef} type="file" hidden accept="image/*" onChange={handleImageUpload} />
          <Box
            onClick={openFilePicker}
            sx={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}
              aria-hidden="true"
          >
            {previewSrc ? (
              <Card sx={{ width: 140, height: 190, borderRadius: 2, overflow: "hidden", position: "relative" }}>
                <CardMedia component="img" image={previewSrc} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <IconButton
                 onClick={(e) => {
  e.stopPropagation();

  if (newPreview) {
    removeNewImage();
  } else {
    removeExistingImage();
  }
}}
                  sx={{ position: 'absolute', top: 8, right: 8, bgcolor: '#fff', '&:hover': { bgcolor: '#f3f4f6' } }}
                >
                  <DeleteOutlineIcon />
                </IconButton>
              </Card>
            ) : (
              <Box sx={{ width: 140, height: 190, borderRadius: 2, border: "1px dashed #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <AddPhotoAlternateIcon />
              </Box>
            )}

            <Typography variant="caption" sx={{ color: "text.secondary" }}>Click to upload / replace image</Typography>
            {imageError && <Typography variant="caption" sx={{ color: "red" }}>{imageError}</Typography>}
          </Box>
        </Stack>

        {error && <Typography variant="body2" sx={{ color: "#b91c1c", mb: 2, fontWeight: 500 }}>{typeof error === "string" ? error : "Failed to update book"}</Typography>}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={2.3}>
            <TextField label="Title" fullWidth {...register("title")} error={!!errors.title} helperText={errors.title?.message} />

            <TextField
              label={`Description (min ${DESCRIPTION_MIN} - max ${DESCRIPTION_MAX} chars)`}
              fullWidth
              multiline
              rows={3}
              {...register("description")}
              error={!!errors.description}
              helperText={errors.description?.message || `${watchDescription.length} / ${DESCRIPTION_MAX}`}
              inputProps={{ maxLength: DESCRIPTION_MAX }}
            />

            <TextField
              label={`Excerpt (min ${EXCERPT_MIN} - max ${EXCERPT_MAX} chars)`}
              fullWidth
              multiline
              rows={2}
              {...register("excerpt")}
              error={!!errors.excerpt}
              helperText={errors.excerpt?.message || `${watchExcerpt.length} / ${EXCERPT_MAX}`}
              inputProps={{ maxLength: EXCERPT_MAX }}
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField label="Page Count" type="number" fullWidth {...register("page_count")} error={!!errors.page_count} helperText={errors.page_count?.message} />
              <TextField label="Publish Date" type="date" fullWidth InputLabelProps={{ shrink: true }} {...register("publish_date")} error={!!errors.publish_date} helperText={errors.language?.message as string} />
            </Stack>

            <TextField label="Author" fullWidth {...register("author")} error={!!errors.author} helperText={errors.language?.message as string} />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Controller
                name="genre"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    multiple
                    options={genres}
                    onChange={(_, value) => field.onChange(value)}
                    value={field.value || []}
                    sx={{ width: '100%' }}
                    PopperProps={{ style: { minWidth: 240, maxWidth: 480 } }}
                    renderInput={(params) => (
                      <TextField {...params} label="Genre" error={!!errors.genre} helperText={errors.language?.message as string}fullWidth />
                    )}
                  />
                )}
              />

              <Controller
                name="language"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    multiple
                    options={languages}
                    onChange={(_, value) => field.onChange(value)}
                    value={field.value || []}
                    sx={{ width: '100%' }}
                    PopperProps={{ style: { minWidth: 240, maxWidth: 480 } }}
                    renderInput={(params) => (
                      <TextField {...params} label="Language" error={!!errors.language} helperText={errors.language?.message as string} fullWidth />
                    )}
                  />
                )}
              />
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField label="Price (₹)" type="number" fullWidth {...register("prize")} error={!!errors.prize} helperText={errors.language?.message as string} />
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <TextField select label="Category" fullWidth {...field} error={!!errors.category} helperText={errors.language?.message as string}>
                    {categories.map((c) => (
                      <MenuItem key={c} value={c}>{c}</MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Stack>

            <Button
              variant="contained"
              type="submit"
              disabled={loading}
              sx={{
                bgcolor: "#c57a45",
                "&:hover": { bgcolor: "#b36a36" },
                py: 1.2,
                fontSize: 15,
                borderRadius: "999px",
                textTransform: "none",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
              }}
            >
              {loading && <CircularProgress size={18} sx={{ color: "#fff" }} />}
              {loading ? "Updating..." : "Update Book"}
            </Button>
          </Stack>
        </form>
      </Box>
    </Box>
  );
};

export default UpdateBook;
