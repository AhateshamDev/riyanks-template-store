import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";

import { getTemplates } from "../api/templateApi";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

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

        setTemplates(result.products || []);
      } catch (error) {
        console.error(error);
        setError("Unable to connect to the template store.");
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
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#08090d",
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            animation: "fadeIn 0.5s ease-out",
            "@keyframes fadeIn": {
              from: {
                opacity: 0,
                transform: "translateY(10px)",
              },
              to: {
                opacity: 1,
                transform: "translateY(0)",
              },
            },
          }}
        >
          <CircularProgress size={34} sx={{ color: "#fff" }} />

          <Typography
            sx={{
              mt: 2,
              color: "#9ca3af",
              fontSize: "0.9rem",
            }}
          >
            Loading templates...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        overflowX: "hidden",
        background: "#f7f7f9",
      }}
    >
      {/* =====================================================
          HERO SECTION
      ====================================================== */}

      <Box
        sx={{
          position: "relative",
          width: "100%",
          overflow: "hidden",
          background:
            "radial-gradient(circle at 50% 0%, #292d38 0%, #111319 38%, #08090d 75%)",
          color: "#fff",
        }}
      >
        {/* Animated glow */}
        <Box
          sx={{
            position: "absolute",
            width: {
              xs: 220,
              sm: 320,
              md: 420,
            },
            height: {
              xs: 220,
              sm: 320,
              md: 420,
            },
            borderRadius: "50%",
            top: {
              xs: -100,
              md: -170,
            },
            left: "50%",
            transform: "translateX(-50%)",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0) 70%)",
            animation: "heroGlow 6s ease-in-out infinite",
            pointerEvents: "none",

            "@keyframes heroGlow": {
              "0%, 100%": {
                transform: "translateX(-50%) scale(1)",
                opacity: 0.7,
              },
              "50%": {
                transform: "translateX(-50%) scale(1.15)",
                opacity: 1,
              },
            },
          }}
        />

        {/* Floating decorative dots */}
        <Box
          sx={{
            position: "absolute",
            top: "18%",
            left: {
              xs: "8%",
              md: "12%",
            },
            width: 5,
            height: 5,
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.55)",
            animation: "floatDot 4s ease-in-out infinite",
            "@keyframes floatDot": {
              "0%, 100%": {
                transform: "translateY(0)",
                opacity: 0.35,
              },
              "50%": {
                transform: "translateY(-16px)",
                opacity: 1,
              },
            },
          }}
        />

        <Box
          sx={{
            position: "absolute",
            top: "35%",
            right: {
              xs: "8%",
              md: "15%",
            },
            width: 4,
            height: 4,
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.4)",
            animation: "floatDotReverse 5s ease-in-out infinite",

            "@keyframes floatDotReverse": {
              "0%, 100%": {
                transform: "translateY(0)",
                opacity: 0.3,
              },
              "50%": {
                transform: "translateY(14px)",
                opacity: 0.9,
              },
            },
          }}
        />

        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            px: {
              xs: 2,
              sm: 3,
              md: 5,
            },
            pt: {
              xs: 5,
              sm: 7,
              md: 10,
            },
            pb: {
              xs: 7,
              sm: 9,
              md: 12,
            },
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 1100,
              mx: "auto",
              textAlign: "center",
            }}
          >
            {/* Badge */}

            <Chip
              icon={<AutoAwesomeRoundedIcon />}
              label="Premium Creator Templates"
              sx={{
                height: 38,
                px: 1,
                color: "#fff",
                backgroundColor: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.13)",
                backdropFilter: "blur(10px)",
                animation: "badgeIn 0.7s ease-out",

                "& .MuiChip-label": {
                  px: 1.2,
                  fontWeight: 600,
                },

                "& .MuiChip-icon": {
                  color: "#fff",
                },

                "@keyframes badgeIn": {
                  from: {
                    opacity: 0,
                    transform: "translateY(12px)",
                  },
                  to: {
                    opacity: 1,
                    transform: "translateY(0)",
                  },
                },
              }}
            />

            {/* Heading */}

            <Typography
              component="h1"
              sx={{
                mt: 3,
                fontSize: {
                  xs: "2.65rem",
                  sm: "3.8rem",
                  md: "5.2rem",
                },
                lineHeight: {
                  xs: 1.03,
                  sm: 1,
                },
                fontWeight: 900,
                letterSpacing: "-0.055em",
                color: "#fff",
                maxWidth: 900,
                mx: "auto",
                animation: "heroText 0.8s ease-out",

                "@keyframes heroText": {
                  from: {
                    opacity: 0,
                    transform: "translateY(18px)",
                  },
                  to: {
                    opacity: 1,
                    transform: "translateY(0)",
                  },
                },
              }}
            >
              Turn your creativity
              <br />
              into{" "}
              <Box
                component="span"
                sx={{
                  background:
                    "linear-gradient(90deg, #ffffff 0%, #aeb5c3 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                scroll-stopping videos.
              </Box>
            </Typography>

            {/* Description */}

            <Typography
              sx={{
                mt: 3,
                mx: "auto",
                maxWidth: 680,
                color: "#aeb4c0",
                fontSize: {
                  xs: "0.98rem",
                  sm: "1.08rem",
                  md: "1.18rem",
                },
                lineHeight: 1.75,
                animation: "heroDescription 0.9s ease-out",

                "@keyframes heroDescription": {
                  from: {
                    opacity: 0,
                    transform: "translateY(14px)",
                  },
                  to: {
                    opacity: 1,
                    transform: "translateY(0)",
                  },
                },
              }}
            >
              Professional editable templates for creators who want better
              reels, faster edits and more creative freedom.
            </Typography>

            {/* Buttons */}

            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={1.5}
              justifyContent="center"
              sx={{
                mt: 4,
                maxWidth: {
                  xs: 360,
                  sm: "none",
                },
                mx: "auto",
              }}
            >
              <Button
                href="#templates"
                variant="contained"
                endIcon={<ArrowForwardRoundedIcon />}
                sx={{
                  width: {
                    xs: "100%",
                    sm: "auto",
                  },
                  minHeight: 54,
                  px: 3,
                  borderRadius: 2.5,
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 800,
                  boxShadow: "0 10px 35px rgba(0,0,0,0.25)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",

                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 15px 42px rgba(0,0,0,0.35)",
                  },
                }}
              >
                Explore Templates
              </Button>

              <Button
                href="#templates"
                variant="outlined"
                sx={{
                  width: {
                    xs: "100%",
                    sm: "auto",
                  },
                  minHeight: 54,
                  px: 3,
                  borderRadius: 2.5,
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "#fff",
                  borderColor: "rgba(255,255,255,0.16)",

                  "&:hover": {
                    borderColor: "rgba(255,255,255,0.35)",
                    backgroundColor: "rgba(255,255,255,0.04)",
                  },
                }}
              >
                Browse Collection
              </Button>
            </Stack>

            {/* Creator stats */}

            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={{
                xs: 1.5,
                sm: 4,
              }}
              justifyContent="center"
              alignItems="center"
              sx={{
                mt: 5,
              }}
            >
              <Stack direction="row" spacing={0.8} alignItems="center">
                <BoltRoundedIcon
                  sx={{
                    fontSize: 18,
                    color: "#d7dbe3",
                  }}
                />

                <Typography
                  sx={{
                    fontSize: "0.85rem",
                    color: "#9299a7",
                  }}
                >
                  Easy to edit
                </Typography>
              </Stack>

              <Stack direction="row" spacing={0.8} alignItems="center">
                <AutoAwesomeRoundedIcon
                  sx={{
                    fontSize: 17,
                    color: "#d7dbe3",
                  }}
                />

                <Typography
                  sx={{
                    fontSize: "0.85rem",
                    color: "#9299a7",
                  }}
                >
                  Creator focused
                </Typography>
              </Stack>

              <Stack direction="row" spacing={0.8} alignItems="center">
                <PlayArrowRoundedIcon
                  sx={{
                    fontSize: 18,
                    color: "#d7dbe3",
                  }}
                />

                <Typography
                  sx={{
                    fontSize: "0.85rem",
                    color: "#9299a7",
                  }}
                >
                  Ready to customize
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Box>
      </Box>

      {/* =====================================================
          TEMPLATES SECTION
      ====================================================== */}

      <Box
        id="templates"
        sx={{
          width: "100%",
          backgroundColor: "#f7f7f9",
          py: {
            xs: 6,
            sm: 8,
            md: 10,
          },
          px: {
            xs: 2,
            sm: 3,
            md: 5,
          },
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 1400,
            mx: "auto",
          }}
        >
          {/* Section heading */}

          <Box
            sx={{
              display: "flex",
              flexDirection: {
                xs: "column",
                sm: "row",
              },
              alignItems: {
                xs: "flex-start",
                sm: "flex-end",
              },
              justifyContent: "space-between",
              gap: 2,
              mb: {
                xs: 3,
                md: 5,
              },
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: {
                    xs: "1.8rem",
                    sm: "2.2rem",
                    md: "2.6rem",
                  },
                  lineHeight: 1.1,
                  fontWeight: 900,
                  letterSpacing: "-0.035em",
                  color: "#111318",
                }}
              >
                Featured Templates
              </Typography>

              <Typography
                sx={{
                  mt: 1,
                  color: "#727885",
                  fontSize: {
                    xs: "0.92rem",
                    sm: "1rem",
                  },
                  lineHeight: 1.6,
                }}
              >
                Start with a strong idea and make it your own.
              </Typography>
            </Box>

            <Typography
              sx={{
                color: "#969ba6",
                fontSize: "0.85rem",
              }}
            >
              {templates.length}{" "}
              {templates.length === 1 ? "template" : "templates"}
            </Typography>
          </Box>

          {/* Error */}

          {error && (
            <Card
              sx={{
                mb: 4,
                borderRadius: 3,
                boxShadow: "none",
                border: "1px solid #ead1d1",
                backgroundColor: "#fff",
              }}
            >
              <CardContent>
                <Typography color="error">{error}</Typography>
              </CardContent>
            </Card>
          )}

          {/* Empty state */}

          {!error && templates.length === 0 && (
            <Card
              sx={{
                borderRadius: 4,
                border: "1px solid #e8e9ed",
                boxShadow: "0 10px 30px rgba(15,23,42,0.04)",
              }}
            >
              <CardContent
                sx={{
                  py: 8,
                  textAlign: "center",
                }}
              >
                <Typography variant="h6" fontWeight={800}>
                  No templates available
                </Typography>

                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  New creative templates will appear here soon.
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* Product grid */}

          <Grid
            container
            spacing={{
              xs: 2,
              sm: 2.5,
              md: 3,
            }}
          >
            {templates.map((template, index) => (
              <Grid
                key={template.id}
                size={{
                  xs: 12,
                  sm: 6,
                  lg: 4,
                }}
              >
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 4,
                    overflow: "hidden",
                    border: "1px solid #e8e9ed",
                    backgroundColor: "#fff",
                    boxShadow: "0 8px 30px rgba(15,23,42,0.055)",
                    animation: `cardEnter 0.6s ease-out ${index * 80}ms both`,
                    transition: "transform 0.25s ease, box-shadow 0.25s ease",

                    "&:hover": {
                      transform: "translateY(-7px)",
                      boxShadow: "0 18px 45px rgba(15,23,42,0.11)",
                    },

                    "@keyframes cardEnter": {
                      from: {
                        opacity: 0,
                        transform: "translateY(18px)",
                      },
                      to: {
                        opacity: 1,
                        transform: "translateY(0)",
                      },
                    },
                  }}
                >
                  {/* Preview */}

                  <Box
                    sx={{
                      position: "relative",
                      aspectRatio: "16 / 10",
                      overflow: "hidden",
                      background:
                        "linear-gradient(135deg, #1a1d24 0%, #0b0c10 100%)",
                    }}
                  >
                    {template.thumbnail ?
                      <Box
                        component="img"
                        src={`${BACKEND_URL}${template.thumbnail}`}
                        alt={template.title}
                        loading="lazy"
                        sx={{
                          width: "100%",
                          height: "100%",
                          display: "block",
                          objectFit: "cover",
                          transition: "transform 0.45s ease",

                          " .MuiCard-root:hover &": {
                            transform: "scale(1.04)",
                          },
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
                        <Box
                          sx={{
                            width: 62,
                            height: 62,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "rgba(255,255,255,0.08)",
                            border: "1px solid rgba(255,255,255,0.14)",
                            animation: "playPulse 3s ease-in-out infinite",

                            "@keyframes playPulse": {
                              "0%, 100%": {
                                transform: "scale(1)",
                              },
                              "50%": {
                                transform: "scale(1.07)",
                              },
                            },
                          }}
                        >
                          <PlayArrowRoundedIcon
                            sx={{
                              color: "#fff",
                              fontSize: 34,
                              ml: 0.3,
                            }}
                          />
                        </Box>
                      </Box>
                    }

                    {/* Overlay */}

                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(180deg, rgba(0,0,0,0.02) 30%, rgba(0,0,0,0.55) 100%)",
                      }}
                    />

                    {/* Category */}

                    <Chip
                      label={template.category || "Template"}
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 14,
                        left: 14,
                        color: "#fff",
                        backgroundColor: "rgba(0,0,0,0.42)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(255,255,255,0.13)",
                        fontWeight: 700,
                      }}
                    />

                    {/* Price */}

                    <Box
                      sx={{
                        position: "absolute",
                        right: 14,
                        bottom: 14,
                        px: 1.5,
                        py: 0.75,
                        borderRadius: 2,
                        backgroundColor: "#fff",
                        color: "#111318",
                        fontWeight: 900,
                        fontSize: "0.95rem",
                        boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
                      }}
                    >
                      ₹{template.price}
                    </Box>
                  </Box>

                  {/* Details */}

                  <CardContent
                    sx={{
                      p: {
                        xs: 2.25,
                        sm: 2.5,
                      },
                      display: "flex",
                      flexDirection: "column",
                      flexGrow: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#111318",
                        fontWeight: 850,
                        fontSize: {
                          xs: "1.08rem",
                          sm: "1.18rem",
                        },
                        lineHeight: 1.3,
                      }}
                    >
                      {template.title}
                    </Typography>

                    <Typography
                      sx={{
                        mt: 1,
                        color: "#727885",
                        lineHeight: 1.6,
                        fontSize: "0.92rem",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {template.description}
                    </Typography>

                    <Stack
                      direction="row"
                      spacing={1}
                      flexWrap="wrap"
                      useFlexGap
                      sx={{
                        mt: 2,
                      }}
                    >
                      {template.software && (
                        <Chip
                          label={template.software}
                          size="small"
                          variant="outlined"
                          sx={{
                            borderRadius: 1.5,
                            fontSize: "0.72rem",
                            maxWidth: "100%",
                          }}
                        />
                      )}

                      {template.version && (
                        <Chip
                          label={template.version}
                          size="small"
                          variant="outlined"
                          sx={{
                            borderRadius: 1.5,
                            fontSize: "0.72rem",
                          }}
                        />
                      )}
                    </Stack>

                    <Box
                      sx={{
                        mt: "auto",
                        pt: 2.5,
                      }}
                    >
                      <Button
                        href={`/template/${template.slug}`}
                        variant="contained"
                        fullWidth
                        endIcon={<ArrowForwardRoundedIcon />}
                        sx={{
                          minHeight: 50,
                          borderRadius: 2.5,
                          textTransform: "none",
                          fontWeight: 800,
                          transition: "transform 0.2s ease",

                          "&:hover": {
                            transform: "translateY(-2px)",
                          },
                        }}
                      >
                        View Template
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* =====================================================
          MOBILE BOTTOM CTA
      ====================================================== */}

      <Box
        sx={{
          display: {
            xs: "block",
            md: "none",
          },
          position: "fixed",
          left: 12,
          right: 12,
          bottom: 12,
          zIndex: 100,
        }}
      >
        <Button
          href="#templates"
          fullWidth
          variant="contained"
          endIcon={<ArrowForwardRoundedIcon />}
          sx={{
            minHeight: 54,
            borderRadius: 3,
            textTransform: "none",
            fontSize: "0.95rem",
            fontWeight: 800,
            boxShadow: "0 12px 35px rgba(0,0,0,0.2)",
            backdropFilter: "blur(10px)",
          }}
        >
          Explore Templates
        </Button>
      </Box>

      {/* Mobile bottom safe space */}

      <Box
        sx={{
          display: {
            xs: "block",
            md: "none",
          },
          height: 85,
          backgroundColor: "#f7f7f9",
        }}
      />
    </Box>
  );
}
