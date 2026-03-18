import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { COLORS, FONTS } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';
import { dashboardService } from '../../services/dashboardService';
import { DashboardSummary, DateRangeType } from '../../types';
import SummaryCard from '../../components/dashboard/SummaryCard';
import RecentTransactionItem from '../../components/dashboard/RecentTransactionItem';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { MaterialIcons } from '@expo/vector-icons';

const ReportScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { user } = useAuth();
  
  // Quick action from dashboard passes `range` in params
  const initialRange: DateRangeType = route.params?.range || '3months';

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentRange, setCurrentRange] = useState<DateRangeType>(initialRange);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [dateRangeLabel, setDateRangeLabel] = useState('');

  const loadReportData = async (range: DateRangeType = currentRange) => {
    if (!user) return;

    try {
      const data = await dashboardService.getDashboardData(user.id, range);
      setSummary(data.summary);
      setRecentTransactions(data.recentTransactions || []);
      setDateRangeLabel(data.dateRange.label);
    } catch (error) {
      Alert.alert('Error', 'Failed to load report data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadReportData();
    }, [user, currentRange])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    loadReportData();
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Generating Report..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {navigation.canGoBack() && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color={COLORS.text.primary} />
          </TouchableOpacity>
        )}
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Reports</Text>
          <Text style={styles.headerDate}>{dateRangeLabel}</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.content}>
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

          <View style={styles.recentSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>REPORT TRANSACTIONS</Text>
            </View>

            {recentTransactions.length === 0 ? (
              <EmptyState
                icon="📊"
                title="No Data"
                message={`No transactions found for ${dateRangeLabel}`}
              />
            ) : (
              recentTransactions.map((transaction) => (
                <RecentTransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  onPress={() => {
                     navigation.navigate('TransactionDetail', {
                       transactionId: transaction.id,
                       type: transaction.type,
                     });
                  }}
                />
              ))
            )}
          </View>
          <View style={styles.bottomPadding} />
        </View>
      </ScrollView>
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
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerTitleContainer: {
    flex: 1,
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
  content: {
    paddingTop: 8,
  },
  recentSection: {
    backgroundColor: COLORS.white,
    marginTop: 8,
    paddingVertical: 16,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.sizes.medium,
    color: COLORS.text.secondary,
    marginBottom: 12,
  },
  bottomPadding: {
    height: 80,
  },
});

export default ReportScreen;
