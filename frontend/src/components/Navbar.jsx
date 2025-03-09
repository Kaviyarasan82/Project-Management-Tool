import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { IconButton, Menu, MenuItem, Button } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Navbar = ({ toggleSidebar, openLoginModal, onSearch }) => {
  const [anchorElLogin, setAnchorElLogin] = useState(null);
  const [anchorElLogo, setAnchorElLogo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [userEmail, setUserEmail] = useState(null);
  const [username, setUsername] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [history, setHistory] = useState([]);
  const [supportQuery, setSupportQuery] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setUsername(decoded.username);
      fetchUserDetails(token);
      fetchHistory(token);
    }
  }, []);

  const fetchUserDetails = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setUserDetails(data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const fetchHistory = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/history', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setHistory(data.history || []);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

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
    openLoginModal();
    handleLoginClose();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUsername(null);
    setUserDetails(null);
    setHistory([]);
    window.location.href = '/';
    handleLoginClose();
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearch) onSearch(query);
  };

  const handleSupportSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:5000/api/auth/support', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: supportQuery }),
      });
      setSupportQuery('');
      setShowSupportModal(false);
      handleLoginClose();
    } catch (error) {
      console.error('Error submitting support query:', error);
      alert('Failed to submit support query.');
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
        {username || 'Login'}
      </Button>
      <Menu
        anchorEl={anchorElLogin}
        open={Boolean(anchorElLogin)}
        onClose={handleLoginClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ style: { marginTop: 8, borderRadius: 8, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' } }}
      >
        {!username && <MenuItem onClick={handleLoginSelect}>Login</MenuItem>}
        {username && <MenuItem onClick={handleLogout}>Logout</MenuItem>}
        {username && <MenuItem onClick={() => { setShowProfileModal(true); handleLoginClose(); }}>Profile</MenuItem>}
        {username && <MenuItem onClick={() => { setShowHistoryModal(true); handleLoginClose(); }}>History</MenuItem>}
        {username && <MenuItem onClick={() => { setShowSupportModal(true); handleLoginClose(); }}>Support</MenuItem>}
      </Menu>
      <IconButton onClick={handleLogoClick} className="logo-btn">
        <AccountCircleIcon />
      </IconButton>
      <Menu
        anchorEl={anchorElLogo}
        open={Boolean(anchorElLogo)}
        onClose={handleLogoClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ style: { marginTop: 8, borderRadius: 8, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' } }}
      >
        {!username && <MenuItem onClick={handleLoginSelect}>Login</MenuItem>}
        {!username && <MenuItem onClick={handleLogoClose}>Sign Up</MenuItem>}
      </Menu>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="modal" onClick={() => setShowProfileModal(false)}>
          <div className="modal-content login-modal-content" onClick={(e) => e.stopPropagation()}>
            <h1 style={{ fontSize: '1.5rem', margin: '8px 0' }}>Profile</h1>
            <p style={{ fontSize: '1rem', margin: '8px 0' }}>
              Email: {userDetails?.email || 'N/A'}
            </p>
            <p style={{ fontSize: '1rem', margin: '8px 0' }}>
              Username: {userDetails?.username || 'N/A'}
            </p>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => setShowProfileModal(false)}
              style={{ marginTop: '16px', padding: '8px' }}
            >
              OK
            </Button>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && (
        <div className="modal" onClick={() => setShowHistoryModal(false)}>
          <div className="modal-content login-modal-content" onClick={(e) => e.stopPropagation()}>
            <h1 style={{ fontSize: '1.5rem', margin: '8px 0' }}>History</h1>
            {history.length > 0 ? (
              <ul style={{ paddingLeft: '20px', maxHeight: '200px', overflowY: 'auto' }}>
                {history.map((entry, index) => (
                  <li key={index} style={{ fontSize: '0.9rem', margin: '4px 0' }}>
                    {entry}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ fontSize: '1rem', margin: '8px 0' }}>No history available.</p>
            )}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => setShowHistoryModal(false)}
              style={{ marginTop: '16px', padding: '8px' }}
            >
              OK
            </Button>
          </div>
        </div>
      )}

      {/* Support Modal */}
      {showSupportModal && (
        <div className="modal" onClick={() => setShowSupportModal(false)}>
          <div className="modal-content login-modal-content" onClick={(e) => e.stopPropagation()}>
            <h1 style={{ fontSize: '1.5rem', margin: '8px 0' }}>Support</h1>
            <p style={{ fontSize: '1rem', margin: '8px 0' }}>Need any support? Submit your query below:</p>
            <input
              type="text"
              value={supportQuery}
              onChange={(e) => setSupportQuery(e.target.value)}
              placeholder="Enter your query..."
              style={{ width: '100%', padding: '8px', margin: '8px 0', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSupportSubmit}
                style={{ flex: 1, padding: '8px' }}
              >
                Submit
              </Button>
              <Button
                variant="outlined"
                onClick={() => setShowSupportModal(false)}
                style={{ flex: 1, padding: '8px' }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;