import React, { useState, useEffect } from 'react';
import { auth, db } from '../../services/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';

const ProviderAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    topPackages: [],
    monthlyRevenue: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProviderAnalytics = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setError('User not authenticated');
          return;
        }

        // Fetch packages
        const packagesQuery = query(
          collection(db, 'packages'), 
          where('providerId', '==', user.uid)
        );
        const packagesSnapshot = await getDocs(packagesQuery);
        const packages = packagesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Fetch bookings
        const bookingsQuery = query(
          collection(db, 'bookings'), 
          where('providerId', '==', user.uid)
        );
        const bookingsSnapshot = await getDocs(bookingsQuery);
        const bookings = bookingsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Calculate analytics
        const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
        
        // Top packages by bookings
        const packageBookingCounts = packages.map(pkg => ({
          ...pkg,
          bookingCount: bookings.filter(b => b.packageId === pkg.id).length
        })).sort((a, b) => b.bookingCount - a.bookingCount);

        // Monthly revenue (simplified)
        const monthlyRevenue = bookings.reduce((acc, booking) => {
          const month = new Date(booking.createdAt.toDate()).toLocaleString('default', { month: 'short' });
          acc[month] = (acc[month] || 0) + booking.totalPrice;
          return acc;
        }, {});

        setAnalytics({
          totalRevenue,
          totalBookings: bookings.length,
          topPackages: packageBookingCounts.slice(0, 3),
          monthlyRevenue: Object.entries(monthlyRevenue).map(([month, revenue]) => ({ month, revenue }))
        });
      } catch (error) {
        setError('Error fetching analytics: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProviderAnalytics();
  }, []);

  if (isLoading) {
    return <div>Loading analytics...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Rest of the component remains the same as previous implementation */}
    </div>
  );
};

export default ProviderAnalytics;