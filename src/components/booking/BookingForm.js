// src/components/booking/BookingForm.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPackageById } from '../../services/packageService';
import { createBooking } from '../../services/bookingService';
import { useAuth } from '../../contexts/AuthContext';

const BookingForm = () => {
  const { packageId } = useParams();
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  
  const [travelPackage, setTravelPackage] = useState(null);
  const [travelers, setTravelers] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Custom Package States
  const [showCustomOptions, setShowCustomOptions] = useState(false);
  const [accommodationLevel, setAccommodationLevel] = useState('');
  const [accommodationFeatures, setAccommodationFeatures] = useState([]);
  const [diningExperiences, setDiningExperiences] = useState([]);
  const [dietaryRequirements, setDietaryRequirements] = useState([]);
  const [otherDietaryNeeds, setOtherDietaryNeeds] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [activities, setActivities] = useState([]);
  const [activityLevel, setActivityLevel] = useState('');
  const [transportationOptions, setTransportationOptions] = useState([]);
  const [flightClass, setFlightClass] = useState('Economy');
  const [specialOccasions, setSpecialOccasions] = useState([]);
  const [addOnServices, setAddOnServices] = useState([]);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const fetchPackage = async () => {
      try {
        console.log("Fetching package with ID:", packageId);
        const data = await getPackageById(packageId);
        console.log("Package data received:", data);
        setTravelPackage(data);
        
        // Set default start date to 30 days from now
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 30);
        setStartDate(defaultDate.toISOString().split('T')[0]);
      } catch (error) {
        console.error("Error fetching package:", error);
        setError('Failed to fetch package: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [packageId, currentUser, navigate]);

  const getTotalPrice = () => {
    if (!travelPackage) return 0;
    
    // Base price
    let total = travelPackage.price * travelers;
    
    // Add accommodation upgrades
    if (accommodationLevel === 'premium') total += 50 * travelers;
    if (accommodationLevel === 'luxury') total += 150 * travelers;
    if (accommodationLevel === 'ultraluxury') total += 300 * travelers;
    
    // Add services
    if (addOnServices.includes('travelInsurance')) total += 35 * travelers;
    if (addOnServices.includes('airportLounge')) total += 40 * travelers;
    if (addOnServices.includes('photographyServices')) total += 100;
    if (addOnServices.includes('concierge')) total += 75 * travelers;
    
    return total;
  };

  const handleCheckboxChange = (setter, currentValues, value) => {
    if (currentValues.includes(value)) {
      setter(currentValues.filter(item => item !== value));
    } else {
      setter([...currentValues, value]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!travelPackage || !startDate) {
      setError('Please fill all required fields');
      return;
    }
    
    try {
      setSubmitting(true);
      setError('');
      
      // Gather custom package details
      const customizationDetails = showCustomOptions ? {
        accommodationLevel,
        accommodationFeatures,
        diningExperiences,
        dietaryRequirements,
        otherDietaryNeeds,
        budgetRange,
        activities,
        activityLevel,
        transportationOptions,
        flightClass,
        specialOccasions,
        addOnServices
      } : null;
      
      const bookingData = {
        packageId,
        packageTitle: travelPackage.title,
        packagePrice: travelPackage.price,
        travelers,
        totalPrice: getTotalPrice(),
        startDate,
        specialRequests,
        userId: currentUser.uid,
        userName: userProfile.name,
        userEmail: currentUser.email,
        status: 'pending',
        paymentStatus: 'pending',
        customizationDetails // Add the customization details
      };
      
      // Add logging to debug
      console.log("Creating booking with data:", bookingData);
      const bookingId = await createBooking(bookingData);
      console.log("Booking created with ID:", bookingId);
      
      // Store the booking ID in localStorage as a backup
      localStorage.setItem('lastBookingId', bookingId);

      // Debug alert
      alert(`Booking created! ID: ${bookingId}. About to navigate to payment.`); 
    
      // Force a direct URL navigation instead of using React Router
      window.location.href = `/payment/${bookingId}`;
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      setError('Failed to create booking: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading booking form...</div>;
  }

  if (!travelPackage) {
    return <div className="error-message">Package not found</div>;
  }

  return (
    <div className="booking-form-container">
      <h2>Book Your Trip</h2>
      <div className="booking-package-summary">
        <h3>{travelPackage.title}</h3>
        <p>Destination: {travelPackage.region}</p>
        <p>Duration: {travelPackage.duration} days</p>
        <p>Price: ${travelPackage.price} per person</p>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-group">
          <label htmlFor="travelers">Number of Travelers</label>
          <input
            type="number"
            id="travelers"
            min="1"
            max="10"
            value={travelers}
            onChange={(e) => setTravelers(parseInt(e.target.value))}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="startDate">Start Date</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>
        
        <div className="form-group customize-toggle">
          <label>
            <input
              type="checkbox"
              checked={showCustomOptions}
              onChange={() => setShowCustomOptions(!showCustomOptions)}
            />
            Customize my package
          </label>
        </div>
        
        {showCustomOptions && (
          <div className="custom-package-section">
            <h3>Customize Your Experience</h3>
            
            {/* Accommodation Preferences */}
            <div className="form-section">
              <h4>Accommodation Preferences</h4>
              <div className="form-group">
                <label>Please select your preferred accommodation level:</label>
                <div className="radio-group">
                  <label>
                    <input 
                      type="radio" 
                      name="accommodationLevel" 
                      value="standard"
                      checked={accommodationLevel === 'standard'}
                      onChange={() => setAccommodationLevel('standard')}
                    />
                    Standard: Comfortable, clean accommodations with basic amenities ($)
                  </label>
                  <label>
                    <input 
                      type="radio" 
                      name="accommodationLevel" 
                      value="premium"
                      checked={accommodationLevel === 'premium'}
                      onChange={() => setAccommodationLevel('premium')}
                    />
                    Premium: Higher quality accommodations with additional amenities ($$)
                  </label>
                  <label>
                    <input 
                      type="radio" 
                      name="accommodationLevel" 
                      value="luxury"
                      checked={accommodationLevel === 'luxury'}
                      onChange={() => setAccommodationLevel('luxury')}
                    />
                    Luxury: High-end accommodations with premium amenities ($$$)
                  </label>
                  <label>
                    <input 
                      type="radio" 
                      name="accommodationLevel" 
                      value="ultraluxury"
                      checked={accommodationLevel === 'ultraluxury'}
                      onChange={() => setAccommodationLevel('ultraluxury')}
                    />
                    Ultra-Luxury: Exclusive 5-star properties, private villas, or resorts ($$$$)
                  </label>
                </div>
              </div>
              
              <div className="form-group">
                <label>Specific accommodation requests: (Select all that apply)</label>
                <div className="checkbox-group">
                  {['Ocean/water view', 'Mountain view', 'City center location', 
                    'Private pool/hot tub', 'Family-friendly', 'Adult-only', 
                    'Eco-friendly/Sustainable', 'Historic property', 'Boutique hotel', 
                    'All-inclusive resort'].map(feature => {
                    const value = feature.toLowerCase().replace(/[^a-z0-9]/g, '');
                    return (
                      <label key={value}>
                        <input 
                          type="checkbox"
                          checked={accommodationFeatures.includes(value)}
                          onChange={() => handleCheckboxChange(
                            setAccommodationFeatures, 
                            accommodationFeatures, 
                            value
                          )}
                        />
                        {feature}
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Dining & Culinary Preferences */}
            <div className="form-section">
              <h4>Dining & Culinary Preferences</h4>
              <div className="form-group">
                <label>What types of dining experiences are you interested in? (Select all that apply)</label>
                <div className="checkbox-group">
                  {['Local authentic cuisine', 'Fine dining experiences', 'Street food exploration', 
                    'Cooking classes/culinary workshops', 'Food tours', 'Michelin-starred restaurants', 
                    'Farm-to-table experiences', 'Wine/beer/spirits tastings', 'Food markets and festivals'].map(option => {
                    const value = option.toLowerCase().replace(/[^a-z0-9]/g, '');
                    return (
                      <label key={value}>
                        <input 
                          type="checkbox"
                          checked={diningExperiences.includes(value)}
                          onChange={() => handleCheckboxChange(
                            setDiningExperiences, 
                            diningExperiences, 
                            value
                          )}
                        />
                        {option}
                      </label>
                    );
                  })}
                </div>
              </div>
              
              <div className="form-group">
                <label>Do you have any dietary requirements or preferences?</label>
                <div className="checkbox-group">
                  {['Vegetarian', 'Vegan', 'Gluten-free', 'Halal', 'Kosher'].map(diet => {
                    const value = diet.toLowerCase().replace(/[^a-z0-9]/g, '');
                    return (
                      <label key={value}>
                        <input 
                          type="checkbox"
                          checked={dietaryRequirements.includes(value)}
                          onChange={() => handleCheckboxChange(
                            setDietaryRequirements, 
                            dietaryRequirements, 
                            value
                          )}
                        />
                        {diet}
                      </label>
                    );
                  })}
                </div>
                <label htmlFor="otherDietaryNeeds">Other dietary needs or allergies:</label>
                <input
                  type="text"
                  id="otherDietaryNeeds"
                  value={otherDietaryNeeds}
                  onChange={(e) => setOtherDietaryNeeds(e.target.value)}
                />
              </div>
            </div>
            
            {/* Activities & Experiences */}
            <div className="form-section">
              <h4>Activities & Experiences</h4>
              <div className="form-group">
                <label>What types of experiences interest you? (Select all that apply)</label>
                <div className="checkbox-group">
                  {['Cultural (museums, historical sites)', 'Adventure (hiking, water sports)', 
                    'Relaxation (spa, beaches, wellness)', 'Nature & Wildlife', 'Shopping', 
                    'Nightlife & Entertainment', 'Arts & Music', 'Photography', 
                    'Local community engagement'].map(activity => {
                    const value = activity.toLowerCase().replace(/[^a-z0-9]/g, '');
                    return (
                      <label key={value}>
                        <input 
                          type="checkbox"
                          checked={activities.includes(value)}
                          onChange={() => handleCheckboxChange(
                            setActivities, 
                            activities, 
                            value
                          )}
                        />
                        {activity}
                      </label>
                    );
                  })}
                </div>
              </div>
              
              <div className="form-group">
                <label>What is your preferred activity level?</label>
                <div className="radio-group">
                  <label>
                    <input 
                      type="radio" 
                      name="activityLevel" 
                      value="low"
                      checked={activityLevel === 'low'}
                      onChange={() => setActivityLevel('low')}
                    />
                    Low (primarily relaxation with minimal physical activity)
                  </label>
                  <label>
                    <input 
                      type="radio" 
                      name="activityLevel" 
                      value="moderate"
                      checked={activityLevel === 'moderate'}
                      onChange={() => setActivityLevel('moderate')}
                    />
                    Moderate (balanced mix of activities and downtime)
                  </label>
                  <label>
                    <input 
                      type="radio" 
                      name="activityLevel" 
                      value="high"
                      checked={activityLevel === 'high'}
                      onChange={() => setActivityLevel('high')}
                    />
                    High (active itinerary with full days of exploration)
                  </label>
                </div>
              </div>
            </div>
            
            {/* Transportation */}
            <div className="form-section">
              <h4>Transportation Preferences</h4>
              <div className="form-group">
                <label>How would you like to get around at your destination? (Select all that apply)</label>
                <div className="checkbox-group">
                  {['Private transfers', 'Rental car', 'Public transportation', 
                    'Walking/biking where possible'].map(option => {
                    const value = option.toLowerCase().replace(/[^a-z0-9]/g, '');
                    return (
                      <label key={value}>
                        <input 
                          type="checkbox"
                          checked={transportationOptions.includes(value)}
                          onChange={() => handleCheckboxChange(
                            setTransportationOptions, 
                            transportationOptions, 
                            value
                          )}
                        />
                        {option}
                      </label>
                    );
                  })}
                </div>
              </div>
              
              <div className="form-group">
                <label>For flights:</label>
                <select 
                  value={flightClass} 
                  onChange={(e) => setFlightClass(e.target.value)}
                >
                  <option value="Economy">Economy</option>
                  <option value="PremiumEconomy">Premium Economy</option>
                  <option value="Business">Business Class</option>
                  <option value="First">First Class</option>
                </select>
              </div>
            </div>
            
            {/* Budget */}
            <div className="form-section">
              <h4>Budget Considerations</h4>
              <div className="form-group">
                <label>What is your approximate budget per person (excluding flights)?</label>
                <select 
                  value={budgetRange} 
                  onChange={(e) => setBudgetRange(e.target.value)}
                >
                  <option value="">Please select</option>
                  <option value="100-200">$100-200 per day</option>
                  <option value="200-350">$200-350 per day</option>
                  <option value="350-500">$350-500 per day</option>
                  <option value="500-750">$500-750 per day</option>
                  <option value="750-1000">$750-1000 per day</option>
                  <option value="1000+">$1000+ per day</option>
                </select>
              </div>
            </div>
            
            {/* Special Occasions */}
            <div className="form-section">
              <h4>Special Occasions & Requests</h4>
              <div className="form-group">
                <label>Are you celebrating any special occasions during this trip? (Select all that apply)</label>
                <div className="checkbox-group">
                  {['Birthday', 'Anniversary', 'Honeymoon', 'Proposal', 
                    'Graduation', 'Retirement'].map(occasion => {
                    const value = occasion.toLowerCase();
                    return (
                      <label key={value}>
                        <input 
                          type="checkbox"
                          checked={specialOccasions.includes(value)}
                          onChange={() => handleCheckboxChange(
                            setSpecialOccasions, 
                            specialOccasions, 
                            value
                          )}
                        />
                        {occasion}
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Add-Ons */}
            <div className="form-section">
              <h4>Package Add-Ons</h4>
              <div className="form-group">
                <label>Would you be interested in any of these additional services? (Additional fees apply)</label>
                <div className="checkbox-group">
                  {[
                    { value: 'airportLounge', label: 'Airport lounge access ($40/person)', },
                    { value: 'travelInsurance', label: 'Travel insurance ($35/person)' },
                    { value: 'photographyServices', label: 'Photography services during your trip ($100)' },
                    { value: 'concierge', label: 'Personal concierge/guide ($75/person/day)' },
                    { value: 'premiumTransportation', label: 'Premium transportation' },
                    { value: 'childcare', label: 'Child care/babysitting services' },
                    { value: 'specialEventTickets', label: 'Special event tickets' },
                    { value: 'privateTours', label: 'Private tours with expert guides' }
                  ].map(addon => (
                    <label key={addon.value}>
                      <input 
                        type="checkbox"
                        checked={addOnServices.includes(addon.value)}
                        onChange={() => handleCheckboxChange(
                          setAddOnServices, 
                          addOnServices, 
                          addon.value
                        )}
                      />
                      {addon.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="specialRequests">Special Requests (Optional)</label>
          <textarea
            id="specialRequests"
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            rows="4"
          ></textarea>
        </div>
        
        <div className="booking-summary">
          <h3>Booking Summary</h3>
          <div className="summary-row">
            <span>Package Price</span>
            <span>${travelPackage.price} × {travelers} traveler(s)</span>
          </div>
          
          {showCustomOptions && accommodationLevel && accommodationLevel !== 'standard' && (
            <div className="summary-row">
              <span>Accommodation Upgrade</span>
              <span>
                {accommodationLevel === 'premium' && '$50'}
                {accommodationLevel === 'luxury' && '$150'}
                {accommodationLevel === 'ultraluxury' && '$300'}
                {' × ' + travelers + ' traveler(s)'}
              </span>
            </div>
          )}
          
          {showCustomOptions && addOnServices.length > 0 && (
            <div className="summary-row">
              <span>Add-on Services</span>
              <span>Selected: {addOnServices.length}</span>
            </div>
          )}
          
          <div className="summary-total">
            <span>Total</span>
            <span>${getTotalPrice()}</span>
          </div>
        </div>
        
        <button 
          type="submit" 
          className="btn-continue"
          disabled={submitting}
        >
          {submitting ? 'Processing...' : 'Continue to Payment'}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
