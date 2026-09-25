import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

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
  const [paymentLoading, setPaymentLoading] = useState(false);

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

  // ==========================================
  // RAZORPAY
  // ==========================================

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
      if (!email.trim()) {
        alert("Please enter your email address.");
        return;
      }

      setPaymentLoading(true);

      const razorpayLoaded = await loadRazorpay();

      if (!razorpayLoaded) {
        alert("Unable to load Razorpay.");
        return;
      }

      const orderResponse = await createPaymentOrder(template.id, email.trim());

      if (!orderResponse.success) {
        alert(orderResponse.message);
        return;
      }

      const options = {
        key: orderResponse.keyId,

        amount: orderResponse.order.amount,

        currency: orderResponse.order.currency,

        name: "Riyanks Edit",

        description: template.title,

        order_id: orderResponse.order.id,

        prefill: {
          email: email.trim(),
        },

        notes: {
          productId: template.id,
        },

        theme: {
          color: "#111318",
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

            localStorage.setItem("downloadToken", verification.downloadToken);

            localStorage.setItem("downloadProductId", verification.productId);

            window.location.href = `/payment-success?product=${verification.productId}&token=${verification.downloadToken}`;
          } catch (error) {
            console.error(error);
            alert("Payment verification failed.");
          }
        },

        modal: {
          ondismiss: function () {
            setPaymentLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.open();
    } catch (error) {
      console.error(error);
      alert("Unable to start payment.");
    } finally {
      setPaymentLoading(false);
    }
  }

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f7f7f8",
        }}
      >
        <Stack spacing={1.5} alignItems="center">
          <CircularProgress size={32} />

          <Typography
            sx={{
              fontSize: "0.85rem",
              color: "#777d88",
            }}
          >
            Loading template...
          </Typography>
        </Stack>
      </Box>
    );
  }

  // ==========================================
  // NOT FOUND
  // ==========================================

  if (!template) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f7f7f8",
          px: 2,
        }}
      >
        <Card
          sx={{
            width: "100%",
            maxWidth: 500,
            borderRadius: 4,
            border: "1px solid #e7e8eb",
            boxShadow: "none",
          }}
        >
          <CardContent
            sx={{
              p: 5,
              textAlign: "center",
            }}
          >
            <Typography variant="h5" fontWeight={800}>
              Template not found
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 1,
                lineHeight: 1.6,
              }}
            >
              This template is no longer available.
            </Typography>

            <Button
              href="/"
              startIcon={<ArrowBackRoundedIcon />}
              sx={{
                mt: 3,
                textTransform: "none",
                fontWeight: 700,
              }}
            >
              Back to templates
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        overflowX: "hidden",
        backgroundColor: "#f7f7f8",
      }}
    >
      {/* ==========================================
          TOP BAR
      ========================================== */}

      <Box
        sx={{
          width: "100%",
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #ececef",
          pt: {
            xs: 9,
            sm: 9,
            md: 1.5,
          },
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 1500,
            mx: "auto",
            px: {
              xs: 1.5,
              sm: 3,
              md: 5,
            },
            py: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* <Stack direction="row" spacing={0.6} alignItems="center">
            <SecurityRoundedIcon
              sx={{
                fontSize: 16,
                color: "#777d88",
              }}
            />

            <Typography
              sx={{
                fontSize: "0.76rem",
                color: "#777d88",
              }}
            >
              Secure checkout
            </Typography>
          </Stack> */}
        </Box>
      </Box>

      {/* ==========================================
          MAIN
      ========================================== */}

      <Box
        sx={{
          width: "100%",
          px: {
            xs: 1.5,
            sm: 3,
            md: 5,
          },
          py: {
            xs: 1.5,
            sm: 3,
            md: 5,
          },
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 1500,
            mx: "auto",

            // FLEX instead of GRID
            display: "flex",
            flexDirection: {
              xs: "column",
              md: "row",
            },
            alignItems: "flex-start",
            gap: {
              xs: 2,
              sm: 3,
              md: 4,
            },
          }}
        >
          {/* ========================================
              LEFT - VIDEO
          ======================================== */}

          <Box
            sx={{
              flex: {
                xs: "1 1 auto",
                md: "1 1 64%",
              },
              minWidth: 0,
              width: "100%",
            }}
          >
            <Card
              sx={{
                width: "100%",
                borderRadius: {
                  xs: 2,
                  sm: 3.5,
                },
                overflow: "hidden",
                backgroundColor: "#050505",
                border: "1px solid #171717",
                boxShadow: "0 14px 45px rgba(0,0,0,0.12)",
              }}
            >
              {/* HORIZONTAL VIDEO */}

              <Box
                sx={{
                  width: "100%",
                  aspectRatio: "16 / 9",
                  backgroundColor: "#000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                {template.previewVideo ?
                  <video
                    src={
                      template.previewVideo?.startsWith("http") ?
                        template.previewVideo
                      : `${API_URL}${template.previewVideo}`
                    }
                    controls
                    playsInline
                    preload="metadata"
                    controlsList="nodownload"
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "block",
                      objectFit: "contain",
                      backgroundColor: "#000",
                    }}
                  />
                : <Stack spacing={1} alignItems="center">
                    <PlayArrowRoundedIcon
                      sx={{
                        color: "#fff",
                        fontSize: 44,
                      }}
                    />

                    <Typography
                      sx={{
                        color: "#9297a1",
                        fontSize: "0.85rem",
                      }}
                    >
                      Preview coming soon
                    </Typography>
                  </Stack>
                }
              </Box>
            </Card>

            {/* Video information */}

            <Stack
              direction="row"
              spacing={2}
              flexWrap="wrap"
              useFlexGap
              sx={{
                mt: {
                  xs: 1,
                  sm: 1.5,
                },
                px: 0.25,
              }}
            >
              <Stack direction="row" spacing={0.6} alignItems="center">
                <PlayArrowRoundedIcon
                  sx={{
                    fontSize: 16,
                    color: "#777d88",
                  }}
                />

                <Typography
                  sx={{
                    fontSize: "0.76rem",
                    color: "#777d88",
                  }}
                >
                  Preview video
                </Typography>
              </Stack>

              <Stack direction="row" spacing={0.6} alignItems="center">
                <BoltRoundedIcon
                  sx={{
                    fontSize: 16,
                    color: "#777d88",
                  }}
                />

                <Typography
                  sx={{
                    fontSize: "0.76rem",
                    color: "#777d88",
                  }}
                >
                  Instant download
                </Typography>
              </Stack>
            </Stack>
          </Box>

          {/* ========================================
              RIGHT - PRODUCT
          ======================================== */}

          <Box
            sx={{
              flex: {
                xs: "1 1 auto",
                md: "0 1 430px",
              },
              width: "100%",
              minWidth: 0,
            }}
          >
            <Card
              sx={{
                width: "100%",
                borderRadius: {
                  xs: 2,
                  sm: 3.5,
                },
                border: "1px solid #e7e8ec",
                boxShadow: "0 10px 35px rgba(15,23,42,0.06)",
              }}
            >
              <CardContent
                sx={{
                  p: {
                    xs: 2,
                    sm: 3.5,
                  },
                }}
              >
                <Stack spacing={2.4}>
                  {/* Category */}

                  <Box>
                    <Chip
                      icon={<AutoAwesomeRoundedIcon />}
                      label={template.category || "Premium Template"}
                      size="small"
                      sx={{
                        borderRadius: 2,
                        fontWeight: 700,
                      }}
                    />
                  </Box>

                  {/* Title */}

                  <Typography
                    component="h1"
                    sx={{
                      fontSize: {
                        xs: "1.75rem",
                        sm: "2.35rem",
                        md: "2.75rem",
                      },
                      lineHeight: 1.08,
                      letterSpacing: "-0.045em",
                      fontWeight: 900,
                      color: "#111318",
                    }}
                  >
                    {template.title}
                  </Typography>

                  {/* Description */}

                  <Typography
                    sx={{
                      fontSize: "0.95rem",
                      lineHeight: 1.7,
                      color: "#727782",
                    }}
                  >
                    {template.description}
                  </Typography>

                  {/* Price */}

                  <Box>
                    <Typography
                      sx={{
                        fontSize: {
                          xs: "1.85rem",
                          sm: "2.25rem",
                        },
                        lineHeight: 1,
                        fontWeight: 900,
                        letterSpacing: "-0.04em",
                        color: "#111318",
                      }}
                    >
                      ₹{template.price}
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.8,
                        fontSize: "0.76rem",
                        color: "#9297a0",
                      }}
                    >
                      One-time purchase
                    </Typography>
                  </Box>

                  <Divider />

                  {/* Details */}

                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 800,
                        color: "#111318",
                        mb: 1.3,
                      }}
                    >
                      Template details
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                      }}
                    >
                      {template.software && (
                        <Box
                          sx={{
                            flex: {
                              xs: "1 1 100%",
                              sm: "1 1 145px",
                            },
                            p: 1.4,
                            borderRadius: 2,
                            backgroundColor: "#f5f6f8",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "0.7rem",
                              color: "#8a8f98",
                            }}
                          >
                            Software
                          </Typography>

                          <Typography
                            sx={{
                              mt: 0.35,
                              fontSize: "0.84rem",
                              fontWeight: 750,
                              color: "#24262b",
                            }}
                          >
                            {template.software}
                          </Typography>
                        </Box>
                      )}

                      {template.version && (
                        <Box
                          sx={{
                            flex: {
                              xs: "1 1 100%",
                              sm: "1 1 145px",
                            },
                            p: 1.4,
                            borderRadius: 2,
                            backgroundColor: "#f5f6f8",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "0.7rem",
                              color: "#8a8f98",
                            }}
                          >
                            Version
                          </Typography>

                          <Typography
                            sx={{
                              mt: 0.35,
                              fontSize: "0.84rem",
                              fontWeight: 750,
                              color: "#24262b",
                            }}
                          >
                            {template.version}
                          </Typography>
                        </Box>
                      )}

                      {template.duration && (
                        <Box
                          sx={{
                            flex: {
                              xs: "1 1 100%",
                              sm: "1 1 145px",
                            },
                            p: 1.4,
                            borderRadius: 2,
                            backgroundColor: "#f5f6f8",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "0.7rem",
                              color: "#8a8f98",
                            }}
                          >
                            Duration
                          </Typography>

                          <Typography
                            sx={{
                              mt: 0.35,
                              fontSize: "0.84rem",
                              fontWeight: 750,
                              color: "#24262b",
                            }}
                          >
                            {template.duration}
                          </Typography>
                        </Box>
                      )}

                      <Box
                        sx={{
                          flex: {
                            xs: "1 1 100%",
                            sm: "1 1 145px",
                          },
                          p: 1.4,
                          borderRadius: 2,
                          backgroundColor: "#f5f6f8",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "0.7rem",
                            color: "#8a8f98",
                          }}
                        >
                          Delivery
                        </Typography>

                        <Typography
                          sx={{
                            mt: 0.35,
                            fontSize: "0.84rem",
                            fontWeight: 750,
                            color: "#24262b",
                          }}
                        >
                          Instant
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Divider />

                  {/* Features */}

                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 800,
                        color: "#111318",
                        mb: 1.25,
                      }}
                    >
                      What's included
                    </Typography>

                    <Stack spacing={0.9}>
                      {template.features?.map((feature) => (
                        <Stack
                          key={feature}
                          direction="row"
                          spacing={1}
                          alignItems="flex-start"
                        >
                          <Box
                            sx={{
                              width: 19,
                              height: 19,
                              mt: "2px",
                              flexShrink: 0,
                              borderRadius: "50%",
                              backgroundColor: "#111318",
                              color: "#ffffff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "0.64rem",
                              fontWeight: 900,
                            }}
                          >
                            ✓
                          </Box>

                          <Typography
                            sx={{
                              fontSize: "0.88rem",
                              color: "#6c727d",
                              lineHeight: 1.5,
                            }}
                          >
                            {feature}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </Box>

                  <Divider />

                  {/* Email */}

                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 800,
                        color: "#111318",
                        mb: 1,
                      }}
                    >
                      Enter your email
                    </Typography>

                    <TextField
                      fullWidth
                      type="email"
                      label="Email address"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2.5,
                          backgroundColor: "#fff",
                        },
                      }}
                    />
                  </Box>

                  {/* Buy */}

                  <Button
                    fullWidth
                    size="large"
                    variant="contained"
                    disabled={paymentLoading}
                    onClick={handleBuy}
                    startIcon={<DownloadRoundedIcon />}
                    sx={{
                      minHeight: 54,
                      borderRadius: 2.5,
                      textTransform: "none",
                      fontSize: {
                        xs: "0.9rem",
                        sm: "0.98rem",
                      },
                      fontWeight: 850,
                      boxShadow: "0 8px 25px rgba(15,23,42,0.14)",

                      "&:hover": {
                        boxShadow: "0 12px 30px rgba(15,23,42,0.2)",
                      },
                    }}
                  >
                    {paymentLoading ?
                      "Opening Checkout..."
                    : `Buy Template — ₹${template.price}`}
                  </Button>

                  {/* Trust */}

                  <Stack
                    direction="row"
                    justifyContent="center"
                    spacing={2}
                    flexWrap="wrap"
                    useFlexGap
                  >
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <SecurityRoundedIcon
                        sx={{
                          fontSize: 15,
                          color: "#777d88",
                        }}
                      />

                      <Typography
                        sx={{
                          fontSize: "0.72rem",
                          color: "#777d88",
                        }}
                      >
                        Secure payment
                      </Typography>
                    </Stack>

                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <BoltRoundedIcon
                        sx={{
                          fontSize: 15,
                          color: "#777d88",
                        }}
                      />

                      <Typography
                        sx={{
                          fontSize: "0.72rem",
                          color: "#777d88",
                        }}
                      >
                        Instant access
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
