import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";
import Watch from "./pages/Watch";
import Search from "./pages/Search";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Profile from "./pages/Profile.jsx";
import Callback from "./pages/Callback";

import { loadGoogleApi } from './services/authService';

const App = () => {

  useEffect(() => {
    // Initialize Google API when app loads
    loadGoogleApi()
      .then(() => {
        console.log('Google API loaded successfully');
      })
      .catch(error => {
        console.error('Error loading Google API:', error);
      });
  }, []);

  return (
    <AuthProvider>
        <CssBaseline />
        <Navbar />
        <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/search" element={<Search />} />
            <Route path="/watch/:videoId" element={<Watch />} />
            <Route path="/callback" element={<Callback />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            
            {/* Not Found Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
    </AuthProvider>
  );
};

export default App;