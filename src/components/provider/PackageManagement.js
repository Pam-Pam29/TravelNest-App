import React, { useState, useEffect } from 'react';

const PackageManagement = () => {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    // Simulate packages data
    setPackages([
      {
        id: 'pkg1',
        title: 'Tropical Paradise Tour',
        price: 1200,
        duration: 7,
        status: 'Approved'
      },
      {
        id: 'pkg2',
        title: 'Mountain Expedition',
        price: 1500,
        duration: 10,
        status: 'Pending'
      }
    ]);
  }, []);

  const handleCreatePackage = () => {
    // Navigate to package creation form
    console.log('Create new package');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Packages</h1>
        <button 
          onClick={handleCreatePackage}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Package
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Package Name</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Duration</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg) => (
              <tr key={pkg.id} className="border-b">
                <td className="p-3">{pkg.title}</td>
                <td className="p-3">${pkg.price}</td>
                <td className="p-3">{pkg.duration} days</td>
                <td className="p-3">
                  <span className={`
                    px-2 py-1 rounded-full text-xs
                    ${pkg.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                  `}>
                    {pkg.status}
                  </span>
                </td>
                <td className="p-3">
                  <button className="text-blue-600 hover:underline">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PackageManagement;