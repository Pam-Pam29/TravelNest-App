// src/services/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAvXOapjqvQ2ru6JeG7jy5aMYuZ_bEpGxg",
  authDomain: "travelnest-app-1.firebaseapp.com",
  projectId: "travelnest-app-1",
  storageBucket: "travelnest-app-1.firebasestorage.app",
  messagingSenderId: "557240068663",
  appId: "1:557240068663:web:b82df76a646767db0b2db2",
  measurementId: "G-Q6H5YMQ67M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };

