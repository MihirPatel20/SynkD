// src/pages/Login.jsx
import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { getAuthUrl } from '../services/authService';

const Login = () => {
  const handleLogin = () => {
    window.location.href = getAuthUrl();
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="80vh"
      gap={3}
    >
      <Typography variant="h4">
        Login to access your YouTube playlists
      </Typography>
      <Button 
        variant="contained" 
        color="error"
        onClick={handleLogin}
        size="large"
      >
        Sign in with Google
      </Button>
    </Box>
  );
};

export default Login;
