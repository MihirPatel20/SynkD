// src/components/auth/GoogleSignInButton.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, CircularProgress } from "@mui/material";
import { useGoogleLogin } from "@react-oauth/google";
import GoogleIcon from "@mui/icons-material/Google";

import { useAuth } from "../../context/AuthContext";
import { useSnackbar } from "../../context/SnackbarContext";
import { authAPI } from "../../services/api/api";

const GoogleSignInButton = ({
  buttonText = "Sign in with Google",
  redirectPath = "/home",
  onLoginSuccess,
  onLoginFailure,
}) => {
  const navigate = useNavigate();
  const { setUser, login } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);

        // Send the access token to your server
        const response = await authAPI.googleLogin(tokenResponse.access_token);

        // Store the JWT token from your server
        localStorage.setItem("access_token", response.data.token);

        // Update auth context
        login(response.data.token);
        setUser(response.data.user);

        // Call optional callback if provided
        if (onLoginSuccess) {
          onLoginSuccess(response.data);
        }

        // Show success message
        showSnackbar("Successfully signed in with Google!", "success");

        // Redirect after a short delay
        setTimeout(() => {
          navigate(redirectPath, { replace: true });
        }, 1000);
      } catch (error) {
        console.error("Error during login:", error);
        showSnackbar("Login process failed", "error");

        if (onLoginFailure) {
          onLoginFailure(error);
        }
      } finally {
        setLoading(false);
      }
    },
    onError: (errorResponse) => {
      console.error("Login Failed:", errorResponse);
      showSnackbar("Google authentication failed", "error");

      if (onLoginFailure) {
        onLoginFailure(errorResponse);
      }
    },
    scope:
      "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/yt-analytics.readonly",
    flow: "implicit",
  });

  return (
    <Button
      fullWidth
      variant="outlined"
      startIcon={
        loading ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          <GoogleIcon />
        )
      }
      onClick={() => googleLogin()}
      disabled={loading}
      sx={{
        py: 1.5,
        mb: 2,
        borderColor: "#4285f4",
        color: "#4285f4",
        borderRadius: 2,
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          borderColor: "#4285f4",
          backgroundColor: "rgba(66, 133, 244, 0.04)",
          transform: "scale(1.02)",
        },
      }}
    >
      {loading ? "Signing in..." : buttonText}
    </Button>
  );
};

export default GoogleSignInButton;
