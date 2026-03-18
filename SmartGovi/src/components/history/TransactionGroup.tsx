import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { COLORS, FONTS } from '../../utils/constants';
import { GroupedTransactions } from '../../types';
import TransactionCard from './TransactionCard';

interface TransactionGroupProps {
  group: GroupedTransactions;
  onTransactionPress: (transaction: any) => void;
}

const TransactionGroup: React.FC<TransactionGroupProps> = ({
  group,
  onTransactionPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{group.title}</Text>
        <Text style={styles.headerCount}>{group.data.length} items</Text>
      </View>
      
      {group.data.map((transaction) => (
        <TransactionCard
          key={transaction.id}
          transaction={transaction}
          onPress={() => onTransactionPress(transaction)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.lightGray,
  },
  headerTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.sizes.medium,
    color: COLORS.text.primary,
  },
  headerCount: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.small,
    color: COLORS.text.secondary,
  },
});

export default TransactionGroup;