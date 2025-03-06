import React from 'react';
import '../pages/LoginPage.css'; // Reuse the existing LoginPage.css
import { Button, TextField } from '@mui/material';

const SignUpPage = ({ onClose, onSwitchToLogin }) => {
  return (
    <div className="login-modal-content">
      <h1>Sign up</h1>
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
      <TextField
        label="Confirm Password"
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" fullWidth>
        Sign up
      </Button>
      <p>or</p>
      <Button variant="outlined" color="primary" fullWidth>
        Sign up with Google
      </Button>
      <p>
        Already have an account?{' '}
        <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToLogin(); }}>
          Sign in
        </a>
      </p>
      <Button variant="outlined" onClick={onClose} className="close-button">
        Close
      </Button>
    </div>
  );
};

export default SignUpPage;