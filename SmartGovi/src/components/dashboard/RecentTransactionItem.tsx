import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { COLORS, FONTS } from '../../utils/constants';
import { RecentTransactionDisplay } from '../../types';

interface RecentTransactionItemProps {
  transaction: RecentTransactionDisplay;
  onPress: () => void;
}

const RecentTransactionItem: React.FC<RecentTransactionItemProps> = ({
  transaction,
  onPress,
}) => {
  const isIncome = transaction.type === 'income';

  const formatCurrency = (amount: number) => {
    return `Rs ${amount.toLocaleString('en-LK')}`;
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const getDayLabel = (date: Date) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftSection}>
        <View style={[
          styles.typeIndicator,
          { backgroundColor: isIncome ? COLORS.success + '20' : COLORS.error + '20' }
        ]}>
          <Text style={styles.typeIcon}>{isIncome ? '💰' : '💸'}</Text>
        </View>
        
        <View style={styles.details}>
          <Text style={styles.categoryName}>{transaction.categoryName}</Text>
          <Text style={styles.time}>
            {getDayLabel(transaction.date)} • {formatTime(transaction.date)}
          </Text>
          {!!transaction.quantity && (
            <Text style={styles.quantity}>
              {transaction.weight
                ? `${transaction.quantity} × ${transaction.weight}${transaction.unit}`
                : `${transaction.quantity} ${transaction.unit}`}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.rightSection}>
        <Text style={[
          styles.amount,
          { color: isIncome ? COLORS.success : COLORS.error }
        ]}>
          {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  typeIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  typeIcon: {
    fontSize: 20,
  },
  details: {
    flex: 1,
  },
  categoryName: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.sizes.medium,
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  time: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.small,
    color: COLORS.text.secondary,
  },
  quantity: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.small,
    color: COLORS.text.secondary,
    marginTop: 2,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  amount: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.sizes.medium,
  },
});

export default RecentTransactionItem;