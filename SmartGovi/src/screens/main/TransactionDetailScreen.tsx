import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { COLORS, FONTS } from '../../utils/constants';
import { DashboardStackParamList, Transaction } from '../../types';
import { transactionService } from '../../services/transactionService';
import {
  formatCurrency,
  formatDateForDisplay,
  getTransactionIcon,
  getTransactionColor,
} from '../../utils/transactionHelpers';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { MaterialIcons } from '@expo/vector-icons';

type TransactionDetailRouteProp = RouteProp<DashboardStackParamList, 'TransactionDetail'>;
type TransactionDetailNavigationProp = StackNavigationProp<DashboardStackParamList, 'TransactionDetail'>;

const TransactionDetailScreen: React.FC = () => {
  const route = useRoute<TransactionDetailRouteProp>();
  const navigation = useNavigation<TransactionDetailNavigationProp>();
  const { transactionId, type } = route.params;

  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const data = await transactionService.getTransactionById(type, transactionId);
        if (data) {
          setTransaction(data);
        } else {
          Alert.alert('Error', 'Transaction not found');
          navigation.goBack();
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch transaction details');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [transactionId, type]);

  const handleDelete = () => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await transactionService.deleteTransaction(type, transactionId);
              Alert.alert('Success', 'Transaction deleted successfully');
              navigation.navigate('DashboardMain');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete transaction');
            }
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    if (!transaction) return;
    
    if (transaction.type === 'income') {
      navigation.navigate('AddIncome', { transaction } as any);
    } else {
      navigation.navigate('AddExpense', { transaction } as any);
    }
  };

  const handleViewReceipt = () => {
    if (transaction && 'receiptUrl' in transaction && transaction.receiptUrl) {
      Linking.openURL(transaction.receiptUrl);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading details..." />;
  }

  if (!transaction) return null;

  const isIncome = transaction.type === 'income';
  const icon = getTransactionIcon(transaction.type);
  const color = getTransactionColor(transaction.type);

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Transaction Details" 
        showBack 
        onBackPress={() => navigation.goBack()} 
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Main Info Card */}
        <View style={styles.mainCard}>
          <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
            <Text style={styles.iconEmoji}>{icon}</Text>
          </View>
          <Text style={[styles.typeText, { color }]}>
            {isIncome ? 'INCOME' : 'EXPENSE'}
          </Text>
          <Text style={[styles.amount, { color }]}>
            {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
          </Text>
          <Text style={styles.dateText}>
            {formatDateForDisplay(transaction.date)}
          </Text>
        </View>

        {/* Details List */}
        <View style={styles.detailsList}>
          <DetailItem
            icon="category"
            label="Category"
            value={transaction.categoryName}
          />

          {isIncome && 'quantity' in transaction && (
            <DetailItem
              icon="inventory"
              label="Quantity"
              value={`${transaction.quantity} ${transaction.unit}`}
            />
          )}

          {!!transaction.notes && (
            <DetailItem
              icon="notes"
              label="Notes"
              value={transaction.notes}
              isMultiline
            />
          )}

          {!isIncome && 'receiptUrl' in transaction && !!transaction.receiptUrl && (
            <TouchableOpacity 
              style={styles.receiptContainer} 
              onPress={handleViewReceipt}
            >
              <MaterialIcons name="receipt" size={24} color={COLORS.primary} />
              <View style={styles.receiptInfo}>
                <Text style={styles.receiptLabel}>Receipt</Text>
                <Text style={styles.viewReceiptText}>View Attachment</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={COLORS.text.secondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <Button
            title="Edit Transaction"
            onPress={handleEdit}
            variant="outline"
            style={styles.actionButton}
            icon={<MaterialIcons name="edit" size={20} color={COLORS.primary} />}
          />
          <Button
            title="Delete Transaction"
            onPress={handleDelete}
            variant="outline"
            style={[styles.actionButton, styles.deleteButton]}
            textStyle={{ color: COLORS.error }}
            icon={<MaterialIcons name="delete" size={20} color={COLORS.error} />}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const DetailItem: React.FC<{
  icon: string;
  label: string;
  value: string;
  isMultiline?: boolean;
}> = ({ icon, label, value, isMultiline }) => (
  <View style={styles.detailItem}>
    <View style={styles.detailHeader}>
      <MaterialIcons name={icon as any} size={20} color={COLORS.text.disabled} />
      <Text style={styles.detailLabel}>{label}</Text>
    </View>
    <Text style={[styles.detailValue, isMultiline && styles.multilineValue]}>
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  mainCard: {
    backgroundColor: COLORS.white,
    alignItems: 'center',
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  iconEmoji: {
    fontSize: 32,
  },
  typeText: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.sizes.small,
    letterSpacing: 1,
    marginBottom: 4,
  },
  amount: {
    fontFamily: FONTS.bold,
    fontSize: 36,
    marginBottom: 8,
  },
  dateText: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.medium,
    color: COLORS.text.secondary,
  },
  detailsList: {
    backgroundColor: COLORS.white,
    marginTop: 12,
    paddingHorizontal: 16,
  },
  detailItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailLabel: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.small,
    color: COLORS.text.disabled,
    marginLeft: 8,
  },
  detailValue: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.sizes.medium,
    color: COLORS.text.primary,
    marginLeft: 28,
  },
  multilineValue: {
    lineHeight: 22,
  },
  receiptContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  receiptInfo: {
    flex: 1,
    marginLeft: 12,
  },
  receiptLabel: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.small,
    color: COLORS.text.disabled,
  },
  viewReceiptText: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.sizes.medium,
    color: COLORS.primary,
  },
  actionContainer: {
    padding: 16,
    marginTop: 12,
  },
  actionButton: {
    marginBottom: 12,
  },
  deleteButton: {
    borderColor: COLORS.error,
  },
});

export default TransactionDetailScreen;
