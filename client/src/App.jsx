import React from "react";
import { Routes, Route } from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";
import { AuthProvider } from "./context/AuthContext"; // New
import ProtectedRoute from "./components/auth/ProtectedRoute"; // New
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";
import Watch from "./pages/Watch";
import Search from "./pages/Search";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login"; // New
import Profile from "./pages/Profile.jsx"; // New
import Callback from "./pages/Callback"; // New


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
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <CssBaseline />
        <Navbar />
        <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/watch/:videoId" element={<Watch />} />
            <Route path="/login" element={<Login />} />
            <Route path="/callback" element={<Callback />} />

            {/* Protected Routes */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            
            {/* Not Found Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Box>
      </Box>
    </AuthProvider>
  );
};

export default App;
