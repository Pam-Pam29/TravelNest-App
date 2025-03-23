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
    console.log("Creating booking...");
    // Add a test field to confirm the function runs
    const bookingWithTest = {
      ...bookingData,
      status: 'pending',
      createdAt: new Date(),
      testField: 'This is a test booking'
    };
    
    const bookingsCollection = collection(db, 'bookings');
    const docRef = await addDoc(bookingsCollection, bookingWithTest);
    
    console.log("Booking created with ID:", docRef.id);
    
    // Return the ID explicitly
    return docRef.id;
  } catch (error) {
    console.error("Error creating booking:", error);
    alert("Error creating booking: " + error.message); // Add alert for visibility
    throw error;
  }
};

// Process payment for booking
export const processPayment = async (bookingId, paymentDetails) => {
  try {
    console.log("Service: Processing payment for booking:", bookingId);
    const bookingRef = doc(db, 'bookings', bookingId);
    await updateDoc(bookingRef, {
      paymentStatus: 'paid',
      paymentDetails,
      status: 'confirmed',
      updatedAt: new Date()
    });
    
    console.log("Service: Payment processed and booking updated");
    return true;
  } catch (error) {
    console.error("Service: Error processing payment:", error);
    throw error;
  }
};

// Get user's bookings
export const getUserBookings = async (userId) => {
  try {
    console.log("Service: Getting bookings for user:", userId);
    const bookingsQuery = query(
      collection(db, 'bookings'),
      where('userId', '==', userId)
    );
    
    const bookingSnapshot = await getDocs(bookingsQuery);
    const bookings = bookingSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log("Service: Retrieved", bookings.length, "bookings");
    return bookings;
  } catch (error) {
    console.error("Service: Error getting user bookings:", error);
    throw error;
  }
};

// Get booking by ID
export const getBookingById = async (bookingId) => {
  try {
    console.log("Service: Fetching booking document:", bookingId);
    const bookingDoc = await getDoc(doc(db, 'bookings', bookingId));
    console.log("Service: Document exists?", bookingDoc.exists());
    
    if (bookingDoc.exists()) {
      const bookingData = {
        id: bookingDoc.id,
        ...bookingDoc.data()
      };
      console.log("Service: Retrieved booking data:", bookingData);
      return bookingData;
    } else {
      console.error("Service: Booking document not found");
      throw new Error('Booking not found');
    }
  } catch (error) {
    console.error("Service: Error getting booking:", error);
    throw error;
  }
};

// Get all bookings (for admin)
export const getAllBookings = async () => {
  try {
    console.log("Service: Getting all bookings");
    const bookingsCollection = collection(db, 'bookings');
    const bookingSnapshot = await getDocs(bookingsCollection);
    const bookings = bookingSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log("Service: Retrieved", bookings.length, "total bookings");
    return bookings;
  } catch (error) {
    console.error("Service: Error getting all bookings:", error);
    throw error;
  }
};

// Update booking status
export const updateBookingStatus = async (bookingId, status) => {
  try {
    console.log("Service: Updating booking status:", bookingId, status);
    const bookingRef = doc(db, 'bookings', bookingId);
    await updateDoc(bookingRef, {
      status,
      updatedAt: new Date()
    });
    console.log("Service: Booking status updated");
    return true;
  } catch (error) {
    console.error("Service: Error updating booking status:", error);
    throw error;
  }
};
