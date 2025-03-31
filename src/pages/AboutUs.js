import React from 'react';
import '../styles/style.css'

const AboutUs = () => {
    const overrideStyles = {
      background: 'white',
      backgroundImage: 'none'
    };
  
    return (
      <div className="about-us-container" style={overrideStyles}>
        <h1>About TravelNest</h1>

      <section className="story-section">
        <h2>Our Story</h2>
        <p>
          Founded in 2018, TravelNest emerged from a simple idea: travel should be about experiences, not logistics. 
          Our founders, passionate travelers themselves, recognized the gap between the promise of seamless travel 
          planning and the often fragmented reality.
        </p>
        <p>
          What began as a small team working out of a co-working space has grown into a dedicated community of travel 
          enthusiasts committed to revolutionizing how people explore the world. Through innovative technology and 
          personalized service, we've helped thousands of travelers create memories that last a lifetime.
        </p>
      </section>

      <section className="mission-section">
        <h2>Our Mission</h2>
        <p>
          At TravelNest, we believe travel has the power to transform lives. Our mission is to make authentic travel 
          experiences accessible to everyone by simplifying the planning process and connecting travelers with unique 
          destinations and accommodations that match their personal preferences.
        </p>
      </section>

      <section className="features-section">
        <h2>What Sets Us Apart</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Personalized Recommendations</h3>
            <p>Our proprietary algorithm learns your travel preferences to suggest destinations and accommodations 
            tailored specifically to you.</p>
          </div>
          <div className="feature-card">
            <h3>Curated Experiences</h3>
            <p>We personally vet each property and experience in our catalog to ensure quality and authenticity.</p>
          </div>
          <div className="feature-card">
            <h3>Sustainable Travel</h3>
            <p>We're committed to promoting responsible tourism that respects local communities and environments.</p>
          </div>
          <div className="feature-card">
            <h3>24/7 Support</h3>
            <p>From booking to return, our dedicated travel concierge team is always available to assist you.</p>
          </div>
        </div>
      </section>

      <section className="team-section">
        <h2>Our Team</h2>
        <p>
          Behind TravelNest is a diverse team of travel enthusiasts, technology experts, and customer service 
          specialists united by our passion for exploration. Our team members have collectively visited over 
          120 countries, bringing first-hand knowledge and expertise to every aspect of our service.
        </p>
      </section>

      <section className="cta-section">
        <h2>Join Our Journey</h2>
        <p>
          Whether you're planning your first international adventure or you're a seasoned globetrotter, 
          we invite you to experience the TravelNest difference. Let us help you discover the joy of 
          hassle-free travel that connects you with the heart and soul of your destination.
        </p>
        <p className="tagline"><em>TravelNest - Where Your Journey Begins</em></p>
      </section>
    </div>
    );
};

export default AboutUs;