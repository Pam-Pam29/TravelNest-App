// src/App.js
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import AppRoutes from './routes';
import { AuthProvider } from './contexts/AuthContext';
import ScrollToTop from './components/ScrollToTop'; // Import the ScrollToTop component from '\components\ScrollToTop.js';
import './styles/main.css';
import './styles/Home.css';
import './styles/questionnaire.css';
import './styles/providerRegistration.css';
import './styles/adminVerification.css';
import './styles/verificationPending.css';
import './styles/completedBookings.css';


const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
      <ScrollToTop />
        <div className="app">
          <Navbar />
          <main className="main-content">
            <AppRoutes />
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
