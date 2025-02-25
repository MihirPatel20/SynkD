import React from "react";
import { Navigate } from "react-router-dom";
import { Box, Typography, Container } from "@mui/material";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import sessionManager from "../services/auth/sessionManager";

const Login = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        console.log("Login successful", tokenResponse);
        
        // Store tokens securely
        localStorage.setItem("access_token", tokenResponse.access_token);
        
        // Initialize session
        sessionManager.initialize();
        sessionManager.logActivity("User logged in");
        
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error during login:", error);
      }
    },
    onError: (errorResponse) => {
      console.error("Login Failed:", errorResponse);
    },
    scope: "https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
    flow: 'implicit'
  });

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3
        }}
      >
        <Typography component="h1" variant="h4">
          Welcome to SynkD
        </Typography>
        <Typography variant="body1" textAlign="center">
          Sign in with your Google account to access your personalized music recommendations
        </Typography>
        <button
          onClick={() => login()}
          className="button"
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            cursor: 'pointer',
            backgroundColor: '#4285f4',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <img 
            src="https://www.google.com/favicon.ico" 
            alt="Google"
            style={{ width: '20px', height: '20px' }}
          />
          Sign in with Google
        </button>
      </Box>
    </Container>
  );
};

export default Login;
