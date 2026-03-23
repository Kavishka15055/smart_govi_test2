import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, query, collection, where, getDocs, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { User } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Derive a synthetic Firebase email from a phone number
const phoneToEmail = (phone: string): string => {
  // Normalize phone: strip leading + or 0, ensure it's always consistent
  const normalized = phone.replace(/\s+/g, '').replace(/^\+94/, '0');
  return `${normalized}@smartgovi.app`;
};

class AuthService {
  /**
   * Login with phone number + password.
   */
  async login(phoneNumber: string, password: string): Promise<User> {
    try {
      const email = phoneToEmail(phoneNumber);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        return { id: firebaseUser.uid, ...userDoc.data() } as User;
      } else {
        throw new Error('User data not found');
      }
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Sign up with phone number + password (no email required).
   */
  async signUp(userData: any): Promise<User> {
    try {
      const email = phoneToEmail(userData.phoneNumber);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        userData.password
      );
      const firebaseUser = userCredential.user;

      const newUser: User = {
        id: firebaseUser.uid,
        fullName: userData.fullName,
        phoneNumber: userData.phoneNumber,
        preferredLanguage: 'en',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
      return newUser;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Check if a phone number is already registered.
   */
  async isPhoneRegistered(phoneNumber: string): Promise<boolean> {
    try {
      const q = query(
        collection(db, 'users'),
        where('phoneNumber', '==', phoneNumber)
      );
      const snapshot = await getDocs(q);
      return !snapshot.empty;
    } catch {
      return false;
    }
  }


  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error('Logout failed');
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return null;
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    if (userDoc.exists()) {
      return { id: firebaseUser.uid, ...userDoc.data() } as User;
    }
    return null;
  }

  async updateUserProfile(userId: string, data: Partial<User>): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { ...data, updatedAt: new Date() });
    } catch (error: any) {
      throw new Error('Failed to update user profile');
    }
  }
}

export const authService = new AuthService();