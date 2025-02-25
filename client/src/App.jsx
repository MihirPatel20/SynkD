import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/layout/Navbar";
import { SnackbarProvider } from "./context/SnackbarContext";
import { theme } from "./styles/theme";
import Login from "./pages/auth/Login";
import Callback from "./pages/auth/Callback";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Home from "./pages/home/Home";
import Playlists from "./pages/playlists/Playlists";
import PlaylistDetail from "./pages/playlists/PlaylistDetail";
import Profile from "./pages/profile/Profile";
import Search from "./pages/search/Search";
import Watch from "./pages/watch/Watch";

const App = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <SnackbarProvider>
          <CssBaseline /> {!isLoginPage && <Navbar />}
          <Box component="main" sx={{ flexGrow: 1 }} py={isLoginPage ? 0 : 3}>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/search" element={<Search />} />
              <Route path="/watch/:videoId" element={<Watch />} />
              <Route path="/callback" element={<Callback />} />

              {/* Protected Routes */}
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/playlists"
                element={
                  <ProtectedRoute>
                    <Playlists />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/playlist/:id"
                element={
                  <ProtectedRoute>
                    <PlaylistDetail />
                  </ProtectedRoute>
                }
              />

              {/* Not Found Route */}
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
          </Box>
        </SnackbarProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
