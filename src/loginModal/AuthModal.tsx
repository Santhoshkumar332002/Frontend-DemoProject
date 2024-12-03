import React, { useState } from 'react';
import { IconButton ,Dialog, Typography} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';


interface AuthModalProps {
  open: boolean;
  handleClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ open, handleClose }) => {
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);

  // Function to open the login modal
  const handleOpenLogin = () => {
    setOpenLogin(true);
  };

  // Function to open the register modal
  const handleOpenRegister = () => {
    setOpenRegister(true);
  };

  // Function to close the login modal
  const handleCloseLogin = () => {
    setOpenLogin(false);
  };

  // Function to close the register modal
  const handleCloseRegister = () => {
    setOpenRegister(false);
  };

  return (
      <Dialog open={open} onClose={handleClose}>
    <div style={{ padding: '20px' }}>
      <IconButton sx={{
        backgroundColor:"#F7EFE5"
      }} onClick={handleOpenLogin}>
        <AccountCircleIcon sx={{color:'#674188'}} />
        <Typography
        sx={{ fontSize:20,ml:2,color:'#674188'}}
        >Login</Typography>
      </IconButton>

      {/* Login Modal */}
      <LoginModal
        open={openLogin}
        handleClose={handleCloseLogin}
        onRegisterClick={() => {
          handleCloseLogin();
          handleOpenRegister();
        }}
      />

      {/* Register Modal */}
      <RegisterModal
        open={openRegister}
        handleClose={handleCloseRegister}
        onRegisterComplete={() => {
          handleCloseRegister();
          handleOpenLogin();
        }}
      />
    </div>
    </Dialog>
  );
};

export default AuthModal;
