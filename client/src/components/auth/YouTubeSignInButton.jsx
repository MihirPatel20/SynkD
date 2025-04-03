import React, { useState, useEffect, useCallback } from "react";
import { Button, CircularProgress } from "@mui/material";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api";
import sessionManager from "../../services/auth/sessionManager";
import { useSnackbar } from "../../context/SnackbarContext";
import axios from "axios";

const YouTubeSignInButton = ({
  buttonText = "Sign in with YouTube",
  redirectPath = "/home",
  onLoginSuccess,
}) => {
  const navigate = useNavigate();
  const { setUser, setIsAuthenticated } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [deviceCode, setDeviceCode] = useState(null);
  const [popupWindow, setPopupWindow] = useState(null);

  const pollForTokens = useCallback(async (deviceCode) => {
    try {
      const response = await axios.post(
        "https://oauth2.googleapis.com/token",
        {
          client_id: import.meta.env.VITE_GOOGLE_TV_CLIENT_ID,
          client_secret: import.meta.env.VITE_GOOGLE_TV_CLIENT_SECRET,
          device_code: deviceCode,
          grant_type: "urn:ietf:params:oauth:grant-type:device_code",
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (response.data.access_token) {
        return response.data;
      }
    } catch (error) {
      console.error("Error polling for tokens:", error);
    }
    return null;
  }, []);

  const scopes = [
    "https://www.googleapis.com/auth/youtube",
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/youtube.readonly",
    "openid",
    "https://www.googleapis.com/auth/userinfo.email",
    // "https://www.googleapis.com/auth/yt-analytics.readonly",
    // "https://www.googleapis.com/auth/yt-analytics-monetary.readonly",
    // "https://www.googleapis.com/auth/youtubereporting",
  ];

  // Join the scopes with a space delimiter
  const scopeString = scopes.join(" ");

  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://oauth2.googleapis.com/device/code",
        {
          client_id: import.meta.env.VITE_GOOGLE_TV_CLIENT_ID,
          scope: scopeString,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const data = response.data;
      setDeviceCode(data.device_code);
      const loginUrl = `https://www.google.com/device?user_code=${data.user_code}`;

      const popupWidth = 600;
      const popupHeight = 600;
      const left = window.screen.width / 2 - popupWidth / 2;
      const top = window.screen.height / 2 - popupHeight / 2;
      const newPopup = window.open(
        loginUrl,
        "YouTubeAuth",
        `width=${popupWidth},height=${popupHeight},left=${left},top=${top},resizable=yes,scrollbars=yes`
      );
      setPopupWindow(newPopup);
    } catch (error) {
      console.error("Error during login:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const pollInterval = setInterval(async () => {
      if (deviceCode) {
        const tokens = await pollForTokens(deviceCode);
        if (tokens) {
          console.log("Tokens received:", tokens);

          // Close the popup window
          if (popupWindow && !popupWindow.closed) {
            popupWindow.close();
          }

          try {
            const response = await api.post("/auth/youtube/callback", {
              tokens,
            });
            console.log("Login successful:", response);

            // Initialize session
            sessionManager.initialize();
            sessionManager.logActivity("User logged in with Google");

            // Store token securely
            localStorage.setItem("access_token", response.data.token);

            // Update authentication state
            setIsAuthenticated(true);
            setUser(response.data.user);

            // Call optional callback if provided
            if (onLoginSuccess) {
              onLoginSuccess(response);
            }

            // Show success message using global snackbar
            showSnackbar("Successfully signed in with Google!", "success");

            // Redirect after a short delay
            setTimeout(() => {
              navigate(redirectPath, { replace: true });
            }, 1000);
          } catch (error) {
            console.error("Error syncing play history:", error);
          }

          // Clear the interval
          clearInterval(pollInterval);
        }
      }
    }, 5000); // Poll every 5 seconds

    return () => {
      clearInterval(pollInterval);
    };
  }, [deviceCode, pollForTokens, popupWindow, redirectPath]);

  return (
    <Button
      fullWidth
      variant="outlined"
      startIcon={
        loading ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          <YouTubeIcon />
        )
      }
      onClick={() => handleLogin()}
      disabled={loading}
      sx={{
        py: 1.5,
        mb: 2,
        borderColor: "#FF0000",
        color: "#FF0000",
        borderRadius: 2,
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          borderColor: "#FF0000",
          backgroundColor: "rgba(255, 0, 0, 0.04)",
          transform: "scale(1.02)",
        },
      }}
    >
      {loading ? "Signing in..." : buttonText}
    </Button>
  );
};

export default YouTubeSignInButton;
