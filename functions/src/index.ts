// functions/src/index.ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { sendEmail } from './emailService';
import { bookingConfirmationTemplate, customPackageRequestTemplate } from './emailTemplates';

admin.initializeApp();

// For Firebase Functions v2 syntax
const firestore = functions.firestore;

// Function to send booking confirmation email
export const sendBookingConfirmation = firestore
  .onDocumentCreated('bookings/{bookingId}', async (event) => {
    try {
      const snapshot = event.data;
      if (!snapshot) {
        console.log('No data associated with the event');
        return;
      }
      
      const bookingData = snapshot.data();
      const bookingId = event.params.bookingId;
      
      // Add the booking ID to the data
      const bookingWithId = {
        ...bookingData,
        id: bookingId
      };
      
      // Generate the email HTML
      const emailHtml = bookingConfirmationTemplate(bookingWithId);
      
      // Send the email
      await sendEmail(
        bookingData.userEmail,
        'Your Travenest Booking Confirmation',
        emailHtml
      );
      
      // Update the booking document to mark email as sent
      await admin.firestore().collection('bookings').doc(bookingId).update({
        confirmationEmailSent: true,
        confirmationEmailSentAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error sending booking confirmation:', error);
      return { success: false, error };
    }
  });

// Function to send payment confirmation email
export const sendPaymentConfirmation = firestore
  .onDocumentUpdated('bookings/{bookingId}', async (event) => {
    try {
      const beforeSnapshot = event.data?.before;
      const afterSnapshot = event.data?.after;
      
      if (!beforeSnapshot || !afterSnapshot) {
        console.log('Missing data in the event');
        return;
      }
      
      const beforeData = beforeSnapshot.data();
      const afterData = afterSnapshot.data();
      const bookingId = event.params.bookingId;
      
      // Check if payment status changed from 'pending' to 'paid'
      if (beforeData.paymentStatus !== 'paid' && afterData.paymentStatus === 'paid') {
        // Add the booking ID to the data
        const bookingWithId = {
          ...afterData,
          id: bookingId
        };
        
        // Generate the email HTML
        const emailHtml = bookingConfirmationTemplate(bookingWithId);
        
        // Send the email
        await sendEmail(
          afterData.userEmail,
          'Payment Confirmation - Travenest Booking',
          emailHtml
        );
        
        // Update the booking document to mark payment email as sent
        await admin.firestore().collection('bookings').doc(bookingId).update({
          paymentConfirmationEmailSent: true,
          paymentConfirmationEmailSentAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error sending payment confirmation:', error);
      return { success: false, error };
    }
  });

// Function to send custom package request confirmation
export const sendCustomPackageRequestConfirmation = firestore
  .onDocumentCreated('customPackageRequests/{requestId}', async (event) => {
    try {
      const snapshot = event.data;
      if (!snapshot) {
        console.log('No data associated with the event');
        return;
      }
      
      const requestData = snapshot.data();
      const requestId = event.params.requestId;
      
      // Add the request ID to the data
      const requestWithId = {
        ...requestData,
        id: requestId
      };
      
      // Generate the email HTML
      const emailHtml = customPackageRequestTemplate(requestWithId);
      
      // Send the email
      await sendEmail(
        requestData.email,
        'Your Custom Travel Package Request - Travenest',
        emailHtml
      );
      
      // Update the request document to mark email as sent
      await admin.firestore().collection('customPackageRequests').doc(requestId).update({
        confirmationEmailSent: true,
        confirmationEmailSentAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error sending custom package request confirmation:', error);
      return { success: false, error };
    }
});