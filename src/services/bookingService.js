// src/services/bookingService.js
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where 
} from 'firebase/firestore';
import { db } from './firebase';

// Create a new booking
export const createBooking = async (bookingData) => {
  try {
    const bookingsCollection = collection(db, 'bookings');
    const docRef = await addDoc(bookingsCollection, {
      ...bookingData,
      status: 'pending',
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

// Process payment for booking
export const processPayment = async (bookingId, paymentDetails) => {
  try {
    // In a real app, you would integrate with a payment provider here
    // This is a simplified version
    const bookingRef = doc(db, 'bookings', bookingId);
    await updateDoc(bookingRef, {
      paymentStatus: 'paid',
      paymentDetails,
      updatedAt: new Date()
    });
    
    // Send confirmation email (would be handled by Cloud Functions in production)
    console.log(Payment confirmation email sent for booking ${bookingId});
    
    return true;
  } catch (error) {
    throw error;
  }
};

// Get user's bookings
export const getUserBookings = async (userId) => {
  try {
    const bookingsQuery = query(
      collection(db, 'bookings'),
      where('userId', '==', userId)
    );
    
    const bookingSnapshot = await getDocs(bookingsQuery);
    return bookingSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw error;
  }
};

// Get booking by ID
export const getBookingById = async (bookingId) => {
  try {
    const bookingDoc = await getDoc(doc(db, 'bookings', bookingId));
    if (bookingDoc.exists()) {
      return {
        id: bookingDoc.id,
        ...bookingDoc.data()
      };
    } else {
      throw new Error('Booking not found');
    }
  } catch (error) {
    throw error;
  }
};

