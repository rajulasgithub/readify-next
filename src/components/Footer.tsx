"use client";

import React from "react";
import { Box, Typography, Container, Stack, IconButton, Divider } from "@mui/material";

import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";

const Footer: React.FC = () => {
  return (
    <Box
      sx={{
        bgcolor: "#f9fafb",
        borderTop: "1px solid #e5e7eb",
        mt: "auto", // ensures footer sticks to bottom
        py: 6,
        width: "100%",
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "center", md: "flex-start" }}
          spacing={4}
          sx={{ textAlign: { xs: "center", md: "left" } }}
        >
          {/* Brand */}
          <Box sx={{ maxWidth: 280 }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: "#111827", mb: 1 }}
            >
              Readify
            </Typography>
            <Typography variant="body2" sx={{ color: "#6b7280", lineHeight: 1.6 }}>
              Discover books from every genre—fiction, knowledge, imagination, and everything in between.
            </Typography>
          </Box>

          {/* Quick Links */}
          <Stack spacing={1}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, color: "#111827", mb: 1 }}
            >
              Quick Links
            </Typography>
            {["Home", "Categories", "Browse Books", "About Us"].map((item, index) => (
              <Typography
                key={index}
                sx={{
                  color: "#4b5563",
                  fontSize: 14,
                  cursor: "pointer",
                  transition: "0.3s",
                  "&:hover": { color: "#c57a45", textDecoration: "underline" },
                }}
              >
                {item}
              </Typography>
            ))}
          </Stack>

          {/* Social Media */}
          <Stack alignItems={{ xs: "center", md: "flex-start" }} spacing={2}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, color: "#111827" }}
            >
              Follow Us
            </Typography>
            <Stack direction="row" spacing={1}>
              {[FacebookIcon, InstagramIcon, TwitterIcon].map((Icon, i) => (
                <IconButton
                  key={i}
                  sx={{
                    color: "#4b5563",
                    "&:hover": { color: "#c57a45", transform: "scale(1.1)" },
                    transition: "all 0.3s",
                  }}
                >
                  <Icon />
                </IconButton>
              ))}
            </Stack>
          </Stack>
        </Stack>

        <Divider sx={{ my: 4, borderColor: "#e5e7eb" }} />

        {/* Copyright */}
        <Typography
          variant="caption"
          sx={{
            display: "block",
            textAlign: "center",
            color: "#6b7280",
          }}
        >
          © {new Date().getFullYear()} Readify. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
