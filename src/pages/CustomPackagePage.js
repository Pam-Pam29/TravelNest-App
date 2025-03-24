// pages/CustomPackagePage.js
import React from 'react';
import CustomPackageForm from '../packages/CustomPackageForm';

function CustomPackagePage() {
  return (
    <div className="custom-package-page">
      <div className="page-header">
        <h1>Create Your Custom Travel Package</h1>
        <p>Tell us about your dream vacation and we'll craft a personalized travel experience just for you.</p>
      </div>
      
      <CustomPackageForm />
    </div>
  );
}

export default CustomPackagePage;