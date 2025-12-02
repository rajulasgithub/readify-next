// "use client";

// import {
//   Box,
//   Container,
//   Typography,
//   Card,
//   CardMedia,
//   CardContent,
//   IconButton,
//   Button,
//   Stack,
//   Chip,
//   Pagination,
// } from "@mui/material";

// import DeleteIcon from "@mui/icons-material/Delete";
// import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchWishlist,
//   removeFromWishlist,
//   clearWishlist,
// } from "@/src/Redux/store/wishlistSlice";
// import { AppDispatch, RootState } from "@/src/Redux/store/store";
// import { useRouter } from "next/navigation";

// export default function WishlistPage() {
//   const dispatch = useDispatch<AppDispatch>();
//   const router = useRouter();

//   // 👇 pagination state
//   const [page, setPage] = useState(1);
//   const limit = 6; // how many items per page

//   const { items, loading, error, totalPages, totalItems } = useSelector(
//     (state: RootState) => state.wishlist
//   );

//   // 👇 load wishlist whenever page changes
//   useEffect(() => {
//     dispatch(fetchWishlist({ page, limit }));
//   }, [dispatch, page, limit]);

//   const removeHandler = (id: string) => {
//     dispatch(removeFromWishlist(id));
//   };

//   const clearHandler = () => {
//     dispatch(clearWishlist());
//   };

//   const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
//     setPage(value);
//   };

//   if (loading) {
//     return (
//       <Box
//         sx={{
//           minHeight: "60vh",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         <Typography variant="h6" color="text.secondary">
//           Loading your wishlist...
//         </Typography>
//       </Box>
//     );
//   }

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         bgcolor: "#f5f7fb",
//         py: 6,
//       }}
//     >
//       <Container maxWidth="md">
//         {/* Header */}
//         <Box
//           sx={{
//             mb: 4,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             gap: 2,
//           }}
//         >
//           <Box>
//             <Stack direction="row" spacing={1} alignItems="center">
//               <FavoriteBorderIcon sx={{ color: "#c57a45" }} />
//               <Typography variant="h4" fontWeight={700}>
//                 My Wishlist
//               </Typography>
//             </Stack>
//             <Stack direction="row" spacing={1} mt={1}>
//               <Chip
//                 label={`${totalItems ?? items.length} item${
//                   (totalItems ?? items.length) !== 1 ? "s" : ""
//                 } saved`}
//                 size="small"
//                 sx={{ bgcolor: "#fff7f0", color: "#c57a45", fontWeight: 500 }}
//               />
//               {totalPages && totalPages > 1 && (
//                 <Chip
//                   label={`Page ${page} of ${totalPages}`}
//                   size="small"
//                   sx={{ bgcolor: "#e3f2fd", color: "#1976d2" }}
//                 />
//               )}
//             </Stack>
//           </Box>

//           {items.length > 0 && (
//             <Button
//               variant="outlined"
//               color="error"
//               sx={{
//                 borderRadius: "999px",
//                 textTransform: "none",
//                 px: 3,
//               }}
//               onClick={clearHandler}
//             >
//               Clear Wishlist
//             </Button>
//           )}
//         </Box>

//         {error && (
//           <Typography color="error" mb={2}>
//             {error}
//           </Typography>
//         )}

