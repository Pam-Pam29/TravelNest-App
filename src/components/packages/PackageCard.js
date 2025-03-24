// src/components/packages/PackageCard.js
import React from 'react';
import { Link } from 'react-router-dom';

const PackageCard = ({ travelPackage }) => {
  const { id, title, description, price, duration, region, imageUrl } = travelPackage;

  return (
    <div className="package-card">
      <div className="package-image">
        <img src={imageUrl || '/assets/images/package-placeholder.jpg'} alt={title} />
      </div>
      
      <div className="package-content">
        <h3>{title}</h3>
        <p className="package-location">{region}</p>
        <p className="package-duration">{duration} days</p>
        <p className="package-description">{description.substring(0, 100)}...</p>
        
        <div className="package-footer">
          <span className="package-price">${price}</span>
          <Link to={`/packages/${id}`}className="btn-view">View Details</Link>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;