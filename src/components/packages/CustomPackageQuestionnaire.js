import React, { useState, useEffect } from 'react';
import '../../styles/questionnaire.css';
import { sendCustomPackageRequestEmail } from '../../services/emailService';

const TravenestForm = () => {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    email: '',
    phone: '',
    travelers: '',
    travelDates: '',
    
    // Destination Preferences
    primaryDestination: '',
    secondaryDestinations: '',
    tripDuration: '',
    
    // Accommodation Preferences
    accommodationLevel: '',
    accommodationRequests: [],
    otherAccommodationRequests: '',
    
    // Dining & Culinary Preferences
    diningExperiences: [],
    dietaryRequirements: [],
    foodAllergies: '',
    otherDietaryNeeds: '',
    
    // Activities & Experiences
    experiences: [],
    activityLevel: '',
    
    // Transportation Preferences
    transportation: [],
    flightClass: '',
    
    // Budget Considerations
    budget: '',
    priorities: {
      accommodation: '',
      dining: '',
      activities: '',
      transportation: '',
      shopping: ''
    },
    
    // Special Occasions & Requests
    specialOccasions: [],
    otherSpecialOccasion: '',
    specialRequests: '',
    
    // Package Add-Ons
    addOns: []
  });

  // Form validation state
  const [errors, setErrors] = useState({});

  // ScrollToTop function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Use effect to scroll to top when step changes
  useEffect(() => {
    scrollToTop();
  }, [step]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    
    if (checked) {
      setFormData({
        ...formData,
        [name]: [...formData[name], value]
      });
    } else {
      setFormData({
        ...formData,
        [name]: formData[name].filter(item => item !== value)
      });
    }
  };

  // Validate each step
  const validateStep = () => {
    const newErrors = {};
    
    // Step 1 validation
    if (step === 1) {
      if (!formData.fullName) newErrors.fullName = 'Full name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
      if (!formData.phone) newErrors.phone = 'Phone number is required';
      if (!formData.travelers) newErrors.travelers = 'Number of travelers is required';
      if (!formData.travelDates) newErrors.travelDates = 'Travel dates are required';
    }
    
    // Step 2 validation
    if (step === 2) {
      if (!formData.primaryDestination) newErrors.primaryDestination = 'Primary destination is required';
      if (!formData.tripDuration) newErrors.tripDuration = 'Trip duration is required';
      if (!formData.accommodationLevel) newErrors.accommodationLevel = 'Please select an accommodation level';
    }
    
    // Step 3 validation
    if (step === 3) {
      if (formData.diningExperiences.length === 0) newErrors.diningExperiences = 'Please select at least one dining experience';
      if (!formData.activityLevel) newErrors.activityLevel = 'Please select an activity level';
      if (formData.transportation.length === 0) newErrors.transportation = 'Please select at least one transportation option';
    }
    
    // Step 4 validation
    if (step === 4) {
      if (!formData.budget) newErrors.budget = 'Please select a budget';
      
      // Validate that all priorities are filled
      const priorities = formData.priorities;
      if (!priorities.accommodation || !priorities.dining || 
          !priorities.activities || !priorities.transportation || 
          !priorities.shopping) {
        newErrors.priorities = 'Please rank all spending priorities';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next button click
  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  // Handle back button click
  const handleBack = () => {
    setStep(step - 1);
  };

  // Send email using the fixed emailService
  const sendEmail = async () => {
    try {
      // Prepare email template parameters
      const templateParams = {
        fullName: formData.fullName,
        email: formData.email,
        primaryDestination: formData.primaryDestination,
        tripDuration: formData.tripDuration,
        numTravelers: formData.travelers,
        travelDates: formData.travelDates
      };
      
      const result = await sendCustomPackageRequestEmail(templateParams);
      if (result.success) {
        setEmailSent(true);
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateStep()) {
      // Here you would normally send the data to your backend
      console.log('Form submitted:', formData);
      
      // Send confirmation email
      await sendEmail();
      
      setSubmitted(true);
    }
  };

  // Check if text is longer than 40 characters to apply multi-line class
  const getOptionClass = (text) => {
    return text.length > 40 ? 'multi-line' : '';
  };

  // Render Step 1: Personal Information & Destination Preferences
  const renderStep1 = () => {
    return (
      <div className="form-step">
        <h2>Personal Information</h2>
        <div className="form-group">
          <label htmlFor="fullName">Full Name:</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={errors.fullName ? 'error' : ''}
          />
          {errors.fullName && <div className="error-message">{errors.fullName}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email Address:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="phone">Phone Number:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={errors.phone ? 'error' : ''}
          />
          {errors.phone && <div className="error-message">{errors.phone}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="travelers">Number of Travelers:</label>
          <input
            type="number"
            id="travelers"
            name="travelers"
            min="1"
            value={formData.travelers}
            onChange={handleChange}
            className={errors.travelers ? 'error' : ''}
          />
          {errors.travelers && <div className="error-message">{errors.travelers}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="travelDates">Preferred Travel Dates:</label>
          <input
            type="text"
            id="travelDates"
            name="travelDates"
            value={formData.travelDates}
            onChange={handleChange}
            className={errors.travelDates ? 'error' : ''}
            placeholder="e.g., June 15-28, 2025"
          />
          {errors.travelDates && <div className="error-message">{errors.travelDates}</div>}
        </div>
      </div>
    );
  };

  // Render Step 2: Destination & Accommodation Preferences
  const renderStep2 = () => {
    const accommodationOptions = [
      'Standard: Comfortable, clean accommodations with basic amenities ($)',
      'Premium: Higher quality accommodations with additional amenities ($$)',
      'Luxury: High-end accommodations with premium amenities ($$$)',
      'Ultra-Luxury: Exclusive 5-star properties, private villas ($$$$)'
    ];
    
    return (
      <div className="form-step">
        <h2>Destination Preferences</h2>
        <div className="form-group">
          <label htmlFor="primaryDestination">Primary Destination:</label>
          <input
            type="text"
            id="primaryDestination"
            name="primaryDestination"
            value={formData.primaryDestination}
            onChange={handleChange}
            className={errors.primaryDestination ? 'error' : ''}
          />
          {errors.primaryDestination && <div className="error-message">{errors.primaryDestination}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="secondaryDestinations">Secondary Destinations (if any):</label>
          <input
            type="text"
            id="secondaryDestinations"
            name="secondaryDestinations"
            value={formData.secondaryDestinations}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="tripDuration">Trip Duration (number of days):</label>
          <input
            type="number"
            id="tripDuration"
            name="tripDuration"
            min="1"
            value={formData.tripDuration}
            onChange={handleChange}
            className={errors.tripDuration ? 'error' : ''}
          />
          {errors.tripDuration && <div className="error-message">{errors.tripDuration}</div>}
        </div>
        
        <h2>Accommodation Preferences</h2>
        <div className="form-group radio-group">
          <label>Please select your preferred accommodation level:</label>
          {errors.accommodationLevel && <div className="error-message">{errors.accommodationLevel}</div>}
          
          <div className="radio-options">
            {accommodationOptions.map((option, index) => {
              const value = option.split(':')[0]; // Extract just the level name
              const id = value.toLowerCase().replace(/\s+/g, '');
              
              return (
                <div className={`radio-option ${getOptionClass(option)}`} key={id}>
                  <input
                    type="radio"
                    id={id}
                    name="accommodationLevel"
                    value={value}
                    checked={formData.accommodationLevel === value}
                    onChange={handleChange}
                  />
                  <label htmlFor={id}>{option}</label>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="form-group checkbox-group">
          <label>Specific accommodation requests:</label>
          <div className="checkbox-grid">
            {[
              'Ocean/water view', 'Mountain view', 'City center location', 
              'Private pool/hot tub', 'Family-friendly', 'Adult-only',
              'Eco-friendly/Sustainable', 'Historic property', 'Boutique hotel', 
              'All-inclusive resort'
            ].map(option => (
              <div className={`checkbox-option ${getOptionClass(option)}`} key={option}>
                <input
                  type="checkbox"
                  id={option.replace(/\W+/g, '')}
                  name="accommodationRequests"
                  value={option}
                  checked={formData.accommodationRequests.includes(option)}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor={option.replace(/\W+/g, '')}>{option}</label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="otherAccommodationRequests">Other accommodation requests:</label>
          <input
            type="text"
            id="otherAccommodationRequests"
            name="otherAccommodationRequests"
            value={formData.otherAccommodationRequests}
            onChange={handleChange}
          />
        </div>
      </div>
    );
  };

  // Render Step 3: Dining, Activities & Transportation Preferences
  const renderStep3 = () => {
    const diningOptions = [
      'Local authentic cuisine', 'Fine dining experiences', 'Street food exploration',
      'Cooking classes/culinary workshops', 'Food tours', 'Michelin-starred restaurants',
      'Farm-to-table experiences', 'Wine/beer/spirits tastings', 'Food markets and festivals'
    ];
    
    const activityOptions = [
      'Cultural (museums, historical sites)', 'Adventure (hiking, water sports)',
      'Relaxation (spa, beaches, wellness)', 'Nature & Wildlife', 'Shopping',
      'Nightlife & Entertainment', 'Arts & Music', 'Photography', 'Local community engagement'
    ];
    
    const transportationOptions = [
      'Private transfers', 'Rental car', 'Public transportation',
      'Walking/biking where possible', 'Combination of options'
    ];
    
    return (
      <div className="form-step">
        <h2>Dining & Culinary Preferences</h2>
        <div className="form-group checkbox-group">
          <label>What types of dining experiences are you interested in?</label>
          {errors.diningExperiences && <div className="error-message">{errors.diningExperiences}</div>}
          
          <div className="checkbox-grid">
            {diningOptions.map(option => (
              <div className={`checkbox-option ${getOptionClass(option)}`} key={option}>
                <input
                  type="checkbox"
                  id={option.replace(/\W+/g, '')}
                  name="diningExperiences"
                  value={option}
                  checked={formData.diningExperiences.includes(option)}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor={option.replace(/\W+/g, '')}>{option}</label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="form-group checkbox-group">
          <label>Do you have any dietary requirements or preferences?</label>
          <div className="checkbox-grid">
            {[
              'Vegetarian', 'Vegan', 'Gluten-free',
              'Halal', 'Kosher'
            ].map(option => (
              <div className={`checkbox-option ${getOptionClass(option)}`} key={option}>
                <input
                  type="checkbox"
                  id={option.replace(/\W+/g, '')}
                  name="dietaryRequirements"
                  value={option}
                  checked={formData.dietaryRequirements.includes(option)}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor={option.replace(/\W+/g, '')}>{option}</label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="foodAllergies">Food allergies (please specify):</label>
          <input
            type="text"
            id="foodAllergies"
            name="foodAllergies"
            value={formData.foodAllergies}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="otherDietaryNeeds">Other dietary needs:</label>
          <input
            type="text"
            id="otherDietaryNeeds"
            name="otherDietaryNeeds"
            value={formData.otherDietaryNeeds}
            onChange={handleChange}
          />
        </div>
        
        <h2>Activities & Experiences</h2>
        <div className="form-group checkbox-group">
          <label>What types of experiences interest you?</label>
          <div className="checkbox-grid">
            {activityOptions.map(option => (
              <div className={`checkbox-option ${getOptionClass(option)}`} key={option}>
                <input
                  type="checkbox"
                  id={option.replace(/\W+/g, '')}
                  name="experiences"
                  value={option}
                  checked={formData.experiences.includes(option)}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor={option.replace(/\W+/g, '')}>{option}</label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="form-group radio-group">
          <label>What is your preferred activity level?</label>
          {errors.activityLevel && <div className="error-message">{errors.activityLevel}</div>}
          
          <div className="radio-options">
            {[
              'Low (primarily relaxation with minimal physical activity)',
              'Moderate (balanced mix of activities and downtime)',
              'High (active itinerary with full days of exploration)'
            ].map(option => {
              const value = option.split(' ')[0];
              const id = value.toLowerCase() + 'Activity';
              
              return (
                <div className={`radio-option ${getOptionClass(option)}`} key={id}>
                  <input
                    type="radio"
                    id={id}
                    name="activityLevel"
                    value={value}
                    checked={formData.activityLevel === value}
                    onChange={handleChange}
                  />
                  <label htmlFor={id}>{option}</label>
                </div>
              );
            })}
          </div>
        </div>
        
        <h2>Transportation Preferences</h2>
        <div className="form-group checkbox-group">
          <label>How would you like to get around at your destination?</label>
          {errors.transportation && <div className="error-message">{errors.transportation}</div>}
          
          <div className="checkbox-grid">
            {transportationOptions.map(option => (
              <div className={`checkbox-option ${getOptionClass(option)}`} key={option}>
                <input
                  type="checkbox"
                  id={option.replace(/\W+/g, '')}
                  name="transportation"
                  value={option}
                  checked={formData.transportation.includes(option)}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor={option.replace(/\W+/g, '')}>{option}</label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="form-group radio-group">
          <label>For flights:</label>
          <div className="radio-options">
            {[
              'Economy', 'Premium Economy', 'Business Class', 'First Class'
            ].map(option => {
              const id = option.toLowerCase().replace(/\s+/g, '');
              
              return (
                <div className={`radio-option ${getOptionClass(option)}`} key={id}>
                  <input
                    type="radio"
                    id={id}
                    name="flightClass"
                    value={option}
                    checked={formData.flightClass === option}
                    onChange={handleChange}
                  />
                  <label htmlFor={id}>{option}</label>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Render Step 4: Budget, Special Occasions & Add-Ons
  const renderStep4 = () => {
    const budgetOptions = [
      '$100-200 per day', '$200-350 per day', '$350-500 per day',
      '$500-750 per day', '$750-1000 per day', '$1000+ per day'
    ];
    
    return (
      <div className="form-step">
        <h2>Budget Considerations</h2>
        <div className="form-group radio-group">
          <label>What is your approximate budget per person (excluding flights)?</label>
          {errors.budget && <div className="error-message">{errors.budget}</div>}
          
          <div className="radio-options">
            {budgetOptions.map(option => (
              <div className={`radio-option ${getOptionClass(option)}`} key={option}>
                <input
                  type="radio"
                  id={option.replace(/\W+/g, '')}
                  name="budget"
                  value={option}
                  checked={formData.budget === option}
                  onChange={handleChange}
                />
                <label htmlFor={option.replace(/\W+/g, '')}>{option}</label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="form-group">
          <label>What aspects of your trip would you prioritize for spending? (Rank from 1-5, with 1 being highest priority)</label>
          {errors.priorities && <div className="error-message">{errors.priorities}</div>}
          
          <div className="priority-ranking">
            <div className="priority-item">
              <label htmlFor="accommodation-priority">Accommodation:</label>
              <select
                id="accommodation-priority"
                name="priorities.accommodation"
                value={formData.priorities.accommodation}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="1">1 (Highest)</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5 (Lowest)</option>
              </select>
            </div>
            
            <div className="priority-item">
              <label htmlFor="dining-priority">Dining/Food:</label>
              <select
                id="dining-priority"
                name="priorities.dining"
                value={formData.priorities.dining}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="1">1 (Highest)</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5 (Lowest)</option>
              </select>
            </div>
            
            <div className="priority-item">
              <label htmlFor="activities-priority">Activities/Experiences:</label>
              <select
                id="activities-priority"
                name="priorities.activities"
                value={formData.priorities.activities}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="1">1 (Highest)</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5 (Lowest)</option>
              </select>
            </div>
            
            <div className="priority-item">
              <label htmlFor="transportation-priority">Transportation:</label>
              <select
                id="transportation-priority"
                name="priorities.transportation"
                value={formData.priorities.transportation}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="1">1 (Highest)</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5 (Lowest)</option>
              </select>
            </div>
            
            <div className="priority-item">
              <label htmlFor="shopping-priority">Shopping/Souvenirs:</label>
              <select
                id="shopping-priority"
                name="priorities.shopping"
                value={formData.priorities.shopping}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="1">1 (Highest)</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5 (Lowest)</option>
              </select>
            </div>
          </div>
        </div>
        
        <h2>Special Occasions & Requests</h2>
        <div className="form-group checkbox-group">
          <label>Are you celebrating any special occasions during this trip?</label>
          <div className="checkbox-grid">
            {[
              'Birthday', 'Anniversary', 'Honeymoon',
              'Proposal', 'Graduation', 'Retirement'
            ].map(option => (
              <div className="checkbox-option" key={option}>
                <input
                  type="checkbox"
                  id={option.replace(/\W+/g, '')}
                  name="specialOccasions"
                  value={option}
                  checked={formData.specialOccasions.includes(option)}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor={option.replace(/\W+/g, '')}>{option}</label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="otherSpecialOccasion">Other special occasion:</label>
          <input
            type="text"
            id="otherSpecialOccasion"
            name="otherSpecialOccasion"
            value={formData.otherSpecialOccasion}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="specialRequests">Any other special requests or information you'd like us to know?</label>
          <textarea
            id="specialRequests"
            name="specialRequests"
            value={formData.specialRequests}
            onChange={handleChange}
            rows="4"
          ></textarea>
        </div>
        
        <h2>Package Add-Ons</h2>
        <div className="form-group checkbox-group">
          <label>Would you be interested in any of these additional services? (Additional fees apply)</label>
          <div className="checkbox-grid">
            {[
              'Airport lounge access', 'Travel insurance', 'Photography services',
              'Personal concierge/guide', 'Premium transportation', 'Child care/babysitting services',
              'Special event tickets', 'Private tours with expert guides'
            ].map(option => (
              <div className="checkbox-option" key={option}>
                <input
                  type="checkbox"
                  id={option.replace(/\W+/g, '')}
                  name="addOns"
                  value={option}
                  checked={formData.addOns.includes(option)}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor={option.replace(/\W+/g, '')}>{option}</label>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render success message
  const renderSuccess = () => {
    return (
      <div className="success-message">
        <h2>Thank you for completing our questionnaire!</h2>
        <p>A Travenest travel specialist will contact you within 48 hours to discuss your custom travel package and provide pricing options based on your preferences.</p>
        {emailSent && <p className="email-confirmation">A confirmation email has been sent to {formData.email}.</p>}
      </div>
    );
  };

  // Render form navigation
  const renderNavigation = () => {
    return (
      <div className="form-navigation">
        {step > 1 && (
          <button type="button" className="back-button" onClick={handleBack}>
            Back
          </button>
        )}
        
        {step < 4 ? (
          <button type="button" className="next-button" onClick={handleNext}>
            Next
          </button>
        ) : (
          <button type="submit" className="submit-button">
            Submit
          </button>
        )}
      </div>
    );
  };

  // Render progress indicator
  const renderProgress = () => {
    return (
      <div className="progress-indicator">
        <div className="steps">
          {[1, 2, 3, 4].map(stepNumber => (
            <div 
              key={stepNumber} 
              className={`step ${stepNumber === step ? 'active' : ''} ${stepNumber < step ? 'completed' : ''}`}
            >
              {stepNumber}
            </div>
          ))}
        </div>
        <div className="step-title">
          {step === 1 && 'Personal Information'}
          {step === 2 && 'Destination & Accommodation'}
          {step === 3 && 'Activities & Transportation'}
          {step === 4 && 'Budget & Extras'}
        </div>
      </div>
    );
  };

  return (
    <div className="travenest-form-container">
      <h1>Travenest Custom Travel Package Questionnaire</h1>
      
      {!submitted ? (
        <>
          {renderProgress()}
          
          <form onSubmit={handleSubmit}>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
            
            {renderNavigation()}
          </form>
          
          <button 
            className="scroll-to-top-button" 
            onClick={scrollToTop}
            aria-label="Scroll to top"
          >
            ↑
          </button>
        </>
      ) : (
        renderSuccess()
      )}
    </div>
  );
};

export default TravenestForm;