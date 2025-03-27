import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../services/firebase';
import '../../styles/userReview.css';

const UserReview = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  
  const [booking, setBooking] = useState(null);
  const [package_, setPackage] = useState(null);
  const [provider, setProvider] = useState(null);
  const [user, setUser] = useState(null);
  const [existingReview, setExistingReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Review form state
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  
  // Categories of ratings
  const [categoryRatings, setCategoryRatings] = useState({
    value: 0,
    cleanliness: 0,
    service: 0,
    location: 0,
  });

  useEffect(() => {
    // Check authentication
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchData(currentUser.uid);
      } else {
        navigate('/login');
      }
    });
    
    return () => unsubscribe();
  }, [navigate]);
  
  const fetchData = async (userId) => {
    try {
      setLoading(true);
      
      if (!bookingId) {
        setError('Invalid booking ID');
        setLoading(false);
        return;
      }
      
      // Fetch booking
      const bookingRef = doc(db, 'bookings', bookingId);
      const bookingDoc = await getDoc(bookingRef);
      
      if (!bookingDoc.exists()) {
        setError('Booking not found');
        setLoading(false);
        return;
      }
      
      const bookingData = bookingDoc.data();
      
      // Verify booking belongs to user
      if (bookingData.userId !== userId) {
        setError('You are not authorized to review this booking');
        setLoading(false);
        return;
      }
      
      // Verify booking is completed
      if (bookingData.status !== 'completed') {
        setError('You can only review completed bookings');
        setLoading(false);
        return;
      }
      
      setBooking(bookingData);
      
      // Fetch package
      const packageRef = doc(db, 'packages', bookingData.packageId);
      const packageDoc = await getDoc(packageRef);
      
      if (packageDoc.exists()) {
        const packageData = packageDoc.data();
        setPackage(packageData);
        
        // Fetch provider
        const providerRef = doc(db, 'serviceProviders', packageData.providerId);
        const providerDoc = await getDoc(providerRef);
        
        if (providerDoc.exists()) {
          setProvider(providerDoc.data());
        }
      }
      
      // Check for existing review
      const reviewsRef = collection(db, 'reviews');
      const q = query(
        reviewsRef,
        where('bookingId', '==', bookingId),
        where('userId', '==', userId)
      );
      
      const reviewSnapshot = await getDocs(q);
      
      if (!reviewSnapshot.empty) {
        const reviewData = reviewSnapshot.docs[0].data();
        setExistingReview(reviewData);
        
        // Pre-fill form with existing review data
        setRating(reviewData.overallRating || 0);
        setReviewTitle(reviewData.title || '');
        setReviewText(reviewData.text || '');
        setCategoryRatings({
          value: reviewData.categoryRatings?.value || 0,
          cleanliness: reviewData.categoryRatings?.cleanliness || 0,
          service: reviewData.categoryRatings?.service || 0,
          location: reviewData.categoryRatings?.location || 0,
        });
      }
      
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error loading review data');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCategoryRatingChange = (category, value) => {
    setCategoryRatings((prev) => ({
      ...prev,
      [category]: value,
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please provide an overall rating');
      return;
    }
    
    if (!reviewTitle.trim()) {
      setError('Please provide a review title');
      return;
    }
    
    if (!reviewText.trim()) {
      setError('Please provide review details');
      return;
    }
    
    try {
      setSubmitting(true);
      setError('');
      
      if (!user || !booking || !package_) {
        setError('Missing required information');
        return;
      }
      
      const reviewData = {
        bookingId,
        packageId: booking.packageId,
        providerId: package_.providerId,
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        overallRating: rating,
        title: reviewTitle,
        text: reviewText,
        categoryRatings,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
      // Add the review to Firestore
      await addDoc(collection(db, 'reviews'), reviewData);
      
      setSuccess(true);
      window.scrollTo(0, 0);
      
      // Redirect after a delay
      setTimeout(() => {
        navigate(`/packages/${booking.packageId}`);
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting review:', error);
      setError('Error submitting review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="user-review-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="user-review-container">
        <div className="review-error">
          <h3>Unable to Load Review</h3>
          <p>{error}</p>
          <button onClick={() => navigate('/bookings')} className="btn-primary">
            Return to My Bookings
          </button>
        </div>
      </div>
    );
  }
  
  if (success) {
    return (
      <div className="user-review-container">
        <div className="review-success">
          <div className="success-icon">✓</div>
          <h3>Review Submitted Successfully!</h3>
          <p>Thank you for sharing your experience.</p>
          <p>You will be redirected to the package page shortly...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-review-container">
      <div className="user-review-card">
        <h2 className="review-title">
          {existingReview ? 'Edit Your Review' : 'Rate Your Experience'}
        </h2>
        
        <div className="booking-info">
          <div className="package-image">
            <img src={package_?.imageUrl || '/placeholder-image.jpg'} alt={package_?.title} />
          </div>
          <div className="booking-details">
            <h3>{package_?.title}</h3>
            <p className="provider-name">by {provider?.businessName}</p>
            <p className="booking-date">
              Traveled on: {booking?.startDate ? new Date(booking.startDate.toDate()).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="review-form">
          <div className="overall-rating-section">
            <h4>Overall Rating</h4>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${star <= (hoveredRating || rating) ? 'filled' : ''}`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                >
                  ★
                </span>
              ))}
              <span className="rating-text">
                {rating > 0 ? `${rating} out of 5` : 'Click to rate'}
              </span>
            </div>
          </div>
          
          <div className="category-ratings-section">
            <h4>Rate Specific Aspects</h4>
            
            {Object.entries({
              value: 'Value for Money',
              cleanliness: 'Cleanliness',
              service: 'Service Quality',
              location: 'Location',
            }).map(([category, label]) => (
              <div key={category} className="category-rating">
                <span className="category-label">{label}</span>
                <div className="category-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`category-star ${star <= categoryRatings[category] ? 'filled' : ''}`}
                      onClick={() => handleCategoryRatingChange(category, star)}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="form-group">
            <label htmlFor="reviewTitle">Review Title</label>
            <input
              type="text"
              id="reviewTitle"
              value={reviewTitle}
              onChange={(e) => setReviewTitle(e.target.value)}
              placeholder="Summarize your experience"
              maxLength={100}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="reviewText">Your Review</label>
            <textarea
              id="reviewText"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Tell others about your experience - what did you like or dislike? Was the description accurate?"
              rows={5}
              maxLength={1000}
              required
            ></textarea>
            <div className="character-count">
              {reviewText.length}/1000 characters
            </div>
          </div>
          
          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate(`/packages/${booking?.packageId}`)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : (existingReview ? 'Update Review' : 'Submit Review')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserReview;