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

  const colors = type === 'income' 
    ? ['#2E7D32', '#43A047', '#66BB6A', '#81C784', '#A5D6A7']
    : ['#C62828', '#E53935', '#EF5350', '#E57373', '#FFCDD2'];

  const chartData = topCategories.map((item, index) => ({
    name: item.categoryName,
    amount: item.amount,
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
      <PieChart
        data={chartData}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
        accessor={"amount"}
        backgroundColor={"transparent"}
        paddingLeft={"0"}
        center={[0, 0]}
        absolute
      />
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
});

export default FinancialPieChart;
