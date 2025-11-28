"use client";

import React from "react";
import { Box, Typography, Container, Stack, IconButton } from "@mui/material";

import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";

const Footer: React.FC = () => {
  return (
    <Box
      sx={{
        bgcolor: "#ffffff",
        borderTop: "1px solid #e5e7eb",
        mt: 6,
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "center", md: "flex-start" }}
          spacing={3}
          sx={{ textAlign: { xs: "center", md: "left" } }}
        >
          {/* LEFT SECTION */}
          <Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: "#111827", mb: 1 }}
            >
              Readify
            </Typography>

            <Typography variant="body2" sx={{ color: "#6b7280", maxWidth: 260 }}>
              Discover books from every genre—fiction, knowledge, imagination,
              and everything in between.
            </Typography>
          </Box>

          {/* CENTER LINKS */}
          <Stack spacing={1}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, color: "#111827", mb: 1 }}
            >
              Quick Links
            </Typography>

            {["Home", "Categories", "Browse Books", "About Us"].map(
              (item, index) => (
                <Typography
                  key={index}
                  sx={{
                    color: "#4b5563",
                    fontSize: 14,
                    cursor: "pointer",
                    "&:hover": { color: "#111827" },
                  }}
                >
                  {item}
                </Typography>
              )
            )}
          </Stack>

          {/* SOCIAL ICONS */}
          <Stack alignItems="center" spacing={1}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, color: "#111827" }}
            >
              Follow Us
            </Typography>

            <Stack direction="row" spacing={1}>
              <IconButton sx={{ color: "#4b5563", "&:hover": { color: "#111827" } }}>
                <FacebookIcon />
              </IconButton>

              <IconButton sx={{ color: "#4b5563", "&:hover": { color: "#111827" } }}>
                <InstagramIcon />
              </IconButton>

              <IconButton sx={{ color: "#4b5563", "&:hover": { color: "#111827" } }}>
                <TwitterIcon />
              </IconButton>
            </Stack>
          </Stack>
        </Stack>

        {/* BOTTOM COPYRIGHT */}
        <Typography
          variant="caption"
          sx={{
            display: "block",
            textAlign: "center",
            color: "#6b7280",
            mt: 3,
          }}
        >
          © {new Date().getFullYear()} Readify. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