//         {/* Empty State */}
//         {items.length === 0 ? (
//           <Box
//             sx={{
//               mt: 6,
//               p: 4,
//               bgcolor: "#ffffff",
//               borderRadius: 4,
//               boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
//               textAlign: "center",
//             }}
//           >
//             <Typography variant="h6" fontWeight={600} mb={1}>
//               Your wishlist is empty
//             </Typography>
//             <Typography color="text.secondary" mb={3}>
//               Start exploring books and tap the ❤️ icon to save your favourites
//               here.
//             </Typography>
//             <Button
//               variant="contained"
//               sx={{
//                 bgcolor: "#c57a45",
//                 textTransform: "none",
//                 borderRadius: "999px",
//                 px: 4,
//                 "&:hover": { bgcolor: "#b36a36" },
//               }}
//               onClick={() => router.push("/browse")}
//             >
//               Browse Books
//             </Button>
//           </Box>
//         ) : (
//           <>
//             {/* Wishlist items */}
//             <Stack spacing={2.5}>
//               {items.map((item) => (
//                 <Card
//                   key={item.bookId}
//                   sx={{
//                     display: "flex",
//                     alignItems: "stretch",
//                     p: 2,
//                     borderRadius: 3,
//                     boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
//                     bgcolor: "#ffffff",
//                     position: "relative",
//                     overflow: "hidden",
//                     "&::before": {
//                       content: '""',
//                       position: "absolute",
//                       inset: 0,
//                       background:
//                         "linear-gradient(135deg, rgba(197,122,69,0.06), transparent)",
//                       pointerEvents: "none",
//                     },
//                   }}
//                 >
//                   <CardMedia
//                     component="img"
//                     image={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${item.image}`}
//                     alt={item.title}
//                     sx={{
//                       width: 110,
//                       height: 150,
//                       borderRadius: 2,
//                       objectFit: "cover",
//                       mr: 2,
//                       flexShrink: 0,
//                     }}
//                   />

//                   <CardContent
//                     sx={{
//                       flexGrow: 1,
//                       display: "flex",
//                       flexDirection: "column",
//                       justifyContent: "space-between",
//                       zIndex: 1,
//                     }}
//                   >
//                     <Box>
//                       <Typography
//                         variant="subtitle1"
//                         fontWeight={700}
//                         sx={{ mb: 0.5 }}
//                         noWrap
//                       >
//                         {item.title}
//                       </Typography>
//                       <Typography
//                         variant="body2"
//                         color="text.secondary"
//                         sx={{ mb: 0.5 }}
//                         noWrap
//                       >
//                         {item.author}
//                       </Typography>

//                       <Stack direction="row" spacing={1} flexWrap="wrap">
//                         {Array.isArray(item.genre) ? (
//                           item.genre.map((g: string) => (
//                             <Chip
//                               key={g}
//                               label={g}
//                               size="small"
//                               sx={{
//                                 bgcolor: "#f3e7dd",
//                                 color: "#7a4a26",
//                                 fontSize: "0.7rem",
//                               }}
//                             />
//                           ))
//                         ) : (
//                           <Chip
//                             label={item.genre}
//                             size="small"
//                             sx={{
//                               bgcolor: "#f3e7dd",
//                               color: "#7a4a26",
//                               fontSize: "0.7rem",
//                             }}
//                           />
//                         )}
//                       </Stack>
//                     </Box>

//                     <Stack
//                       direction="row"
//                       alignItems="center"
//                       justifyContent="space-between"
//                       mt={2}
//                     >
//                       <Typography variant="h6" fontWeight={700}>
//                         ₹{item.prize}
//                       </Typography>
//                     </Stack>
//                   </CardContent>

//                   {/* Remove Button */}
//                   <Box
//                     sx={{
//                       display: "flex",
//                       alignItems: "flex-start",
//                       justifyContent: "flex-end",
//                       pr: 1,
//                       pt: 1,
//                       zIndex: 1,
//                     }}
//                   >
//                     <IconButton
//                       color="error"
//                       onClick={() => removeHandler(item.bookId)}
//                       sx={{
//                         bgcolor: "#ffebee",
//                         "&:hover": { bgcolor: "#ffcdd2" },
//                       }}
//                     >
//                       <DeleteIcon fontSize="small" />
//                     </IconButton>
//                   </Box>
//                 </Card>
//               ))}
//             </Stack>

//             {/* Pagination */}
//             {totalPages && totalPages > 1 && (
//               <Box mt={4} display="flex" justifyContent="center">
//                 <Pagination
//                   page={page}
//                   count={totalPages}
//                   onChange={handlePageChange}
//                   shape="rounded"
//                   color="primary"
//                   siblingCount={1}
//                   boundaryCount={1}
//                 />
//               </Box>
//             )}
//           </>
//         )}
//       </Container>
//     </Box>
//   );
// }
