// src/pages/PaymentTestPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const PaymentTestPage = () => {
  const [bookingId, setBookingId] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (bookingId) {
      navigate(/payment/${bookingId});
    }
  };
  
  return (
    <div className="page-container">
      <h2>Payment Test Page</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="bookingId">Enter Booking ID:</label>
          <input
            type="text"
            id="bookingId"
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn-primary">Go to Payment Page</button>
      </form>
    </div>
  );
};

export default PaymentTestPage;
