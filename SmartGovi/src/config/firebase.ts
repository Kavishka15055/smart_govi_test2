import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your Firebase configuration
// Replace with your own config from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyActAqg4N9h6mUO8x53JSFG9TgahGe0tnI",
  authDomain: "smartgovi-9378a.firebaseapp.com",
  projectId: "smartgovi-9378a",
  storageBucket: "smartgovi-9378a.firebasestorage.app",
  messagingSenderId: "789055550094",
  appId: "1:789055550094:android:fb4b45482494546acb4fdf"
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