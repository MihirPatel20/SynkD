import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import {
  Box,
  Typography,
  Container,
  Button,
  TextField,
  Divider,
  Paper,
  Checkbox,
  FormControlLabel,
  Link,
  Grid,
  IconButton,
  InputAdornment,
  Avatar,
  CssBaseline,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import GoogleSignInButton from "../../components/auth/GoogleSignInButton";
import sessionManager from "../../services/auth/sessionManager";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Reset errors
    setEmailError("");
    setPasswordError("");

    // Validate inputs
    let isValid = true;

    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    }

    if (isValid) {
      // Here you would typically handle credential login
      console.log("Form submitted with:", { email, password, rememberMe });

      // For demo purposes, simulate successful login
      localStorage.setItem("access_token", "demo_token");
      sessionManager.initialize();
      sessionManager.logActivity("User logged in with credentials");

      <Navigate to="/home" replace />;
    }
  };

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
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="%23000000" fill-opacity="0.03" fill-rule="evenodd"/%3E%3C/svg%3E")',
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
              backgroundImage: "url(https://source.unsplash.com/random?music)",
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
                backgroundColor: "rgba(0, 0, 0, 0.4)",
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
                sx={{ mt: 2 }}
              >
                Sign In
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Access your account to continue
              </Typography>
            </Box>

            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1, width: "100%" }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!emailError}
                helperText={emailError}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover fieldset": {
                      borderColor: "primary.main",
                    },
                  },
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!passwordError}
                helperText={passwordError}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover fieldset": {
                      borderColor: "primary.main",
                    },
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Grid container sx={{ mt: 1 }}>
                <Grid item xs>
                  <FormControlLabel
                    control={
                      <Checkbox
                        value="remember"
                        color="primary"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                    }
                    label="Remember me"
                  />
                </Grid>
                <Grid item sx={{ display: "flex", alignItems: "center" }}>
                  <Link
                    href="#"
                    variant="body2"
                    sx={{
                      color: "primary.main",
                      textDecoration: "none",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Forgot password?
                  </Link>
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  borderRadius: 2,
                  background:
                    "linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)",
                  boxShadow: "0 3px 5px 2px rgba(63, 81, 181, .3)",
                  transition: "transform 0.2s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.02)",
                  },
                }}
              >
                Sign In
              </Button>

              <Box sx={{ position: "relative", my: 3 }}>
                <Divider>
                  <Typography
                    variant="body2"
                    sx={{ px: 2, color: "text.secondary", fontWeight: 500 }}
                  >
                    OR
                  </Typography>
                </Divider>
              </Box>

              <GoogleSignInButton redirectPath="/home" />

              <Grid container justifyContent="center" sx={{ mt: 3 }}>
                <Grid item>
                  <Link
                    href="#"
                    variant="body2"
                    sx={{
                      color: "primary.main",
                      textDecoration: "none",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mt: 3,
                  justifyContent: "center",
                }}
              >
                <LockIcon
                  sx={{ fontSize: 16, mr: 1, color: "text.secondary" }}
                />
                <Typography variant="caption" color="text.secondary">
                  Secure login with 256-bit encryption
                </Typography>
              </Box>
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
