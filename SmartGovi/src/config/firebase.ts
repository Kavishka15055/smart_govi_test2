import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your Firebase configuration
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

// Initialize services with persistence for React Native
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

export const storage = getStorage(app);

export default app;