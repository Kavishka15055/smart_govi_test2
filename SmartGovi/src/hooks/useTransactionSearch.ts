import { useState, useMemo } from 'react';
import { TransactionDisplay, GroupedTransactions } from '../types';
import {
  filterTransactions,
  groupTransactionsByDate,
  sortTransactions,
} from '../utils/transactionHelpers';

export const useTransactionSearch = (transactions: TransactionDisplay[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'category'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const filteredTransactions = useMemo(() => {
    let filtered = filterTransactions(transactions, searchQuery, typeFilter);
    filtered = sortTransactions(filtered, sortBy, sortDirection);
    return filtered;
  }, [transactions, searchQuery, typeFilter, sortBy, sortDirection]);

  const groupedTransactions = useMemo(() => {
    return groupTransactionsByDate(filteredTransactions);
  }, [filteredTransactions]);

  const toggleSort = (field: 'date' | 'amount' | 'category') => {
    if (sortBy === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('desc');
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setTypeFilter('all');
    setSortBy('date');
    setSortDirection('desc');
  };

  return {
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    sortBy,
    sortDirection,
    toggleSort,
    filteredTransactions,
    groupedTransactions,
    clearFilters,
  };
};