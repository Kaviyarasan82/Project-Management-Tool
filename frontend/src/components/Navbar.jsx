import React, { useState } from 'react';
import './Navbar.css';
import { IconButton, Menu, MenuItem, Button } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Navbar = ({ toggleSidebar, openLoginModal, onSearch }) => {
  const [anchorElLogin, setAnchorElLogin] = useState(null); // For login dropdown
  const [anchorElLogo, setAnchorElLogo] = useState(null); // For logo dropdown
  const [searchQuery, setSearchQuery] = useState(''); // State for search input

  const handleLoginClick = (event) => {
    setAnchorElLogin(event.currentTarget);
  };

  const handleLoginClose = () => {
    setAnchorElLogin(null);
  };

  const handleLogoClick = (event) => {
    setAnchorElLogo(event.currentTarget);
  };

  const handleLogoClose = () => {
    setAnchorElLogo(null);
  };

  const handleLoginSelect = () => {
    openLoginModal(); // Open the login modal instead of navigating
    handleLoginClose();
  };

  // Handle search input change and trigger the search callback
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query); // Pass the search query to the parent (App.jsx or MainPage.jsx)
    }
  };

  return (
    <nav className="navbar">
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        <span>☰</span>
      </button>
      <input
        type="text"
        placeholder="Search..."
        className="search-bar"
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <Button
        variant="contained"
        color="primary"
        className="login-button"
        onClick={handleLoginClick}
        endIcon={<span className="dropdown-arrow">▼</span>}
      >
        Login
      </Button>
      <Menu
        anchorEl={anchorElLogin}
        open={Boolean(anchorElLogin)}
        onClose={handleLoginClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          style: {
            marginTop: 8,
            borderRadius: 8,
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <MenuItem onClick={handleLoginSelect}>Login</MenuItem>
        <MenuItem onClick={handleLoginClose}>My Profile</MenuItem>
        <MenuItem onClick={handleLoginClose}>Support</MenuItem>
        <MenuItem onClick={handleLoginClose}>History</MenuItem>
      </Menu>
      <IconButton onClick={handleLogoClick} className="logo-btn">
        <AccountCircleIcon />
      </IconButton>
      <Menu
        anchorEl={anchorElLogo}
        open={Boolean(anchorElLogo)}
        onClose={handleLogoClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          style: {
            marginTop: 8,
            borderRadius: 8,
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <MenuItem onClick={handleLogoClose}>Login</MenuItem>
        <MenuItem onClick={handleLogoClose}>Sign Up</MenuItem>
      </Menu>
    </nav>
  );
};

export default Navbar;