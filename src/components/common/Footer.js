// src/components/common/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Travelnest</h3>
          <p>
            Simplifying travel planning with all-inclusive packages. Experience stress-free vacations with Travlenest.
          </p>
        </div>
        
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/packages">Travel Packages</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/terms">Terms & Conditions</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>123 Travel Street</p>
          <p>Adventure City, AC 12345</p>
          <p>Email: info@travenest.com</p>
          <p>Phone: +1 (555) 123-4567</p>
        </div>
        
        <div className="footer-section">
          <h3>Newsletter</h3>
          <p>Subscribe to get special offers and travel tips.</p>
          <div className="newsletter-form">
            <input 
              type="email" 
              placeholder="Your email address" 
            />
            <button type="submit">Subscribe</button>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {year} Travelnest. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

