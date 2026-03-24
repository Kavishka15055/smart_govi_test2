import React, { useState, useCallback } from 'react';
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
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { COLORS, FONTS } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';
import { dashboardService } from '../../services/dashboardService';
import { DashboardSummary, DateRangeType } from '../../types';
import SummaryCard from '../../components/dashboard/SummaryCard';
import CategoryBreakdownCard from '../../components/dashboard/CategoryBreakdownCard';
import FinancialPieChart from '../../components/dashboard/FinancialPieChart';
import RecentTransactionItem from '../../components/dashboard/RecentTransactionItem';
import FilterModal from '../modals/FilterModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { MaterialIcons } from '@expo/vector-icons';
import { useSettings } from '../../context/SettingsContext';
import MonthlyComparisonCard from '../../components/dashboard/MonthlyComparisonCard';
import { pdfService } from '../../services/pdfService';
import { useTranslation } from 'react-i18next';

const ReportScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { user } = useAuth();
  const { settings } = useSettings();
  const { t } = useTranslation();
  
  // Quick action from dashboard passes `range` in params
  const initialRange: DateRangeType = route.params?.range || '3months';

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [currentRange, setCurrentRange] = useState<DateRangeType>(initialRange);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [dateRangeLabel, setDateRangeLabel] = useState('');
  const [pdfLoading, setPdfLoading] = useState(false);

  const loadReportData = async (range: DateRangeType = currentRange, start?: Date, end?: Date) => {
    if (!user) return;

    try {
      const data = await dashboardService.getDashboardData(user.id, range, start, end);
      setSummary(data.summary);
      setRecentTransactions(data.recentTransactions || []);
      setDateRangeLabel(data.dateRange.label);
    } catch (error) {
      Alert.alert(t('common.error'), 'Failed to load report data');
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

  const handleFilterApply = (rangeType: string, startDate?: Date, endDate?: Date) => {
    setCurrentRange(rangeType as DateRangeType);
    if (rangeType === 'custom' && startDate && endDate) {
      loadReportData(rangeType as DateRangeType, startDate, endDate);
    } else {
      loadReportData(rangeType as DateRangeType);
    }
  };

  const handleSharePDF = async () => {
    if (!summary || !user) return;

    setPdfLoading(true);
    try {
      await pdfService.generateAndShareReport({
        summary,
        user,
        dateRangeLabel,
      });
    } catch (error) {
      Alert.alert(t('common.error'), 'Failed to generate PDF report');
    } finally {
      setPdfLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message={t('common.loading')} />;
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
          <Text style={styles.headerTitle}>{t('navigation.reports')}</Text>
          <Text style={styles.headerDate}>{dateRangeLabel}</Text>
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <MaterialIcons name="filter-list" size={24} color={COLORS.primary} />
          <Text style={styles.filterButtonText}>{t('report.filter')}</Text>
        </TouchableOpacity>
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

          {settings.showMonthlyComparison && summary && summary.monthlyComparison && (
            <MonthlyComparisonCard 
              data={summary.monthlyComparison} 
              title={currentRange === 'week' ? t('report.incomeComparison') : t('report.monthlyComparison')}
              label={currentRange === 'week' ? t('report.day') : t('report.month')}
            />
          )}

          {summary && summary.incomeBreakdown && (
            <FinancialPieChart
              title={t('report.incomeDistribution')}
              data={summary.incomeBreakdown}
              type="income"
            />
          )}

          {summary && summary.expenseBreakdown && (
            <FinancialPieChart
              title={t('report.expenseDistribution')}
              data={summary.expenseBreakdown}
              type="expense"
            />
          )}

          {summary && summary.incomeBreakdown && (
            <CategoryBreakdownCard 
              title={t('report.incomeBreakdown')} 
              data={summary.incomeBreakdown} 
              color={COLORS.success} 
            />
          )}

          {summary && summary.expenseBreakdown && (
            <CategoryBreakdownCard 
              title={t('report.expenseBreakdown')} 
              data={summary.expenseBreakdown} 
              color={COLORS.error} 
            />
          )}

          <View style={styles.recentSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('report.reportTransactions')}</Text>
            </View>

            {recentTransactions.length === 0 ? (
              <EmptyState
                icon="📊"
                title={t('report.noData')}
                message={t('report.noDataDetail')}
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

          {summary && (
            <TouchableOpacity
              style={[styles.pdfButton, pdfLoading && styles.pdfButtonDisabled]}
              onPress={handleSharePDF}
              disabled={pdfLoading}
            >
              {pdfLoading ? (
                <LoadingSpinner size="small" color={COLORS.white} />
              ) : (
                <>
                  <MaterialIcons name="share" size={20} color={COLORS.white} />
                  <Text style={styles.pdfButtonText}>{t('report.shareReport')}</Text>
                </>
              )}
            </TouchableOpacity>
          )}

          <View style={styles.bottomPadding} />
        </View>
      </ScrollView>

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
  settingsButton: {
    padding: 8,
    marginLeft: 8,
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
    height: 40,
  },
  pdfButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginVertical: 24,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  pdfButtonDisabled: {
    opacity: 0.7,
    backgroundColor: COLORS.disabled,
  },
  pdfButtonText: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.sizes.medium,
    color: COLORS.white,
    marginLeft: 8,
  },
});

export default ReportScreen;
