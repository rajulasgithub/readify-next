"use client";

import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { useForm ,Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Redux
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/src/Redux/store/store";
import { fetchSingleBook, updateBook } from "@/src/Redux/store/bookSlice";

import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

const categories = ["Academic","Fiction","Non-Fiction","Comics","Children","Poetry"];
const genres = ["Fiction","Thriller","Romance","Fantasy","Sci-Fi","Mystery","Biography","Adventure","Self-help"];
const languages = ["English","Malayalam","Hindi","Tamil","Kannada","Telugu"];

type BookFormInputs = {
  title: string;
  description: string;
  excerpt?: string;
  page_count: number;
  author: string;
  genre: string;
  language: string;
  publish_date: string;
  prize: number;
  category: string;
};

// Yup validation schema
const bookSchema: yup.ObjectSchema<BookFormInputs> = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  excerpt: yup.string(),
  page_count: yup.number().required("Page count is required").typeError("Must be a number"),
  author: yup.string().required("Author is required"),
  genre: yup.string().required("Genre is required"),
  language: yup.string().required("Language is required"),
  publish_date: yup.string().required("Publish date is required"),
  prize: yup.number().required("Price is required").typeError("Must be a number"),
  category: yup.string().required("Category is required"),
}).required();

const UpdateBook: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const params = useParams();
  const bookId = params?.id as string;

  const { singleBook, singleBookLoading, singleBookError, loading, error } = useSelector((state: RootState) => state.books);

  const [existingImage, setExistingImage] = useState<string>(singleBook?.image || "");
const [newImage, setNewImage] = useState<File | null>(null);
const [newPreview, setNewPreview] = useState<string | null>(null);
const [imageError, setImageError] = useState<string | null>(null);

  

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<BookFormInputs>({
  resolver: yupResolver(bookSchema),
  defaultValues: {
    title: "",
    description: "",
    excerpt: "",
    page_count: 0,
    publish_date: "",
    author: "",
    genre: "",
    language: "",
    prize: 0,
    category: "",
  },
});

  // Fetch single book on mount
  useEffect(() => {
    if (bookId) {
      dispatch(fetchSingleBook(bookId));
    }
  }, [bookId, dispatch]);

  // Pre-fill form when book data is available
  useEffect(() => {
  if (singleBook) {
    reset({
      title: singleBook.title,
      description: singleBook.description,
      excerpt: singleBook.excerpt || "",
      page_count: singleBook.page_count,
      publish_date: singleBook.publish_date ? singleBook.publish_date.split("T")[0] : "",
      author: singleBook.author,
      genre: singleBook.genre,
      language: singleBook.language,
      prize: singleBook.prize,
      category: singleBook.category,
    });
    setExistingImage(singleBook.image || "");
  }
}, [singleBook, reset]);

  // ------------------ IMAGE HANDLERS ------------------
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setNewImage(file);
  setNewPreview(URL.createObjectURL(file));
  setImageError(null);
};

 const removeExistingImage = () => setExistingImage("");
const removeNewImage = () => {
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
  formData.append("genre", data.genre);
  formData.append("language", data.language);
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

  return (
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh", py: 4 }}>
      <Box sx={{ maxWidth: 720, mx: "auto", p: 4, bgcolor: "#fff", borderRadius: 3, border: "1px solid #e5e7eb" }}>
        <Typography variant="overline" sx={{ letterSpacing: 3, color: "text.secondary" }}>SELLER</Typography>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>Update Book</Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 3, maxWidth: 420 }}>
          Edit the book details and images. Changes will be reflected in the store instantly.
        </Typography>

        {/* IMAGE SECTION */}
      {/* IMAGE SECTION */}
<Stack spacing={1.5} sx={{ mb: 3 }}>
  <Typography variant="subtitle2">Book Image *</Typography>

  {existingImage && (
    <Card sx={{ width: 100, height: 130, position: "relative", borderRadius: 2, overflow: "hidden" }}>
      <CardMedia
        component="img"
        image={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${existingImage}`}
        sx={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <IconButton onClick={removeExistingImage} sx={{ position: "absolute", top: 4, right: 4, bgcolor: "#fff" }}>
        <DeleteOutlineIcon fontSize="small" />
      </IconButton>
    </Card>
  )}

  {newPreview && (
    <Card sx={{ width: 100, height: 130, position: "relative", borderRadius: 2, overflow: "hidden" }}>
      <CardMedia
        component="img"
        image={newPreview}
        sx={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <IconButton onClick={removeNewImage} sx={{ position: "absolute", top: 4, right: 4, bgcolor: "#fff" }}>
        <DeleteOutlineIcon fontSize="small" />
      </IconButton>
    </Card>
  )}

  <Button
    variant="contained"
    component="label"
    sx={{
      bgcolor: "#c57a45",
      "&:hover": { bgcolor: "#b36a36" },
      textTransform: "none",
      borderRadius: "999px",
      px: 3,
      width: "fit-content",
      mt: existingImage ? 2 : 0,
    }}
  >
    Upload New Image
    <input type="file" hidden onChange={handleImageUpload} />
  </Button>

  {imageError && <Typography variant="caption" sx={{ color: "red" }}>{imageError}</Typography>}
</Stack>


        {error && <Typography variant="body2" sx={{ color: "#b91c1c", mb: 2, fontWeight: 500 }}>{typeof error === "string" ? error : "Failed to update book"}</Typography>}

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={2.3}>
            <TextField label="Title" fullWidth {...register("title")} error={!!errors.title} helperText={errors.title?.message} />
            <TextField label="Description" fullWidth multiline rows={3} {...register("description")} error={!!errors.description} helperText={errors.description?.message} />
            <TextField label="Excerpt" fullWidth multiline rows={2} {...register("excerpt")} error={!!errors.excerpt} helperText={errors.excerpt?.message} />
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
    <TextField
      select
      label="Genre"
      fullWidth
      {...field}
      error={!!errors.genre}
      helperText={errors.genre?.message}
    >
      {genres.map((g) => (
        <MenuItem key={g} value={g}>{g}</MenuItem>
      ))}
    </TextField>
  )}
/>
             <Controller
  name="language"
  control={control}
  render={({ field }) => (
    <TextField
      select
      label="Language"
      fullWidth
      {...field}
      error={!!errors.language}
      helperText={errors.language?.message}
    >
      {languages.map((l) => (
        <MenuItem key={l} value={l}>{l}</MenuItem>
      ))}
    </TextField>
  )}
/>
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField label="Price (₹)" type="number" fullWidth {...register("prize")} error={!!errors.prize} helperText={errors.prize?.message} />
            <Controller
  name="category"
  control={control}
  render={({ field }) => (
    <TextField
      select
      label="Category"
      fullWidth
      {...field}
      error={!!errors.category}
      helperText={errors.category?.message}
    >
      {categories.map((c) => (
        <MenuItem key={c} value={c}>{c}</MenuItem>
      ))}
    </TextField>
  )}
/>
            </Stack>
            <Button variant="contained" type="submit" disabled={loading} sx={{ bgcolor: "#c57a45", "&:hover": { bgcolor: "#b36a36" }, py: 1.2, fontSize: 16, borderRadius: "999px", textTransform: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
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
