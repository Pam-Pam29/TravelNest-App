// src/components/booking/BookingForm.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPackageById } from '../../services/packageService';
import { createBooking } from '../../services/bookingService';
import { useAuth } from '../../contexts/AuthContext';

const BookingForm = () => {
  const { packageId } = useParams();
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  
  const [travelPackage, setTravelPackage] = useState(null);
  const [travelers, setTravelers] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const fetchPackage = async () => {
      try {
        console.log("Fetching package with ID:", packageId);
        const data = await getPackageById(packageId);
        console.log("Package data received:", data);
        setTravelPackage(data);
        
        // Set default start date to 30 days from now
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 30);
        setStartDate(defaultDate.toISOString().split('T')[0]);
      } catch (error) {
        console.error("Error fetching package:", error);
        setError('Failed to fetch package: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [packageId, currentUser, navigate]);

  const getTotalPrice = () => {
    if (!travelPackage) return 0;
    return travelPackage.price * travelers;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!travelPackage || !startDate) {
      setError('Please fill all required fields');
      return;
    }
    
    try {
      setSubmitting(true);
      setError('');
      
      const bookingData = {
        packageId,
        packageTitle: travelPackage.title,
        packagePrice: travelPackage.price,
        travelers,
        totalPrice: getTotalPrice(),
        startDate,
        specialRequests,
        userId: currentUser.uid,
        userName: userProfile.name,
        userEmail: currentUser.email,
        status: 'pending',
        paymentStatus: 'pending'
      };
      
      // Add logging to debug
      console.log("Creating booking with data:", bookingData);
      const bookingId = await createBooking(bookingData);
      console.log("Booking created with ID:", bookingId);
      
      // Store the booking ID in localStorage as a backup
      localStorage.setItem('lastBookingId', bookingId);

      // Debug alert
alert(`Booking created! ID: ${bookingId}. About to navigate to payment.`); 
    
    // Force a direct URL navigation instead of using React Router
    window.location.href = `/payment/${bookingId}`;
      
      // Add alert to show the booking ID
    //  alert("Booking created with ID: " + bookingId + ". Click OK to proceed to payment.");
      
     // navigate(`/payment/${bookingId}`);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      setError('Failed to create booking: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading booking form...</div>;
  }

  if (!travelPackage) {
    return <div className="error-message">Package not found</div>;
  }

  return (
    <div className="booking-form-container">
      <h2>Book Your Trip</h2>
      <div className="booking-package-summary">
        <h3>{travelPackage.title}</h3>
        <p>Destination: {travelPackage.region}</p>
        <p>Duration: {travelPackage.duration} days</p>
        <p>Price: ${travelPackage.price} per person</p>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-group">
          <label htmlFor="travelers">Number of Travelers</label>
          <input
            type="number"
            id="travelers"
            min="1"
            max="10"
            value={travelers}
            onChange={(e) => setTravelers(parseInt(e.target.value))}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="startDate">Start Date</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="specialRequests">Special Requests (Optional)</label>
          <textarea
            id="specialRequests"
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            rows="4"
          ></textarea>
        </div>
        
        <div className="booking-summary">
          <h3>Booking Summary</h3>
          <div className="summary-row">
            <span>Package Price</span>
            <span>${travelPackage.price} × {travelers} traveler(s)</span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span>${getTotalPrice()}</span>
          </div>
        </div>
        
        <button 
          type="submit" 
          className="btn-continue"
          disabled={submitting}
        >
          {submitting ? 'Processing...' : 'Continue to Payment'}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
