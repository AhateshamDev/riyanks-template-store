import { Box, Card, CardContent, Container, Typography } from "@mui/material";

export default function Contact() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f7f7f8",
        py: 8,
        px: 2,
      }}
    >
      <Container maxWidth="md">
        <Card
          sx={{
            borderRadius: 4,
            border: "1px solid #e5e7eb",
            boxShadow: "none",
          }}
        >
          <CardContent sx={{ p: 5 }}>
            <Typography variant="h3" fontWeight={900} gutterBottom>
              Contact Us
            </Typography>

            <Typography color="text.secondary" sx={{ mb: 4, lineHeight: 1.7 }}>
              Have a question about a template, purchase, payment, or download?
              Contact our support team.
            </Typography>

            <Typography fontWeight={700}>Riyanks Edit</Typography>

            <Typography sx={{ mt: 1 }} color="text.secondary">
              Email: support@riyanksedit.online
            </Typography>

            <Typography color="text.secondary">
              Phone: +91 7987212434
            </Typography>

            <Typography color="text.secondary">India</Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
