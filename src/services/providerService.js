// src/services/providerService.js
import { 
    collection, 
    doc, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    getDoc, 
    getDocs, 
    query, 
    where 
  } from 'firebase/firestore';
  import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
  import { db, storage, auth } from './firebase';
  
  export const providerService = {
    // Create a new service provider profile
    async createProviderProfile(profileData) {
      try {
        const providersRef = collection(db, 'serviceProviders');
        const newProvider = await addDoc(providersRef, {
          ...profileData,
          userId: auth.currentUser.uid,
          isVerified: false,
          verificationStatus: 'pending',
          createdAt: new Date(),
          updatedAt: new Date()
        });
        return newProvider.id;
      } catch (error) {
        console.error('Error creating provider profile:', error);
        throw error;
      }
    },
  
    // Update existing provider profile
    async updateProviderProfile(providerId, updateData) {
      try {
        const providerRef = doc(db, 'serviceProviders', providerId);
        await updateDoc(providerRef, {
          ...updateData,
          updatedAt: new Date()
        });
      } catch (error) {
        console.error('Error updating provider profile:', error);
        throw error;
      }
    },
  
    // Upload verification documents
    async uploadVerificationDocuments(files) {
      try {
        const uploadPromises = files.map(async (file) => {
          const storageRef = ref(
            storage, 
            verification-docs/`${auth.currentUser.uid}/${file.name}`
          );
          const snapshot = await uploadBytes(storageRef, file);
          return await getDownloadURL(snapshot.ref);
        });
  
        return await Promise.all(uploadPromises);
      } catch (error) {
        console.error('Error uploading documents:', error);
        throw error;
      }
    },
  
    // Get provider profile
    async getProviderProfile(providerId) {
      try {
        const providerRef = doc(db, 'serviceProviders', providerId);
        const providerSnap = await getDoc(providerRef);
        
        if (providerSnap.exists()) {
          return { id: providerSnap.id, ...providerSnap.data() };
        } else {
          throw new Error('No provider profile found');
        }
      } catch (error) {
        console.error('Error fetching provider profile:', error);
        throw error;
      }
    },
  
    // Get provider profile by user ID
    async getProviderProfileByUserId(userId) {
      try {
        const q = query(
          collection(db, 'serviceProviders'), 
          where('userId', '==', userId)
        );
        
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const providerDoc = querySnapshot.docs[0];
          return { id: providerDoc.id, ...providerDoc.data() };
        } else {
          return null;
        }
      } catch (error) {
        console.error('Error fetching provider profile by user ID:', error);
        throw error;
      }
    },
  
    // Create a new package
    async createPackage(packageData) {
      try {
        const packagesRef = collection(db, 'packages');
        const newPackage = await addDoc(packagesRef, {
          ...packageData,
          providerId: auth.currentUser.uid,
          isApproved: false,
          approvalStatus: 'pending',
          createdAt: new Date(),
          updatedAt: new Date()
        });
        return newPackage.id;
      } catch (error) {
        console.error('Error creating package:', error);
        throw error;
      }
    },
  
    // Get packages for a provider
    async getProviderPackages(providerId) {
      try {
        const q = query(
          collection(db, 'packages'), 
          where('providerId', '==', providerId)
        );
        
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error('Error fetching provider packages:', error);
        throw error;
      }
    }
  };
  
  export default providerService;