// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Discover Amazing Places</h1>
          <p>
            Book all-inclusive travel packages with accommodations, tours, 
            and transportation for a stress-free vacation experience.
          </p>
          <Link to="/packages" className="btn-primary">Explore Packages</Link>
        </div>
      </section>
      
      <section className="features-section">
        <h2>Why Choose Travenest?</h2>
        <div className="features-container">
          <div className="feature-card">
            <div className="feature-icon">🏨</div>
            <h3>All-Inclusive Packages</h3>
            <p>
              Our packages include accommodations, guided tours, transportation,
              and other essential services.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🌎</div>
            <h3>Worldwide Destinations</h3>
            <p>
              Explore exciting destinations around the world with our 
              carefully curated travel packages.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Best Price Guarantee</h3>
            <p>
              We offer competitive prices for all our packages with no hidden fees.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🛡</div>
            <h3>Secure Booking</h3>
            <p>
              Book with confidence knowing your payments and personal information are secure.
            </p>
          </div>
        </div>
      </section>
      
      <section className="popular-destinations">
        <h2>Popular Destinations</h2>
        <div className="destinations-grid">
          <div className="destination-card">
            <div className="destination-image" style={{ backgroundImage: 'url(/assets/images/europe.jpg)' }}></div>
            <div className="destination-content">
              <h3>Europe</h3>
              <p>Explore historic cities and scenic landscapes</p>
              <Link to="/packages?region=Europe" className="btn-view">View Packages</Link>
            </div>
          </div>
          
          <div className="destination-card">
            <div className="destination-image" style={{ backgroundImage: 'url(/assets/images/asia.jpg)' }}></div>
            <div className="destination-content">
              <h3>Asia</h3>
              <p>Experience rich cultures and ancient traditions</p>
              <Link to="/packages?region=Asia" className="btn-view">View Packages</Link>
            </div>
          </div>
          
          <div className="destination-card">
            <div className="destination-image" style={{ backgroundImage: 'url(/assets/images/north-america.jpg)' }}></div>
            <div className="destination-content">
              <h3>North America</h3>
              <p>Discover diverse cities and natural wonders</p>
              <Link to="/packages?region=North%20America" className="btn-view">View Packages</Link>
            </div>
          </div>
          
          <div className="destination-card">
            <div className="destination-image" style={{ backgroundImage: 'url(/assets/images/australia.jpg)' }}></div>
            <div className="destination-content">
              <h3>Australia</h3>
              <p>Adventure through stunning landscapes</p>
              <Link to="/packages?region=Australia" className="btn-view">View Packages</Link>
            </div>
          </div>
        </div>
      </section>
      
      <section className="testimonials-section">
        <h2>What Our Travelers Say</h2>
        <div className="testimonials-container">
          <div className="testimonial-card">
            <div className="testimonial-rating">★★★★★</div>
            <p className="testimonial-text">
              "Travenest made our family vacation so easy. Everything was organized and
              we didn't have to worry about any details during our trip. Highly recommended!"
            </p>
            <div className="testimonial-author">- Sarah J.</div>
          </div>
          
          <div className="testimonial-card">
            <div className="testimonial-rating">★★★★★</div>
            <p className="testimonial-text">
              "The tour guides were exceptional and accommodations were top-notch. 
              I'll definitely be booking my next adventure with Travenest."
            </p>
            <div className="testimonial-author">- Michael R.</div>
          </div>
          
          <div className="testimonial-card">
            <div className="testimonial-rating">★★★★★</div>
            <p className="testimonial-text">
              "Seamless booking process and excellent customer service. Our Europe trip
              was perfectly planned and executed without any hassle."
            </p>
            <div className="testimonial-author">- Emily T.</div>
          </div>
        </div>
      </section>
      
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Start Your Adventure?</h2>
          <p>Browse our packages and book your dream vacation today!</p>
          <Link to="/packages" className="btn-primary">Explore Packages</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

