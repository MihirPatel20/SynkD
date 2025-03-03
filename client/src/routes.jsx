// routes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Box } from "@mui/material";

import Login from "./pages/auth/Login";
import Callback from "./pages/auth/Callback";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Home from "./pages/home/Home";
import Playlists from "./pages/playlists/Playlists";
import Profile from "./pages/profile/Profile";
import Search from "./pages/search/Search";
import Watch from "./pages/watch/Watch";
import PlaylistManager from "./pages/playlists/PlaylistManager";
import NotFound from "./components/common/NotFound";
import PlaylistDetail from "./pages/PlaylistDetail";

const AppRoutes = () => {
  return (
    <>
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Routes>
          {/* Redirect root to home */}
          <Route path="/" element={<Navigate to="/home" replace />} />

          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/callback" element={<Callback />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/playlist-manager" element={<PlaylistManager />} />
            <Route path="/playlists" element={<Playlists />} />
            <Route path="/playlist/:id" element={<PlaylistDetail />} />
          </Route>

          {/* Public routes */}
          <Route path="/search" element={<Search />} />
          <Route path="/watch/:videoId" element={<Watch />} />

          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Box>
    </>
  );
};

export default AppRoutes;
