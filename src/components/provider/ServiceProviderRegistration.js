import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../../services/firebase';
import '../../styles/providerRegistration.css';

const ProviderRegistration = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form states
  const [accountData, setAccountData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [businessData, setBusinessData] = useState({
    businessName: '',
    businessType: '',
    contactPhone: '',
    website: '',
    description: '',
  });
  
  const [addressData, setAddressData] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });
  
  const [verificationDocs, setVerificationDocs] = useState({
    businessLicense: null,
    identityProof: null,
  });

  // Handle account form inputs
  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setAccountData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle business form inputs
  const handleBusinessChange = (e) => {
    const { name, value } = e.target;
    setBusinessData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle address form inputs
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file uploads
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setVerificationDocs(prev => ({
        ...prev,
        [name]: files[0]
      }));
    }
  };

  // Move to next step
  const nextStep = () => {
    if (step === 1) {
      // Validate account data
      if (!accountData.email || !accountData.password || !accountData.confirmPassword) {
        setError('Please fill in all fields');
        return;
      }
      
      if (accountData.password !== accountData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      
      if (accountData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
    }
    
    if (step === 2) {
      // Validate business data
      if (!businessData.businessName || !businessData.businessType || !businessData.contactPhone || !businessData.description) {
        setError('Please fill in all required fields');
        return;
      }
    }
    
    if (step === 3) {
      // Validate address data
      if (!addressData.street || !addressData.city || !addressData.state || !addressData.zipCode || !addressData.country) {
        setError('Please fill in all address fields');
        return;
      }
    }
    
    setError('');
    setStep(prevStep => prevStep + 1);
  };

  // Move to previous step
  const prevStep = () => {
    setStep(prevStep => prevStep - 1);
  };

  // Upload verification document to Firebase Storage
  const uploadDocument = async (file, userId, docType) => {
    const storageRef = ref(storage, `verificationDocuments/${userId}/${docType}_${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  // Submit the entire form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Step 1: Create user account in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        accountData.email, 
        accountData.password
      );
      
      const userId = userCredential.user.uid;
      
      // Step 2: Upload verification documents
      const documentUrls = {};
      
      if (verificationDocs.businessLicense) {
        documentUrls.businessLicense = await uploadDocument(
          verificationDocs.businessLicense, 
          userId, 
          'business_license'
        );
      }
      
      if (verificationDocs.identityProof) {
        documentUrls.identityProof = await uploadDocument(
          verificationDocs.identityProof, 
          userId, 
          'identity_proof'
        );
      }
      
      // Step 3: Create user profile in Firestore
      await setDoc(doc(db, 'users', userId), {
        name: businessData.businessName,
        email: accountData.email,
        role: 'provider',
        createdAt: serverTimestamp()
      });
      
      // Step 4: Create service provider profile in Firestore
      await setDoc(doc(db, 'serviceProviders', userId), {
        userId: userId,
        businessName: businessData.businessName,
        businessType: businessData.businessType,
        address: {
          street: addressData.street,
          city: addressData.city,
          state: addressData.state,
          zipCode: addressData.zipCode,
          country: addressData.country
        },
        contactPhone: businessData.contactPhone,
        website: businessData.website || '',
        description: businessData.description,
        verificationDocuments: documentUrls,
        isVerified: false,
        verificationStatus: 'pending',
        verificationNotes: '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // Redirect to provider dashboard or verification pending page
      navigate('/provider/verification-pending');
    } catch (error) {
      console.error('Error during registration:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="provider-registration-container">
      <div className="provider-registration-card">
        <h2 className="provider-registration-title">Service Provider Registration</h2>
        
        {/* Progress Indicator */}
        <div className="progress-steps">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Account</div>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Business</div>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">Address</div>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 4 ? 'active' : ''}`}>
            <div className="step-number">4</div>
            <div className="step-label">Verification</div>
          </div>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {/* Step 1: Account Information */}
          {step === 1 && (
            <div className="form-step">
              <h3 className="step-title">Account Information</h3>
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={accountData.email}
                  onChange={handleAccountChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={accountData.password}
                  onChange={handleAccountChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password *</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={accountData.confirmPassword}
                  onChange={handleAccountChange}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-next" onClick={nextStep}>
                  Next
                </button>
              </div>
            </div>
          )}
          
          {/* Step 2: Business Information */}
          {step === 2 && (
            <div className="form-step">
              <h3 className="step-title">Business Information</h3>
              <div className="form-group">
                <label htmlFor="businessName">Business Name *</label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={businessData.businessName}
                  onChange={handleBusinessChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="businessType">Business Type *</label>
                <select
                  id="businessType"
                  name="businessType"
                  value={businessData.businessType}
                  onChange={handleBusinessChange}
                  required
                >
                  <option value="">Select Business Type</option>
                  <option value="hotel">Hotel/Accommodation</option>
                  <option value="tour">Tour Operator</option>
                  <option value="transport">Transportation</option>
                  <option value="activity">Activity Provider</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="contactPhone">Contact Phone *</label>
                <input
                  type="tel"
                  id="contactPhone"
                  name="contactPhone"
                  value={businessData.contactPhone}
                  onChange={handleBusinessChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="website">Website (Optional)</label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={businessData.website}
                  onChange={handleBusinessChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Business Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={businessData.description}
                  onChange={handleBusinessChange}
                  rows="4"
                  required
                ></textarea>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-prev" onClick={prevStep}>
                  Previous
                </button>
                <button type="button" className="btn-next" onClick={nextStep}>
                  Next
                </button>
              </div>
            </div>
          )}
          
          {/* Step 3: Address Information */}
          {step === 3 && (
            <div className="form-step">
              <h3 className="step-title">Address Information</h3>
              <div className="form-group">
                <label htmlFor="street">Street Address *</label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={addressData.street}
                  onChange={handleAddressChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="city">City *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={addressData.city}
                  onChange={handleAddressChange}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group half">
                  <label htmlFor="state">State/Province *</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={addressData.state}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
                <div className="form-group half">
                  <label htmlFor="zipCode">Zip/Postal Code *</label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={addressData.zipCode}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="country">Country *</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={addressData.country}
                  onChange={handleAddressChange}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-prev" onClick={prevStep}>
                  Previous
                </button>
                <button type="button" className="btn-next" onClick={nextStep}>
                  Next
                </button>
              </div>
            </div>
          )}
          
          {/* Step 4: Verification Documents */}
          {step === 4 && (
            <div className="form-step">
              <h3 className="step-title">Verification Documents</h3>
              <p className="verification-info">
                Please upload the required documents to verify your business. Your application will be
                reviewed by our team, and you will be notified once approved.
              </p>
              
              <div className="form-group">
                <label htmlFor="businessLicense">Business License *</label>
                <div className="file-upload">
                  <input
                    type="file"
                    id="businessLicense"
                    name="businessLicense"
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    required
                  />
                  <div className="file-upload-info">
                    {verificationDocs.businessLicense ? (
                      <span className="file-name">{verificationDocs.businessLicense.name}</span>
                    ) : (
                      <span className="upload-prompt">Upload a copy of your business license</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="identityProof">Identity Proof *</label>
                <div className="file-upload">
                  <input
                    type="file"
                    id="identityProof"
                    name="identityProof"
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    required
                  />
                  <div className="file-upload-info">
                    {verificationDocs.identityProof ? (
                      <span className="file-name">{verificationDocs.identityProof.name}</span>
                    ) : (
                      <span className="upload-prompt">Upload a valid ID proof (passport, driver's license)</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn-prev" onClick={prevStep}>
                  Previous
                </button>
                <button 
                  type="submit" 
                  className="btn-submit" 
                  disabled={isLoading || !verificationDocs.businessLicense || !verificationDocs.identityProof}
                >
                  {isLoading ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProviderRegistration;