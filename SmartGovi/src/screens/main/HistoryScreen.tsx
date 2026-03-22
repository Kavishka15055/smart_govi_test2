import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { COLORS, FONTS } from '../../utils/constants';
import { useTransactions } from '../../hooks/useTransactions';
import { useTransactionSearch } from '../../hooks/useTransactionSearch';
import { TransactionDisplay } from '../../types';
import Header from '../../components/common/Header';
import SearchBar from '../../components/history/SearchBar';
import FilterChips from '../../components/history/FilterChips';
import TransactionGroup from '../../components/history/TransactionGroup';
import TransactionDetailModal from '../../components/modals/TransactionDetailModal';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';

type HistoryScreenNavigationProp = StackNavigationProp<any, 'History'>;

const HistoryScreen: React.FC = () => {
  const navigation = useNavigation<HistoryScreenNavigationProp>();
  const {
    transactions,
    loading,
    refreshing,
    error,
    deleteTransaction,
    refreshTransactions,
  } = useTransactions();

  const {
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    sortBy,
    toggleSort,
    groupedTransactions,
    clearFilters,
  } = useTransactionSearch(transactions);

  const [selectedTransaction, setSelectedTransaction] = useState<TransactionDisplay | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      refreshTransactions();
    }, [])
  );

  const handleTransactionPress = (transaction: TransactionDisplay) => {
    setSelectedTransaction(transaction);
    setModalVisible(true);
  };

  const handleEditTransaction = (transaction: TransactionDisplay) => {
    setModalVisible(false);
    // Navigate to edit screen (will be implemented in next phase)
    if (transaction.type === 'income') {
      navigation.navigate('AddIncome', { transaction });
    } else {
      navigation.navigate('AddExpense', { transaction });
    }
  };

  const handleDeleteTransaction = async (transactionId: string, type: 'income' | 'expense') => {
    try {
      await deleteTransaction(transactionId, type);
      Alert.alert('Success', 'Transaction deleted successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete transaction');
    }
  };

  const filterChips = [
    { id: 'all', label: 'All', icon: 'list', selected: typeFilter === 'all' },
    { id: 'income', label: 'Income', icon: 'trending-up', selected: typeFilter === 'income' },
    { id: 'expense', label: 'Expense', icon: 'trending-down', selected: typeFilter === 'expense' },
  ];

  const handleChipPress = (id: string) => {
    setTypeFilter(id as 'all' | 'income' | 'expense');
  };

  const getSortIcon = () => {
    switch (sortBy) {
      case 'date': return 'sort';
      case 'amount': return 'sort-by-amount';
      case 'category': return 'sort-by-alpha';
      default: return 'sort';
    }
  };

  const handleSortPress = () => {
    // Cycle through sort options
    if (sortBy === 'date') toggleSort('amount');
    else if (sortBy === 'amount') toggleSort('category');
    else toggleSort('date');
  };

  if (loading && !refreshing) {
    return <LoadingSpinner fullScreen message="Loading transactions..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Transaction History" />

      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onClear={() => setSearchQuery('')}
      />

      {/* Filter Chips */}
      <FilterChips
        chips={filterChips}
        onChipPress={handleChipPress}
        onSortPress={handleSortPress}
        sortIcon={getSortIcon()}
      />

      {/* Active Filters Indicator */}
      {!!(searchQuery || typeFilter !== 'all') && (
        <View style={styles.activeFilters}>
          <Text style={styles.activeFiltersText}>
            {searchQuery && `Search: "${searchQuery}"`}
            {typeFilter !== 'all' && (searchQuery ? ' • ' : '')}
            {typeFilter !== 'all' && `Type: ${typeFilter}`}
          </Text>
          <Text style={styles.clearFilters} onPress={clearFilters}>
            Clear
          </Text>
        </View>
      )}

      {/* Transactions List */}
      <FlatList
        data={groupedTransactions}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <TransactionGroup
            group={item}
            onTransactionPress={handleTransactionPress}
          />
        )}
        refreshing={refreshing}
        onRefresh={refreshTransactions}
        ListEmptyComponent={
          <EmptyState
            icon="📭"
            title="No Transactions Found"
            message={
              searchQuery || typeFilter !== 'all'
                ? "No transactions match your filters. Try adjusting your search."
                : "You haven't added any transactions yet. Tap + to add your first income or expense."
            }
          />
        }
        ListFooterComponent={
          loading && !refreshing ? (
            <ActivityIndicator style={styles.loader} color={COLORS.primary} />
          ) : null
        }
      />

      {/* Transaction Detail Modal */}
      <TransactionDetailModal
        visible={modalVisible}
        transaction={selectedTransaction}
        onClose={() => {
          setModalVisible(false);
          setSelectedTransaction(null);
        }}
        onEdit={handleEditTransaction}
        onDelete={handleDeleteTransaction}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  activeFilters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '10',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  activeFiltersText: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.small,
    color: COLORS.primary,
    flex: 1,
  },
  clearFilters: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.sizes.small,
    color: COLORS.primary,
    padding: 4,
  },
  loader: {
    paddingVertical: 20,
  },
});

export default HistoryScreen;