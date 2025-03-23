// src/components/common/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { logoutUser } from '../../services/authService';

const Navbar = () => {
  const { currentUser, userProfile, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-logo">
          Travenest
        </Link>
      </div>
      
      <div className="navbar-menu">
        <Link to="/" className="navbar-item">Home</Link>
        <Link to="/packages" className="navbar-item">Packages</Link>
        <Link to="/about" className="navbar-item">About</Link>
        <Link to="/contact" className="navbar-item">Contact</Link>
      </div>
      
      <div className="navbar-auth">
        {currentUser ? (
          <>
            <div className="user-menu">
              <span className="user-welcome">
                Welcome, {userProfile?.name?.split(' ')[0] || 'User'}
              </span>
              <div className="dropdown-menu">
                <Link to="/dashboard" className="dropdown-item">My Dashboard</Link>
                {isAdmin && (
                  <Link to="/admin" className="dropdown-item">Admin Panel</Link>
                )}
                <button onClick={handleLogout} className="dropdown-item">
                  Logout
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-login">Login</Link>
            <Link to="/register" className="btn-register">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

