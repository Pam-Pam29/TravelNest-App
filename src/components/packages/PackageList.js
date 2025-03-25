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
  const [filteredPackages, setFilteredPackages] = useState([]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const data = await getAllPackages();
        setPackages(data);
        setFilteredPackages(data);
        setError('');
      } catch (error) {
        setError('Failed to fetch packages: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  // Handle filter input changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    // Apply filters
    const filtered = filterPackages(packages, newFilters);
    setFilteredPackages(filtered);
  };

  return (
    <div className="package-list-container">
      <h2>Explore Travel Packages</h2>
      
      {/* Filter inputs */}
      <div className="filter-container">
        <select 
          name="region" 
          value={filters.region} 
          onChange={handleFilterChange}
        >
          <option value="">All Regions</option>
          <option value="Europe">Europe</option>
          <option value="Asia">Asia</option>
          <option value="North America">North America</option>
          {/* Add more region options */}
        </select>

        <select 
          name="budget" 
          value={filters.budget} 
          onChange={handleFilterChange}
        >
          <option value="">All Budgets</option>
          <option value="budget">Budget</option>
          <option value="mid-range">Mid-Range</option>
          <option value="luxury">Luxury</option>
        </select>

        <select 
          name="duration" 
          value={filters.duration} 
          onChange={handleFilterChange}
        >
          <option value="">All Durations</option>
          <option value="short">Short (1-3 days)</option>
          <option value="medium">Medium (4-7 days)</option>
          <option value="long">Long (8+ days)</option>
        </select>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="loading">Loading packages...</div>
      ) : (
        <div className="packages-grid">
          {filteredPackages.length > 0 ? (
            filteredPackages.map((pkg) => (
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