// src/routes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PackagesPage from './pages/PackagesPage';
import PackageDetailPage from './pages/PackageDetailPage';
import BookingPage from './pages/BookingPage';
import PaymentPage from './pages/PaymentPage';
import ConfirmationPage from './pages/ConfirmationPage';
import UserDashboardPage from './pages/UserDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import NotFoundPage from './pages/NotFoundPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/packages" element={<PackagesPage />} />
      <Route path="/packages/:packageId" element={<PackageDetailPage />} />
      <Route path="/booking/:packageId" element={<BookingPage />} />
      <Route path="/payment/:bookingId" element={<PaymentPage />} />
      <Route path="/payment-test" element={<PaymentTestPage />} />
      <Route path="/confirmation/:bookingId" element={<ConfirmationPage />} />
      <Route path="/dashboard" element={<UserDashboardPage />} />
      <Route path="/admin" element={<AdminDashboardPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;

