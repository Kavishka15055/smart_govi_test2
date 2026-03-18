import { db } from '../config/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  query,
  where,
  getDocs 
} from 'firebase/firestore';
import { Farm, FarmSetupState } from '../types';

class FarmService {
  async saveFarmProfile(userId: string, farmData: FarmSetupState): Promise<string> {
    try {
      const farmRef = doc(collection(db, 'farms'));
      const farm: Farm = {
        id: farmRef.id,
        userId,
        types: farmData.selectedFarmTypes,
        incomeCategories: farmData.incomeCategories.filter(cat => cat.isSelected),
        expenseCategories: farmData.expenseCategories.filter(cat => cat.isSelected),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(farmRef, farm);
      
      // Also update user document to mark setup as complete
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        farmSetupComplete: true,
        farmId: farmRef.id,
        updatedAt: new Date(),
      });

      return farmRef.id;
    } catch (error) {
      console.error('Error saving farm profile:', error);
      throw error;
    }
  }

  async getFarmProfile(userId: string): Promise<Farm | null> {
    try {
      const farmsRef = collection(db, 'farms');
      const q = query(farmsRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const farmDoc = querySnapshot.docs[0];
        return {
          id: farmDoc.id,
          ...farmDoc.data()
        } as Farm;
      }

      return null;
    } catch (error) {
      console.error('Error getting farm profile:', error);
      throw error;
    }
  }

  async updateFarmProfile(farmId: string, updates: Partial<Farm>): Promise<void> {
    try {
      const farmRef = doc(db, 'farms', farmId);
      await updateDoc(farmRef, {
        ...updates,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating farm profile:', error);
      throw error;
    }
  }

  async checkFarmSetupComplete(userId: string): Promise<boolean> {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        return userDoc.data()?.farmSetupComplete || false;
      }
      
      return false;
    } catch (error) {
      console.error('Error checking farm setup:', error);
      throw error;
    }
  }
}

export const farmService = new FarmService();