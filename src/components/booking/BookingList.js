import React, { useState } from 'react';
import { updateBookingStatus } from '../../services/bookingService';
import BookingDetailsModal from './BookingDetailsModal';


const BookingList = ({ bookings, isProvider = false }) => {
  const [filter, setFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') {
      return booking.status === 'confirmed' && new Date(booking.startDate) > new Date();
    }
    if (filter === 'past') {
      return booking.status === 'completed' || new Date(booking.startDate) < new Date();
    }
    return booking.status === filter;
  });

  const handleStatusChange = async (bookingId, newStatus) => {
    setLoading(true);
    setError('');
    
    try {
      await updateBookingStatus(bookingId, newStatus);
      // Update the booking in the current list to avoid refetching
      const updatedBookings = bookings.map(booking => 
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      );
      // This will trigger a re-render with updated status
    } catch (error) {
      console.error('Error updating booking status:', error);
      setError('Failed to update booking status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    } /*as Intl.DateTimeFormatOptions;*/
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bookings-container">
      <div className="booking-filters">
        <button 
          className={filter === 'all' ? 'active' : ''} 
          onClick={() => setFilter('all')}
        >
          All Bookings
        </button>
        <button 
          className={filter === 'upcoming' ? 'active' : ''} 
          onClick={() => setFilter('upcoming')}
        >
          Upcoming
        </button>
        <button 
          className={filter === 'completed' ? 'active' : ''} 
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
        <button 
          className={filter === 'cancelled' ? 'active' : ''} 
          onClick={() => setFilter('cancelled')}
        >
          Cancelled
        </button>
      </div>
      
      {error && <p className="error-message">{error}</p>}
      
      {filteredBookings.length === 0 ? (
        <div className="no-bookings">
          <p>No {filter !== 'all' ? filter : ''} bookings found.</p>
        </div>
      ) : (
        <div className="bookings-list">
          <table>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Package</th>
                <th>Travel Date</th>
                <th>Travelers</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className={`status-${booking.status}`}>
                  <td>{booking.id.substring(0, 8)}...</td>
                  <td>{booking.packageTitle}</td>
                  <td>{formatDate(booking.startDate)}</td>
                  <td>{booking.travelers}</td>
                  <td>
                    <span className={`status-badge ${booking.status}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <button
                      className="view-details-button"
                      onClick={() => handleViewDetails(booking)}
                    >
                      View Details
                    </button>
                    
                    {isProvider && booking.status === 'pending' && (
                      <button
                        className="confirm-button"
                        onClick={() => handleStatusChange(booking.id, 'confirmed')}
                        disabled={loading}
                      >
                        Confirm
                      </button>
                    )}
                    
                    {isProvider && booking.status === 'confirmed' && new Date(booking.startDate) < new Date() && (
                      <button
                        className="complete-button"
                        onClick={() => handleStatusChange(booking.id, 'completed')}
                        disabled={loading}
                      >
                        Mark Completed
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {modalOpen && selectedBooking && (
        <BookingDetailsModal 
          booking={selectedBooking}
          onClose={closeModal}
          isProvider={isProvider}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};

export default BookingList;