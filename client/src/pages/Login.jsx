// src/pages/Login.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { Box, Button, Typography, Container } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { signIn } from '../services/authService';

const Login = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  const handleLogin = async () => {
    try {
      await signIn();
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
        }}
      >
        <Typography component="h1" variant="h4">
          Welcome to Music App
        </Typography>
        <Typography variant="body1" textAlign="center">
          Please sign in with your Google account to continue
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={handleLogin}
          sx={{ mt: 2 }}
        >
          Sign in with Google
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
