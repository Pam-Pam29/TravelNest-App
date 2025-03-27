import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';

const CompletedBookingsPage = () => {
  const { currentUser } = useAuth();
  const [completedBookings, setCompletedBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser) {
      fetchCompletedBookings();
    }
  }, [currentUser]);

  const fetchCompletedBookings = async () => {
    try {
      setLoading(true);
      
      const bookingsRef = collection(db, 'bookings');
      const q = query(
        bookingsRef,
        where('userId', '==', currentUser.uid),
        where('status', '==', 'completed'),
        orderBy('startDate', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      
      const bookingsData = [];
      querySnapshot.forEach((doc) => {
        bookingsData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      setCompletedBookings(bookingsData);
    } catch (error) {
      console.error('Error fetching completed bookings:', error);
      setError('Failed to load completed bookings');
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="completed-bookings-container">
      <div className="page-header">
        <h1>Your Completed Trips</h1>
        <p className="page-subtitle">Share your experiences and help other travelers plan their perfect getaway!</p>
      </div>
      
      {loading ? (
        <div className="loading">Loading your completed trips...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : completedBookings.length === 0 ? (
        <div className="no-bookings">
          <div className="empty-state">
            <div className="empty-icon">✈</div>
            <h2>No completed trips yet</h2>
            <p>Once you've completed a trip with Travenest, you'll be able to share your experience here.</p>
            <Link to="/packages" className="btn-primary">Explore Travel Packages</Link>
          </div>
        </div>
      ) : (
        <>
          <div className="completed-bookings-list">
            {completedBookings.map((booking) => (
              <div key={booking.id} className="completed-booking-card">
                <div className="booking-image">
                  <img 
                    src={booking.packageImage || '/placeholder-trip.jpg'} 
                    alt={booking.packageTitle} 
                  />
                </div>
                
                <div className="booking-content">
                  <div className="booking-header">
                    <h2 className="booking-title">{booking.packageTitle}</h2>
                    <div className="booking-status completed">Completed</div>
                  </div>
                  
                  <div className="booking-details">
                    <div className="booking-detail">
                      <span className="detail-label">Travel Date:</span>
                      <span className="detail-value">{formatDate(booking.startDate)}</span>
                    </div>
                    
                    <div className="booking-detail">
                      <span className="detail-label">Duration:</span>
                      <span className="detail-value">{booking.duration || 'N/A'} days</span>
                    </div>
                    
                    <div className="booking-detail">
                      <span className="detail-label">Travelers:</span>
                      <span className="detail-value">{booking.travelers} people</span>
                    </div>
                  </div>
                  
                  <div className="booking-actions">
                    <Link 
                      to={`/packages/${booking.packageId}`} 
                      className="btn-secondary"
                    >
                      View Package
                    </Link>
                    
                    <Link 
                      to={`/booking/${booking.id}/review`} 
                      className="btn-review-large"
                    >
                      <span className="review-icon-large">★</span>
                      Write Your Review
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="back-link">
            <Link to="/dashboard" className="text-link">
              ← Back to Dashboard
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default CompletedBookingsPage;