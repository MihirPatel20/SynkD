// src/pages/Callback.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';

import { useAuth } from '../../context/AuthContext';
import { getTokens } from '../../services/api/googleApi';

const Callback = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (code) {
        try {
          const tokens = await getTokens(code);
          // Store tokens securely
          localStorage.setItem('access_token', tokens.access_token);
          if (tokens.refresh_token) {
            localStorage.setItem('refresh_token', tokens.refresh_token);
          }
          
          setIsAuthenticated(true);
          navigate('/');
        } catch (error) {
          console.error('Error during authentication:', error);
          navigate('/login');
        }
      } else {
        navigate('/login');
      }
    };

    handleCallback();
  }, [navigate, setIsAuthenticated]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <CircularProgress />
    </Box>
  );
};

export default Callback;
