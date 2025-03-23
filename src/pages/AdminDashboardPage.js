// src/pages/AdminDashboardPage.js
import React from 'react';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminDashboardPage = () => {
  const { currentUser, isAdmin, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/dashboard" />;
  }
  
  return (
    <div className="page-container">
      <AdminDashboard />
    </div>
  );
};

export default AdminDashboardPage;


