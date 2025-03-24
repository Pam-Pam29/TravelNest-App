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
        Travel Dates:
        <input type="date" name="travelDates" value={formData.travelDates} onChange={handleChange} required />
      </label>
      <label>
        Primary Destination:
        <input type="text" name="primaryDestination" value={formData.primaryDestination} onChange={handleChange} required />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}

export default CustomPackageForm;
