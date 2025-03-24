import React, { useState } from 'react';
import { submitCustomPackage } from '../../services/packageService';

function CustomPackageForm() {
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      const arrayField = name.split('.')[0];
      setFormData((prevState) => ({
        ...prevState,
        [arrayField]: checked
          ? [...prevState[arrayField], value]
          : prevState[arrayField].filter(item => item !== value)
      }));
    } else if (name.startsWith('priorities.')) {
      const priorityKey = name.split('.')[1];
      setFormData((prevState) => ({
        ...prevState,
        priorities: { ...prevState.priorities, [priorityKey]: parseInt(value) }
      }));
    } else {
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitCustomPackage(formData);
      alert('Thank you for your submission! A Travenest travel specialist will contact you within 48 hours.');
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

  return (
    <form onSubmit={handleSubmit}>
      <h2>Personal Information</h2>
      <label>
        Full Name:
        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
      </label>
      <label>
        Email:
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
      </label>
      <label>
        Phone:
        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
      </label>
      <label>
        Number of Travelers:
        <input type="number" name="travelers" value={formData.travelers} onChange={handleChange} required />
      </label>
      <label>
        Preferred Travel Dates:
        <input type="date" name="travelDates" value={formData.travelDates} onChange={handleChange} required />
      </label>

      <h2>Destination Preferences</h2>
      <label>
        Primary Destination:
        <input type="text" name="primaryDestination" value={formData.primaryDestination} onChange={handleChange} required />
      </label>
      <label>
        Secondary Destinations (if any):
        <input type="text" name="secondaryDestinations" value={formData.secondaryDestinations} onChange={handleChange} />
      </label>
      <label>
        Trip Duration (number of days):
        <input type="number" name="tripDuration" value={formData.tripDuration} onChange={handleChange} required />
      </label>

      <h2>Accommodation Preferences</h2>
      <label>
        Accommodation Level:
        <select name="accommodationLevel" value={formData.accommodationLevel} onChange={handleChange} required>
          <option value="">Select a level</option>
          <option value="Standard">Standard</option>
          <option value="Premium">Premium</option>
          <option value="Luxury">Luxury</option>
          <option value="Ultra-Luxury">Ultra-Luxury</option>
        </select>
      </label>
      <div>
        <h3>Specific accommodation requests:</h3>
        <label>
          <input type="checkbox" name="accommodationRequests" value="Ocean/water view" onChange={handleChange} />
          Ocean/water view
        </label>
        <label>
          <input type="checkbox" name="accommodationRequests" value="Mountain view" onChange={handleChange} />
          Mountain view
        </label>
        <label>
          <input type="checkbox" name="accommodationRequests" value="City center location" onChange={handleChange} />
          City center location
        </label>
        <label>
          <input type="checkbox" name="accommodationRequests" value="Private pool/hot tub" onChange={handleChange} />
          Private pool/hot tub
        </label>
        <label>
          <input type="checkbox" name="accommodationRequests" value="Family-friendly" onChange={handleChange} />
          Family-friendly
        </label>
        <label>
          <input type="checkbox" name="accommodationRequests" value="Adult-only" onChange={handleChange} />
          Adult-only
        </label>
        <label>
          <input type="checkbox" name="accommodationRequests" value="Eco-friendly/Sustainable" onChange={handleChange} />
          Eco-friendly/Sustainable
        </label>
        <label>
          <input type="checkbox" name="accommodationRequests" value="Historic property" onChange={handleChange} />
          Historic property
        </label>
        <label>
          <input type="checkbox" name="accommodationRequests" value="Boutique hotel" onChange={handleChange} />
          Boutique hotel
        </label>
        <label>
          <input type="checkbox" name="accommodationRequests" value="All-inclusive resort" onChange={handleChange} />
          All-inclusive resort
        </label>
      </div>

      <label>
        Other accommodation requests:
        <input type="text" name="otherAccommodationRequests" value={formData.otherAccommodationRequests} onChange={handleChange} />
      </label>

      <h2>Dining & Culinary Preferences</h2>
      <label>
        Dining Experiences:
        <div>
          <label>
            <input type="checkbox" name="diningExperiences" value="Local authentic cuisine" onChange={handleChange} />
            Local authentic cuisine
          </label>
          <label>
            <input type="checkbox" name="diningExperiences" value="Fine dining experiences" onChange={handleChange} />
            Fine dining experiences
          </label>
          <label>
            <input type="checkbox" name="diningExperiences" value="Street food exploration" onChange={handleChange} />
            Street food exploration
          </label>
          <label>
            <input type="checkbox" name="diningExperiences" value="Cooking classes" onChange={handleChange} />
            Cooking classes
          </label>
          <label>
            <input type="checkbox" name="diningExperiences" value="Food tours" onChange={handleChange} />
            Food tours
          </label>
          <label>
            <input type="checkbox" name="diningExperiences" value="Michelin-starred restaurants" onChange={handleChange} />
            Michelin-starred restaurants
          </label>
          <label>
            <input type="checkbox" name="diningExperiences" value="Farm-to-table experiences" onChange={handleChange} />
            Farm-to-table experiences
          </label>
          <label>
            <input type="checkbox" name="diningExperiences" value="Wine/beer/spirits tastings" onChange={handleChange} />
            Wine/beer/spirits tastings
          </label>
          <label>
            <input type="checkbox" name="diningExperiences" value="Food markets and festivals" onChange={handleChange} />
            Food markets and festivals
          </label>
        </div>
      </label>

      <h2>Dietary Preferences</h2>
      <label>
        Dietary Requirements:
        <div>
          <label>
            <input type="checkbox" name="dietaryRequirements" value="Vegetarian" onChange={handleChange} />
            Vegetarian
          </label>
          <label>
            <input type="checkbox" name="dietaryRequirements" value="Vegan" onChange={handleChange} />
            Vegan
          </label>
          <label>
            <input type="checkbox" name="dietaryRequirements" value="Gluten-free" onChange={handleChange} />
            Gluten-free
          </label>
          <label>
            <input type="checkbox" name="dietaryRequirements" value="Halal" onChange={handleChange} />
            Halal
          </label>
          <label>
            <input type="checkbox" name="dietaryRequirements" value="Kosher" onChange={handleChange} />
            Kosher
          </label>
          <label>
            <input type="checkbox" name="dietaryRequirements" value="Food allergies" onChange={handleChange} />
            Food allergies
          </label>
          <label>
            <input type="text" name="foodAllergies" value={formData.foodAllergies} onChange={handleChange} placeholder="Please specify" />
          </label>
          <label>
            Other dietary needs:
            <input type="text" name="otherDietaryNeeds" value={formData.otherDietaryNeeds} onChange={handleChange} />
          </label>
        </div>
      </label>

      <h2>Activities & Experiences</h2>
      <label>
        What types of experiences interest you?
        <div>
          <label>
            <input type="checkbox" name="experienceTypes" value="Cultural" onChange={handleChange} />
            Cultural
          </label>
          <label>
            <input type="checkbox" name="experienceTypes" value="Adventure" onChange={handleChange} />
            Adventure
          </label>
          <label>
            <input type="checkbox" name="experienceTypes" value="Relaxation" onChange={handleChange} />
            Relaxation
          </label>
          <label>
            <input type="checkbox" name="experienceTypes" value="Nature & Wildlife" onChange={handleChange} />
            Nature & Wildlife
          </label>
          <label>
            <input type="checkbox" name="experienceTypes" value="Shopping" onChange={handleChange} />
            Shopping
          </label>
          <label>
            <input type="checkbox" name="experienceTypes" value="Nightlife & Entertainment" onChange={handleChange} />
            Nightlife & Entertainment
          </label>
          <label>
            <input type="checkbox" name="experienceTypes" value="Arts & Music" onChange={handleChange} />
            Arts & Music
          </label>
          <label>
            <input type="checkbox" name="experienceTypes" value="Photography" onChange={handleChange} />
            Photography
          </label>
          <label>
            <input type="checkbox" name="experienceTypes" value="Community engagement" onChange={handleChange} />
            Local community engagement/volunteering
          </label>
        </div>
      </label>

      <label>
        Preferred activity level:
        <select name="activityLevel" value={formData.activityLevel} onChange={handleChange} required>
          <option value="">Select activity level</option>
          <option value="Low">Low</option>
          <option value="Moderate">Moderate</option>
          <option value="High">High</option>
        </select>
      </label>

      <label>
        Preferred duration:
        <select name="duration" value={formData.duration} onChange={handleChange} required>
          <option value="">Select duration</option>
          <option value="1 day">1 day</option>
          <option value="2 days">2 days</option>
          <option value="3 days">3 days</option>
          <option value="4 days">4 days</option>  {/* Add more options as needed */}
        </select>
      </label>

      <label>
        Additional notes:
        <textarea name="additionalNotes" value={formData.additionalNotes} onChange={handleChange} />
      </label>

      <button type="submit">Submit</button>
    </form>
  );
}; export default CustomPackageForm;