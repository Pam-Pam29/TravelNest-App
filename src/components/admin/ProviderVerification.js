// src/components/admin/ProviderVerification.js
import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';
import '../../styles/adminVerification.css';

const ProviderVerification = () => {
  const [pendingProviders, setPendingProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verificationNote, setVerificationNote] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchPendingProviders();
  }, []);

  const fetchPendingProviders = async () => {
    setLoading(true);
    try {
      const providersRef = collection(db, 'serviceProviders');
      const q = query(providersRef, where('verificationStatus', '==', 'pending'));
      const querySnapshot = await getDocs(q);
      
      const providers = [];
      querySnapshot.forEach((doc) => {
        providers.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      setPendingProviders(providers);
    } catch (error) {
      console.error('Error fetching pending providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProvider = (provider) => {
    setSelectedProvider(provider);
    setVerificationNote('');
    setSuccessMessage('');
  };

  const handleVerificationAction = async (action) => {
    if (!selectedProvider) return;
    
    setActionLoading(true);
    try {
      const providerRef = doc(db, 'serviceProviders', selectedProvider.id);
      
      await updateDoc(providerRef, {
        isVerified: action === 'approve',
        verificationStatus: action === 'approve' ? 'approved' : 'rejected',
        verificationNotes: verificationNote,
        updatedAt: serverTimestamp()
      });
      
      // Update the local state
      setPendingProviders(prevProviders => 
        prevProviders.filter(provider => provider.id !== selectedProvider.id)
      );
      
      setSuccessMessage(`Provider ${action === 'approve' ? 'approved' : 'rejected'} successfully.)`);
      setSelectedProvider(null);
    } catch (error) {
      console.error(`Error ${action}ing provider:, error)`);
    } finally {
      setActionLoading(false);
    }
  };

  // Format timestamp
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
    <div className="admin-verification-container">
      <h2 className="admin-section-title">Service Provider Verification</h2>
      
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}
      
      <div className="verification-panel">
        <div className="providers-list">
          <h3>Pending Verifications</h3>
          
          {loading ? (
            <div className="loading-spinner"></div>
          ) : pendingProviders.length === 0 ? (
            <div className="empty-state">
              <p>No pending verification requests.</p>
            </div>
          ) : (
            <ul className="providers-list-items">
              {pendingProviders.map((provider) => (
                <li
                  key={provider.id}
                  className={`provider-list-item ${selectedProvider?.id === provider.id ? 'active' : ''}`}
                  onClick={() => handleSelectProvider(provider)}
                >
                  <div className="provider-list-content">
                    <h4>{provider.businessName}</h4>
                    <p>Applied: {formatDate(provider.createdAt)}</p>
                  </div>
                  <span className="chevron">›</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="provider-details">
          {selectedProvider ? (
            <div className="provider-detail-content">
              <h3>Business Details</h3>
              
              <div className="detail-section">
                <div className="detail-item">
                  <span className="detail-label">Business Name</span>
                  <span className="detail-value">{selectedProvider.businessName}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Business Type</span>
                  <span className="detail-value">{selectedProvider.businessType}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Contact Phone</span>
                  <span className="detail-value">{selectedProvider.contactPhone}</span>
                </div>
                {selectedProvider.website && (
                  <div className="detail-item">
                    <span className="detail-label">Website</span>
                    <span className="detail-value">
                      <a href={selectedProvider.website} target="_blank" rel="noopener noreferrer">
                        {selectedProvider.website}
                      </a>
                    </span>
                  </div>
                )}
              </div>
              
              <div className="detail-section">
                <h4>Address</h4>
                <div className="detail-item">
                  <span className="detail-value address">
                    {selectedProvider.address.street}, {selectedProvider.address.city}, {selectedProvider.address.state}, {selectedProvider.address.zipCode}, {selectedProvider.address.country}
                  </span>
                </div>
              </div>
              
              <div className="detail-section">
                <h4>Business Description</h4>
                <p className="description-text">
                  {selectedProvider.description}
                </p>
              </div>
              
              <div className="detail-section">
                <h4>Verification Documents</h4>
                <div className="documents-container">
                  {selectedProvider.verificationDocuments?.businessLicense && (
                    <div className="document-item">
                      <span className="document-label">Business License</span>
                      <a
                        href={selectedProvider.verificationDocuments.businessLicense}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="document-link"
                      >
                        View Document
                      </a>
                    </div>
                  )}
                  
                  {selectedProvider.verificationDocuments?.identityProof && (
                    <div className="document-item">
                      <span className="document-label">Identity Proof</span>
                      <a
                        href={selectedProvider.verificationDocuments.identityProof}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="document-link"
                      >
                        View Document
                      </a>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="verification-actions">
                <div className="verification-notes">
                  <label htmlFor="verificationNote">Verification Notes</label>
                  <textarea
                    id="verificationNote"
                    value={verificationNote}
                    onChange={(e) => setVerificationNote(e.target.value)}
                    placeholder="Add verification notes or feedback for the provider..."
                    rows="4"
                  ></textarea>
                </div>
                
                <div className="action-buttons">
                  <button
                    className="reject-btn"
                    onClick={() => handleVerificationAction('reject')}
                    disabled={actionLoading}
                  >
                    {actionLoading ? 'Processing...' : 'Reject Application'}
                  </button>
                  <button
                    className="approve-btn"
                    onClick={() => handleVerificationAction('approve')}
                    disabled={actionLoading}
                  >
                    {actionLoading ? 'Processing...' : 'Approve Provider'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-details-state">
              <p>Select a provider from the list to view details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProviderVerification;