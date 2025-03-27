import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, limit, getDocs, getDoc, doc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import '../../styles/reviewList.css';

const ReviewList = ({ packageId }) => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    avgRating: 0,
    totalReviews: 0,
    ratingDistribution: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    },
    categoryAverages: {
      value: 0,
      cleanliness: 0,
      service: 0,
      location: 0
    }
  });
  
  const [filterRating, setFilterRating] = useState(0);
  const [sortOption, setSortOption] = useState('newest');
  const [visibleReviews, setVisibleReviews] = useState(5);
  
  useEffect(() => {
    fetchReviews();
  }, [packageId]);
  
  useEffect(() => {
    applyFiltersAndSort();
  }, [filterRating, sortOption, reviews]);
  
  const fetchReviews = async () => {
    try {
      setLoading(true);
      
      const reviewsRef = collection(db, 'reviews');
      const q = query(
        reviewsRef,
        where('packageId', '==', packageId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      
      const reviewsData = [];
      querySnapshot.forEach((doc) => {
        reviewsData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      // Fetch user details for each review
      const reviewsWithUserDetails = await Promise.all(
        reviewsData.map(async (review) => {
          try {
            const userDoc = await getDoc(doc(db, 'users', review.userId));
            return {
              ...review,
              userPhotoUrl: userDoc.data()?.photoURL || null
            };
          } catch (error) {
            console.error('Error fetching user details:', error);
            return review;
          }
        })
      );
      
      setReviews(reviewsWithUserDetails);
      setFilteredReviews(reviewsWithUserDetails);
      calculateReviewStats(reviewsWithUserDetails);
      
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Error loading reviews');
    } finally {
      setLoading(false);
    }
  };
  
  // Rest of the code remains the same as in the previous implementation
  
  const renderStars = (rating) => {
    return (
      <div className="stars-display">
        {[1, 2, 3, 4, 5].map((star) => (
          <span 
            key={star} 
            className={`star ${star <= rating ? 'filled' : ''}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const calculatePercentage = (count) => {
    return stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
  };

  // Existing render methods and return statement
  // ...

  return (
    <div className="reviews-container">
      <div className="rating-bars">
        {[5, 4, 3, 2, 1].map((rating) => (
          <div 
            key={rating} 
            className={`rating-bar-row ${filterRating === rating ? 'active' : ''}`}
            onClick={() => handleFilterChange(rating)}
          >
            <div className="rating-label">{rating} stars</div>
            <div className="rating-bar-container">
              <div 
                className="rating-bar-fill"
                style={{ width: `${calculatePercentage(stats.ratingDistribution[rating])}%` }}
              ></div>
            </div>
            <div className="rating-count">{stats.ratingDistribution[rating]}</div>
          </div>
        ))}
      </div>
      {/* Rest of the component */}
    </div>
  );
};

export default ReviewList;