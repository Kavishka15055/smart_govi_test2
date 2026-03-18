import { useState, useEffect, useCallback } from 'react';
import { db } from '../config/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  deleteDoc,
  doc,
  Timestamp,
  startAfter,
} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { TransactionDisplay, PaginationState } from '../types';

const TRANSACTIONS_PER_PAGE = 20;

export const useTransactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<TransactionDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: TRANSACTIONS_PER_PAGE,
    hasMore: true,
    total: 0,
  });
  const [lastDoc, setLastDoc] = useState<any>(null);

  const loadTransactions = useCallback(async (refresh = false) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Load income
      const incomeQuery = query(
        collection(db, 'income'),
        where('userId', '==', user.id),
        orderBy('date', 'desc'),
        limit(TRANSACTIONS_PER_PAGE)
      );

      // Load expenses
      const expenseQuery = query(
        collection(db, 'expenses'),
        where('userId', '==', user.id),
        orderBy('date', 'desc'),
        limit(TRANSACTIONS_PER_PAGE)
      );

      const [incomeSnapshot, expenseSnapshot] = await Promise.all([
        getDocs(incomeQuery),
        getDocs(expenseQuery),
      ]);

      const allTransactions: TransactionDisplay[] = [];

      incomeSnapshot.forEach((doc) => {
        const data = doc.data();
        allTransactions.push({
          id: doc.id,
          type: 'income',
          categoryName: data.categoryName,
          amount: data.amount,
          date: data.date.toDate(),
          quantity: data.quantity,
          unit: data.unit,
          notes: data.notes,
        });
      });

      expenseSnapshot.forEach((doc) => {
        const data = doc.data();
        allTransactions.push({
          id: doc.id,
          type: 'expense',
          categoryName: data.categoryName,
          amount: data.amount,
          date: data.date.toDate(),
          notes: data.notes,
          receiptUrl: data.receiptUrl,
        });
      });

      // Sort by date descending
      const sorted = allTransactions.sort((a, b) => b.date.getTime() - a.date.getTime());

      setTransactions(sorted);
      setPagination(prev => ({
        ...prev,
        hasMore: sorted.length === TRANSACTIONS_PER_PAGE,
        total: sorted.length,
      }));
    } catch (err) {
      console.error('Error loading transactions:', err);
      setError('Failed to load transactions');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  const loadMoreTransactions = useCallback(async () => {
    if (!user || !pagination.hasMore || loading) return;

    try {
      setLoading(true);

      // Load more income
      const incomeQuery = query(
        collection(db, 'income'),
        where('userId', '==', user.id),
        orderBy('date', 'desc'),
        startAfter(lastDoc),
        limit(TRANSACTIONS_PER_PAGE)
      );

      // Load more expenses
      const expenseQuery = query(
        collection(db, 'expenses'),
        where('userId', '==', user.id),
        orderBy('date', 'desc'),
        startAfter(lastDoc),
        limit(TRANSACTIONS_PER_PAGE)
      );

      const [incomeSnapshot, expenseSnapshot] = await Promise.all([
        getDocs(incomeQuery),
        getDocs(expenseQuery),
      ]);

      // ... similar to loadTransactions but append
      
    } catch (err) {
      console.error('Error loading more transactions:', err);
    } finally {
      setLoading(false);
    }
  }, [user, pagination.hasMore, loading, lastDoc]);

  const deleteTransaction = async (transactionId: string, type: 'income' | 'expense') => {
    try {
      const collectionName = type === 'income' ? 'income' : 'expenses';
      await deleteDoc(doc(db, collectionName, transactionId));
      
      // Remove from local state
      setTransactions(prev => prev.filter(t => t.id !== transactionId));
      
      return true;
    } catch (err) {
      console.error('Error deleting transaction:', err);
      throw err;
    }
  };

  const refreshTransactions = useCallback(() => {
    setRefreshing(true);
    loadTransactions(true);
  }, [loadTransactions]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  return {
    transactions,
    loading,
    refreshing,
    error,
    pagination,
    loadMoreTransactions,
    deleteTransaction,
    refreshTransactions,
  };
};