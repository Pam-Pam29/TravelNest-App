// functions/src/emailTemplates.ts

// Booking confirmation email template
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const bookingConfirmationTemplate = (booking: any) => {
    const startDate = new Date(booking.startDate).toLocaleDateString();
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #1e88e5; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        .booking-details { margin: 20px 0; }
        .detail-row { margin-bottom: 10px; }
        .detail-label { font-weight: bold; }
        .btn { display: inline-block; background-color: #1e88e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Your Booking is Confirmed!</h1>
        </div>
        <div class="content">
          <p>Dear ${booking.userName},</p>
          <p>Thank you for booking with Travenest. Your reservation is confirmed, and we're excited to help you experience an amazing journey!</p>
          
          <div class="booking-details">
            <h2>Booking Details</h2>
            <div class="detail-row">
              <span class="detail-label">Booking Reference:</span> ${booking.id}
            </div>
            <div class="detail-row">
              <span class="detail-label">Package:</span> ${booking.packageTitle}
            </div>
            <div class="detail-row">
              <span class="detail-label">Start Date:</span> ${startDate}
            </div>
            <div class="detail-row">
              <span class="detail-label">Number of Travelers:</span> ${booking.travelers}
            </div>
            <div class="detail-row">
              <span class="detail-label">Total Amount:</span> $${booking.totalPrice}
            </div>
          </div>
          
          <p>If you have any questions about your booking, please don't hesitate to contact our customer support team.</p>
          
          <p>We hope you enjoy your trip!</p>
          
          <p>Best regards,<br>The Travenest Team</p>
          
          <a href="https://your-travenest-app.web.app/dashboard" class="btn">View Your Bookings</a>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Travenest. All rights reserved.</p>
          <p>123 Travel Street, Adventure City, AC 12345</p>
        </div>
      </div>
    </body>
    </html>
    `;
  };
  
  // Custom package request confirmation template
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const customPackageRequestTemplate = (request: any) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #1e88e5; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Custom Travel Package Request Received</h1>
        </div>
        <div class="content">
          <p>Dear ${request.fullName},</p>
          <p>Thank you for submitting your custom travel package request with Travenest.</p>
          
          <p>A travel specialist will review your preferences and contact you within 48 hours to discuss your custom travel package and provide pricing options.</p>
          
          <p>Your request details:</p>
          <ul>
            <li><strong>Destination:</strong> ${request.primaryDestination}</li>
            <li><strong>Trip Duration:</strong> ${request.tripDuration} days</li>
            <li><strong>Number of Travelers:</strong> ${request.numTravelers}</li>
            <li><strong>Travel Dates:</strong> ${request.travelDates}</li>
          </ul>
          
          <p>If you have any immediate questions, please feel free to contact our customer support team.</p>
          
          <p>Best regards,<br>The Travenest Team</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Travenest. All rights reserved.</p>
          <p>123 Travel Street, Adventure City, AC 12345</p>
        </div>
      </div>
    </body>
    </html>
   `;
  };