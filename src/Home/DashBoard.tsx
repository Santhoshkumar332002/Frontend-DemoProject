import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/index';
import { Box, Typography, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 
import ProductCreationForm from '../ProductCard/CreateProduct';

const DashBoard = () => {
  const [userData, setUserData] = useState<{ username?: string; email: string; token: string | null } | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const reduxUserData = useSelector((state: RootState) => state.auth.userData);
  const navigate = useNavigate(); 
  
  useEffect(() => {
    if (!reduxUserData) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUserData(JSON.parse(storedUser));
      }
    } else {
      setUserData(reduxUserData);
    }
  }, [reduxUserData]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#F7EFE5"
      width="100%"
    >
      <Paper
        elevation={3}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
          borderRadius: '15px',
          backgroundColor: 'white',
          width: '100%',
          maxWidth: '600px',
          textAlign: 'center',
        }}
      >
        {userData ? (
          <>
            <Typography variant="h4" style={{ color: '#C8A1E0' }}>
              Welcome back, <span style={{ color: '#674188' }}>{userData.username}!</span>
            </Typography>
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: '20px', backgroundColor: '#674188' }}
              onClick={() => setOpenForm(true)}
            >
              Create Product
            </Button>
            <Button
              variant="contained"
              color="secondary"
              style={{ marginTop: '10px', backgroundColor: '#E2BFD9' }}
              onClick={() => navigate('/product-dashboard')} 
            >
              View Products
            </Button>
            <ProductCreationForm open={openForm} onClose={() => setOpenForm(false)} />
          </>
        ) : (
          <Typography variant="h5" style={{ color: '#674188',fontWeight:"bold" }}>
            Please log in.....
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default DashBoard;
