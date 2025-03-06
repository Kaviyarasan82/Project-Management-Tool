import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import './App.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = React.useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
    setIsSignUpModalOpen(false);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const openSignUpModal = () => {
    setIsSignUpModalOpen(true);
    setIsLoginModalOpen(false);
  };

  const closeSignUpModal = () => {
    setIsSignUpModalOpen(false);
  };

  // Handle search query from Navbar
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <Router>
      <div className="app">
        <Navbar toggleSidebar={toggleSidebar} openLoginModal={openLoginModal} onSearch={handleSearch} />
        <div className={`content-wrapper ${isSidebarOpen ? 'sidebar-open' : ''}`}>
          {isSidebarOpen && <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />}
          <main className={`main-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            <Routes>
              <Route path="/" element={<MainPage searchQuery={searchQuery} />} />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </main>
        </div>
        {isLoginModalOpen && (
          <div className="modal-overlay" onClick={closeLoginModal}>
            <div className="login-modal" onClick={(e) => e.stopPropagation()}>
              <LoginPage onClose={closeLoginModal} onSwitchToSignUp={openSignUpModal} />
            </div>
          </div>
        )}
        {isSignUpModalOpen && (
          <div className="modal-overlay" onClick={closeSignUpModal}>
            <div className="login-modal" onClick={(e) => e.stopPropagation()}>
              <SignUpPage onClose={closeSignUpModal} onSwitchToLogin={openLoginModal} />
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;