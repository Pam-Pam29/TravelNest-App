// src/components/packages/CustomPackageQuestionnaire.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../services/firebase';
import '../../styles/questionnaire.css'

const CustomPackageQuestionnaire = () => {
  const { currentUser, userProfile, loading } = useAuth();
  const navigate = useNavigate();
  useEffect (() => {
    console.log('CustomPackageQuestionnaire - Current User', currentUser)
    console.log('CustomPackageQuestionnaire - User Profile', userProfile)
    console.log('CustomPackageQuestionnaire - Loading', loading)
    if (!loading && !currentUser) {
        console.log('Redirecting to login from questionnaire');
        navigate('/login', { state: { from: '/custom-package' } });
      }
    }, [currentUser, userProfile, loading, navigate]);
  
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: userProfile?.name || '',
    email: currentUser?.email || '',
    phone: '',
    numTravelers: 1,
    travelDates: '',
    
    // Destination
    primaryDestination: '',
    secondaryDestinations: '',
    tripDuration: '',
    
    // Accommodation
    accommodationLevel: '',
    accommodationRequests: [],
    otherAccommodationRequests: '',
    
    // Dining
    diningExperiences: [],
    dietaryRequirements: [],
    otherDietaryNeeds: '',
    
    // Activities
    activities: [],
    activityLevel: '',
    
    // Transportation
    transportationModes: [],
    flightClass: '',
    
    // Budget
    budgetPerPerson: '',
    budgetPriorities: {
      accommodation: 0,
      dining: 0,
      activities: 0,
      transportation: 0,
      shopping: 0
    },
    
    // Special Occasions
    specialOccasions: [],
    otherSpecialOccasion: '',
    specialRequests: '',
    
    // Add-ons
    addOns: []
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleCheckboxChange = (e, category) => {
    const { name, checked } = e.target;
    
    if (checked) {
      setFormData({
        ...formData,
        [category]: [...formData[category], name]
      });
    } else {
      setFormData({
        ...formData,
        [category]: formData[category].filter(item => item !== name)
      });
    }
  };
  
  const handlePriorityChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      budgetPriorities: {
        ...formData.budgetPriorities,
        [name]: parseInt(value)
      }
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      navigate('/login', { state: { from: '/custom-package' } });
      return;
    }
    
    try {
      setSubmitting(true);
      setError('');
      
      // Add timestamp and user info
      const questionnaireData = {
        ...formData,
        userId: currentUser.uid,
        userName: userProfile?.name || 'User',
        userEmail: currentUser.email,
        status: 'pending',
        createdAt: new Date()
      };
      
      // Save to Firestore
      const docRef = await addDoc(collection(db, 'customPackageRequests'), questionnaireData);
      
      console.log("Custom package request submitted with ID:", docRef.id);
      setSuccess(true);

      // Send confirmation email
    const emailResult = await sendCustomPackageRequestEmail({
      ...formData,
      id: docRef.id,
      email: currentUser.email,
      fullName: userProfile?.name || formData.fullName
    });
    
    if (emailResult.success) {
      console.log("Confirmation email sent successfully");
    } else {
      console.warn("Failed to send confirmation email", emailResult.error);
    }
    
    setSuccess(true);
      
      // Scroll to top to show success message
      window.scrollTo(0, 0);
      
      // Optionally, clear form after successful submission
      // setFormData({ ... }); // Reset form
      
    } catch (error) {
      console.error("Error submitting questionnaire:", error);
      setError('Failed to submit questionnaire: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };
  
  if (success) {
    return (
      <div className="success-container">
        <div className="success-icon">✓</div>
        <h2>Thank You for Your Custom Package Request!</h2>
        <p>Your questionnaire has been submitted successfully. A Travenest travel specialist will contact you within 48 hours to discuss your custom travel package and provide pricing options based on your preferences.</p>
        <div className="success-actions">
          <button onClick={() => navigate('/dashboard')} className="btn-primary">Go to Dashboard</button>
          <button onClick={() => navigate('/packages')} className="btn-secondary">Browse Packages</button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="questionnaire-container">
      <h1>Custom Travel Package Questionnaire</h1>
      <p className="questionnaire-intro">
        Thank you for choosing Travenest for your next adventure! To create your perfect custom travel package, 
        please complete the following questionnaire.
      </p>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="questionnaire-form">
        {/* Personal Information */}
        <section className="form-section">
          <h2>Personal Information</h2>
          
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
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
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="numTravelers">Number of Travelers</label>
              <input
                type="number"
                id="numTravelers"
                name="numTravelers"
                value={formData.numTravelers}
                onChange={handleInputChange}
                min="1"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="travelDates">Preferred Travel Dates</label>
              <input
                type="text"
                id="travelDates"
                name="travelDates"
                value={formData.travelDates}
                onChange={handleInputChange}
                placeholder="MM/YYYY or specific dates"
                required
              />
            </div>
          </div>
        </section>
        
        {/* Destination Preferences */}
        <section className="form-section">
          <h2>Destination Preferences</h2>
          
          <div className="form-group">
            <label htmlFor="primaryDestination">Primary Destination</label>
            <input
              type="text"
              id="primaryDestination"
              name="primaryDestination"
              value={formData.primaryDestination}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="secondaryDestinations">Secondary Destinations (if any)</label>
            <input
              type="text"
              id="secondaryDestinations"
              name="secondaryDestinations"
              value={formData.secondaryDestinations}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="tripDuration">Trip Duration (number of days)</label>
            <input
              type="number"
              id="tripDuration"
              name="tripDuration"
              value={formData.tripDuration}
              onChange={handleInputChange}
              min="1"
              required
            />
          </div>
        </section>
        
        {/* Accommodation Preferences */}
        <section className="form-section">
          <h2>Accommodation Preferences</h2>
          
          <div className="form-group radio-group">
            <p className="label-heading">Please select your preferred accommodation level:</p>
            
            <div className="radio-option">
              <input
                type="radio"
                id="standard"
                name="accommodationLevel"
                value="Standard"
                checked={formData.accommodationLevel === 'Standard'}
                onChange={handleInputChange}
              />
              <label htmlFor="standard">
                <strong>Standard:</strong> Comfortable, clean accommodations with basic amenities ($)
              </label>
            </div>
            
            <div className="radio-option">
              <input
                type="radio"
                id="premium"
                name="accommodationLevel"
                value="Premium"
                checked={formData.accommodationLevel === 'Premium'}
                onChange={handleInputChange}
              />
              <label htmlFor="premium">
                <strong>Premium:</strong> Higher quality accommodations with additional amenities and better locations ($$)
              </label>
            </div>
            
            <div className="radio-option">
              <input
                type="radio"
                id="luxury"
                name="accommodationLevel"
                value="Luxury"
                checked={formData.accommodationLevel === 'Luxury'}
                onChange={handleInputChange}
              />
              <label htmlFor="luxury">
                <strong>Luxury:</strong> High-end accommodations with premium amenities, exceptional service, and prime locations ($$$)
              </label>
            </div>
            
            <div className="radio-option">
              <input
                type="radio"
                id="ultraLuxury"
                name="accommodationLevel"
                value="Ultra-Luxury"
                checked={formData.accommodationLevel === 'Ultra-Luxury'}
                onChange={handleInputChange}
              />
              <label htmlFor="ultraLuxury">
                <strong>Ultra-Luxury:</strong> Exclusive 5-star properties, private villas, or resorts with personalized service and exceptional experiences ($$$$)
              </label>
            </div>
          </div>
          
          <div className="form-group checkbox-group">
            <p className="label-heading">Specific accommodation requests:</p>
            
            <div className="checkbox-grid">
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  id="oceanView"
                  name="Ocean/water view"
                  checked={formData.accommodationRequests.includes('Ocean/water view')}
                  onChange={(e) => handleCheckboxChange(e, 'accommodationRequests')}
                />
                <label htmlFor="oceanView">Ocean/water view</label>
              </div>
              
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  id="mountainView"
                  name="Mountain view"
                  checked={formData.accommodationRequests.includes('Mountain view')}
                  onChange={(e) => handleCheckboxChange(e, 'accommodationRequests')}
                />
                <label htmlFor="mountainView">Mountain view</label>
              </div>
              
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  id="cityCenter"
                  name="City center location"
                  checked={formData.accommodationRequests.includes('City center location')}
                  onChange={(e) => handleCheckboxChange(e, 'accommodationRequests')}
                />
                <label htmlFor="cityCenter">City center location</label>
              </div>
              
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  id="privatePool"
                  name="Private pool/hot tub"
                  checked={formData.accommodationRequests.includes('Private pool/hot tub')}
                  onChange={(e) => handleCheckboxChange(e, 'accommodationRequests')}
                />
                <label htmlFor="privatePool">Private pool/hot tub</label>
              </div>
              
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  id="familyFriendly"
                  name="Family-friendly"
                  checked={formData.accommodationRequests.includes('Family-friendly')}
                  onChange={(e) => handleCheckboxChange(e, 'accommodationRequests')}
                />
                <label htmlFor="familyFriendly">Family-friendly</label>
              </div>
              
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  id="adultOnly"
                  name="Adult-only"
                  checked={formData.accommodationRequests.includes('Adult-only')}
                  onChange={(e) => handleCheckboxChange(e, 'accommodationRequests')}
                />
                <label htmlFor="adultOnly">Adult-only</label>
              </div>
              
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  id="ecoFriendly"
                  name="Eco-friendly/Sustainable"
                  checked={formData.accommodationRequests.includes('Eco-friendly/Sustainable')}
                  onChange={(e) => handleCheckboxChange(e, 'accommodationRequests')}
                />
                <label htmlFor="ecoFriendly">Eco-friendly/Sustainable</label>
              </div>
              
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  id="historicProperty"
                  name="Historic property"
                  checked={formData.accommodationRequests.includes('Historic property')}
                  onChange={(e) => handleCheckboxChange(e, 'accommodationRequests')}
                />
                <label htmlFor="historicProperty">Historic property</label>
              </div>
              
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  id="boutiqueHotel"
                  name="Boutique hotel"
                  checked={formData.accommodationRequests.includes('Boutique hotel')}
                  onChange={(e) => handleCheckboxChange(e, 'accommodationRequests')}
                />
                <label htmlFor="boutiqueHotel">Boutique hotel</label>
              </div>
              
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  id="allInclusive"
                  name="All-inclusive resort"
                  checked={formData.accommodationRequests.includes('All-inclusive resort')}
                  onChange={(e) => handleCheckboxChange(e, 'accommodationRequests')}
                />
                <label htmlFor="allInclusive">All-inclusive resort</label>
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="otherAccommodationRequests">Other accommodation requests</label>
            <textarea
              id="otherAccommodationRequests"
              name="otherAccommodationRequests"
              value={formData.otherAccommodationRequests}
              onChange={handleInputChange}
              rows="3"
            ></textarea>
          </div>
        </section>
        
       {/* Dining & Culinary Preferences */}
       <section className="form-section">
          <h2>Dining & Culinary Preferences</h2>
          
          <div className="form-group checkbox-group">
            <p className="label-heading">What types of dining experiences are you interested in?</p>
            
            <div className="checkbox-grid">
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  id="localCuisine"
                  name="Local authentic cuisine"
                  checked={formData.diningExperiences.includes('Local authentic cuisine')}
                  onChange={(e) => handleCheckboxChange(e, 'diningExperiences')}
                />
                <label htmlFor="localCuisine">Local authentic cuisine</label>
              </div>
              
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  id="fineDining"
                  name="Fine dining experiences"
                  checked={formData.diningExperiences.includes('Fine dining experiences')}
                  onChange={(e) => handleCheckboxChange(e, 'diningExperiences')}
                />
                <label htmlFor="fineDining">Fine dining experiences</label>
              </div>
              
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  id="streetFood"
                  name="Street food exploration"
                  checked={formData.diningExperiences.includes('Street food exploration')}
                  onChange={(e) => handleCheckboxChange(e, 'diningExperiences')}
                />
                <label htmlFor="streetFood">Street food exploration</label>
              </div>
              
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  id="cookingClasses"
                  name="Cooking classes/culinary workshops"
                  checked={formData.diningExperiences.includes('Cooking classes/culinary workshops')}
                  onChange={(e) => handleCheckboxChange(e, 'diningExperiences')}
                />
                <label htmlFor="cookingClasses">Cooking classes/culinary workshops</label>
              </div>
              
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  id="foodTours"
                  name="Food tours"
                  checked={formData.diningExperiences.includes('Food tours')}
                  onChange={(e) => handleCheckboxChange(e, 'diningExperiences')}
                />
                <label htmlFor="foodTours">Food tours</label>
              </div>
              
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  id="michelinStarred"
                  name="Michelin-starred restaurants"
                  checked={formData.diningExperiences.includes('Michelin-starred restaurants')}
                  onChange={(e) => handleCheckboxChange(e, 'diningExperiences')}
                />
                <label htmlFor="michelinStarred">Michelin-starred restaurants</label>
              </div>
              
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  id="farmToTable"
                  name="Farm-to-table experiences"
                  checked={formData.diningExperiences.includes('Farm-to-table experiences')}
                  onChange={(e) => handleCheckboxChange(e, 'diningExperiences')}
                />
                <label htmlFor="farmToTable">Farm-to-table experiences</label>
              </div>
              
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  id="tastings"
                  name="Wine/beer/spirits tastings"
                  checked={formData.diningExperiences.includes('Wine/beer/spirits tastings')}
                  onChange={(e) => handleCheckboxChange(e, 'diningExperiences')}
                />
                <label htmlFor="tastings">Wine/beer/spirits tastings</label>
              </div>
              
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  id="foodMarkets"
                  name="Food markets and festivals"
                  checked={formData.diningExperiences.includes('Food markets and festivals')}
                  onChange={(e) => handleCheckboxChange(e, 'diningExperiences')}
                />
                <label htmlFor="foodMarkets">Food markets and festivals</label>
              </div>
            </div>
          </div>
          
          <div className="form-group checkbox-group">
            <p className="label-heading">Do you have any dietary requirements or preferences?</p>
            
            <div className="checkbox-grid">
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  id="vegetarian"
                  name="Vegetarian"
                  checked={formData.dietaryRequirements.includes('Vegetarian')}
                  onChange={(e) => handleCheckboxChange(e, 'dietaryRequirements')}
                />
                <label htmlFor="vegetarian">Vegetarian</label>
              </div>
              
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  id="vegan"
                  name="Vegan"
                  checked={formData.dietaryRequirements.includes('Vegan')}
                  onChange={(e) => handleCheckboxChange(e, 'dietaryRequirements')}
                />
                <label htmlFor="vegan">Vegan</label>
              </div>
              
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  id="glutenFree"
                  name="Gluten-free"
                  checked={formData.dietaryRequirements.includes('Gluten-free')}
                  onChange={(e) => handleCheckboxChange(e, 'dietaryRequirements')}
                />
                <label htmlFor="glutenFree">Gluten-free</label>
              </div>
              
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  id="halal"
                  name="Halal"
                  checked={formData.dietaryRequirements.includes('Halal')}
                  onChange={(e) => handleCheckboxChange(e, 'dietaryRequirements')}
                />
                <label htmlFor="halal">Halal</label>
              </div>
              
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  id="kosher"
                  name="Kosher"
                  checked={formData.dietaryRequirements.includes('Kosher')}
                  onChange={(e) => handleCheckboxChange(e, 'dietaryRequirements')}
                />
                <label htmlFor="kosher">Kosher</label>
              </div>
              
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  id="foodAllergies"
                  name="Food allergies"
                  checked={formData.dietaryRequirements.includes('Food allergies')}
                  onChange={(e) => handleCheckboxChange(e, 'dietaryRequirements')}
                />
                <label htmlFor="foodAllergies">Food allergies</label>
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="otherDietaryNeeds">Other dietary needs (please specify food allergies here)</label>
            <textarea
              id="otherDietaryNeeds"
              name="otherDietaryNeeds"
              value={formData.otherDietaryNeeds}
              onChange={handleInputChange}
              rows="3"
            ></textarea>
          </div>
        </section>
  {/* Activities & Experiences */}
  <section className="form-section">
          <h2>Activities & Experiences</h2>
          
          <div className="form-group checkbox-group">
            <p className="label-heading">What types of experiences interest you?</p>
            
            <div className="checkbox-grid">
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  id="cultural"
                  name="Cultural (museums, historical sites, local customs)"
                  checked={formData.activities.includes('Cultural (museums, historical sites, local customs)')}
                  onChange={(e) => handleCheckboxChange(e, 'activities')}
                />
                <label htmlFor="cultural">Cultural (museums, historical sites, local customs)</label>
              </div>
              
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  id="adventure"
                  name="Adventure (hiking, water sports, zip-lining, etc.)"
                  checked={formData.activities.includes('Adventure (hiking, water sports, zip-lining, etc.)')}
                  onChange={(e) => handleCheckboxChange(e, 'activities')}
                />
                <label htmlFor="adventure">Adventure (hiking, water sports, zip-lining, etc.)</label>
              </div>
              
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  id="relaxation"
                  name="Relaxation (spa, beaches, wellness)"
                  checked={formData.activities.includes('Relaxation (spa, beaches, wellness)')}
                  onChange={(e) => handleCheckboxChange(e, 'activities')}
                />
                <label htmlFor="relaxation">Relaxation (spa, beaches, wellness)</label>
              </div>
              
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  id="natureWildlife"
                  name="Nature & Wildlife"
                  checked={formData.activities.includes('Nature & Wildlife')}
                  onChange={(e) => handleCheckboxChange(e, 'activities')}
                />
                <label htmlFor="natureWildlife">Nature & Wildlife</label>
              </div>
              
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  id="shopping"
                  name="Shopping"
                  checked={formData.activities.includes('Shopping')}
                  onChange={(e) => handleCheckboxChange(e, 'activities')}
                />
                <label htmlFor="shopping">Shopping</label>
              </div>
              
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  id="nightlife"
                  name="Nightlife & Entertainment"
                  checked={formData.activities.includes('Nightlife & Entertainment')}
                  onChange={(e) => handleCheckboxChange(e, 'activities')}
                />
                <label htmlFor="nightlife">Nightlife & Entertainment</label>
              </div>
              
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  id="artsMusic"
                  name="Arts & Music"
                  checked={formData.activities.includes('Arts & Music')}
                  onChange={(e) => handleCheckboxChange(e, 'activities')}
                />
                <label htmlFor="artsMusic">Arts & Music</label>
              </div>
              
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  id="photography"
                  name="Photography"
                  checked={formData.activities.includes('Photography')}
                  onChange={(e) => handleCheckboxChange(e, 'activities')}
                />
                <label htmlFor="photography">Photography</label>
              </div>
              
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  id="localCommunity"
                  name="Local community engagement/volunteering"
                  checked={formData.activities.includes('Local community engagement/volunteering')}
                  onChange={(e) => handleCheckboxChange(e, 'activities')}
                />
                <label htmlFor="localCommunity">Local community engagement/volunteering</label>
              </div>
            </div>
          </div>
          
          <div className="form-group radio-group">
            <p className="label-heading">What is your preferred activity level?</p>
            
            <div className="radio-option">
              <input
                type="radio"
                id="lowActivity"
                name="activityLevel"
                value="Low"
                checked={formData.activityLevel === 'Low'}
                onChange={handleInputChange}
              />
              <label htmlFor="lowActivity">
                Low (primarily relaxation with minimal physical activity)
              </label>
            </div>
            
            <div className="radio-option">
              <input
                type="radio"
                id="moderateActivity"
                name="activityLevel"
                value="Moderate"
                checked={formData.activityLevel === 'Moderate'}
                onChange={handleInputChange}
              />
              <label htmlFor="moderateActivity">
                Moderate (balanced mix of activities and downtime)
              </label>
            </div>
            
            <div className="radio-option">
              <input
                type="radio"
                id="highActivity"
                name="activityLevel"
                value="High"
                checked={formData.activityLevel === 'High'}
                onChange={handleInputChange}
              />
              <label htmlFor="highActivity">
                High (active itinerary with full days of exploration)
              </label>
            </div>
          </div>
        </section>
  {/* Transportation Preferences */}
  <section className="form-section">
          <h2>Transportation Preferences</h2>
          
          <div className="form-group checkbox-group">
            <p className="label-heading">How would you like to get around at your destination?</p>
            
            <div className="checkbox-grid">
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  id="privateTransfers"
                  name="Private transfers"
                  checked={formData.transportationModes.includes('Private transfers')}
                  onChange={(e) => handleCheckboxChange(e, 'transportationModes')}
                />
                <label htmlFor="privateTransfers">Private transfers</label>
              </div>
              
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  id="rentalCar"
                  name="Rental car"
                  checked={formData.transportationModes.includes('Rental car')}
                  onChange={(e) => handleCheckboxChange(e, 'transportationModes')}
                />
                <label htmlFor="rentalCar">Rental car</label>
              </div>
              
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  id="publicTransport"
                  name="Public transportation"
                  checked={formData.transportationModes.includes('Public transportation')}
                  onChange={(e) => handleCheckboxChange(e, 'transportationModes')}
                />
                <label htmlFor="publicTransport">Public transportation</label>
              </div>
              
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  id="walkingBiking"
                  name="Walking/biking where possible"
                  checked={formData.transportationModes.includes('Walking/biking where possible')}
                  onChange={(e) => handleCheckboxChange(e, 'transportationModes')}
                />
                <label htmlFor="walkingBiking">Walking/biking where possible</label>
              </div>
              
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  id="combinationOptions"
                  name="Combination of options"
                  checked={formData.transportationModes.includes('Combination of options')}
                  onChange={(e) => handleCheckboxChange(e, 'transportationModes')}
                />
                <label htmlFor="combinationOptions">Combination of options</label>
              </div>
            </div>
          </div>
          
          <div className="form-group radio-group">
            <p className="label-heading">For flights:</p>
            
            <div className="radio-option">
              <input
                type="radio"
                id="economy"
                name="flightClass"
                value="Economy"
                checked={formData.flightClass === 'Economy'}
                onChange={handleInputChange}
              />
              <label htmlFor="economy">Economy</label>
            </div>
            
            <div className="radio-option">
              <input
                type="radio"
                id="premiumEconomy"
                name="flightClass"
                value="Premium Economy"
                checked={formData.flightClass === 'Premium Economy'}
                onChange={handleInputChange}
              />
              <label htmlFor="premiumEconomy">Premium Economy</label>
            </div>
            
            <div className="radio-option">
              <input
                type="radio"
                id="businessClass"
                name="flightClass"
                value="Business Class"
                checked={formData.flightClass === 'Business Class'}
                onChange={handleInputChange}
              />
              <label htmlFor="businessClass">Business Class</label>
            </div>
            
            <div className="radio-option">
              <input
                type="radio"
                id="firstClass"
                name="flightClass"
                value="First Class"
                checked={formData.flightClass === 'First Class'}
                onChange={handleInputChange}
              />
              <label htmlFor="firstClass">First Class</label>
            </div>
          </div>
        </section>
  {/* Budget Considerations */}
  <section className="form-section">
          <h2>Budget Considerations</h2>
          
          <div className="form-group radio-group">
            <p className="label-heading">What is your approximate budget per person (excluding flights)?</p>
            
            <div className="radio-option">
              <input
                type="radio"
                id="budget1"
                name="budgetPerPerson"
                value="$100-200 per day"
                checked={formData.budgetPerPerson === '$100-200 per day'}
                onChange={handleInputChange}
              />
              <label htmlFor="budget1">$100-200 per day</label>
            </div>
            
            <div className="radio-option">
              <input
                type="radio"
                id="budget2"
                name="budgetPerPerson"
                value="$200-350 per day"
                checked={formData.budgetPerPerson === '$200-350 per day'}
                onChange={handleInputChange}
              />
              <label htmlFor="budget2">$200-350 per day</label>
            </div>
            
            <div className="radio-option">
              <input
                type="radio"
                id="budget3"
                name="budgetPerPerson"
                value="$350-500 per day"
                checked={formData.budgetPerPerson === '$350-500 per day'}
                onChange={handleInputChange}
              />
              <label htmlFor="budget3">$350-500 per day</label>
            </div>
            
            <div className="radio-option">
              <input
                type="radio"
                id="budget4"
                name="budgetPerPerson"
                value="$500-750 per day"
                checked={formData.budgetPerPerson === '$500-750 per day'}
                onChange={handleInputChange}
              />
              <label htmlFor="budget4">$500-750 per day</label>
            </div>
            
            <div className="radio-option">
              <input
                type="radio"
                id="budget5"
                name="budgetPerPerson"
                value="$750-1000 per day"
                checked={formData.budgetPerPerson === '$750-1000 per day'}
                onChange={handleInputChange}
              />
              <label htmlFor="budget5">$750-1000 per day</label>
            </div>
            
            <div className="radio-option">
              <input
                type="radio"
                id="budget6"
                name="budgetPerPerson"
                value="$1000+ per day"
                checked={formData.budgetPerPerson === '$1000+ per day'}
                onChange={handleInputChange}
              />
              <label htmlFor="budget6">$1000+ per day</label>
            </div>
          </div>
          
          <div className="form-group">
            <p className="label-heading">What aspects of your trip would you prioritize for spending? (Rank from 1-5, with 1 being highest priority)</p>
            
            <div className="priority-ranking">
              <div className="priority-item">
                <label htmlFor="priorityAccommodation">Accommodation</label>
                <select
                  id="priorityAccommodation"
                  name="accommodation"
                  value={formData.budgetPriorities.accommodation}
                  onChange={handlePriorityChange}
                >
                  <option value="0">Select</option>
                  <option value="1">1 (Highest)</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5 (Lowest)</option>
                </select>
              </div>
              
              <div className="priority-item">
                <label htmlFor="priorityDining">Dining/Food</label>
                <select
                  id="priorityDining"
                  name="dining"
                  value={formData.budgetPriorities.dining}
                  onChange={handlePriorityChange}
                >
                  <option value="0">Select</option>
                  <option value="1">1 (Highest)</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5 (Lowest)</option>
                </select>
              </div>
              
              <div className="priority-item">
                <label htmlFor="priorityActivities">Activities/Experiences</label>
                <select
                  id="priorityActivities"
                  name="activities"
                  value={formData.budgetPriorities.activities}
                  onChange={handlePriorityChange}
                >
                  <option value="0">Select</option>
                  <option value="1">1 (Highest)</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5 (Lowest)</option>
                </select>
              </div>
              
              <div className="priority-item">
                <label htmlFor="priorityTransportation">Transportation</label>
                <select
                  id="priorityTransportation"
                  name="transportation"
                  value={formData.budgetPriorities.transportation}
                  onChange={handlePriorityChange}
                >
                  <option value="0">Select</option>
                  <option value="1">1 (Highest)</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5 (Lowest)</option>
                </select>
              </div>
              
              <div className="priority-item">
                <label htmlFor="priorityShopping">Shopping/Souvenirs</label>
                <select
                  id="priorityShopping"
                  name="shopping"
                  value={formData.budgetPriorities.shopping}
                  onChange={handlePriorityChange}
                >
                  <option value="0">Select</option>
                  <option value="1">1 (Highest)</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5 (Lowest)</option>
                </select>
              </div>
            </div>
          </div>
        </section>
  {/* Special Occasions & Requests */}
  <section className="form-section">
          <h2>Special Occasions & Requests</h2>
          
          <div className="form-group checkbox-group">
            <p className="label-heading">Are you celebrating any special occasions during this trip?</p>
            
            <div className="checkbox-grid">
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  id="birthday"
                  name="Birthday"
                  checked={formData.specialOccasions.includes('Birthday')}
                  onChange={(e) => handleCheckboxChange(e, 'specialOccasions')}
                />
                <label htmlFor="birthday">Birthday</label>
              </div>
              
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  id="anniversary"
                  name="Anniversary"
                  checked={formData.specialOccasions.includes('Anniversary')}
                  onChange={(e) => handleCheckboxChange(e, 'specialOccasions')}
                />
                <label htmlFor="anniversary">Anniversary</label>
              </div>
              
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  id="honeymoon"
                  name="Honeymoon"
                  checked={formData.specialOccasions.includes('Honeymoon')}
                  onChange={(e) => handleCheckboxChange(e, 'specialOccasions')}
                />
                <label htmlFor="honeymoon">Honeymoon</label>
              </div>
              
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  id="proposal"
                  name="Proposal"
                  checked={formData.specialOccasions.includes('Proposal')}
                  onChange={(e) => handleCheckboxChange(e, 'specialOccasions')}
                />
                <label htmlFor="proposal">Proposal</label>
              </div>
              
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  id="graduation"
                  name="Graduation"
                  checked={formData.specialOccasions.includes('Graduation')}
                  onChange={(e) => handleCheckboxChange(e, 'specialOccasions')}
                />
                <label htmlFor="graduation">Graduation</label>
              </div>
              
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  id="retirement"
                  name="Retirement"
                  checked={formData.specialOccasions.includes('Retirement')}
                  onChange={(e) => handleCheckboxChange(e, 'specialOccasions')}
                />
                <label htmlFor="retirement">Retirement</label>
              </div>
              
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  id="otherOccasion"
                  name="Other"
                  checked={formData.specialOccasions.includes('Other')}
                  onChange={(e) => handleCheckboxChange(e, 'specialOccasions')}
                />
                <label htmlFor="otherOccasion">Other</label>
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="otherSpecialOccasion">If you selected 'Other' above, please specify:</label>
            <input
              type="text"
              id="otherSpecialOccasion"
              name="otherSpecialOccasion"
              value={formData.otherSpecialOccasion}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="specialRequests">Any other special requests or information you'd like us to know?</label>
            <textarea
              id="specialRequests"
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleInputChange}
              rows="4"
            ></textarea>
          </div>
        </section>
        
        {/* Package Add-Ons */}
        <section className="form-section">
          <h2>Package Add-Ons</h2>
          
          <div className="form-group checkbox-group">
            <p className="label-heading">Would you be interested in any of these additional services? (Additional fees apply)</p>
            
            <div className="checkbox-grid">
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  id="airportLounge"
                  name="Airport lounge access"
                  checked={formData.addOns.includes('Airport lounge access')}
                  onChange={(e) => handleCheckboxChange(e, 'addOns')}
                />
                <label htmlFor="childcare">Child care/babysitting services</label>
              </div>
              
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  id="specialEvents"
                  name="Special event tickets (concerts, sporting events, etc.)"
                  checked={formData.addOns.includes('Special event tickets (concerts, sporting events, etc.)')}
                  onChange={(e) => handleCheckboxChange(e, 'addOns')}
                />
                <label htmlFor="specialEvents">Special event tickets (concerts, sporting events, etc.)</label>
              </div>
              
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  id="privateTours"
                  name="Private tours with expert guides"
                  checked={formData.addOns.includes('Private tours with expert guides')}
                  onChange={(e) => handleCheckboxChange(e, 'addOns')}
                />
                <label htmlFor="privateTours">Private tours with expert guides</label>
              </div>
            </div>
          </div>
        </section>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="btn-primary"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Questionnaire'}
          </button>
        </div>
        
        <div className="form-disclaimer">
          <p>
            Thank you for completing our questionnaire! A Travenest travel specialist will contact you within 48 hours to discuss your custom travel package and provide pricing options based on your preferences.
          </p>
        </div>
      </form>
    </div>
  );
};


export default CustomPackageQuestionnaire;