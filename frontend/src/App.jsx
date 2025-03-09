import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import './App.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoginModalOpen(true);
    }
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const openLoginModal = () => { setIsLoginModalOpen(true); setIsSignUpModalOpen(false); };
  const closeLoginModal = () => setIsLoginModalOpen(false);
  const openSignUpModal = () => { setIsSignUpModalOpen(true); setIsLoginModalOpen(false); };
  const closeSignUpModal = () => setIsSignUpModalOpen(false);

  const handleSearch = (query) => setSearchQuery(query);

  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <Router>
      <div className="app">
        <Navbar toggleSidebar={toggleSidebar} openLoginModal={openLoginModal} onSearch={handleSearch} />
        <div className={`content-wrapper ${isSidebarOpen ? 'sidebar-open' : ''}`}>
          {isSidebarOpen && <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />}
          <main className={`main-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <MainPage searchQuery={searchQuery} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/login"
                element={
                  isLoginModalOpen ? (
                    <div className="modal-overlay" onClick={closeLoginModal}>
                      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
                        <LoginPage onClose={closeLoginModal} onSwitchToSignUp={openSignUpModal} />
                      </div>
                    </div>
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
              <Route
                path="/signup"
                element={
                  isSignUpModalOpen ? (
                    <div className="modal-overlay" onClick={closeSignUpModal}>
                      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
                        <SignUpPage onClose={closeSignUpModal} onSwitchToLogin={openLoginModal} />
                      </div>
                    </div>
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
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