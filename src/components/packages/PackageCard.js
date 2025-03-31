// src/components/packages/PackageCard.js
import React from 'react';
import { Link } from 'react-router-dom';


const PackageCard = ({ travelPackage }) => {
  // Add a guard clause to prevent errors if travelPackage is undefined
  if (!travelPackage) {
    return null; // or return a placeholder component
  }

  // Destructure with default values
  const {
    id = '',
    title = 'Unnamed Package', 
    description = '', 
    price = 0, 
    duration = 0, 
    region = '', 
    imageUrl = ''
  } = travelPackage;

  return (
    <div className="package-card">
      <div className="package-image">
        <img src={imageUrl} alt={title} />
      </div>
      
      <div className="package-content">
        <h3>{title}</h3>
        <p className="package-location">{region}</p>
        <p className="package-duration">{duration} days</p>
        <p className="package-description">
          {description.length > 100 ? description.substring(0, 100) + '...' : description}
        </p>
        
        <div className="package-footer">
          <span className="package-price">${price}</span>
          <Link to={`/packages/${id}`} className="btn-view">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;