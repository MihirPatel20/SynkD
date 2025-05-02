import React from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  Avatar,
  CssBaseline,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockIcon from "@mui/icons-material/Lock";
import YouTubeSignInButton from "../../components/auth/YouTubeSignInButton";

const Login = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundImage: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: "none",
        },
      }}
    >
      <Container
        component="main"
        maxWidth="md"
        sx={{ py: 8, flex: 1, display: "flex", alignItems: "center" }}
      >
        <CssBaseline />
        <Grid
          container
          component={Paper}
          elevation={10}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              boxShadow: "0 15px 50px rgba(0,0,0,0.12)",
            },
          }}
        >
          <Grid
            item
            xs={false}
            sm={5}
            md={6}
            sx={{
              backgroundImage: 'url("/11423698.jpg")',
              backgroundRepeat: "no-repeat",
              backgroundColor: (t) =>
                t.palette.mode === "light"
                  ? t.palette.grey[50]
                  : t.palette.grey[900],
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.1)",
                zIndex: 1,
              },
            }}
          >
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                p: 4,
                zIndex: 2,
                color: "white",
              }}
            >
              <Typography
                variant="h4"
                component="h2"
                fontWeight="bold"
                gutterBottom
              >
                Welcome to SynkD
              </Typography>
              <Typography variant="body1">
                Your personalized music experience awaits
              </Typography>
            </Box>
          </Grid>

          <Grid
            item
            xs={12}
            sm={7}
            md={6}
            sx={{
              minHeight: "60vh",
              p: 4,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              backgroundColor: "#ffffff",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Avatar
                sx={{ m: 1, bgcolor: "primary.main", width: 56, height: 56 }}
              >
                <LockOutlinedIcon sx={{ fontSize: 32 }} />
              </Avatar>
              <Typography
                component="h1"
                variant="h4"
                fontWeight="bold"
                sx={{ my: 2 }}
              >
                Sign In
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 4 }}
                align="center"
              >
                Connect with YouTube and turn your playlist into the perfect
                mix!
              </Typography>

              <YouTubeSignInButton redirectPath="/home" />
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mt: 3,
                justifyContent: "center",
              }}
            >
              <LockIcon sx={{ fontSize: 16, mr: 1, color: "text.secondary" }} />
              <Typography variant="caption" color="text.secondary">
                Secure login with 256-bit encryption
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Box component="footer" sx={{ py: 3, px: 2, mt: "auto" }}>
        <Typography variant="body2" color="text.secondary" align="center">
          {"Copyright © SynkD "}
          {new Date().getFullYear()}
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
