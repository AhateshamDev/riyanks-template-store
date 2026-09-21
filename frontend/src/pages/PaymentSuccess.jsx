import { useState } from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";

import { useSearchParams } from "react-router-dom";

import { getDownloadUrl } from "../api/templateApi";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();

  const productId = searchParams.get("product");

  const token = searchParams.get("token");

  const [downloadStarted, setDownloadStarted] = useState(false);

  const downloadUrl =
    productId && token ? getDownloadUrl(productId, token) : null;

  // ==========================================
  // DOWNLOAD
  // ==========================================

  const handleDownload = () => {
    if (!downloadUrl) {
      alert("Invalid download link.");
      return;
    }

    try {
      const link = document.createElement("a");

      link.href = downloadUrl;

      link.setAttribute("download", "");

      link.style.display = "none";

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      // Stay on this page
      setDownloadStarted(true);
    } catch (error) {
      console.error("Download error:", error);

      alert("Unable to download the template.");
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        margin: 0,
        padding: 0,
        overflowX: "hidden",
        backgroundColor: "#f6f7f9",
      }}
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <Box
        sx={{
          width: "100%",
          backgroundColor: "#101216",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 1400,
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
          <Button
            href="/"
            startIcon={<ArrowBackRoundedIcon />}
            sx={{
              color: "#fff",
              textTransform: "none",
              fontWeight: 700,
              minWidth: 0,
              px: 1,

              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.06)",
              },
            }}
          >
            Templates
          </Button>

          <Stack direction="row" spacing={0.6} alignItems="center">
            <SecurityRoundedIcon
              sx={{
                fontSize: 16,
                color: "#9da3ae",
              }}
            />

            <Typography
              sx={{
                color: "#9da3ae",
                fontSize: {
                  xs: "0.7rem",
                  sm: "0.78rem",
                },
              }}
            >
              Secure purchase
            </Typography>
          </Stack>
        </Box>
      </Box>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <Box
        sx={{
          width: "100%",
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: {
            xs: 1.5,
            sm: 3,
            md: 5,
          },
          py: {
            xs: 4,
            sm: 6,
            md: 8,
          },
        }}
      >
        <Card
          sx={{
            width: "100%",
            maxWidth: 650,
            borderRadius: {
              xs: 3,
              sm: 4,
            },
            backgroundColor: "#fff",
            border: "1px solid #e5e7eb",
            boxShadow: "0 20px 60px rgba(15,23,42,0.08)",
            overflow: "hidden",

            animation: "cardEnter 0.55s ease-out",

            "@keyframes cardEnter": {
              from: {
                opacity: 0,
                transform: "translateY(20px)",
              },
              to: {
                opacity: 1,
                transform: "translateY(0)",
              },
            },
          }}
        >
          <CardContent
            sx={{
              px: {
                xs: 2.5,
                sm: 4,
                md: 5,
              },
              py: {
                xs: 4,
                sm: 5,
                md: 6,
              },
            }}
          >
            <Stack spacing={2.5} alignItems="center">
              {/* =================================================
                  SUCCESS ICON
              ================================================== */}

              <Box
                sx={{
                  width: {
                    xs: 82,
                    sm: 96,
                  },
                  height: {
                    xs: 82,
                    sm: 96,
                  },
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#f0f1f3",
                  border: "1px solid #e0e2e6",

                  animation: "iconPop 0.65s ease-out",

                  "@keyframes iconPop": {
                    "0%": {
                      opacity: 0,
                      transform: "scale(0.55)",
                    },

                    "70%": {
                      transform: "scale(1.08)",
                    },

                    "100%": {
                      opacity: 1,
                      transform: "scale(1)",
                    },
                  },
                }}
              >
                <CheckCircleRoundedIcon
                  sx={{
                    fontSize: {
                      xs: 50,
                      sm: 60,
                    },
                    color: "#111318",
                  }}
                />
              </Box>

              {/* =================================================
                  BADGE
              ================================================== */}

              <Stack
                direction="row"
                spacing={0.6}
                alignItems="center"
                sx={{
                  px: 1.5,
                  py: 0.7,
                  borderRadius: 99,
                  backgroundColor: "#f5f6f7",
                  border: "1px solid #e8e9ec",
                }}
              >
                <AutoAwesomeRoundedIcon
                  sx={{
                    fontSize: 15,
                    color: "#656b76",
                  }}
                />

                <Typography
                  sx={{
                    fontSize: "0.74rem",
                    fontWeight: 700,
                    color: "#656b76",
                  }}
                >
                  Purchase complete
                </Typography>
              </Stack>

              {/* =================================================
                  TITLE
              ================================================== */}

              <Typography
                component="h1"
                sx={{
                  textAlign: "center",
                  fontSize: {
                    xs: "2rem",
                    sm: "2.7rem",
                  },
                  lineHeight: 1.05,
                  letterSpacing: "-0.045em",
                  fontWeight: 900,
                  color: "#111318",
                }}
              >
                Payment successful
              </Typography>

              {/* =================================================
                  DESCRIPTION
              ================================================== */}

              <Typography
                sx={{
                  maxWidth: 520,
                  textAlign: "center",
                  color: "#747a85",
                  fontSize: {
                    xs: "0.93rem",
                    sm: "1rem",
                  },
                  lineHeight: 1.7,
                }}
              >
                Thank you for your purchase. Your template is ready to download.
              </Typography>

              <Divider
                sx={{
                  width: "100%",
                  my: 0.5,
                }}
              />

              {/* =================================================
                  DOWNLOAD AREA
              ================================================== */}

              {!downloadStarted ?
                <>
                  <Box
                    sx={{
                      width: "100%",
                      p: {
                        xs: 2,
                        sm: 2.5,
                      },
                      borderRadius: 2.5,
                      backgroundColor: "#f7f7f8",
                      border: "1px solid #e8e9ed",
                      textAlign: "left",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.7rem",
                        fontWeight: 750,
                        letterSpacing: "0.06em",
                        color: "#9297a1",
                        mb: 0.8,
                      }}
                    >
                      YOUR DOWNLOAD
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: "0.95rem",
                        fontWeight: 800,
                        color: "#202229",
                      }}
                    >
                      Your template is ready.
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.5,
                        color: "#858a94",
                        fontSize: "0.8rem",
                        lineHeight: 1.55,
                      }}
                    >
                      Click the button below to download your purchased
                      template.
                    </Typography>
                  </Box>

                  {downloadUrl ?
                    <Button
                      variant="contained"
                      fullWidth
                      size="large"
                      onClick={handleDownload}
                      startIcon={<DownloadRoundedIcon />}
                      sx={{
                        minHeight: 57,
                        borderRadius: 2.5,
                        textTransform: "none",
                        fontWeight: 850,
                        fontSize: "0.98rem",
                        boxShadow: "0 8px 25px rgba(15,23,42,0.14)",

                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 12px 32px rgba(15,23,42,0.2)",
                        },

                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      }}
                    >
                      Download Template
                    </Button>
                  : <Box
                      sx={{
                        width: "100%",
                        p: 2,
                        borderRadius: 2.5,
                        textAlign: "center",
                        backgroundColor: "#fff2f2",
                        border: "1px solid #f0d2d2",
                      }}
                    >
                      <Typography color="error" fontWeight={700}>
                        Invalid download link.
                      </Typography>
                    </Box>
                  }
                </>
              : <>
                  {/* ==========================================
                      AFTER DOWNLOAD
                  ========================================== */}

                  <Box
                    sx={{
                      width: "100%",
                      textAlign: "center",
                      py: 1,
                    }}
                  >
                    <DownloadRoundedIcon
                      sx={{
                        fontSize: 42,
                        color: "#111318",
                        mb: 1,
                      }}
                    />

                    <Typography
                      sx={{
                        fontSize: "1.15rem",
                        fontWeight: 800,
                        color: "#111318",
                      }}
                    >
                      Download started
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.8,
                        fontSize: "0.85rem",
                        lineHeight: 1.6,
                        color: "#777d88",
                      }}
                    >
                      Your template download should begin shortly.
                    </Typography>
                  </Box>

                  {/* ONLY HOME ACTION */}

                  <Button
                    href="/"
                    variant="contained"
                    fullWidth
                    size="large"
                    sx={{
                      minHeight: 56,
                      borderRadius: 2.5,
                      textTransform: "none",
                      fontWeight: 850,
                      fontSize: "0.98rem",
                      boxShadow: "0 8px 25px rgba(15,23,42,0.14)",

                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 12px 32px rgba(15,23,42,0.2)",
                      },

                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    }}
                  >
                    Explore Templates
                  </Button>
                </>
              }

              {/* =================================================
                  TRUST INFORMATION
              ================================================== */}

              {!downloadStarted && (
                <Stack
                  direction={{
                    xs: "column",
                    sm: "row",
                  }}
                  spacing={{
                    xs: 1,
                    sm: 3,
                  }}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Stack direction="row" spacing={0.6} alignItems="center">
                    <SecurityRoundedIcon
                      sx={{
                        fontSize: 15,
                        color: "#858b95",
                      }}
                    />

                    <Typography
                      sx={{
                        fontSize: "0.72rem",
                        color: "#858b95",
                      }}
                    >
                      Secure payment
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={0.6} alignItems="center">
                    <BoltRoundedIcon
                      sx={{
                        fontSize: 15,
                        color: "#858b95",
                      }}
                    />

                    <Typography
                      sx={{
                        fontSize: "0.72rem",
                        color: "#858b95",
                      }}
                    >
                      Instant download
                    </Typography>
                  </Stack>
                </Stack>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
