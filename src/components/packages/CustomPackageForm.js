import React, { useState } from 'react';
import { submitCustomPackage } from '../../services/packageService';

function CustomPackageForm() {
  // State and handlers as in previous example
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    travelers: '',
    travelDates: '',
    primaryDestination: '',
    secondaryDestinations: '',
    tripDuration: '',
    accommodationLevel: '',
    accommodationRequests: [],
    otherAccommodationRequests: '',
    diningExperiences: [],
    dietaryRequirements: [],
    foodAllergies: '',
    otherDietaryNeeds: '',
    experienceTypes: [],
    activityLevel: '',
    transportationPreferences: [],
    flightClass: '',
    budgetPerPerson: '',
    priorities: {
      accommodation: 0,
      dining: 0,
      activities: 0,
      transportation: 0,
      shopping: 0
    },
    specialOccasions: [],
    otherOccasion: '',
    specialRequests: '',
    addOns: []
  });

  // Form change handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      const arrayField = name.split('.')[0];
      if (checked) {
        setFormData({ ...formData, [arrayField]: [...formData[arrayField], value] });
      } else {
        setFormData({
          ...formData,
          [arrayField]: formData[arrayField].filter(item => item !== value)
        });
      }
    } else if (name.startsWith('priorities.')) {
      const priorityKey = name.split('.')[1];
      setFormData({
        ...formData,
        priorities: { ...formData.priorities, [priorityKey]: parseInt(value) }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitCustomPackage(formData);
      alert('Thank you for your submission! A Travenest travel specialist will contact you within 48 hours.');
      // Reset form or redirect
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        travelers: '',
        travelDates: '',
        primaryDestination: '',
        secondaryDestinations: '',
        tripDuration: '',
        accommodationLevel: '',
        accommodationRequests: [],
        otherAccommodationRequests: '',
        diningExperiences: [],
        dietaryRequirements: [],
        foodAllergies: '',
        otherDietaryNeeds: '',
        experienceTypes: [],
        activityLevel: '',
        transportationPreferences: [],
        flightClass: '',
        budgetPerPerson: '',
        priorities: {
          accommodation: 0,
          dining: 0,
          activities: 0,
          transportation: 0,
          shopping: 0
        },
        specialOccasions: [],
        otherOccasion: '',
        specialRequests: '',
        addOns: []
      });
    } catch (error) {
      alert('There was an error submitting your request. Please try again.');
    }
  };

  // Form JSX
  return (
    <div className="custom-package-container">
      <h2>Create Your Custom Travel Package</h2>
      <p>Complete the form below and our travel specialists will design a personalized itinerary for you.</p>
      
      <form onSubmit={handleSubmit} className="custom-package-form">
        {/* Personal Information Section */}
        <section className="form-section">
          <h3>Personal Information</h3>
          
          <div className="form-group">
            <label htmlFor="fullName">Full Name *</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
        </section>
        
        {/* Trip Details Section */}
        <section className="form-section">
          <h3>Trip Details</h3>
          
          <div className="form-group">
            <label htmlFor="travelers">Number of Travelers *</label>
            <input
              type="number"
              id="travelers"
              name="travelers"
              value={formData.travelers}
              onChange={handleChange}
              min="1"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="travelDates">Preferred Travel Dates *</label>
            <input
              type="text"
              id="travelDates"
              name="travelDates"
              value={formData.travelDates}
              onChange={handleChange}
              placeholder="MM/DD/YYYY - MM/DD/YYYY"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="tripDuration">Trip Duration (days) *</label>
            <input
              type="number"
              id="tripDuration"
              name="tripDuration"
              value={formData.tripDuration}
              onChange={handleChange}
              min="1"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="primaryDestination">Primary Destination *</label>
            <input
              type="text"
              id="primaryDestination"
              name="primaryDestination"
              value={formData.primaryDestination}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="secondaryDestinations">Other Destinations (optional)</label>
            <textarea
              id="secondaryDestinations"
              name="secondaryDestinations"
              value={formData.secondaryDestinations}
              onChange={handleChange}
              placeholder="List any other places you'd like to visit during your trip"
            />
          </div>
        </section>
        
        {/* Accommodation Section */}
        <section className="form-section">
          <h3>Accommodation Preferences</h3>
          
          <div className="form-group">
            <label htmlFor="accommodationLevel">Preferred Accommodation Level *</label>
            <select
              id="accommodationLevel"
              name="accommodationLevel"
              value={formData.accommodationLevel}
              onChange={handleChange}
              required
            >
              <option value="">Select an option</option>
              <option value="budget">Budget</option>
              <option value="standard">Standard</option>
              <option value="luxury">Luxury</option>
              <option value="ultra-luxury">Ultra Luxury</option>
            </select>
          </div>
          
          <div className="form-group checkbox-group">
            <label>Accommodation Requests</label>
            <div className="checkbox-options">
              <label>
                <input
                  type="checkbox"
                  name="accommodationRequests"
                  value="ocean-view"
                  checked={formData.accommodationRequests.includes('ocean-view')}
                  onChange={handleChange}
                /> Ocean View
              </label>
              <label>
                <input
                  type="checkbox"
                  name="accommodationRequests"
                  value="pool-access"
                  checked={formData.accommodationRequests.includes('pool-access')}
                  onChange={handleChange}
                /> Pool Access
              </label>
              <label>
                <input
                  type="checkbox"
                  name="accommodationRequests"
                  value="spa-services"
                  checked={formData.accommodationRequests.includes('spa-services')}
                  onChange={handleChange}
                /> Spa Services
              </label>
              <label>
                <input
                  type="checkbox"
                  name="accommodationRequests"
                  value="all-inclusive"
                  checked={formData.accommodationRequests.includes('all-inclusive')}
                  onChange={handleChange}
                /> All-Inclusive
              </label>
              <label>
                <input
                  type="checkbox"
                  name="accommodationRequests"
                  value="boutique-hotel"
                  checked={formData.accommodationRequests.includes('boutique-hotel')}
                  onChange={handleChange}
                /> Boutique Hotel
              </label>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="otherAccommodationRequests">Other Accommodation Requests</label>
            <textarea
              id="otherAccommodationRequests"
              name="otherAccommodationRequests"
              value={formData.otherAccommodationRequests}
              onChange={handleChange}
            />
          </div>
        </section>
        
        {/* Dining Section */}
        <section className="form-section">
          <h3>Dining & Culinary Preferences</h3>
          
          <div className="form-group checkbox-group">
            <label>Dining Experiences</label>
            <div className="checkbox-options">
              <label>
                <input
                  type="checkbox"
                  name="diningExperiences"
                  value="fine-dining"
                  checked={formData.diningExperiences.includes('fine-dining')}
                  onChange={handleChange}
                /> Fine Dining
              </label>
              <label>
                <input
                  type="checkbox"
                  name="diningExperiences"
                  value="local-cuisine"
                  checked={formData.diningExperiences.includes('local-cuisine')}
                  onChange={handleChange}
                /> Local Cuisine
              </label>
              <label>
                <input
                  type="checkbox"
                  name="diningExperiences"
                  value="cooking-classes"
                  checked={formData.diningExperiences.includes('cooking-classes')}
                  onChange={handleChange}
                /> Cooking Classes
              </label>
              <label>
                <input
                  type="checkbox"
                  name="diningExperiences"
                  value="street-food"
                  checked={formData.diningExperiences.includes('street-food')}
                  onChange={handleChange}
                /> Street Food
              </label>
              <label>
                <input
                  type="checkbox"
                  name="diningExperiences"
                  value="food-tours"
                  checked={formData.diningExperiences.includes('food-tours')}
                  onChange={handleChange}
                /> Food Tours
              </label>
            </div>
          </div>
          
          <div className="form-group checkbox-group">
            <label>Dietary Requirements</label>
            <div className="checkbox-options">
              <label>
                <input
                  type="checkbox"
                  name="dietaryRequirements"
                  value="vegetarian"
                  checked={formData.dietaryRequirements.includes('vegetarian')}
                  onChange={handleChange}
                /> Vegetarian
              </label>
              <label>
                <input
                  type="checkbox"
                  name="dietaryRequirements"
                  value="vegan"
                  checked={formData.dietaryRequirements.includes('vegan')}
                  onChange={handleChange}
                /> Vegan
              </label>
              <label>
                <input
                  type="checkbox"
                  name="dietaryRequirements"
                  value="gluten-free"
                  checked={formData.dietaryRequirements.includes('gluten-free')}
                  onChange={handleChange}
                /> Gluten-Free
              </label>
              <label>
                <input
                  type="checkbox"
                  name="dietaryRequirements"
                  value="dairy-free"
                  checked={formData.dietaryRequirements.includes('dairy-free')}
                  onChange={handleChange}
                /> Dairy-Free
              </label>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="foodAllergies">Food Allergies</label>
            <textarea
              id="foodAllergies"
              name="foodAllergies"
              value={formData.foodAllergies}
              onChange={handleChange}
              placeholder="Please list any food allergies"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="otherDietaryNeeds">Other Dietary Requirements</label>
            <textarea
              id="otherDietaryNeeds"
              name="otherDietaryNeeds"
              value={formData.otherDietaryNeeds}
              onChange={handleChange}
            />
          </div>
        </section>
        
        {/* Activities Section */}
        <section className="form-section">
          <h3>Experiences & Activities</h3>
          
          <div className="form-group checkbox-group">
            <label>Experience Types</label>
            <div className="checkbox-options">
              <label>
                <input
                  type="checkbox"
                  name="experienceTypes"
                  value="cultural"
                  checked={formData.experienceTypes.includes('cultural')}
                  onChange={handleChange}
                /> Cultural
              </label>
              <label>
                <input
                  type="checkbox"
                  name="experienceTypes"
                  value="adventure"
                  checked={formData.experienceTypes.includes('adventure')}
                  onChange={handleChange}
                /> Adventure
              </label>
              <label>
                <input
                  type="checkbox"
                  name="experienceTypes"
                  value="relaxation"
                  checked={formData.experienceTypes.includes('relaxation')}
                  onChange={handleChange}
                /> Relaxation
              </label>
              <label>
                <input
                  type="checkbox"
                  name="experienceTypes"
                  value="historical"
                  checked={formData.experienceTypes.includes('historical')}
                  onChange={handleChange}
                /> Historical
              </label>
              <label>
                <input
                  type="checkbox"
                  name="experienceTypes"
                  value="nature"
                  checked={formData.experienceTypes.includes('nature')}
                  onChange={handleChange}
                /> Nature
              </label>
              <label>
                <input
                  type="checkbox"
                  name="experienceTypes"
                  value="wildlife"
                  checked={formData.experienceTypes.includes('wildlife')}
                  onChange={handleChange}
                /> Wildlife
              </label>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="activityLevel">Activity Level *</label>
            <select
              id="activityLevel"
              name="activityLevel"
              value={formData.activityLevel}
              onChange={handleChange}
              required
            >
              <option value="">Select an option</option>
              <option value="leisurely">Leisurely - Minimal physical activity</option>
              <option value="moderate">Moderate - Some walking, light activities</option>
              <option value="active">Active - Regular activities, longer walks</option>
              <option value="challenging">Challenging - Demanding activities, hiking</option>
            </select>
          </div>
        </section>
        
        {/* Transportation Section */}
        <section className="form-section">
          <h3>Transportation</h3>
          
          <div className="form-group checkbox-group">
            <label>Transportation Preferences</label>
            <div className="checkbox-options">
              <label>
                <input
                  type="checkbox"
                  name="transportationPreferences"
                  value="private-transfers"
                  checked={formData.transportationPreferences.includes('private-transfers')}
                  onChange={handleChange}
                /> Private Transfers
              </label>
              <label>
                <input
                  type="checkbox"
                  name="transportationPreferences"
                  value="rental-car"
                  checked={formData.transportationPreferences.includes('rental-car')}
                  onChange={handleChange}
                /> Rental Car
              </label>
              <label>
                <input
                  type="checkbox"
                  name="transportationPreferences"
                  value="public-transport"
                  checked={formData.transportationPreferences.includes('public-transport')}
                  onChange={handleChange}
                /> Public Transport
              </label>
              <label>
                <input
                  type="checkbox"
                  name="transportationPreferences"
                  value="train"
                  checked={formData.transportationPreferences.includes('train')}
                  onChange={handleChange}
                /> Train
              </label>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="flightClass">Preferred Flight Class</label>
            <select
              id="flightClass"
              name="flightClass"
              value={formData.flightClass}
              onChange={handleChange}
            >
              <option value="">Select an option</option>
              <option value="economy">Economy</option>
              <option value="premium-economy">Premium Economy</option>
              <option value="business">Business</option>
              <option value="first">First</option>
            </select>
          </div>
        </section>
        
        {/* Budget & Priorities Section */}
        <section className="form-section">
          <h3>Budget & Priorities</h3>
          
          <div className="form-group">
            <label htmlFor="budgetPerPerson">Budget Per Person (USD) *</label>
            <select
              id="budgetPerPerson"
              name="budgetPerPerson"
              value={formData.budgetPerPerson}
              onChange={handleChange}
              required
            >
              <option value="">Select an option</option>
              <option value="under-2000">Under $2,000</option>
              <option value="2000-3500">$2,000 - $3,500</option>
              <option value="3500-5000">$3,500 - $5,000</option>
              <option value="5000-7500">$5,000 - $7,500</option>
              <option value="7500-10000">$7,500 - $10,000</option>
              <option value="10000-plus">$10,000+</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Trip Priorities (Rate from 1-5, with 5 being highest priority)</label>
            
            <div className="priority-slider">
              <label htmlFor="priorities.accommodation">Accommodation</label>
              <input
                type="range"
                id="priorities.accommodation"
                name="priorities.accommodation"
                min="1"
                max="5"
                value={formData.priorities.accommodation}
                onChange={handleChange}
              />
              <span>{formData.priorities.accommodation}</span>
            </div>
            
            <div className="priority-slider">
              <label htmlFor="priorities.dining">Dining</label>
              <input
                type="range"
                id="priorities.dining"
                name="priorities.dining"
                min="1"
                max="5"
                value={formData.priorities.dining}
                onChange={handleChange}
              />
              <span>{formData.priorities.dining}</span>
            </div>
            
            <div className="priority-slider">
              <label htmlFor="priorities.activities">Activities & Experiences</label>
              <input
                type="range"
                id="priorities.activities"
                name="priorities.activities"
                min="1"
                max="5"
                value={formData.priorities.activities}
                onChange={handleChange}
              />
              <span>{formData.priorities.activities}</span>
            </div>
            
            <div className="priority-slider">
              <label htmlFor="priorities.transportation">Transportation</label>
              <input
                type="range"
                id="priorities.transportation"
                name="priorities.transportation"
                min="1"
                max="5"
                value={formData.priorities.transportation}
                onChange={handleChange}
              />
              <span>{formData.priorities.transportation}</span>
            </div>
            
            <div className="priority-slider">
              <label htmlFor="priorities.shopping">Shopping</label>
              <input
                type="range"
                id="priorities.shopping"
                name="priorities.shopping"
                min="1"
                max="5"
                value={formData.priorities.shopping}
                onChange={handleChange}
              />
              <span>{formData.priorities.shopping}</span>
            </div>
          </div>
        </section>
        
        {/* Special Occasions & Additional Requests */}
        <section className="form-section">
          <h3>Special Occasions & Additional Requests</h3>
          
          <div className="form-group checkbox-group">
            <label>Special Occasions</label>
            <div className="checkbox-options">
              <label>
                <input
                  type="checkbox"
                  name="specialOccasions"
                  value="anniversary"
                  checked={formData.specialOccasions.includes('anniversary')}
                  onChange={handleChange}
                /> Anniversary
              </label>
              <label>
                <input
                  type="checkbox"
                  name="specialOccasions"
                  value="birthday"
                  checked={formData.specialOccasions.includes('birthday')}
                  onChange={handleChange}
                /> Birthday
              </label>
              <label>
                <input
                  type="checkbox"
                  name="specialOccasions"
                  value="honeymoon"
                  checked={formData.specialOccasions.includes('honeymoon')}
                  onChange={handleChange}
                /> Honeymoon
              </label>
              <label>
                <input
                  type="checkbox"
                  name="specialOccasions"
                  value="proposal"
                  checked={formData.specialOccasions.includes('proposal')}
                  onChange={handleChange}
                /> Proposal
              </label>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="otherOccasion">Other Special Occasion</label>
            <input
              type="text"
              id="otherOccasion"
              name="otherOccasion"
              value={formData.otherOccasion}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="specialRequests">Special Requests or Additional Information</label>
            <textarea
              id="specialRequests"
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleChange}
              placeholder="Tell us anything else that would help us create your perfect trip"
              rows="4"
            />
          </div>
        </section>
        
        {/* Additional Services Section */}
        <section className="form-section">
          <h3>Additional Services</h3>
          
          <div className="form-group checkbox-group">
            <label>Add-On Services</label>
            <div className="checkbox-options">
              <label>
                <input
                  type="checkbox"
                  name="addOns"
                  value="travel-insurance"
                  checked={formData.addOns.includes('travel-insurance')}
                  onChange={handleChange}
                /> Travel Insurance
              </label>
              <label>
                <input
                  type="checkbox"
                  name="addOns"
                  value="car-rental"
                  checked={formData.addOns.includes('car-rental')}
                  onChange={handleChange}
                /> Car Rental
              </label>
            </div>
          </div>
        </section>
      </form>
    </div>
  );
};

export default CustomPackageForm;