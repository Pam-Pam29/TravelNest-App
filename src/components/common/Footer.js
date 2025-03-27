// Updated Footer Component with proper CSS class references
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/Footer.css';
// Import icons if you're using a library like FontAwesome or similar
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faFacebookF, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  const { currentUser } = useAuth();
  
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Travenest</h3>
          <p>Discover amazing travel experiences with our all-inclusive packages.</p>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
        
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/packages">Travel Packages</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            {currentUser && (
              <li><Link to="/dashboard">My Dashboard</Link></li>
            )}
            {!currentUser && (
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
              </>
            )}
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>For Travelers</h3>
          <ul className="footer-links">
            <li><Link to="/packages">Explore Packages</Link></li>
            <li><Link to="/custom-package">Custom Packages</Link></li>
            {currentUser && (
              <li><Link to="/dashboard">My Bookings</Link></li>
            )}
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>For Service Providers</h3>
          <ul className="footer-links">
            <li><Link to="/provider/register">Join as Provider</Link></li>
            {currentUser ? (
              <li><Link to="/provider/dashboard">Provider Dashboard</Link></li>
            ) : (
              <li><Link to="/login">Provider Login</Link></li>
            )}
            <li><Link to="/provider/help">Help Center</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Travenest. All rights reserved.</p>
        <div className="footer-bottom-links">
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms-of-service">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;