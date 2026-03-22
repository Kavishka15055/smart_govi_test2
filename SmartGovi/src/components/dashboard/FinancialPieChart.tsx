import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { COLORS, FONTS } from '../../utils/constants';
import { CategoryBreakdown } from '../../types';
import EmptyState from '../common/EmptyState';

const screenWidth = Dimensions.get('window').width - 32;

interface FinancialPieChartProps {
  title: string;
  data?: CategoryBreakdown[];
  type: 'income' | 'expense';
}

const FinancialPieChart: React.FC<FinancialPieChartProps> = ({ title, data = [], type }) => {
  if (data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.headerTitle}>{title}</Text>
        <EmptyState
          icon="pie-chart"
          title="No Data for Chart"
          message={`No ${type} records found for this period.`}
        />
      </View>
    );
  }

  // Get top 5 categories
  const topCategories = [...data].sort((a, b) => b.amount - a.amount).slice(0, 5);

  // Diverse color palettes
  const incomeColors = ['#2E7D32', '#00796B', '#0288D1', '#689F38', '#0097A7'];
  const expenseColors = ['#C62828', '#E65100', '#F57C00', '#D84315', '#8D6E63'];

  const colors = type === 'income' ? incomeColors : expenseColors;

  const chartData = topCategories.map((item, index) => ({
    name: item.categoryName,
    amount: item.amount,
    percentage: item.percentage,
    color: colors[index % colors.length],
    legendFontColor: COLORS.text.secondary,
    legendFontSize: 12,
  }));

  const chartConfig = {
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>{title}</Text>
      
      <View style={styles.chartWrapper}>
        <PieChart
          data={chartData}
          width={screenWidth}
          height={180}
          chartConfig={chartConfig}
          accessor={"amount"}
          backgroundColor={"transparent"}
          paddingLeft={"32"}
          center={[0, 0]}
          hasLegend={false}
          absolute
        />
      </View>

      <View style={styles.legendContainer}>
        {chartData.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={styles.legendLabelContainer}>
              <View style={[styles.legendColor, { backgroundColor: item.color }]} />
              <Text style={styles.legendName} numberOfLines={1}>
                {item.name}
              </Text>
            </View>
            <View style={styles.legendValues}>
              <Text style={styles.legendAmount}>
                Rs. {item.amount.toLocaleString()}
              </Text>
              <Text style={styles.legendPercentage}>
                {item.percentage.toFixed(1)}%
              </Text>
            </View>
          </View>
        ))}
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
  headerTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.sizes.medium,
    color: COLORS.text.secondary,
    marginBottom: 8,
  },
  chartWrapper: {
    alignItems: 'center',
    marginVertical: -10,
  },
  legendContainer: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingTop: 12,
  },
  legendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  legendLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendName: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: COLORS.text.primary,
  },
  legendValues: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  legendAmount: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: COLORS.text.primary,
    marginRight: 8,
  },
  legendPercentage: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: COLORS.text.secondary,
    width: 40,
    textAlign: 'right',
  },
});

export default FinancialPieChart;
