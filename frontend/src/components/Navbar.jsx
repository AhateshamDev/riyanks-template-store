import { AppBar, Toolbar, Box } from "@mui/material";

import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <AppBar
      position="absolute"
      elevation={0}
      sx={{
        top: 0,
        left: 0,
        width: "100%",
        background: "transparent",
        boxShadow: "none",
        border: "none",
        zIndex: 1200,
      }}
    >
      <Toolbar
        sx={{
          width: "100%",
          minHeight: {
            xs: 70,
            sm: 78,
            md: 84,
          },
          px: {
            xs: 1.5,
            sm: 2.5,
            md: 4,
          },
          display: "flex",
          alignItems: "center",
        }}
      >
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
                xs: 130,
                sm: 155,
                md: 180,
              },
              height: {
                xs: 52,
                sm: 60,
                md: 66,
              },
              objectFit: "contain",
              display: "block",
            }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
