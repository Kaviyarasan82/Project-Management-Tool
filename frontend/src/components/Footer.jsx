import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import './Footer.css';

const Footer = () => {
  const handleSendMessage = () => {
    console.log('Send message clicked');
    // Add logic for sending message (e.g., open modal or form)
  };

  return (
    <Box sx={{ p: 2, borderTop: '2px solid #ff4500', backgroundColor: '#fff', textAlign: 'center' }}>
      <Button
        variant="contained"
        onClick={handleSendMessage}
        sx={{ backgroundColor: '#ff4500', '&:hover': { backgroundColor: '#e04100' }, mb: 1 }}
      >
        Send Message
      </Button>
      <Typography variant="body2" color="text.secondary">
        © 2025 Project Management Tool
      </Typography>
    </Box>
  );
};

export default Footer;