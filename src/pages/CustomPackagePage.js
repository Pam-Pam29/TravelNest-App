import React, { useEffect } from 'react';
import CustomPackageQuestionnaire from '../components/packages/CustomPackageQuestionnaire';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const CustomPackagePage = () => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('CustomPackagePage - Current User:', currentUser);
    console.log('CustomPackagePage - Loading:', loading);

    if (!loading && !currentUser) {
      console.log('Redirecting to login');
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