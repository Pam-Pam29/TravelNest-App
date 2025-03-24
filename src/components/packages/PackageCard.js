import React from 'react';
import { Link } from 'react-router-dom';

const PackageCard = ({ travelPackage }) => {
  // Log the travelPackage to debug
  console.log('travelPackage:', travelPackage);

  // Check if travelPackage is undefined
  if (!travelPackage) {
    return <div>No travel package available</div>;
  }

  // Destructure with default values
  const {
    id,
    title = 'No Title',
    description = 'No Description',
    price = 0,
    duration = 0,
    region = 'No Region',
    imageUrl = '/assets/images/package-placeholder.jpg'
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
        <p className="package-description">{description.substring(0, 100)}...</p>

        <div className="package-footer">
          <span className="package-price">${price}</span>
          <Link to={`/packages/${id}`} className="btn-view">View Details</Link>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;
