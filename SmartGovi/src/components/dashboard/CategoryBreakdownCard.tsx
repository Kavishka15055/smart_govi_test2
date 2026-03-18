import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../../utils/constants';
import { CategoryBreakdown } from '../../types';
import EmptyState from '../common/EmptyState';

interface CategoryBreakdownCardProps {
  title: string;
  data?: CategoryBreakdown[];
  color?: string;
}

const CategoryBreakdownCard: React.FC<CategoryBreakdownCardProps> = ({
  title,
  data = [],
  color = COLORS.success,
}) => {
  const formatCurrency = (amount: number) => {
    return `Rs ${amount.toLocaleString('en-LK')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>{title}</Text>

      {data.length === 0 ? (
        <EmptyState
          icon="📊"
          title="No Data"
          message={`No records found for this period.`}
        />
      ) : (
        <View style={styles.listContainer}>
          {data.map((item, index) => (
            <View key={index} style={styles.itemContainer}>
              <View style={styles.row}>
                <View style={styles.leftColumn}>
                  <Text style={styles.categoryName} numberOfLines={1}>
                    {item.categoryName}
                  </Text>
                  <Text style={styles.countText}>
                    {item.count} transaction{item.count !== 1 ? 's' : ''}
                  </Text>
                </View>
                <View style={styles.rightColumn}>
                  <Text style={[styles.amountText, { color }]}>
                    {formatCurrency(item.amount)}
                  </Text>
                  <Text style={styles.percentageText}>
                    {item.percentage.toFixed(1)}%
                  </Text>
                </View>
              </View>
              
              <View style={styles.progressBarBackground}>
                <View 
                  style={[
                    styles.progressBarFill, 
                    { width: `${Math.min(item.percentage, 100)}%`, backgroundColor: color }
                  ]} 
                />
              </View>
            </View>
          ))}
        </View>
      )}
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
    marginBottom: 16,
  },
  listContainer: {
    marginTop: 4,
  },
  itemContainer: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  leftColumn: {
    flex: 1,
    paddingRight: 8,
  },
  rightColumn: {
    alignItems: 'flex-end',
  },
  categoryName: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.sizes.medium,
    color: COLORS.text.primary,
  },
  countText: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.small,
    color: COLORS.text.secondary,
    marginTop: 2,
  },
  amountText: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.sizes.medium,
  },
  percentageText: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.sizes.small,
    color: COLORS.text.secondary,
    textAlign: 'right',
    marginTop: 2,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: COLORS.lightGray,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
});

export default CategoryBreakdownCard;
