// src/components/dashboard/BookingHistory.js
import React from 'react';
import { Link } from 'react-router-dom';

const BookingHistory = ({ bookings }) => {
  // Sort bookings by date (most recent first)
  const sortedBookings = [...bookings].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const getStatusClass = (status) => {
    switch (status) {
      case 'confirmed':
        return 'status-confirmed';
      case 'pending':
        return 'status-pending';
      case 'cancelled':
        return 'status-cancelled';
      case 'completed':
        return 'status-completed';
      default:
        return '';
    }
  };

  return (
    <div className="booking-history">
      <h2>My Bookings</h2>
      
      <div className="booking-list">
        {sortedBookings.map((booking) => (
          <div key={booking.id} className="booking-card">
            <div className="booking-header">
              <h3>{booking.packageTitle}</h3>
              <span className={`booking-status ${getStatusClass(booking.status)}`}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </span>
            </div>
            
            <div className="booking-details">
              <div className="detail-row">
                <span>Booking Reference:</span>
                <span>{booking.id}</span>
              </div>
              <div className="detail-row">
                <span>Start Date:</span>
                <span>{new Date(booking.startDate).toLocaleDateString()}</span>
              </div>
              <div className="detail-row">
                <span>Travelers:</span>
                <span>{booking.travelers}</span>
              </div>
              <div className="detail-row">
                <span>Total:</span>
                <span>${booking.totalPrice}</span>
              </div>
              <div className="detail-row">
                <span>Payment:</span>
                <span className={booking.paymentStatus === 'paid' ? 'status-paid' : 'status-pending'}>
                  {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                </span>
              </div>
            </div>
            
            <div className="booking-actions">
              <Link to={`/confirmation/${booking.id}`} className="btn-view-details">
                View Details
              </Link>
              
              {booking.status === 'pending' && (
                <button className="btn-cancel">
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingHistory;


