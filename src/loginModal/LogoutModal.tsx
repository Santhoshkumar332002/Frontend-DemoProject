import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#F7EFE5', // Lightest background color
  borderRadius: '15px',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
  p: 4,
};

const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  marginTop: theme.spacing(2),
  backgroundColor: '#674188', // Dark purple background
  color: '#F7EFE5', // Lightest background color
  '&:hover': {
    backgroundColor: '#C8A1E0', 
  },
}));

const StyledCancelButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  marginTop: theme.spacing(2),
  color: '#674188', // Dark purple text
  borderColor: '#674188', // Dark purple border
  borderWidth: 2,
  '&:hover': {
    borderColor: '#C8A1E0', // Lighter purple for hover effect
    color: '#C8A1E0', // Lighter purple text on hover
  },
  borderStyle: 'solid',
}));

interface LogoutModalProps {
  open: boolean;
  handleClose: () => void;
  onLogout: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ open, handleClose, onLogout }) => {
  const handleLogout = () => {
    onLogout();
    window.location.reload(); // Refresh the page after logout
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" gutterBottom align="center" color="#674188">
          Are you sure you want to log out?
        </Typography>
        <StyledButton variant="contained" onClick={handleLogout} fullWidth>
          Yes, Log out
        </StyledButton>
        <StyledCancelButton variant="outlined" onClick={handleClose} fullWidth>
          Cancel
        </StyledCancelButton>
      </Box>
    </Modal>
  );
};

export default LogoutModal;
