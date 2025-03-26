// src/components/booking/PaymentForm.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookingById, processPayment } from '../../services/bookingService';
import { useAuth } from '../../contexts/AuthContext';
import { sendBookingConfirmationEmail } from '../../services/emailService';

const PaymentForm = () => {
  const { bookingId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [booking, setBooking] = useState(null);
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const fetchBooking = async () => {
      try {
        // Try to get the booking ID from the URL or localStorage
        const idToUse = bookingId || localStorage.getItem('lastBookingId');
        
        console.log("Attempting to fetch booking with ID:", idToUse);
        
        if (!idToUse) {
          setError('No booking ID found. Please try creating a booking again.');
          setLoading(false);
          return;
        }
        
        const data = await getBookingById(bookingId);
        console.log("Retrieved booking data:", data);
        console.log("User email from booking:", data.userEmail);
        
        // Verify that the booking belongs to the current user
        if (data.userId !== currentUser.uid) {
          console.error("Unauthorized: Booking belongs to user", data.userId);
          setError('Unauthorized access to this booking');
          return;
        }
        
        setBooking(data);
      } catch (error) {
        console.error('Detailed error:', error);
        setError('Failed to fetch booking: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Get the booking ID from the state or localStorage
    const idToUse = booking?.id || bookingId || localStorage.getItem('lastBookingId');
    
    if (!idToUse) {
      setError('Booking information not available');
      return;
    }
    
    // Basic validation
    if (!cardName || !cardNumber || !expiryDate || !cvv) {
      setError('Please fill all payment fields');
      return;
    }
    
    // Simple card number validation
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      setError('Invalid card number. Please enter a 16-digit card number.');
      return;
    }
    
    try {
      setProcessing(true);
      setError('');
      
      console.log("Processing payment for booking:", idToUse);
      // For demo purposes, we're not actually processing a real payment
      const paymentDetails = {
        cardName,
        // Store last 4 digits only for security
        cardLast4: cardNumber.slice(-4),
        paymentDate: new Date().toISOString()
      };
      
      await processPayment(idToUse, paymentDetails);
      console.log("Payment processed successfully");
      // In your PaymentForm.js, add after successful payment processing


// Inside your handlePaymentSuccess function
const handlePaymentSuccess = async (paymentIntent) => {
  try {
    // Your existing code to update booking status
    // ...
    
    // Get the updated booking with payment info
    const updatedBooking = await getBookingById(booking.id);
      
    // Send payment confirmation email
    await sendBookingConfirmationEmail({
      ...updatedBooking,
      paymentStatus: 'paid'
    });
    
    setPaymentSuccess(true);
    // Navigate to confirmation page after a short delay
    setTimeout(() => {
      navigate(`/confirmation/${booking.id}`);
    }, 2000);
  } catch (err) {
    console.error('Error updating booking:', err);
    setError('Payment successful, but there was an issue updating your booking. Please contact support.');
  }
};
      
      // Store the booking ID for the confirmation page
      localStorage.setItem('lastBookingId', idToUse);
      
      navigate(`/confirmation/${idToUse}`);
    } catch (error) {
      console.error("Payment processing error:", error);
      setError('Payment processing failed: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading payment information...</div>;
  }

  if (error && !booking) {
    return (
      <div className="payment-form-container">
        <div className="error-message">{error}</div>
        <div className="manual-booking-entry">
          <h3>Enter Booking ID Manually</h3>
          <p>If you know your booking ID, you can enter it below:</p>
          <input 
            type="text" 
            placeholder="Enter booking ID" 
            onChange={(e) => {
              localStorage.setItem('lastBookingId', e.target.value);
            }} 
          />
          <button 
            onClick={() => {
              const manualId = localStorage.getItem('lastBookingId');
              if (manualId) {
                window.location.href = `/payment/${manualId}`;
              }
            }}
          >
            Load Booking
          </button>
        </div>
      </div>
    );
  }

  if (!booking) {
    return <div className="error-message">Booking not found</div>;
  }

  return (
    <div className="payment-form-container">
      <h2>Payment Information</h2>
      
      <div className="booking-summary">
        <h3>Booking Summary</h3>
        <p><strong>Booking ID:</strong> {booking.id}</p>
        <p><strong>Package:</strong> {booking.packageTitle}</p>
        <p><strong>Start Date:</strong> {new Date(booking.startDate).toLocaleDateString()}</p>
        <p><strong>Travelers:</strong> {booking.travelers}</p>
        <p><strong>Total Amount:</strong> ${booking.totalPrice}</p>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="payment-form">
        <div className="form-group">
          <label htmlFor="cardName">Cardholder Name</label>
          <input
            type="text"
            id="cardName"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            placeholder="Name on card"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="cardNumber">Card Number</label>
          <input
            type="text"
            id="cardNumber"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
            placeholder="1234 5678 9012 3456"
            required
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="expiryDate">Expiry Date</label>
            <input
              type="text"
              id="expiryDate"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              placeholder="MM/YY"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="cvv">CVV</label>
            <input
              type="text"
              id="cvv"
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
              placeholder="123"
              required
            />
          </div>
        </div>
        
        <div className="total-payment">
          <span>Total Payment</span>
          <span>${booking.totalPrice}</span>
        </div>
        
        <div className="payment-note">
          <p>
            <small>
              Note: This is a demo application. No actual payment will be processed and no real card information should be entered.
            </small>
          </p>
        </div>
        
        <button 
          type="submit" 
          className="btn-pay-now"
          disabled={processing}
        >
          {processing ? 'Processing Payment...' : 'Complete Payment'}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
