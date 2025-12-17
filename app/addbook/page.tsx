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
import {
  useForm,
  Controller,
  FieldError,
  FieldErrors,
} from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/src/redux/store";
import { addBook } from "@/src/redux/slices/bookSlice";

import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";

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

export type BookFormInputs = {
  title: string;
  description: string;
  excerpt: string;
  page_count: number;
  publish_date: string;
  author: string;
  genre: string[];
  language: string[];
  prize: number;
  category: string;
  image: File | null; 
};

const bookSchema = yup.object({
  title: yup.string().required("Title is required"),

  description: yup
    .string()
    .required("Description is required")
    .min(20)
    .max(1000),

  excerpt: yup
    .string()
    .required("Excerpt is required")
    .min(20)
    .max(1000),

  page_count: yup
    .number()
    .typeError("Page count must be a number")
    .required("Page count is required"),

  publish_date: yup.string().required("Publish date is required"),

  author: yup.string().required("Author is required"),

  genre: yup
    .array()
    .of(yup.string().required())
    .min(1, "Select at least one genre")
    .required(),

  language: yup
    .array()
    .of(yup.string().required())
    .min(1, "Select at least one language")
    .required(),

  prize: yup
    .number()
    .typeError("Price must be a number")
    .required("Price is required"),

  category: yup.string().required("Category is required"),

  image: yup
    .mixed<File>()
     .defined() 
    .nullable()
    .test(
      "required",
      "Image is required",
      (value) => value instanceof File
    ),
});


const AddBook: React.FC = () => {
const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { blocked } = useAuth();

  const { loading, error } = useSelector(
    (state: RootState) => state.books
  );

  const {
  register,
  handleSubmit,
  control,
  watch,
  setValue,
  formState: { errors },
} = useForm<BookFormInputs>({
  resolver: yupResolver(bookSchema),
  defaultValues: {
    title: "",
    description: "",
    excerpt: "",
    page_count: undefined as unknown as number,
    publish_date: "",
    author: "",
    genre: [],
    language: [],
    prize: undefined as unknown as number,
    category: "",
    image: null,
  },
});

  const descriptionValue = watch("description") || "";
  const excerptValue = watch("excerpt") || "";

  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      setValue("image", null, { shouldValidate: true });
      if (preview) URL.revokeObjectURL(preview);
      setPreview(null);
      return;
    }

    const file = files[0];
    setValue("image", file, { shouldValidate: true });

    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));

    if (fileRef.current) fileRef.current.value = "";
  };

  const removeImage = () => {
    setValue("image", null, { shouldValidate: true });
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const openFilePicker = () => {
    fileRef.current?.click();
  };

  

  const onSubmit = async (data: BookFormInputs) => {
    if (!data.image) return;

    const formData = new FormData();
    formData.append("image", data.image);
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("excerpt", data.excerpt);
    formData.append("page_count", String(data.page_count));
    formData.append("publish_date", data.publish_date);
    formData.append("author", data.author);
    formData.append("genre", JSON.stringify(data.genre));
    formData.append("language", JSON.stringify(data.language));
    formData.append("prize", String(data.prize));
    formData.append("category", data.category);

    const result = await dispatch(addBook(formData));
    if (addBook.fulfilled.match(result)) {
      router.push("/sellerbooks");
    }
  };

  const onInvalid = (formErrors: FieldErrors<BookFormInputs>) => {
    if (formErrors.image) {
      fileRef.current?.scrollIntoView({ behavior: "smooth" });
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

         
          <input ref={fileRef} type="file" hidden accept="image/*" onChange={handleImageUpload} />
          <Box
            onClick={openFilePicker}
            sx={{
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
              position: "relative",
            }}
            role="button"
            tabIndex={0}
          >
            {preview ? (
              <Card sx={{ width: 160, height: 200, borderRadius: 2, overflow: "hidden", position: "relative" }}>
                <CardMedia component="img" image={preview} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
               
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage();
                  }}
                  sx={{ position: "absolute", top: 8, right: 8, bgcolor: "#fff", "&:hover": { bgcolor: "#f3f4f6" } }}
                  aria-label="Remove image"
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
                  border: `1px dashed #e5e7eb`,
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

           <Typography variant="caption" sx={{ color: "red" }}>
  {errors.image?.message}
</Typography>
          </Box>
        </Stack>

        {error && (
          <Typography variant="body2" sx={{ color: "#b91c1c", mb: 2, fontWeight: 500 }}>
            {typeof error === "string" ? error : "Failed to add book"}
          </Typography>
        )}
           {blocked && (
  <Typography variant="caption" color="error" sx={{ mt: 1 }}>
    Your account is blocked. You cannot add books.
  </Typography>
)}
        <form onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate>
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
      isOptionEqualToValue={(opt, val) => opt === val}
      getOptionLabel={(opt) => opt}
      sx={{ width: "100%" }}
      slotProps={{
        popper: {
          sx: { minWidth: 240, maxWidth: 480 }, // use sx instead of style
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
      sx={{ width: '100%' }}
      slotProps={{
        popper: {
          sx: {
            minWidth: 240,
            maxWidth: 480,
          },
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Language"
          error={!!errors.language}
          helperText={errors.language?.message as string}
          fullWidth
        />
      )}
    />
  )}
/>

            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField label="Price (₹)" type="number" fullWidth {...register("prize")} error={!!errors.prize} helperText={errors.prize?.message} />

              <Controller
                name="category"
                control={control}
                defaultValue=""
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
                      <MenuItem key={c} value={c}>
                        {c}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Stack>

            <Button
              variant="contained"
              type="submit"
              disabled={loading || blocked} 
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
                {loading ? "Adding..." : blocked ? "Blocked" : "Add Book"}
            </Button>
          </Stack>

        </form>
      </Box>
    </Box>
  );
};

export default AddBook;
