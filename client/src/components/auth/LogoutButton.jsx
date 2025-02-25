import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle 
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../context/AuthContext';

const LogoutButton = () => {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('yt_tokens');
    
    // Call the auth context logout
    logout();
    
    // Close the dialog
    handleClose();
    
    // Redirect to login page
    navigate('/login');
  };

  return (
    <>
      <Button
        color="inherit"
        onClick={handleClickOpen}
        startIcon={<LogoutIcon />}
        aria-label="Logout"
        sx={{
          ml: 2,
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          }
        }}
      >
        Logout
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
      >
        <DialogTitle id="logout-dialog-title">
          Confirm Logout
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="logout-dialog-description">
            Are you sure you want to log out? This will end your current session.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleClose}
            color="primary"
            autoFocus
          >
            Cancel
          </Button>
          <Button 
            onClick={handleLogout}
            color="error"
            variant="contained"
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LogoutButton;