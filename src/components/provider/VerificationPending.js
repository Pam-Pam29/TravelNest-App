// src/components/provider/VerificationPending.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';
import '../../styles/verificationPending.css';

const VerificationPending = () => {
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const providerDoc = await getDoc(doc(db, 'serviceProviders', user.uid));
          
          if (providerDoc.exists()) {
            setProvider(providerDoc.data());
            
            // If already verified, redirect to dashboard
            if (providerDoc.data().isVerified) {
              navigate('/provider/dashboard');
            }
          } else {
            // If no provider document exists, redirect to registration
            navigate('/provider/register');
          }
        } catch (error) {
          console.error('Error fetching provider data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        // Not logged in, redirect to login
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="verification-pending-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  // Format the date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="verification-pending-container">
      <div className="verification-pending-card">
        <div className="status-icon pending"></div>
        <h2 className="verification-title">Verification In Progress</h2>
        
        <div className="verification-info">
          <p>
            Thank you for registering as a service provider with Travenest. Our team is currently reviewing your application and verification documents.
          </p>
          
          <div className="status-details">
            <div className="status-item">
              <span className="status-label">Business Name:</span>
              <span className="status-value">{provider?.businessName}</span>
            </div>
            <div className="status-item">
              <span className="status-label">Application Date:</span>
              <span className="status-value">{formatDate(provider?.createdAt)}</span>
            </div>
            <div className="status-item">
              <span className="status-label">Status:</span>
              <span className="status-badge pending">
                {provider?.verificationStatus?.toUpperCase()}
              </span>
            </div>
          </div>
          
          <p className="verification-note">
            The verification process typically takes 1-3 business days. You will be notified via email once your application has been reviewed.
          </p>
        </div>
        
        <div className="verification-steps">
          <h3>What's Next?</h3>
          <div className="step">
            <div className="step-icon active">1</div>
            <div className="step-content">
              <h4>Application Submitted</h4>
              <p>Your application has been received by our team.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-icon">2</div>
            <div className="step-content">
              <h4>Document Verification</h4>
              <p>We are reviewing your submitted documents.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-icon">3</div>
            <div className="step-content">
              <h4>Account Approval</h4>
              <p>Once approved, you can start creating travel packages.</p>
            </div>
          </div>
        </div>
        
        <div className="contact-support">
          <h3>Need Help?</h3>
          <p>
            If you have any questions regarding your application or need to update your information, please contact our support team.
          </p>
          <button className="support-btn">Contact Support</button>
        </div>
      </div>
    </div>
  );
};

export default VerificationPending;