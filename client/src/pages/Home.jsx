import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Home = () => {
  return (
    <Container maxWidth="xl">
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="h4" gutterBottom>
          Welcome to SynkD
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Search for your favorite music videos above
        </Typography>
      </Box>
    </Container>
  );
};

export default Home;