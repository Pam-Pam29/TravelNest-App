// src/components/admin/PackageManagement.js
import React, { useState, useEffect } from 'react';
import { 
  getAllPackages,
  addPackage,
  updatePackage,
  deletePackage 
} from '../../services/packageService';

const PackageManagement = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPackage, setCurrentPackage] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
    region: '',
    imageUrl: '',
    itinerary: [''],
    included: [''],
    excluded: ['']
  });

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const data = await getAllPackages();
        setPackages(data);
      } catch (error) {
        setError('Failed to fetch packages: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const handleOpenModal = (pkg = null) => {
    if (pkg) {
      // Edit mode
      setCurrentPackage(pkg);
      setFormData({
        title: pkg.title || '',
        description: pkg.description || '',
        price: pkg.price || '',
        duration: pkg.duration || '',
        region: pkg.region || '',
        imageUrl: pkg.imageUrl || '',
        itinerary: pkg.itinerary || [''],
        included: pkg.included || [''],
        excluded: pkg.excluded || ['']
      });
    } else {
      // Add mode
      setCurrentPackage(null);
      setFormData({
        title: '',
        description: '',
        price: '',
        duration: '',
        region: '',
        imageUrl: '',
        itinerary: [''],
        included: [''],
        excluded: ['']
      });
    }
    
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentPackage(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: name === 'price' || name === 'duration' ? parseFloat(value) : value
    });
  };

  const handleArrayInputChange = (e, index, arrayName) => {
    const value = e.target.value;
    const newArray = [...formData[arrayName]];
    newArray[index] = value;
    
    setFormData({
      ...formData,
      [arrayName]: newArray
    });
  };

  const handleAddArrayItem = (arrayName) => {
    setFormData({
      ...formData,
      [arrayName]: [...formData[arrayName], '']
    });
  };

  const handleRemoveArrayItem = (index, arrayName) => {
    const newArray = [...formData[arrayName]];
    newArray.splice(index, 1);
    
    setFormData({
      ...formData,
      [arrayName]: newArray
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (currentPackage) {
        // Update existing package
        await updatePackage(currentPackage.id, formData);
        
        // Update the local state
        setPackages(packages.map(pkg => 
          pkg.id === currentPackage.id ? { ...pkg, ...formData } : pkg
        ));
      } else {
        // Add new package
        const newPackageId = await addPackage(formData);
        
        // Update the local state
        setPackages([
          ...packages,
          { id: newPackageId, ...formData }
        ]);
      }
      
      handleCloseModal();
      setError('');
    } catch (error) {
      setError('Failed to save package: ' + error.message);
    }
  };

  const handleDeletePackage = async (packageId) => {
    if (!window.confirm('Are you sure you want to delete this package? This action cannot be undone.')) {
      return;
    }
    
    try {
      await deletePackage(packageId);
      
      // Update the local state
      setPackages(packages.filter(pkg => pkg.id !== packageId));
      
      setError('');
    } catch (error) {
      setError('Failed to delete package: ' + error.message);
    }
  };

  if (loading) {
    return <div className="loading">Loading packages...</div>;
  }

  return (
    <div className="package-management">
      <div className="management-header">
        <h2>Package Management</h2>
        <button 
          onClick={() => handleOpenModal()}
          className="btn-add"
        >
          Add New Package
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="package-table-container">
        <table className="package-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Region</th>
              <th>Duration</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {packages.map(pkg => (
              <tr key={pkg.id}>
                <td>{pkg.title}</td>
                <td>{pkg.region}</td>
                <td>{pkg.duration} days</td>
                <td>${pkg.price}</td>
                <td>
                  <button 
                    onClick={() => handleOpenModal(pkg)}
                    className="btn-edit"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeletePackage(pkg.id)}
                    className="btn-delete"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {packages.length === 0 && (
          <div className="no-packages">No packages found</div>
        )}
      </div>
      
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{currentPackage ? 'Edit Package' : 'Add New Package'}</h3>
              <button 
                onClick={handleCloseModal}
                className="btn-close"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="package-form">
              <div className="form-group">
                <label htmlFor="title">Package Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  required
                ></textarea>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price">Price ($)</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="duration">Duration (days)</label>
                  <input
                    type="number"
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="region">Region</label>
                  <select
                    id="region"
                    name="region"
                    value={formData.region}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Region</option>
                    <option value="Europe">Europe</option>
                    <option value="Asia">Asia</option>
                    <option value="Africa">Africa</option>
                    <option value="North America">North America</option>
                    <option value="South America">South America</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="imageUrl">Image URL</label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div className="form-section">
                <label>Itinerary (Day by Day)</label>
                {formData.itinerary.map((day, index) => (
                  <div key={index} className="array-input-row">
                    <textarea
                      value={day}
                      onChange={(e) => handleArrayInputChange(e, index, 'itinerary')}
                      placeholder={`Day ${index + 1}`}
                      rows="2"
                    ></textarea>
                    <button
                      type="button"
                      onClick={() => handleRemoveArrayItem(index, 'itinerary')}
                      className="btn-remove"
                      disabled={formData.itinerary.length <= 1}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddArrayItem('itinerary')}
                  className="btn-add-item"
                >
                  Add Day
                </button>
              </div>
              
              <div className="form-row">
                <div className="form-section">
                  <label>What's Included</label>
                  {formData.included.map((item, index) => (
                    <div key={index} className="array-input-row">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleArrayInputChange(e, index, 'included')}
                        placeholder="E.g., Accommodation"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveArrayItem(index, 'included')}
                        className="btn-remove"
                        disabled={formData.included.length <= 1}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleAddArrayItem('included')}
                    className="btn-add-item"
                  >
                    Add Item
                  </button>
                </div>
                
                <div className="form-section">
                  <label>What's Not Included</label>
                  {formData.excluded.map((item, index) => (
                    <div key={index} className="array-input-row">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleArrayInputChange(e, index, 'excluded')}
                        placeholder="E.g., Flights"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveArrayItem(index, 'excluded')}
                        className="btn-remove"
                        disabled={formData.excluded.length <= 1}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleAddArrayItem('excluded')}
                    className="btn-add-item"
                  >
                    Add Item
                  </button>
                </div>
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  className="btn-cancel"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-save"
                >
                  {currentPackage ? 'Update Package' : 'Create Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageManagement;

