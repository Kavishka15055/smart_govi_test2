import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { db } from '../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { PickerCategory } from '../types';

export const useCategories = (type: 'income' | 'expense') => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<PickerCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      const fetchCategories = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        // First get the user's farm profile
        const farmsRef = collection(db, 'farms');
        const farmQuery = query(farmsRef, where('userId', '==', user.id));
        const farmSnapshot = await getDocs(farmQuery);

        if (!farmSnapshot.empty) {
          const farmData = farmSnapshot.docs[0].data();
          
          if (type === 'income') {
            const incomeCats = farmData.incomeCategories || [];
            setCategories(incomeCats.map((cat: any) => ({
              id: cat.id,
              name: cat.name,
              defaultUnit: cat.defaultUnit || 'kg',
            })));
          } else {
            const expenseCats = farmData.expenseCategories || [];
            setCategories(expenseCats.map((cat: any) => ({
              id: cat.id,
              name: cat.name,
            })));
          }
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    }, [user, type])
  );

  return { categories, loading, error };
};