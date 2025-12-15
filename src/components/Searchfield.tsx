"use client";

import { Box, InputBase } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
};

export default function Searchfield({
  value,
  onChange,
  placeholder = "Search...",
  onKeyDown,
}: Props) {
  return (
    <Box
      sx={{
        width: { xs: "90%", sm: "60%", md: "50%" },
        mx: "auto",
        display: "flex",
        alignItems: "center",
        padding: "6px 14px",
        borderRadius: "30px",
        background: "#fefefe",
        boxShadow: `
          4px 4px 10px rgba(0, 0, 0, 0.08),
          -4px -4px 10px rgba(255, 255, 255, 0.8)
        `,
      }}
    >
      <SearchIcon sx={{ color: "#B0B0B0", fontSize: 22 }} />

      <InputBase
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        sx={{
          width: "100%",
          fontSize: "15px",
          color: "#555",
        }}
      />
    </Box>
  );
}
