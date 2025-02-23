// src/pages/LoginPage.jsx
import React from 'react';
import './LoginPage.css';
import { Button, TextField } from '@mui/material';

const LoginPage = ({ onClose }) => {
  return (
    <div className="login-modal-content">
      <h1>Sign in</h1>
      <TextField
        label="Email or Phone"
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <TextField
        label="Password"
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" fullWidth>
        Sign in
      </Button>
      <p>or</p>
      <Button variant="outlined" color="primary" fullWidth>
        Sign in with Google
      </Button>
      <p>
        Don’t have an account? <a href="#" onClick={(e) => { e.preventDefault(); onClose(); }}>Sign up</a>
      </p>
      <Button variant="outlined" onClick={onClose} className="close-button">
        Close
      </Button>
    </div>
  );
};

export default LoginPage;