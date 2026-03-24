import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { COLORS, FONTS } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';
import { dashboardService } from '../../services/dashboardService';
import { transactionService } from '../../services/transactionService';
import { DashboardSummary, QUICK_ACTIONS, DateRangeType } from '../../types';
import SummaryCard from '../../components/dashboard/SummaryCard';
import QuickActionButton from '../../components/dashboard/QuickActionButton';
import RecentTransactionItem from '../../components/dashboard/RecentTransactionItem';
import FilterModal from '../modals/FilterModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

type DashboardScreenNavigationProp = StackNavigationProp<any, 'DashboardMain'>;

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<DashboardScreenNavigationProp>();
  const { user } = useAuth();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [currentRange, setCurrentRange] = useState<DateRangeType>('month');
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [dateRangeLabel, setDateRangeLabel] = useState('');

  const loadDashboardData = async (
    range: DateRangeType = currentRange,
    start?: Date,
    end?: Date
  ) => {
    if (!user) return;
 
    try {
      const data = await dashboardService.getDashboardData(user.id, range, start, end);
      setSummary(data.summary);
      setRecentTransactions(data.recentTransactions);
      setDateRangeLabel(data.dateRange.label);
    } catch (error) {
      Alert.alert(t('common.error'), t('dashboard.errorLoad'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, [user, currentRange])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const handleFilterApply = (rangeType: string, startDate?: Date, endDate?: Date) => {
    setCurrentRange(rangeType as DateRangeType);
    loadDashboardData(rangeType as DateRangeType, startDate, endDate);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'AddIncome':
        navigation.navigate('AddIncome');
        break;
      case 'AddExpense':
        navigation.navigate('AddExpense');
        break;
      case 'Report':
        navigation.navigate('ReportTab', { range: currentRange });
        break;
      case 'History':
        navigation.navigate('History');
        break;
    }
  };

  const handleTransactionPress = (transaction: any) => {
    navigation.navigate('TransactionDetail', {
      transactionId: transaction.id,
      type: transaction.type,
    });
  };

  const handleViewAllTransactions = () => {
    navigation.navigate('History');
  };

  if (loading) {
    return <LoadingSpinner fullScreen message={t('common.loading')} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>{t('dashboard.title')}</Text>
          <Text style={styles.headerDate}>{dateRangeLabel}</Text>
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <MaterialIcons name="filter-list" size={24} color={COLORS.primary} />
          <Text style={styles.filterButtonText}>{t('dashboard.filter')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Summary Card */}
        {summary && (
          <SummaryCard
            income={summary.totalIncome}
            expense={summary.totalExpense}
            balance={summary.balance}
            periodLabel={dateRangeLabel}
            incomeCount={summary.incomeCount}
            expenseCount={summary.expenseCount}
          />
        )}

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>{t('dashboard.quickActions')}</Text>
          <View style={styles.quickActionsGrid}>
            {QUICK_ACTIONS.map((action) => (
              <QuickActionButton
                key={action.id}
                title={t(`dashboard.${action.id}`)}
                icon={action.icon}
                color={action.color}
                onPress={() => handleQuickAction(action.route)}
              />
            ))}
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('dashboard.recentTransactions')}</Text>
            {recentTransactions.length > 0 && (
              <TouchableOpacity onPress={handleViewAllTransactions}>
                <Text style={styles.viewAllLink}>{t('common.viewAll')}</Text>
              </TouchableOpacity>
            )}
          </View>

          {recentTransactions.length === 0 ? (
            <EmptyState
              icon="📭"
              title={t('dashboard.noRecent')}
              message={t('dashboard.addFirst')}
            />
          ) : (
            recentTransactions.map((transaction) => (
              <RecentTransactionItem
                key={transaction.id}
                transaction={transaction}
                onPress={() => handleTransactionPress(transaction)}
              />
            ))
          )}
        </View>

        {/* Extra space for bottom padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          Alert.alert(
            t('dashboard.transactions'),
            t('dashboard.filter'),
            [
              { text: t('dashboard.income'), onPress: () => navigation.navigate('AddIncome') },
              { text: t('dashboard.expense'), onPress: () => navigation.navigate('AddExpense') },
              { text: t('common.cancel'), style: 'cancel' },
            ]
          );
        }}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      {/* Filter Modal */}
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={handleFilterApply}
        currentRange={currentRange}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.sizes.large,
    color: COLORS.text.primary,
  },
  headerDate: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.small,
    color: COLORS.text.secondary,
    marginTop: 2,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
  },
  filterButtonText: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.sizes.small,
    color: COLORS.primary,
    marginLeft: 4,
  },
  quickActionsSection: {
    backgroundColor: COLORS.white,
    marginTop: 8,
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  recentSection: {
    backgroundColor: COLORS.white,
    marginTop: 8,
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.sizes.medium,
    color: COLORS.text.secondary,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  viewAllLink: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.sizes.small,
    color: COLORS.primary,
  },
  bottomPadding: {
    height: 80,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  fabIcon: {
    fontSize: 30,
    color: COLORS.white,
    fontWeight: 'bold',
  },
});

export default DashboardScreen;