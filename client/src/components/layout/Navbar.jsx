import React from "react";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import SearchBar from "./SearchBar";
import LogoutButton from "../auth/LogoutButton";

const Navbar = () => {
  const { isAuthenticated } = useAuth();

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            textDecoration: "none",
            color: "inherit",
            flexGrow: 0,
            mr: 2,
          }}
        >
          SynkD
        </Typography>
        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
          <SearchBar />
        </Box>

        <Button
          component={RouterLink}
          to="/playlists"
          color="inherit"
          sx={{ textTransform: "none" }}
        >
          Playlists
        </Button>

        {isAuthenticated && <LogoutButton />}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
