import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { logoutUser } from '../../services/authService';
import '../../styles/Navbar.css';

const Navbar = () => {
  const { currentUser, userProfile, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mainMenuOpen, setMainMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const mainMenuRef = useRef(null);
  const userMenuRef = useRef(null);

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const toggleMainMenu = (e) => {
    e.stopPropagation();
    setMainMenuOpen(!mainMenuOpen);
    if (userMenuOpen) setUserMenuOpen(false);
  };

  const toggleUserMenu = (e) => {
    e.stopPropagation();
    setUserMenuOpen(!userMenuOpen);
    if (mainMenuOpen) setMainMenuOpen(false);
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mainMenuRef.current && !mainMenuRef.current.contains(event.target)) {
        setMainMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Left section with logo and main menu */}
        <div className="left-section">
          <Link to="/" className="navbar-logo">
            Travelnest
          </Link>
          
          <div className="main-menu-container" ref={mainMenuRef}>
            <button className="menu-toggle" onClick={toggleMainMenu}>
              Menu <span className="dropdown-arrow">{mainMenuOpen ? '▴' : '▾'}</span>
            </button>
            
            {mainMenuOpen && (
              <div className="main-dropdown-menu">
                <Link to="/" className="dropdown-item" onClick={() => setMainMenuOpen(false)}>Home</Link>
                <Link to="/packages" className="dropdown-item" onClick={() => setMainMenuOpen(false)}>Packages</Link>
                <Link to="/custom-package" className="dropdown-item" onClick={() => setMainMenuOpen(false)}>Custom Package</Link>
                <Link to="/about" className="dropdown-item" onClick={() => setMainMenuOpen(false)}>AboutUs</Link>
                <Link to="/contact" className="dropdown-item" onClick={() => setMainMenuOpen(false)}>ContactUs</Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Right section with user menu */}
        <div className="right-section">
          <div className="user-menu-container" ref={userMenuRef}>
            {currentUser ? (
              <>
                <button className="user-toggle" onClick={toggleUserMenu}>
                  Welcome, {userProfile?.name?.split(' ')[0] || 'User'} <span className="dropdown-arrow">{userMenuOpen ? '▴' : '▾'}</span>
                </button>
                
                {userMenuOpen && (
                  <div className="user-dropdown-menu">
                    <Link to="/dashboard" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                      My Dashboard
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                        Admin Panel
                      </Link>
                    )}
                    <button 
                      onClick={() => {handleLogout(); setUserMenuOpen(false);}} 
                      className="dropdown-item logout-button"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn-login">Login</Link>
                <Link to="/register" className="btn-register">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;