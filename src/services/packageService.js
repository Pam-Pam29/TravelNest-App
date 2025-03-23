

// src/services/packageService.js
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where, 
  addDoc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { db } from './firebase';

// Get all packages
export const getAllPackages = async () => {
  try {
    const packagesCollection = collection(db, 'packages');
    const packageSnapshot = await getDocs(packagesCollection);
    return packageSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw error;
  }
};

// Get package by ID
export const getPackageById = async (packageId) => {
  try {
    const packageDoc = await getDoc(doc(db, 'packages', packageId));
    if (packageDoc.exists()) {
      return {
        id: packageDoc.id,
        ...packageDoc.data()
      };
    } else {
      throw new Error('Package not found');
    }
  } catch (error) {
    throw error;
  }
};

// Filter packages by criteria
export const filterPackages = async (criteria) => {
  try {
    const { region, budget, duration } = criteria;
    let packagesQuery = collection(db, 'packages');
    
    if (region) {
      packagesQuery = query(packagesQuery, where('region', '==', region));
    }
    
    if (budget) {
      packagesQuery = query(packagesQuery, where('price', '<=', budget));
    }
    
    if (duration) {
      packagesQuery = query(packagesQuery, where('duration', '<=', duration));
    }
    
    const packageSnapshot = await getDocs(packagesQuery);
    return packageSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw error;
  }
};

// Admin: Add new package
export const addPackage = async (packageData) => {
  try {
    const packagesCollection = collection(db, 'packages');
    const docRef = await addDoc(packagesCollection, {
      ...packageData,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

// Admin: Update package
export const updatePackage = async (packageId, packageData) => {
  try {
    const packageRef = doc(db, 'packages', packageId);
    await updateDoc(packageRef, {
      ...packageData,
      updatedAt: new Date()
    });
    return true;
  } catch (error) {
    throw error;
  }
};

// Admin: Delete package
export const deletePackage = async (packageId) => {
  try {
    await deleteDoc(doc(db, 'packages', packageId));
    return true;
  } catch (error) {
    throw error;
  }
};

