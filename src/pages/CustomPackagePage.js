import React, { useEffect } from 'react';
import {useNavigate } from 'react-router-dom';
import CustomPackageQuestionnaire from '../components/packages/CustomPackageQuestionnaire';
import { useAuth } from '../contexts/AuthContext';

const CustomPackagePage = () => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('CustomPackagePage - Mounted');
    console.log('Custom User:', currentUser);
    console.log('Loading state:', loading);

    if (!loading && !currentUser) {
      console.log('Redirecting to login - No authenticated user');
      navigate('/login', { state: { from: '/custom-package' } });
    }
  }, [currentUser, loading, navigate]);

  return (
    <div className="page-container">
      <CustomPackageQuestionnaire />
    </div>
  );
};

export default CustomPackagePage;