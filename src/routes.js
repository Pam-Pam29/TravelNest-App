import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

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
import PaymentTestPage from './pages/PaymentTestPage';
import CustomPackagePage from './pages/CustomPackagePage';
import CompletedBookingsPage from './pages/CompletedBookingsPage'; // New import

// Provider Pages
import ProviderDashboardPage from './pages/ProviderDashboardPage';
import ProviderProfilePage from './pages/ProviderProfilePage';
import ProviderRegistrationPage from './pages/ProviderRegistrationPage';
import ProviderAnalyticsPage from './pages/ProviderAnalyticsPage';

// New Components
import VerificationPending from './components/provider/VerificationPending';
import ProviderVerification from './components/admin/ProviderVerification';
import UserReview from './components/reviews/UserReview';


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
      <Route path="/dashboard/completed-bookings" element={<CompletedBookingsPage />} /> {/* New route */}
      
      {/* User Review Route */}
      <Route path="/booking/:bookingId/review" element={<UserReview />} />
      
      {/* Provider Routes */}
      <Route path="/provider/dashboard" element={<ProviderDashboardPage />} />
      <Route path="/provider/profile" element={<ProviderProfilePage />} />
      <Route path="/provider/analytics" element={<ProviderAnalyticsPage />} />
      <Route path="/provider/register" element={<ProviderRegistrationPage />} />
      <Route path="/provider/verification-pending" element={<VerificationPending />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminDashboardPage />} />
      <Route path="/admin/providers/verification" element={<ProviderVerification />} />
      
      <Route path="/custom-package" element={<CustomPackagePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;