import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#F7EFE5',
  borderRadius: '15px',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
  p: 4,
};

const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  marginTop: theme.spacing(2),
  backgroundColor: '#674188',
  color: '#F7EFE5', 
  '&:hover': {
    backgroundColor: '#C8A1E0', 
  },
}));

const StyledCancelButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  marginTop: theme.spacing(2),
  color: '#674188', 
  borderColor: '#674188', 
  borderWidth: 2,
  '&:hover': {
    borderColor: '#C8A1E0', 
    color: '#C8A1E0', 
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
    window.location.reload();
  }

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
