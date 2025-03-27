// src/pages/ProviderRegistrationPage.js
import React from 'react';
import ProviderRegistration from '../components/provider/ServiceProviderRegistration';

const ProviderRegistrationPage = () => {
  return (
    <div className="provider-registration-page">
      <div className="container">
        <h1 className="page-title">Provider Registration</h1>
        <div className="provider-registration-container">
          <ProviderRegistration />
        </div>
      </div>
    </div>
  );
};

export default ProviderRegistrationPage;