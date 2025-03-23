// src/pages/UserDashboardPage.js
import React from 'react';
import UserDashboard from '../components/dashboard/UserDashboard';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const UserDashboardPage = () => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  return (
    <div className="page-container">
      <UserDashboard />
    </div>
  );
};

export default UserDashboardPage;

