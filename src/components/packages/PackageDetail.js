// src/components/packages/PackageDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPackageById } from '../../services/packageService';
import { useAuth } from '../../contexts/AuthContext';

const PackageDetail = () => {
  const { packageId } = useParams();
  const [packageDetail, setPackageDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackageDetail = async () => {
      try {
        setLoading(true);
        const data = await getPackageById(packageId);
        setPackageDetail(data);
        setError('');
      } catch (error) {
        setError('Failed to fetch package details: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPackageDetail();
  }, [packageId]);

  const handleBookNow = () => {
    if (!currentUser) {
      navigate('/login', { state: { from: `/packages/${packageId}` } });
      return;
    }
    
    navigate(`/booking/${packageId}`);
  };

  if (loading) {
    return <div className="loading">Loading package details...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!packageDetail) {
    return <div className="not-found">Package not found</div>;
  }

  const { 
    title, 
    description, 
    price, 
    duration, 
    region, 
    imageUrl, 
    itinerary,
    included,
    excluded
  } = packageDetail;

  return (
    <div className="package-detail-container">
      <div className="package-header">
        <h1>{title}</h1>
        <div className="package-meta">
          <span className="location">{region}</span>
          <span className="duration">{duration} days</span>
          <span className="price">${price} per person</span>
        </div>
      </div>
      
      <div className="package-gallery">
        <img 
          src={imageUrl || '/assets/images/package-placeholder.jpg'} 
          alt={title}
          className="main-image" 
        />
      </div>
      
      <div className="package-content">
        <div className="package-description">
          <h2>About This Package</h2>
          <p>{description}</p>
        </div>
        
        <div className="package-itinerary">
          <h2>Itinerary</h2>
          <div className="itinerary-days">
            {itinerary && itinerary.map((day, index) => (
              <div key={index} className="itinerary-day">
                <h3>Day {index + 1}</h3>
                <p>{day}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="package-inclusions">
          <div className="included">
            <h2>What's Included</h2>
            <ul>
              {included && included.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          
          <div className="excluded">
            <h2>What's Not Included</h2>
            <ul>
              {excluded && excluded.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      <div className="booking-section">
        <div className="price-summary">
          <h3>Price Summary</h3>
          <div className="price-row">
            <span>Base Price</span>
            <span>${price} per person</span>
          </div>
          <div className="price-total">
            <span>Total</span>
            <span>${price}</span>
          </div>
        </div>
        
        <button onClick={handleBookNow} className="btn-book-now">
          Book Now
        </button>
      </div>
    </div>
  );
};

export default PackageDetail;

