import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { AppDispatch, RootState } from '../store/index';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/authSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  backgroundColor: '#674188', 
  color: '#F7EFE5', 
  '&:hover': {
    backgroundColor: '#C8A1E0', 
  },
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
  margin: `${theme.spacing(2)} 0`,
  borderColor: '#C8A1E0', 
}));

const LoginModal: React.FC<{ open: boolean; handleClose: () => void; onRegisterClick: () => void }> = ({ open, handleClose, onRegisterClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const { status, error } = useSelector((state: RootState) => state.auth);

  const handleLogin = async () => {
    try {
      const result = await dispatch(login({ email, password }));
      
      if (login.fulfilled.match(result)) {
        const { token, message } = result.payload; 
        localStorage.setItem("authToken", token);
        console.log("Token retrieved:", token);
        
        // Display success message from the backend
        toast.success(message || "Login successful! Welcome back.");
        handleClose();
      } else if (login.rejected.match(result)) {
        const errorMessage = result.error?.message ?? "Login failed. Please try again.";
        toast.error(errorMessage);
      }
    } catch (error) {
      // Catch any unexpected errors and show a generic error message
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred. Please try again later.");
    }
  };
  
  

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography variant="h5" fontWeight="bold" gutterBottom align="center" color="#674188">
            Welcome Back
          </Typography>
          <Typography variant="body2" color="#674188" align="center">
            Please log in to your account
          </Typography>

          <StyledDivider />

          <TextField
            label="Email Address"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            error={status === 'failed' && !!error}
            helperText={status === 'failed' ? error : ''}
            slotProps={{
              input: {
                sx: { backgroundColor: '#E2BFD9' }, 
              },
            }}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            error={status === 'failed' && !!error}
            helperText={status === 'failed' ? error : ''}
            slotProps={{
              input: {
                sx: { backgroundColor: '#E2BFD9' }, 
              },
            }}
          />

          <StyledButton
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleLogin}
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Logging In...' : 'Log In'}
          </StyledButton>

          <Typography
            variant="body2"
            color="#674188"
            align="center"
            sx={{ marginTop: 2 }}
          >
            Don’t have an account?
            <Button
              color="secondary"
              onClick={onRegisterClick}
              sx={{ fontWeight: 'bold', marginLeft: 1 }}
            >
              Register
            </Button>
          </Typography>
        </Box>
      </Modal>

      {/* <ToastContainer position="top-right" autoClose={3000} /> */}
    </>
  );
};

export default LoginModal;
