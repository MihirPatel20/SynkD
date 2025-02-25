import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { Button, Snackbar, Alert, CircularProgress } from "@mui/material";
import GoogleIcon from '@mui/icons-material/Google';
import { useAuth } from "../context/AuthContext"; // Import your auth context
import sessionManager from "../services/auth/sessionManager"; // Import your session manager

const GoogleSignInButton = ({ 
  buttonText = "Sign in with Google",
  redirectPath = "/home", // Default redirect path
  onLoginSuccess, // Optional callback for additional actions
  onLoginFailure, // Optional callback for additional error handling
}) => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();
  const [status, setStatus] = useState({ loading: false, error: null });
  const [showAlert, setShowAlert] = useState(false);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setStatus({ loading: true, error: null });
        console.log("Login successful", tokenResponse);
        
        // Store tokens securely
        localStorage.setItem("access_token", tokenResponse.access_token);
        
        // Initialize session
        sessionManager.initialize();
        sessionManager.logActivity("User logged in with Google");
        
        // Update authentication state using the context function
        setIsAuthenticated(true);
        
        // Call optional callback if provided
        if (onLoginSuccess) {
          onLoginSuccess(tokenResponse);
        }
        
        // Show success message briefly before redirecting
        setStatus({ loading: false, error: null });
        setShowAlert(true);
        
        // Redirect after a short delay to allow the user to see the success message
        setTimeout(() => {
          navigate(redirectPath, { replace: true });
        }, 1000);
      } catch (error) {
        console.error("Error during login:", error);
        setStatus({ loading: false, error: "Login process failed" });
        setShowAlert(true);
        
        if (onLoginFailure) {
          onLoginFailure(error);
        }
      }
    },
    onError: (errorResponse) => {
      console.error("Login Failed:", errorResponse);
      setStatus({ loading: false, error: "Google authentication failed" });
      setShowAlert(true);
      
      if (onLoginFailure) {
        onLoginFailure(errorResponse);
      }
    },
    scope: "https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
    flow: 'implicit'
  });

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  return (
    <>
      <Button
        fullWidth
        variant="outlined"
        startIcon={status.loading ? <CircularProgress size={20} color="inherit" /> : <GoogleIcon />}
        onClick={() => login()}
        disabled={status.loading}
        sx={{ 
          py: 1.5,
          mb: 2,
          borderColor: '#4285f4',
          color: '#4285f4',
          borderRadius: 2,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            borderColor: '#4285f4',
            backgroundColor: 'rgba(66, 133, 244, 0.04)',
            transform: 'scale(1.02)',
          }
        }}
      >
        {status.loading ? "Signing in..." : buttonText}
      </Button>
      
      <Snackbar open={showAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert 
          onClose={handleCloseAlert} 
          severity={status.error ? "error" : "success"} 
          sx={{ width: '100%' }}
        >
          {status.error ? status.error : "Successfully signed in with Google!"}
        </Alert>
      </Snackbar>
    </>
  );
};

export default GoogleSignInButton;
