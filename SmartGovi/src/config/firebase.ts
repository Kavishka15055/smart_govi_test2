import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your Firebase configuration
// Replace with your own config from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyBmkVnBcx14TXeGKBnzC3jFDI-VIcmhMTc",
  authDomain: "loginapp-d967c.firebaseapp.com",
  projectId: "loginapp-d967c",
  storageBucket: "loginapp-d967c.firebasestorage.app",
  messagingSenderId: "444363109815",
  appId: "1:444363109815:android:44b06047c5b4e48389a432"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Enable offline persistence for Firestore
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.log('Offline persistence failed: Multiple tabs open');
  } else if (err.code === 'unimplemented') {
    console.log('Offline persistence not available in this browser');
  }
});

export default app;