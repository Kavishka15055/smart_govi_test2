import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../../utils/constants';

interface SummaryCardProps {
  income: number;
  expense: number;
  balance: number;
  periodLabel: string;
  incomeCount?: number;
  expenseCount?: number;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  income,
  expense,
  balance,
  periodLabel,
  incomeCount,
  expenseCount,
}) => {
  const formatCurrency = (amount: number) => {
    return `Rs ${amount.toLocaleString('en-LK')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SUMMARY</Text>
        <Text style={styles.periodLabel}>{periodLabel}</Text>
      </View>

      <View style={styles.row}>
        <View style={styles.leftColumn}>
          <Text style={styles.label}>Income</Text>
          <View style={styles.valueContainer}>
            <Text style={[styles.value, { color: COLORS.success }]}>{formatCurrency(income)}</Text>
            <View style={[styles.indicator, styles.incomeIndicator]} />
          </View>
          {incomeCount !== undefined && (
            <Text style={styles.countLabel}>{incomeCount} transactions</Text>
          )}
        </View>

        <View style={styles.rightColumn}>
          <Text style={styles.label}>Expense</Text>
          <View style={styles.valueContainer}>
            <Text style={[styles.value, { color: COLORS.error }]}>{formatCurrency(expense)}</Text>
            <View style={[styles.indicator, styles.expenseIndicator]} />
          </View>
          {expenseCount !== undefined && (
            <Text style={styles.countLabel}>{expenseCount} transactions</Text>
          )}
        </View>
      </View>

      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Balance</Text>
        <Text style={[
          styles.balanceValue,
          balance >= 0 ? styles.positiveBalance : styles.negativeBalance
        ]}>
          {formatCurrency(balance)}
        </Text>
      </View>

      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill,
            { 
              width: `${Math.min((income / (income + expense || 1)) * 100, 100)}%`,
              backgroundColor: COLORS.success 
            }
          ]} 
        />
        <View 
          style={[
            styles.progressFill,
            { 
              width: `${Math.min((expense / (income + expense || 1)) * 100, 100)}%`,
              backgroundColor: COLORS.error 
            }
          ]} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.sizes.medium,
    color: COLORS.text.secondary,
  },
  periodLabel: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.small,
    color: COLORS.primary,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  leftColumn: {
    flex: 1,
    marginRight: 8,
  },
  rightColumn: {
    flex: 1,
    marginLeft: 8,
  },
  label: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.small,
    color: COLORS.text.secondary,
    marginBottom: 4,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  value: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.sizes.large,
    color: COLORS.text.primary,
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  incomeIndicator: {
    backgroundColor: COLORS.success,
  },
  expenseIndicator: {
    backgroundColor: COLORS.error,
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  balanceLabel: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.sizes.medium,
    color: COLORS.text.primary,
  },
  balanceValue: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.sizes.xlarge,
  },
  positiveBalance: {
    color: COLORS.success,
  },
  negativeBalance: {
    color: COLORS.error,
  },
  progressBar: {
    flexDirection: 'row',
    height: 8,
    backgroundColor: COLORS.lightGray,
    borderRadius: 4,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  countLabel: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.small - 2,
    color: COLORS.text.secondary,
    marginTop: 2,
  },
});

export default SummaryCard;