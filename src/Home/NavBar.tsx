import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AuthModal from '../loginModal/AuthModal';
import LogoutModal from '../loginModal/LogoutModal';

const NavBar: React.FC = () => {
  // Initialize isLoggedIn based on localStorage
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Check localStorage for user data and set isLoggedIn accordingly
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  // Log the isLoggedIn value for debugging
  console.log('Is Logged In:', isLoggedIn);

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    console.log('Profile button clicked');
    if (isLoggedIn) {
      console.log('User is logged in, showing logout modal');
      setAnchorEl(event.currentTarget);
    } else {
      console.log('User is not logged in, showing auth modal');
      setAuthModalOpen(true);
    }
  };

  const handleLogoutModalClose = () => {
    setLogoutModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user'); 
    setAnchorEl(null); 
    setLogoutModalOpen(false); 
    setIsLoggedIn(false);
   };

  const handleAuthModalClose = () => {
    setAuthModalOpen(false);
  };

  return (
    <>
      <AppBar position="fixed" sx={{ bgcolor: '#674188' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, color: '#F7EFE5' }}>
            MERN App Demo
          </Typography>
          <IconButton color="inherit" onClick={handleProfileClick}>
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        slotProps={{
          paper: {
            sx: {
              bgcolor: '#F7EFE5',           
              color: '#674188',    
              borderRadius: '8px',  
            },
          },
        }}
      >
        <MenuItem onClick={() => setLogoutModalOpen(true)}>Logout</MenuItem>
      </Menu>
      <LogoutModal open={logoutModalOpen} handleClose={handleLogoutModalClose} onLogout={handleLogout} />
      <AuthModal open={authModalOpen} handleClose={handleAuthModalClose} />
    </>
  );
};

export default NavBar;
