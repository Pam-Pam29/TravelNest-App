// src/components/dashboard/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import UserManagement from '../admin/UserManagement';
import PackageManagement from '../admin/PackageManagement';

const AdminDashboard = () => {
  const { userProfile, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('packages');
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect if not an admin
    if (!isAdmin) {
      navigate('/dashboard');
    }
  }, [isAdmin, navigate]);
  
  if (!isAdmin) {
    return <div className="loading">Checking credentials...</div>;
  }
  
  return (
    <div className="admin-dashboard-container">
      <div className="admin-dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome, {userProfile?.name}!</p>
      </div>
      <div className="admin-dashboard-tabs">
        <button
          className={`tab ${activeTab === 'packages' ? 'active' : ''}`}
          onClick={() => setActiveTab('packages')}
        >
          Manage Packages
        </button>
        <button
          className={`tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Manage Users
        </button>
        <button
          className={`tab ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          Manage Bookings
        </button>
      </div>
      
      <div className="admin-dashboard-content">
        {activeTab === 'packages' && (
          <PackageManagement />
        )}
        
        {activeTab === 'users' && (
          <UserManagement />
        )}
        
        {activeTab === 'bookings' && (
          <div>
            <h2>Booking Management</h2>
            <p>Feature coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;