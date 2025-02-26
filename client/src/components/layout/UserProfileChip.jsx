import React from "react";
import { useNavigate } from "react-router-dom";
import { IconButton, Avatar } from "@mui/material";
import { useAuth } from "../../context/AuthContext";

const UserProfileChip = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  console.log("User object:", user);

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <IconButton onClick={handleProfileClick} sx={{ ml: 1 }}>
      <Avatar src={user?.picture} alt={user?.name} />
    </IconButton>
  );
};

export default UserProfileChip;
