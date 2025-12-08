"use client";

import React, { useState } from "react";
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

import { useForm } from "react-hook-form";
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
  excerpt?: yup.Maybe<string>; 
  page_count: number | string;
  publish_date: string;
  author: string;
  genre: string;
  language: string;
  prize: number | string;
  category: string;
};


const bookSchema: yup.ObjectSchema<BookFormInputs> = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  excerpt: yup.string().optional(),
  page_count: yup
    .number()
    .typeError("Page count must be a number")
    .positive("Page count must be positive")
    .required("Page count is required"),
  publish_date: yup.string().required("Publish date is required"),
  author: yup.string().required("Author is required"),
  genre: yup.string().required("Genre is required"),
  language: yup.string().required("Language is required"),
  prize: yup
    .number()
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
  formState: { errors },
} = useForm<BookFormInputs>({
  resolver: yupResolver(bookSchema),
});

 
  const [images, setImages] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);

  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);

    setImages((prev) => [...prev, ...fileArray]);

    const urls = fileArray.map((f) => URL.createObjectURL(f));
    setPreview((prev) => [...prev, ...urls]);

    setImageError(null);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreview((prev) => prev.filter((_, i) => i !== index));
  };

  
  const onSubmit = async (data: BookFormInputs) => {
    if (images.length === 0) {
      setImageError("At least one image is required");
      return;
    }

    const formData = new FormData();

    images.forEach((img) => formData.append("image", img)); 

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
    
      const resultAction = await dispatch(addBook(formData)).unwrap();;

    
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
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", mb: 3, maxWidth: 400 }}
        >
          Fill in the book details and upload cover images to list your book in
          the store.
        </Typography>

       
        <Stack spacing={1.5} sx={{ mb: 3 }}>
          <Typography variant="subtitle2">Book Images *</Typography>

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
            }}
          >
            Upload Images
            <input type="file" multiple hidden onChange={handleImageUpload} />
          </Button>

          <Stack direction="row" spacing={2} flexWrap="wrap">
            {preview.map((src, index) => (
              <Card
                key={index}
                sx={{
                  width: 100,
                  height: 130,
                  position: "relative",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <CardMedia
                  component="img"
                  image={src}
                  sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <IconButton
                  onClick={() => removeImage(index)}
                  sx={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    bgcolor: "#ffffff",
                    "&:hover": { bgcolor: "#f1f5f9" },
                  }}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Card>
            ))}
          </Stack>

          {imageError && (
            <Typography variant="caption" sx={{ color: "red" }}>
              {imageError}
            </Typography>
          )}
        </Stack>

        
        {error && (
          <Typography
            variant="body2"
            sx={{ color: "#b91c1c", mb: 2, fontWeight: 500 }}
          >
            {typeof error === "string" ? error : "Failed to add book"}
          </Typography>
        )}

       
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={2.3}>
            <TextField
              label="Title"
              fullWidth
              {...register("title")}
              error={!!errors.title}
              helperText={errors.title?.message}
            />

            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              {...register("description")}
              error={!!errors.description}
              helperText={errors.description?.message}
            />

            <TextField
              label="Excerpt"
              fullWidth
              multiline
              rows={2}
              {...register("excerpt")}
              error={!!errors.excerpt}
              helperText={errors.excerpt?.message}
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Page Count"
                type="number"
                fullWidth
                {...register("page_count")}
                error={!!errors.page_count}
                helperText={errors.page_count?.message}
              />

              <TextField
                label="Publish Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                {...register("publish_date")}
                error={!!errors.publish_date}
                helperText={errors.publish_date?.message}
              />
            </Stack>

            <TextField
              label="Author"
              fullWidth
              {...register("author")}
              error={!!errors.author}
              helperText={errors.author?.message}
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                select
                label="Genre"
                fullWidth
                {...register("genre")}
                error={!!errors.genre}
                helperText={errors.genre?.message}
              >
                {genres.map((g) => (
                  <MenuItem key={g} value={g}>
                    {g}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Language"
                fullWidth
                {...register("language")}
                error={!!errors.language}
                helperText={errors.language?.message}
              >
                {languages.map((l) => (
                  <MenuItem key={l} value={l}>
                    {l}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Price (₹)"
                type="number"
                fullWidth
                {...register("prize")}
                error={!!errors.prize}
                helperText={errors.prize?.message}
              />

              <TextField
                select
                label="Category"
                fullWidth
                {...register("category")}
                error={!!errors.category}
                helperText={errors.category?.message}
              >
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
