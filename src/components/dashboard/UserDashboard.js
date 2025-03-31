// src/components/dashboard/UserDashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import BookingHistory from './BookingHistory';
import Profile from '../auth/Profile';
import { getUserBookings } from '../../services/bookingService';

const UserDashboard = () => {
  const { currentUser, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getUserBookings(currentUser.uid);
        setBookings(data);
      } catch (error) {
        setError('Failed to fetch bookings: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [currentUser]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>My Dashboard</h1>
        <p>Welcome back, {userProfile?.name || currentUser.email}!</p>
      </div>
      
      <div className="dashboard-tabs">
        <button 
          className={`tab ${activeTab === 'bookings' ? 'active' : ''}`} 
          onClick={() => setActiveTab('bookings')}
        >
          My Bookings
        </button>
        <button 
          className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          My Profile
        </button>
      </div>
      
      <div className="dashboard-highlight-action">
</div>

      <div className="dashboard-content">
        {activeTab === 'bookings' && (
          <>
            {error && <div className="error-message">{error}</div>}
            
            {loading ? (
              <div className="loading">Loading your bookings...</div>
            ) : (
              <>
                {bookings.length > 0 ? (
                  <BookingHistory bookings={bookings} />
                ) : (
                  <div className="no-bookings">
                    <p>You haven't made any bookings yet.</p>
                    <Link to="/packages" className="btn-browse">
                      Browse Travel Packages
                    </Link>
                  </div>
                )}
              </>
            )}
          </>
        )}
        
        {activeTab === 'profile' && (
          <Profile />
        )}
      </div>
    </div>
  );
};

export default UserDashboard;