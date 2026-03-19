import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { COLORS, FONTS } from '../../utils/constants';
import { MonthlyData } from '../../types';
import { MaterialIcons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width - 32;

interface MonthlyComparisonCardProps {
  data: MonthlyData[];
}

const MonthlyComparisonCard: React.FC<MonthlyComparisonCardProps> = ({ data }) => {
  if (!data || data.length === 0) return null;

  const chartData = {
    labels: data.map(d => d.month),
    datasets: [
      {
        data: data.map(d => d.income),
        color: (opacity = 1) => `rgba(46, 125, 50, ${opacity})`, // COLORS.primary/success
      },
      {
        data: data.map(d => d.expense),
        color: (opacity = 1) => `rgba(244, 67, 54, ${opacity})`, // COLORS.error
      }
    ],
    legend: ['Income', 'Expense']
  };

  const chartConfig = {
    backgroundColor: COLORS.white,
    backgroundGradientFrom: COLORS.white,
    backgroundGradientTo: COLORS.white,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(117, 117, 117, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#ffa726"
    }
  };

  const renderTrend = (change?: number) => {
    if (change === undefined) return null;
    const isPositive = change >= 0;
    return (
      <View style={styles.trendContainer}>
        <Text style={[styles.trendText, { color: isPositive ? COLORS.success : COLORS.error }]}>
          {isPositive ? '📈' : '📉'} {Math.abs(change).toFixed(1)}%
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MONTHLY COMPARISON</Text>
      
      <BarChart
        style={styles.chart}
        data={chartData}
        width={screenWidth}
        height={220}
        yAxisLabel="Rs "
        yAxisSuffix=""
        chartConfig={chartConfig}
        verticalLabelRotation={0}
        fromZero
        showValuesOnTopOfBars
      />

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.columnHeader, { flex: 1.5 }]}>Month</Text>
          <Text style={[styles.columnHeader, { flex: 2, textAlign: 'right' }]}>Income</Text>
          <Text style={[styles.columnHeader, { flex: 2, textAlign: 'right' }]}>Expense</Text>
          <Text style={[styles.columnHeader, { flex: 2, textAlign: 'right' }]}>Balance</Text>
        </View>

        {data.map((item, index) => (
          <View key={`${item.month}-${item.year}`} style={styles.tableRow}>
            <Text style={[styles.monthText, { flex: 1.5 }]}>{item.month}</Text>
            
            <View style={[styles.valueCell, { flex: 2 }]}>
              <Text style={[styles.valueText, { color: COLORS.success }]}>
                {item.income.toLocaleString()}
              </Text>
              {renderTrend(item.incomeChange)}
            </View>

            <View style={[styles.valueCell, { flex: 2 }]}>
              <Text style={[styles.valueText, { color: COLORS.error }]}>
                {item.expense.toLocaleString()}
              </Text>
              {renderTrend(item.expenseChange)}
            </View>

            <View style={[styles.valueCell, { flex: 2, alignItems: 'flex-end' }]}>
              <Text style={[styles.valueText, { fontFamily: FONTS.bold, color: item.balance >= 0 ? COLORS.primary : COLORS.error }]}>
                {item.balance.toLocaleString()}
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
  title: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.sizes.medium,
    color: COLORS.text.secondary,
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    marginLeft: -16, // Offset for y-axis labels
  },
  table: {
    marginTop: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 8,
    marginBottom: 8,
  },
  columnHeader: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.sizes.small,
    color: COLORS.text.secondary,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  monthText: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.sizes.medium,
    color: COLORS.text.primary,
  },
  valueCell: {
    alignItems: 'flex-end',
  },
  valueText: {
    fontFamily: FONTS.medium,
    fontSize: 13,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  trendText: {
    fontSize: 10,
    fontFamily: FONTS.regular,
  },
});

export default MonthlyComparisonCard;
