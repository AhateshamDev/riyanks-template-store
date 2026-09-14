import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";

import { getTemplates } from "../api/templateApi";

export default function Home() {
  const [templates, setTemplates] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTemplates() {
      try {
        const result = await getTemplates();

        if (!result.success) {
          throw new Error("Unable to load templates");
        }

        setTemplates(result.products);
      } catch (error) {
        console.error(error);

        setError("Unable to connect to the backend.");
      } finally {
        setLoading(false);
      }
    }

    loadTemplates();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}

        <Box
          sx={{
            textAlign: "center",
            mb: 6,
          }}
        >
          <Typography variant="h2" fontWeight={800} gutterBottom>
            Premium Video Templates
          </Typography>

          <Typography variant="h6" color="text.secondary">
            Professional templates for your Instagram content.
          </Typography>
        </Box>

        {/* Error */}

        {error && (
          <Typography color="error" textAlign="center" sx={{ mb: 4 }}>
            {error}
          </Typography>
        )}

        {/* Products */}

        <Grid container spacing={3}>
          {templates.map((template) => (
            <Grid
              key={template.id}
              size={{
                xs: 12,
                sm: 6,
                md: 4,
              }}
            >
              <Card
                sx={{
                  borderRadius: 3,
                  height: "100%",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h5" fontWeight={700} gutterBottom>
                    {template.title}
                  </Typography>

                  <Typography color="text.secondary" sx={{ mb: 2 }}>
                    {template.description}
                  </Typography>

                  <Typography variant="h5" fontWeight={800} sx={{ mb: 2 }}>
                    ₹{template.price}
                  </Typography>

                  <Button
                    variant="contained"
                    fullWidth
                    href={`/template/${template.slug}`}
                  >
                    View Template
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
