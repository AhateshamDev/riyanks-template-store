import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { useSearchParams } from "react-router-dom";

import { getDownloadUrl } from "../api/templateApi";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();

  const productId = searchParams.get("product");

  const token = searchParams.get("token");

  const downloadUrl =
    productId && token ? getDownloadUrl(productId, token) : null;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            borderRadius: 4,
            textAlign: "center",
          }}
        >
          <CardContent sx={{ p: 6 }}>
            <CheckCircleIcon
              sx={{
                fontSize: 80,
                mb: 2,
              }}
            />

            <Typography variant="h4" fontWeight={800} gutterBottom>
              Payment Successful!
            </Typography>

            <Typography color="text.secondary" sx={{ mb: 4 }}>
              Thank you for your purchase. Your template is ready to download.
            </Typography>

            {downloadUrl ?
              <Button
                variant="contained"
                size="large"
                href={downloadUrl}
                sx={{
                  px: 5,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 700,
                }}
              >
                Download Template
              </Button>
            : <Typography color="error">Invalid download link.</Typography>}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
