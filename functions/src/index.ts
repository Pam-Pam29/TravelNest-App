import { onRequest } from 'firebase-functions/v2/https';
import { onDocumentCreated, onDocumentUpdated } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';

admin.initializeApp();

// Monitor new bookings
export const monitorBookings = onDocumentCreated('bookings/{bookingId}', async (event) => {
  try {
    const snapshot = event.data;
    if (!snapshot) {
      return { success: false, error: 'No data associated with the event' };
    }
    
    // We're using bookingId here, so it's not unused
    const bookingId = event.params.bookingId;
    
    // Update the booking with a timestamp
    await admin.firestore().collection('bookings').doc(bookingId).update({
      processedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
});

// Monitor payment status changes
export const monitorPayments = onDocumentUpdated('bookings/{bookingId}', async (event) => {
  try {
    const beforeData = event.data?.before.data();
    const afterData = event.data?.after.data();
    
    if (!beforeData || !afterData) {
      return { success: false, error: 'No data available' };
    }
    
    // Check if payment status changed from 'pending' to 'paid'
    if (beforeData.paymentStatus !== 'paid' && afterData.paymentStatus === 'paid') {
      // Update booking status to confirmed
      await admin.firestore().collection('bookings').doc(event.params.bookingId).update({
        status: 'confirmed',
        confirmedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
});

// Simple API endpoint
export const checkServiceStatus = onRequest((request, response) => {
  response.json({
    status: 'online',
    timestamp: new Date().toISOString()
});
});