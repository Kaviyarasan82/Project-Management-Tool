import React, { useState } from 'react';
import '../pages/LoginPage.css';
import { Button, TextField } from '@mui/material';
import axios from 'axios';

const SignUpPage = ({ onClose, onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!username.trim()) {
      setError('Username is required');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', { email, password, username });
      localStorage.setItem('token', response.data.token); // Store JWT
      onClose(); // Close modal on success
      window.location.href = '/'; // Redirect to MainPage
    } catch (error) {
      setError(error.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="login-modal-content" style={{ padding: '20px', maxHeight: '500px', overflowY: 'auto' }}>
      <h1 style={{ fontSize: '1.5rem', margin: '8px 0' }}>Sign up</h1>
      {error && <p style={{ color: 'red', fontSize: '0.9rem', margin: '4px 0' }}>{error}</p>}
      <form onSubmit={handleSignUp}>
        <TextField
          label="Username *"
          variant="outlined"
          fullWidth
          margin="dense"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          size="small"
        />
        <TextField
          label="Email or Phone *"
          variant="outlined"
          fullWidth
          margin="dense"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          size="small"
        />
        <TextField
          label="Password *"
          type="password"
          variant="outlined"
          fullWidth
          margin="dense"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          size="small"
        />
        <TextField
          label="Confirm Password *"
          type="password"
          variant="outlined"
          fullWidth
          margin="dense"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          size="small"
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          type="submit"
          style={{ marginTop: '8px', padding: '8px' }}
        >
          Sign up
        </Button>
      </form>
      <p style={{ fontSize: '0.9rem', margin: '8px 0' }}>or</p>
      <Button
        variant="outlined"
        color="primary"
        fullWidth
        disabled
        style={{ padding: '8px', fontSize: '0.9rem' }}
      >
        Sign up with Google
      </Button>
      <p style={{ fontSize: '0.9rem', margin: '8px 0' }}>
        Already have an account?{' '}
        <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToLogin(); }}>
          Sign in
        </a>
      </p>
      <Button
        variant="outlined"
        onClick={onClose}
        className="close-button"
        style={{ padding: '8px', fontSize: '0.9rem' }}
      >
        Close
      </Button>
    </div>
  );
};

export default SignUpPage;