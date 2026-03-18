import { db } from '../config/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  startAt,
  endAt,
} from 'firebase/firestore';
import {
  IncomeTransaction,
  ExpenseTransaction,
  Transaction,
  DateRange,
  FilterOptions,
  DashboardSummary,
  RecentTransactionDisplay,
  CategoryBreakdown,
} from '../types';

class TransactionService {
  // Add Income Transaction
  async addIncome(transaction: Omit<IncomeTransaction, 'id' | 'createdAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'income'), {
        ...transaction,
        type: 'income',
        date: Timestamp.fromDate(transaction.date),
        createdAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding income:', error);
      throw error;
    }
  }

  // Add Expense Transaction
  async addExpense(transaction: Omit<ExpenseTransaction, 'id' | 'createdAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'expenses'), {
        ...transaction,
        type: 'expense',
        date: Timestamp.fromDate(transaction.date),
        createdAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding expense:', error);
      throw error;
    }
  }

  // Get Recent Transactions for Dashboard
  async getRecentTransactions(
    userId: string,
    limitCount: number = 5
  ): Promise<RecentTransactionDisplay[]> {
    try {
      // Get recent income
      const incomeQuery = query(
        collection(db, 'income'),
        where('userId', '==', userId),
        orderBy('date', 'desc'),
        limit(limitCount)
      );
      
      // Get recent expenses
      const expenseQuery = query(
        collection(db, 'expenses'),
        where('userId', '==', userId),
        orderBy('date', 'desc'),
        limit(limitCount)
      );

      const [incomeSnapshot, expenseSnapshot] = await Promise.all([
        getDocs(incomeQuery),
        getDocs(expenseQuery),
      ]);

      const transactions: RecentTransactionDisplay[] = [];

      incomeSnapshot.forEach((doc) => {
        const data = doc.data();
        transactions.push({
          id: doc.id,
          type: 'income',
          categoryName: data.categoryName,
          amount: data.amount,
          date: data.date.toDate(),
          quantity: data.quantity,
          unit: data.unit,
        });
      });

      expenseSnapshot.forEach((doc) => {
        const data = doc.data();
        transactions.push({
          id: doc.id,
          type: 'expense',
          categoryName: data.categoryName,
          amount: data.amount,
          date: data.date.toDate(),
          notes: data.notes,
        });
      });

      // Sort by date descending and limit
      return transactions
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, limitCount);
    } catch (error) {
      console.error('Error getting recent transactions:', error);
      throw error;
    }
  }

  // Get Transactions by Date Range
  async getTransactionsByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<{ income: IncomeTransaction[]; expenses: ExpenseTransaction[] }> {
    try {
      const startTimestamp = Timestamp.fromDate(startDate);
      const endTimestamp = Timestamp.fromDate(endDate);

      // Get income in range
      const incomeQuery = query(
        collection(db, 'income'),
        where('userId', '==', userId),
        where('date', '>=', startTimestamp),
        where('date', '<=', endTimestamp),
        orderBy('date', 'desc')
      );

      // Get expenses in range
      const expenseQuery = query(
        collection(db, 'expenses'),
        where('userId', '==', userId),
        where('date', '>=', startTimestamp),
        where('date', '<=', endTimestamp),
        orderBy('date', 'desc')
      );

      const [incomeSnapshot, expenseSnapshot] = await Promise.all([
        getDocs(incomeQuery),
        getDocs(expenseQuery),
      ]);

      const income: IncomeTransaction[] = [];
      const expenses: ExpenseTransaction[] = [];

      incomeSnapshot.forEach((doc) => {
        income.push({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date.toDate(),
          createdAt: doc.data().createdAt.toDate(),
        } as IncomeTransaction);
      });

      expenseSnapshot.forEach((doc) => {
        expenses.push({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date.toDate(),
          createdAt: doc.data().createdAt.toDate(),
        } as ExpenseTransaction);
      });

      return { income, expenses };
    } catch (error) {
      console.error('Error getting transactions by date range:', error);
      throw error;
    }
  }

  // Get Dashboard Summary
  async getDashboardSummary(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<DashboardSummary> {
    try {
      const { income, expenses } = await this.getTransactionsByDateRange(
        userId,
        startDate,
        endDate
      );

      const totalIncome = income.reduce((sum, item) => sum + item.amount, 0);
      const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);

      const incomeCategories = new Map<string, { amount: number; count: number }>();
      income.forEach(item => {
        const current = incomeCategories.get(item.categoryName) || { amount: 0, count: 0 };
        incomeCategories.set(item.categoryName, {
          amount: current.amount + item.amount,
          count: current.count + 1
        });
      });

      const incomeBreakdown: CategoryBreakdown[] = Array.from(incomeCategories.entries())
        .map(([categoryName, data]) => ({
          categoryName,
          amount: data.amount,
          count: data.count,
          percentage: totalIncome > 0 ? (data.amount / totalIncome) * 100 : 0
        }))
        .sort((a, b) => b.amount - a.amount);

      const expenseCategories = new Map<string, { amount: number; count: number }>();
      expenses.forEach(item => {
        const current = expenseCategories.get(item.categoryName) || { amount: 0, count: 0 };
        expenseCategories.set(item.categoryName, {
          amount: current.amount + item.amount,
          count: current.count + 1
        });
      });

      const expenseBreakdown: CategoryBreakdown[] = Array.from(expenseCategories.entries())
        .map(([categoryName, data]) => ({
          categoryName,
          amount: data.amount,
          count: data.count,
          percentage: totalExpense > 0 ? (data.amount / totalExpense) * 100 : 0
        }))
        .sort((a, b) => b.amount - a.amount);

      return {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
        periodStart: startDate,
        periodEnd: endDate,
        incomeCount: income.length,
        expenseCount: expenses.length,
        incomeBreakdown,
        expenseBreakdown,
      };
    } catch (error) {
      console.error('Error getting dashboard summary:', error);
      throw error;
    }
  }

  // Delete Transaction
  async deleteTransaction(type: 'income' | 'expense', transactionId: string): Promise<void> {
    try {
      const collectionName = type === 'income' ? 'income' : 'expenses';
      await deleteDoc(doc(db, collectionName, transactionId));
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  }

  // Update Transaction
  async updateTransaction(
    type: 'income' | 'expense',
    transactionId: string,
    updates: Partial<IncomeTransaction | ExpenseTransaction>
  ): Promise<void> {
    try {
      const collectionName = type === 'income' ? 'income' : 'expenses';
      const docRef = doc(db, collectionName, transactionId);
      
      // Remove id from updates if present
      const { id, ...updateData } = updates as any;
      
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  }
}

export const transactionService = new TransactionService();