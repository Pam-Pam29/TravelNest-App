// src/components/packages/PackageList.js
import React, { useState, useEffect } from 'react';
import PackageCard from './PackageCard';
import { getAllPackages, filterPackages } from '../../services/packageService';

const PackageList = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    region: '',
    budget: '',
    duration: ''
  });

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const data = await getAllPackages();
        setPackages(data);
        setError('');
      } catch (error) {
        setError('Failed to fetch packages: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const handleFilter = async () => {
    try {
      setLoading(true);
      const filteredPackages = await filterPackages({
        region: filters.region || null,
        budget: filters.budget ? parseFloat(filters.budget) : null,
        duration: filters.duration ? parseInt(filters.duration) : null
      });
      setPackages(filteredPackages);
      setError('');
    } catch (error) {
      setError('Failed to filter packages: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setFilters({
      region: '',
      budget: '',
      duration: ''
    });
    
    try {
      setLoading(true);
      const data = await getAllPackages();
      setPackages(data);
      setError('');
    } catch (error) {
      setError('Failed to fetch packages: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="package-list-container">
      <h2>Explore Travel Packages</h2>
      
      <div className="filter-container">
        <div className="filter-group">
          <label htmlFor="region">Destination</label>
          <select
            id="region"
            name="region"
            value={filters.region}
            onChange={handleFilterChange}
          >
            <option value="">All Destinations</option>
            <option value="Europe">Europe</option>
            <option value="Asia">Asia</option>
            <option value="Africa">Africa</option>
            <option value="North America">North America</option>
            <option value="South America">South America</option>
            <option value="Australia">Australia</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="budget">Max Budget</label>
          <input
            type="number"
            id="budget"
            name="budget"
            value={filters.budget}
            onChange={handleFilterChange}
            placeholder="Budget in $"
          />
        </div>
        
        <div className="filter-group">
          <label htmlFor="duration">Max Duration (days)</label>
          <input
            type="number"
            id="duration"
            name="duration"
            value={filters.duration}
            onChange={handleFilterChange}
            placeholder="Days"
          />
        </div>
        
        <div className="filter-buttons">
          <button onClick={handleFilter} className="btn-filter">
            Filter
          </button>
          <button onClick={handleReset} className="btn-reset">
            Reset
          </button>
        </div>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="loading">Loading packages...</div>
      ) : (
        <div className="packages-grid">
          {packages.length > 0 ? (
            packages.map((pkg) => (
              <PackageCard key={pkg.id} travelPackage={pkg} />
            ))
          ) : (
            <div className="no-packages">
              No packages found. Try adjusting your filters.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PackageList;