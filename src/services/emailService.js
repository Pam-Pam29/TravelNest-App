// src/services/emailService.js
import emailjs from '@emailjs/browser';

// Initialize EmailJS with your user ID
emailjs.init("66XU7wP3JCGlL3Pqw"); // Replace with your actual public key from EmailJS

export const sendBookingConfirmationEmail = async (booking) => {
  try {
   
    // Prepare the template parameters
    const templateParams = {
      to_name: booking.userName || "",
      to_email: booking.userEmail ||"fakunlevic@gmail.com",
      booking_id: booking.id||"",
      package_title: booking.packageTitle || "",
      start_date: booking.startDate ? new Date(booking.startDate).toLocaleDateString() :"",
      travelers: booking.travelers || "",
      total_price: booking.totalPrice ||"",
    };
    console.log("Attempting to send email with params:", templateParams);

    // Send the email
    const response = await emailjs.send(
      'service_w0fs8q5',   // Replace with your EmailJS service ID
      'template_babx52t',  // Replace with your template ID
      templateParams
    );

    console.log('EmailJs response:', response);
    return { success: true };
  } catch (error) {
    console.error('EmailJs error:', error);
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

    // Send the email
    const response = await emailjs.send(
      'service_w0fs8q5',   // Replace with your EmailJS service ID
      ':template_1hpopxi', // Create another template for custom requests
      templateParams
    );

    return { success: true, response: response };
  } catch (error) {
   
    return { 
      success: false,
       error: error instanceof Error ? error : new Error('Failed to send email')};
}
};