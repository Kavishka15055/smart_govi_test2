import { TransactionDisplay, GroupedTransactions } from '../types';
import { format, isToday, isYesterday, isThisWeek, parseISO } from 'date-fns';

export const groupTransactionsByDate = (
  transactions: TransactionDisplay[]
): GroupedTransactions[] => {
  const groups: { [key: string]: TransactionDisplay[] } = {};
  const now = new Date();

  transactions.forEach((transaction) => {
    let groupKey: string;

    if (isToday(transaction.date)) {
      groupKey = 'Today';
    } else if (isYesterday(transaction.date)) {
      groupKey = 'Yesterday';
    } else if (isThisWeek(transaction.date)) {
      groupKey = 'This Week';
    } else {
      groupKey = format(transaction.date, 'MMMM d, yyyy');
    }

    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(transaction);
  });

  // Sort groups by date (most recent first)
  const sortedGroups = Object.entries(groups).sort(([keyA], [keyB]) => {
    if (keyA === 'Today') return -1;
    if (keyB === 'Today') return 1;
    if (keyA === 'Yesterday') return -1;
    if (keyB === 'Yesterday') return 1;
    if (keyA === 'This Week') return -1;
    if (keyB === 'This Week') return 1;
    
    // Parse dates for other groups
    const dateA = new Date(keyA);
    const dateB = new Date(keyB);
    return dateB.getTime() - dateA.getTime();
  });

  return sortedGroups.map(([title, data]) => ({
    title,
    data: data.sort((a, b) => b.date.getTime() - a.date.getTime()),
  }));
};

export const filterTransactions = (
  transactions: TransactionDisplay[],
  searchQuery: string,
  typeFilter: 'all' | 'income' | 'expense'
): TransactionDisplay[] => {
  return transactions.filter((transaction) => {
    // Filter by type
    if (typeFilter !== 'all' && transaction.type !== typeFilter) {
      return false;
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesCategory = transaction.categoryName.toLowerCase().includes(query);
      const matchesNotes = transaction.notes?.toLowerCase().includes(query) || false;
      const matchesAmount = transaction.amount.toString().includes(query);
      
      return matchesCategory || matchesNotes || matchesAmount;
    }

    return true;
  });
};

export const sortTransactions = (
  transactions: TransactionDisplay[],
  sortBy: 'date' | 'amount' | 'category',
  sortDirection: 'asc' | 'desc'
): TransactionDisplay[] => {
  return [...transactions].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'date':
        comparison = a.date.getTime() - b.date.getTime();
        break;
      case 'amount':
        comparison = a.amount - b.amount;
        break;
      case 'category':
        comparison = a.categoryName.localeCompare(b.categoryName);
        break;
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });
};

export const formatCurrency = (amount: number): string => {
  return `Rs ${amount.toLocaleString('en-LK')}`;
};

export const formatDateForDisplay = (date: Date): string => {
  if (isToday(date)) {
    return `Today at ${format(date, 'h:mm a')}`;
  } else if (isYesterday(date)) {
    return `Yesterday at ${format(date, 'h:mm a')}`;
  } else {
    return format(date, 'MMM d, yyyy • h:mm a');
  }
};

export const getTransactionIcon = (type: 'income' | 'expense'): string => {
  return type === 'income' ? '💰' : '💸';
};

export const getTransactionColor = (type: 'income' | 'expense'): string => {
  return type === 'income' ? '#4CAF50' : '#F44336';
};