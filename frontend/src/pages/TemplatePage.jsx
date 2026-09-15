import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  getTemplate,
  createPaymentOrder,
  verifyPayment,
} from "../api/templateApi";

const API_URL = "https://riyanks-template-store.onrender.com";

export default function TemplatePage() {
  const { slug } = useParams();

  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");

  useEffect(() => {
    async function loadTemplate() {
      try {
        const result = await getTemplate(slug);

        if (!result.success) {
          throw new Error(result.message);
        }

        setTemplate(result.product);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadTemplate();
  }, [slug]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!template) {
    return (
      <Container sx={{ py: 10 }}>
        <Typography variant="h4">Template not found</Typography>
      </Container>
    );
  }

  async function loadRazorpay() {
    return new Promise((resolve) => {
      const existingScript = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
      );

      if (existingScript) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");

      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => resolve(true);

      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  }

  async function handleBuy() {
    try {
      if (!email) {
        alert("Please enter your email address.");

        return;
      }

      const razorpayLoaded = await loadRazorpay();

      if (!razorpayLoaded) {
        alert("Unable to load Razorpay.");

        return;
      }

      // Create order on backend
      const orderResponse = await createPaymentOrder(template.id, email);

      if (!orderResponse.success) {
        alert(orderResponse.message);

        return;
      }

      // Razorpay options
      const options = {
        key: orderResponse.keyId,

        amount: orderResponse.order.amount,

        currency: orderResponse.order.currency,

        name: "Template Store",

        description: template.title,

        order_id: orderResponse.order.id,

        prefill: {
          email: email,
        },

        theme: {
          color: "#111111",
        },

        handler: async function (response) {
          try {
            const verification = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,

              razorpay_payment_id: response.razorpay_payment_id,

              razorpay_signature: response.razorpay_signature,
            });

            if (!verification.success) {
              alert(verification.message);

              return;
            }

            // Save download information
            localStorage.setItem("downloadToken", verification.downloadToken);

            localStorage.setItem("downloadProductId", verification.productId);

            window.location.href = `/payment-success?product=${verification.productId}&token=${verification.downloadToken}`;
          } catch (error) {
            console.error(error);

            alert("Payment verification failed.");
          }
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.open();
    } catch (error) {
      console.error(error);

      alert("Unable to start payment.");
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={5}>
          {/* Video Preview */}

          <Grid size={{ xs: 12, md: 7 }}>
            <Card
              sx={{
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  backgroundColor: "#000",
                  aspectRatio: "9 / 16",
                  maxHeight: "700px",
                }}
              >
                {template.previewVideo ?
                  <video
                    src={`${API_URL}${template.previewVideo}`}
                    controls
                    playsInline
                    preload="metadata"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                : <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography color="white">
                      Preview video coming soon
                    </Typography>
                  </Box>
                }
              </Box>
            </Card>
          </Grid>

          {/* Product Information */}

          <Grid size={{ xs: 12, md: 5 }}>
            <Card
              sx={{
                borderRadius: 4,
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Stack spacing={2.5}>
                  <Box>
                    <Chip label={template.category} size="small" />
                  </Box>

                  <Typography variant="h3" fontWeight={800}>
                    {template.title}
                  </Typography>

                  <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {template.description}
                  </Typography>

                  <Typography variant="h4" fontWeight={800}>
                    ₹{template.price}
                  </Typography>

                  <Divider />

                  <Typography variant="h6" fontWeight={700}>
                    Template Details
                  </Typography>

                  {/* <Typography>
                    Software: <strong>{template.software}</strong>
                  </Typography> */}

                  {/* <Typography>
                    Version: <strong>{template.version}</strong>
                  </Typography> */}

                  <Typography>
                    Duration: <strong>{template.duration}</strong>
                  </Typography>

                  <Divider />

                  <Typography variant="h6" fontWeight={700}>
                    What You Get
                  </Typography>

                  {template.features?.map((feature) => (
                    <Typography key={feature} color="text.secondary">
                      ✓ {feature}
                    </Typography>
                  ))}

                  <Divider />

                  <TextField
                    label="Email Address"
                    type="email"
                    fullWidth
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                  />

                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={handleBuy}
                    sx={{
                      py: 1.6,
                      borderRadius: 2,
                      fontWeight: 800,
                    }}
                  >
                    BUY NOW — ₹{template.price}
                  </Button>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                  >
                    Secure checkout
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
