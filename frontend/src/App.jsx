// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import './App.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = React.useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  return (
    <Router>
      <div className="app">
        <Navbar toggleSidebar={toggleSidebar} openLoginModal={openLoginModal} />
        <div className={`content-wrapper ${isSidebarOpen ? 'sidebar-open' : ''}`}>
          {isSidebarOpen && <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />}
          <main className="main-content">
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/login" element={<LoginPage />} /> {/* Keep this for fallback or direct URL access */}
            </Routes>
          </main>
        </div>
        {isLoginModalOpen && (
          <div className="modal-overlay" onClick={closeLoginModal}>
            <div className="login-modal" onClick={(e) => e.stopPropagation()}>
              <LoginPage onClose={closeLoginModal} />
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;