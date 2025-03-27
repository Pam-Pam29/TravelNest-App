// src/pages/CustomPackagePage.js
import React from 'react';
import CustomPackageQuestionnaire from '../components/packages/CustomPackageQuestionnaire';
import '../styles/questionnaire.css'

const CustomPackagePage = () => {
  return (
    <div className="page-container">
      <CustomPackageQuestionnaire />
    </div>
  );
};

export default CustomPackagePage;