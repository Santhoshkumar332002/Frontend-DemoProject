import React, { useState, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/index';
import { register } from '../store/authSlice';
import { Modal, Box, TextField, Button, Typography, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

const StyledDivider = styled(Divider)(({ theme }) => ({
  margin: `${theme.spacing(2)} 0`,
  borderColor: '#C8A1E0', 
}));

interface RegisterModalProps {
  open: boolean;
  handleClose: () => void;
  onRegisterComplete: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ open, handleClose, onRegisterComplete }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const { status } = useSelector((state: RootState) => state.auth);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
  
    try {
      const result = await dispatch(register({ username, email, password })).unwrap();
      toast.success(result.message || 'Registration successful!');
      onRegisterComplete();
      handleClose();
    } catch (err) {
      const errorMessage = (err as { message: string }).message || 'Registration failed';
      toast.error(errorMessage);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <Typography variant="h5" fontWeight="bold" gutterBottom align="center" color="#674188">
          Create an Account
        </Typography>
        <Typography variant="body2" color="#674188" align="center">
          Fill in the details to register
        </Typography>

        <StyledDivider />

        <form onSubmit={handleRegister}>
          <TextField
            label="Username"
            type="text"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant="outlined"
            required
            slotProps={{
              input: {
                sx: { backgroundColor: '#E2BFD9' }, 
              },
            }}
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            required
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
            required
            slotProps={{
              input: {
                sx: { backgroundColor: '#E2BFD9' }, 
              },
            }}
          />
          <StyledButton
            type="submit"
            variant="contained"
            fullWidth
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Registering...' : 'Register'}
          </StyledButton>
        </form>
      </Box>
    </Modal>
  );
};

export default RegisterModal;
