// src/components/booking/BookingConfirmation.js
// src/components/booking/BookingConfirmation.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBookingById } from '../../services/bookingService';
import { sendBookingConfirmationEmail } from '../../services/emailService';
import { useAuth } from '../../contexts/AuthContext';

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const { currentUser } = useAuth();
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await getBookingById(bookingId);
        
        // Verify that the booking belongs to the current user
        if (data.userId !== currentUser.uid) {
          setError('Unauthorized access to this booking');
          return;
        }
        
        setBooking(data);
        
        // Send confirmation email if not already sent
        if (data && !data.confirmationEmailSent) {
          const emailResult = await sendBookingConfirmationEmail(data);
          if (emailResult.success) {
            setEmailSent(true);
            // Optionally update the booking to mark email as sent
            // await updateBookingEmailStatus(bookingId, true);
          }
        } else {
          setEmailSent(true); // Email was already sent previously
        }
      } catch (error) {
        console.error('Error details:', error);
        setError('Failed to fetch booking confirmation: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, currentUser]);

  // Rest of your component remains the same
  // ...

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        // Try to get the booking ID from the URL or localStorage
        const idToUse = bookingId || localStorage.getItem('lastBookingId');
        
        console.log("Fetching confirmation for booking ID:", idToUse);
        
        if (!idToUse) {
          setError('No booking ID found. Please try creating a booking again.');
          setLoading(false);
          return;
        }
        
        const data = await getBookingById(idToUse);
        console.log("Confirmation data received:", data);
        
        // Verify that the booking belongs to the current user
        if (data.userId !== currentUser.uid) {
          console.error("Unauthorized: Booking belongs to user", data.userId);
          setError('Unauthorized access to this booking');
          return;
        }
        
        setBooking(data);
      } catch (error) {
        console.error('Confirmation error details:', error);
        setError('Failed to fetch booking confirmation: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, currentUser]);

  if (loading) {
    return <div className="loading">Loading confirmation details...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!booking) {
    return <div className="error-message">Booking not found</div>;
  }

  return (
    <div className="confirmation-container">
      <div className="confirmation-header">
        <div className="confirmation-icon">
          <span role="img" aria-label="success">✅</span>
        </div>
        <h2>Booking Confirmed!</h2>
        <p>Thank you for booking with Travenest. Your reservation is confirmed.</p>
      </div>
      
      <div className="confirmation-details">
        <div className="confirmation-number">
          <h3>Booking Reference</h3>
          <p>{booking.id}</p>
        </div>
        
        <div className="confirmation-info">
          <h3>Booking Details</h3>
          <div className="detail-item">
            <span>Package:</span>
            <span>{booking.packageTitle}</span>
          </div>
          <div className="detail-item">
            <span>Start Date:</span>
            <span>{new Date(booking.startDate).toLocaleDateString()}</span>
          </div>
          <div className="detail-item">
            <span>Number of Travelers:</span>
            <span>{booking.travelers}</span>
          </div>
          <div className="detail-item">
            <span>Total Amount:</span>
            <span>${booking.totalPrice}</span>
          </div>
          <div className="detail-item">
            <span>Payment Status:</span>
            <span className="status paid">Paid</span>
          </div>
        </div>
        
        <div className="confirmation-customer">
          <h3>Customer Information</h3>
          <div className="detail-item">
            <span>Name:</span>
            <span>{booking.userName}</span>
          </div>
          <div className="detail-item">
            <span>Email:</span>
            <span>{booking.userEmail}</span>
          </div>
        </div>
        
        {booking.specialRequests && (
          <div className="confirmation-requests">
            <h3>Special Requests</h3>
            <p>{booking.specialRequests}</p>
          </div>
        )}
      </div>
      
      <div className="confirmation-message">
        <p>
          We have sent a confirmation email to {booking.userEmail} with all the details of your booking.
          If you have any questions, please contact our customer support.
        </p>
      </div>
      
      <div className="confirmation-actions">
        <Link to="/dashboard" className="btn-primary">
          Go to My Bookings
        </Link>
        <Link to="/packages" className="btn-secondary">
          Browse More Packages
        </Link>
      </div>
    </div>
  );
};

export default BookingConfirmation;
