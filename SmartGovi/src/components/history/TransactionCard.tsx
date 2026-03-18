import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { COLORS, FONTS } from '../../utils/constants';
import { TransactionDisplay } from '../../types';
import {
  formatCurrency,
  getTransactionIcon,
  getTransactionColor,
} from '../../utils/transactionHelpers';

interface TransactionCardProps {
  transaction: TransactionDisplay;
  onPress: () => void;
}

const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  onPress,
}) => {
  const isIncome = transaction.type === 'income';
  const icon = getTransactionIcon(transaction.type);
  const color = getTransactionColor(transaction.type);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftSection}>
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
        
        <View style={styles.details}>
          <Text style={styles.categoryName}>{transaction.categoryName}</Text>
          <Text style={styles.time}>
            {new Date(transaction.date).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
          {transaction.quantity && (
            <Text style={styles.quantity}>
              {transaction.quantity} {transaction.unit}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.rightSection}>
        <Text style={[styles.amount, { color }]}>
          {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
        </Text>
        {transaction.notes ? (
          <Text style={styles.notePreview} numberOfLines={1}>
            {transaction.notes}
          </Text>
        ) : null}
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
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
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
    maxWidth: '40%',
  },
  amount: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.sizes.medium,
    marginBottom: 2,
  },
  notePreview: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.small,
    color: COLORS.text.secondary,
  },
});

export default TransactionCard;