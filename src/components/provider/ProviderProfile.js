import React, { useState, useEffect } from 'react';
import { auth, db } from '../../services/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

const ProviderProfile = () => {
  const [profileData, setProfileData] = useState({
    businessName: '',
    businessType: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    description: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: ''
    }
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchProviderProfile = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setError('User not authenticated');
          return;
        }

        const providerRef = doc(db, 'serviceProviders', user.uid);
        const providerSnap = await getDoc(providerRef);

        if (providerSnap.exists()) {
          setProfileData(providerSnap.data());
        } else {
          setError('No provider profile found');
        }
      } catch (error) {
        setError('Error fetching profile: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProviderProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested address fields
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setProfileData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    
    try {
      const user = auth.currentUser;
      if (!user) {
        setError('User not authenticated');
        return;
      }

      const providerRef = doc(db, 'serviceProviders', user.uid);
      await updateDoc(providerRef, profileData);

      setSuccessMessage('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      setError('Error updating profile: ' + error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          {error}
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          {successMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Provider Profile</h1>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className={`
            px-4 py-2 rounded-md transition-colors duration-300
            ${isEditing 
              ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
              : 'bg-blue-600 text-white hover:bg-blue-700'}
          `}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Business Information Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
            <input
              type="text"
              name="businessName"
              value={profileData.businessName}
              onChange={handleChange}
              disabled={!isEditing}
              className={`
                w-full px-3 py-2 border rounded-md 
                ${isEditing 
                  ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500' 
                  : 'bg-gray-100 cursor-not-allowed'}
              `}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
            <select
              name="businessType"
              value={profileData.businessType}
              onChange={handleChange}
              disabled={!isEditing}
              className={`
                w-full px-3 py-2 border rounded-md 
                ${isEditing 
                  ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500' 
                  : 'bg-gray-100 cursor-not-allowed'}
              `}
              required
            >
              <option value="">Select Business Type</option>
              <option value="tour_operator">Tour Operator</option>
              <option value="hotel">Hotel</option>
              <option value="travel_agency">Travel Agency</option>
              <option value="transportation">Transportation</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
            <input
              type="text"
              name="contactName"
              value={profileData.contactName}
              onChange={handleChange}
              disabled={!isEditing}
              className={`
                w-full px-3 py-2 border rounded-md 
                ${isEditing 
                  ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500' 
                  : 'bg-gray-100 cursor-not-allowed'}
              `}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleChange}
              disabled={!isEditing}
              className={`
                w-full px-3 py-2 border rounded-md 
                ${isEditing 
                  ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500' 
                  : 'bg-gray-100 cursor-not-allowed'}
              `}
              required
            />
          </div>
        </div>

        {/* Address Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Street</label>
            <input
              type="text"
              name="address.street"
              value={profileData.address.street}
              onChange={handleChange}
              disabled={!isEditing}
              className={`
                w-full px-3 py-2 border rounded-md 
                ${isEditing 
                  ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500' 
                  : 'bg-gray-100 cursor-not-allowed'}
              `}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            <input
              type="text"
              name="address.city"
              value={profileData.address.city}
              onChange={handleChange}
              disabled={!isEditing}
              className={`
                w-full px-3 py-2 border rounded-md 
                ${isEditing 
                  ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500' 
                  : 'bg-gray-100 cursor-not-allowed'}
              `}
              required
            />
          </div>
        </div>

        {/* Description Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Business Description</label>
          <textarea
            name="description"
            value={profileData.description}
            onChange={handleChange}
            disabled={!isEditing}
            rows={4}
            className={`
              w-full px-3 py-2 border rounded-md 
              ${isEditing 
                ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500' 
                : 'bg-gray-100 cursor-not-allowed'}
            `}
            required
          />
        </div>

        {/* Submit Button */}
        {isEditing && (
          <div className="flex justify-end">
            <button 
              type="submit"
              className="
                bg-green-600 text-white 
                px-6 py-2 rounded-md 
                hover:bg-green-700 
                transition-colors duration-300
                focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
              "
            >
              Save Profile
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ProviderProfile;