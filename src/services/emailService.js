// src/services/emailService.js
import emailjs from '@emailjs/browser';

// Initialize EmailJS with your user ID
emailjs.init("66XU7wP3JCGlL3Pqw");
    
export const sendBookingConfirmationEmail = async (booking) => {
    try {
      const templateParams = {
        booking_id: booking.id || "",
        package_title: booking.packageTitle || "",
        start_date: booking.startDate
           ? new Date(booking.startDate).toLocaleDateString()
           : "",
        travelers: booking.travelers || "",
        total_price: booking.totalPrice || "",
        to_name: booking.userName || "",
        to_email: booking.userEmail || ""
      };
         
      console.log("Email Template Params:", templateParams);
      console.log("About to send email with EmailJS");
         
      const response = await emailjs.send(
        'service_w0fs8q5',   // Your service ID
        'template_babx52t',  // Your template ID
        templateParams
      );
         
      console.log('EmailJS SUCCESS:', response);
      alert('Email sent successfully!');
      return { success: true };
    } catch (error) {
      console.error('EmailJS ERROR:', error);
      console.error('Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
      alert('Failed to send email. See console for details.');
      return { success: false, error };
    }
  };
 
export const sendCustomPackageRequestEmail = async (request) => {
  try {
    // Prepare the template parameters
    const templateParams = {
      to_name: request.fullName,
      to_email: request.email,
      destination: request.primaryDestination,
      trip_duration: request.tripDuration,
      travelers: request.numTravelers,
      travel_dates: request.travelDates
    };

    console.log("Custom Package Email Params:", templateParams);
    console.log("About to send custom package email with EmailJS");

    // Send the email
    const response = await emailjs.send(
      'service_w0fs8q5',   // Your service ID
      'template_1hpopxi',  // Your template ID (fixed)
      templateParams
    );

    console.log('EmailJS SUCCESS for custom package:', response);
    alert('Custom package request email sent successfully!');
    return { success: true, response: response };
  } catch (error) {
    console.error('EmailJS ERROR for custom package:', error);
    console.error('Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    alert('Failed to send custom package email. See console for details.');
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Failed to send email')
    };
  }
};