import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        backgroundColor: "#08090d",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        color: "#fff",
        px: {
          xs: 2,
          sm: 3,
          md: 5,
        },
        py: {
          xs: 3,
          sm: 4,
        },
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 1400,
          mx: "auto",
          display: "flex",
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          alignItems: {
            xs: "center",
            sm: "center",
          },
          justifyContent: "space-between",
          gap: 2,
          textAlign: {
            xs: "center",
            sm: "left",
          },
        }}
      >
        {/* Logo + copyright */}
        <Box
          component={Link}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
          }}
        >
          <Box
            component="img"
            src="/riyank-logo.png"
            alt="Riyank Edit"
            sx={{
              width: {
                xs: 120,
                sm: 140,
              },
              height: 45,
              objectFit: "contain",
              display: "block",
            }}
          />
        </Box>

        <Typography
          sx={{
            color: "#8e95a3",
            fontSize: {
              xs: "0.78rem",
              sm: "0.85rem",
            },
          }}
        >
          © {new Date().getFullYear()} Riyank Edit. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
