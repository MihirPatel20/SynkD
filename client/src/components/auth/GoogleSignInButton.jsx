import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, CircularProgress } from "@mui/material";
import { useGoogleLogin } from "@react-oauth/google";
import GoogleIcon from "@mui/icons-material/Google";

import { useAuth } from "../../context/AuthContext";
import { useSnackbar } from "../../context/SnackbarContext";
import sessionManager from "../../services/auth/sessionManager";
import api from "../../api";

const GoogleSignInButton = ({
  buttonText = "Sign in with Google",
  redirectPath = "/home",
  onLoginSuccess,
  onLoginFailure,
}) => {
  const navigate = useNavigate();
  const { setUser, setIsAuthenticated } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const login = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        setLoading(true);

        // Exchange code for tokens via your backend
        const response = await api.post("/auth/google/callback", {
          code: codeResponse.code,
        });
        console.log("Login successful:", response.data);

        // Store token securely
        localStorage.setItem("access_token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // Initialize session
        sessionManager.initialize();
        sessionManager.logActivity("User logged in with Google");

        // Update authentication state
        setIsAuthenticated(true);
        setUser(response.data.user);

        // Call optional callback if provided
        if (onLoginSuccess) {
          onLoginSuccess(response.data);
        }

        // Show success message using global snackbar
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
    flow: "auth-code",
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
      onClick={() => login()}
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
