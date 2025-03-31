import React, { useState } from 'react';
import '../styles/style.css'

const ContactUs = () => {

           
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [newsletter, setNewsletter] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    setFormSubmitted(true);
    // Reset form after submission
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
    // Reset submission status after 3 seconds
    setTimeout(() => setFormSubmitted(false), 3000);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the newsletter signup to your backend
    console.log('Newsletter signup:', newsletter);
    setNewsletterSubmitted(true);
    setNewsletter('');
    // Reset submission status after 3 seconds
    setTimeout(() => setNewsletterSubmitted(false), 3000);
  };

    return (
        <div className="content-overlay">
          <div className="contact-us-container">
        <h1>Contact Us</h1>

      <section className="intro-section">
        <h2>Get in Touch</h2>
        <p>
          We're here to help make your travel dreams a reality. Whether you have questions about booking, 
          need assistance planning your trip, or want to provide feedback on your experience, 
          our team is ready to assist you.
        </p>
      </section>

      <section className="contact-grid">
        <div className="contact-card">
          <h2>Customer Support</h2>
          <p><strong>Phone:</strong> +1 (800) 555-2789</p>
          <p><strong>Email:</strong> support@travelnest.com</p>
          <p><strong>Hours:</strong> 24/7, 365 days a year</p>
        </div>

        <div className="contact-card">
          <h2>Business Inquiries</h2>
          <p><strong>Phone:</strong> +1 (212) 555-1234</p>
          <p><strong>Email:</strong> business@travelnest.com</p>
          <p><strong>Hours:</strong> Monday-Friday, 9 AM - 5 PM EST</p>
        </div>

        <div className="contact-card">
          <h2>Property Partnerships</h2>
          <p>Interested in listing your property with TravelNest?</p>
          <p><strong>Email:</strong> partners@travelnest.com</p>
        </div>

        <div className="contact-card">
          <h2>Media Inquiries</h2>
          <p>For press and media requests:</p>
          <p><strong>Email:</strong> media@travelnest.com</p>
        </div>
      </section>

      <section className="office-section">
        <h2>Visit Our Office</h2>
        <div className="office-details">
          <p><strong>Headquarters:</strong></p>
          <p>TravelNest Inc.</p>
          <p>123 Explorer Avenue, Suite 500</p>
          <p>New York, NY 10001</p>
          <p>United States</p>
        </div>
      </section>

      <section className="social-section">
        <h2>Connect With Us</h2>
        <div className="social-links">
          <p>
            <strong>Social Media:</strong> Instagram: @TravelNest | Facebook: /TravelNestOfficial | 
            Twitter: @TravelNest | LinkedIn: TravelNest Inc.
          </p>
        </div>
      </section>

      <section className="form-section">
        <h2>Send Us a Message</h2>
        <p>Have a question or comment? Fill out the form below and we'll get back to you within 24 hours.</p>
        
        {formSubmitted && (
          <div className="success-message">
            Thank you for your message! We'll get back to you soon.
          </div>
        )}
        
        <form onSubmit={handleContactSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Phone (optional):</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="subject">Subject:</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="message">Message:</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              rows="5"
            ></textarea>
          </div>
          
          <button type="submit" className="submit-btn">Submit</button>
        </form>
      </section>

      <section className="newsletter-section">
        <h2>Subscribe to Our Newsletter</h2>
        <p>Stay updated on travel tips, exclusive deals, and destination inspiration.</p>
        
        {newsletterSubmitted && (
          <div className="success-message">
            Thanks for subscribing to our newsletter!
          </div>
        )}
        
        <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
          <input
            type="email"
            placeholder="Your email address"
            value={newsletter}
            onChange={(e) => setNewsletter(e.target.value)}
            required
          />
          <button type="submit">Subscribe</button>
        </form>
      </section>

      <p className="closing-message"><em>We look forward to hearing from you and helping you plan your next adventure!</em></p>
    </div>
    </div>
  );
};

export default ContactUs;