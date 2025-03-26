// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  console.log('PrivateRoute - Current User:', currentUser);
  console.log('PrivateRoute - Loading:', loading);

  if (loading) {
    return <div>Loading...</div>;
  }

  return currentUser ? children : <Navigate to="/login" state={{ from: location.pathname }} replace />;
};

export default PrivateRoute;

