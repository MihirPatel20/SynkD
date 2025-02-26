import React from "react";
import { useLocation } from "react-router-dom";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/layout/Navbar";
import { SnackbarProvider } from "./context/SnackbarContext";
import { theme } from "./styles/theme";
import AppRoutes from "./routes";

const App = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <SnackbarProvider>
          <CssBaseline /> {!isLoginPage && <Navbar />}
          <Box component="main" sx={{ flexGrow: 1 }} py={isLoginPage ? 0 : 3}>
            <AppRoutes />
          </Box>
        </SnackbarProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
