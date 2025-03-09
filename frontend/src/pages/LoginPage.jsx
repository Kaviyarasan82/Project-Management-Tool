import React, { useState } from 'react';
import './LoginPage.css';
import { Button, TextField } from '@mui/material';
import axios from 'axios';

const LoginPage = ({ onClose, onSwitchToSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token); // Store JWT
      onClose(); // Close modal on success
      window.location.href = '/'; // Redirect to MainPage
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-modal-content">
      <h1>Sign in</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <TextField
          label="Email or Phone"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button variant="contained" color="primary" fullWidth type="submit">
          Sign in
        </Button>
      </form>
      <p>or</p>
      <Button variant="outlined" color="primary" fullWidth disabled>
        Sign in with Google
      </Button>
      <p>
        Don’t have an account?{' '}
        <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToSignUp(); }}>
          Sign up
        </a>
      </p>
      <Button variant="outlined" onClick={onClose} className="close-button">
        Close
      </Button>
    </div>
  );
};

export default LoginPage;