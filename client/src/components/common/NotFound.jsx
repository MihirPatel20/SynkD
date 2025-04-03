import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const redirect = setTimeout(() => {
      navigate('/');
    }, 3000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [navigate]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      p={3}
      mt={10}
    >
      <Typography variant="h4" gutterBottom>
        Sorry, this page isn't available.
      </Typography>
      <Typography variant="body1" paragraph>
        The link you followed may be broken, or the page may have been removed.
        <Typography
          variant="body2"
          component={Link}
          to="/"
          style={{ textDecoration: "none" }}
        >
          {" "}
          Go back to home
        </Typography>
      </Typography>
      <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
        Redirecting to homepage in {countdown} seconds...
      </Typography>
    </Box>
  );
};

export default NotFound;